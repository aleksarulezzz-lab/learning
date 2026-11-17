'use strict';
// API личных кабинетов «Звездочёт».
// Не зависит от хостинга: handle(req, store, env) -> {status, headers, body}.
// Хранилище (store) — память для тестов или YDB Document API в Yandex Cloud.

const crypto = require('node:crypto');

const DOC_VERSIONS = { privacy: '2026-11-17', consent: '2026-11-17', offer: '2026-11-17' };
const TRIAL_DAYS = 14;
const SESSION_DAYS = 30;
const MAX_CHILDREN = 5;
const SUBJECTS = ['math', 'zh', 'en', 'hub'];
const MAX_PROGRESS_BYTES = 200 * 1024;
const DAY = 86400000;

function now() { return Date.now(); }
function rid(n = 16) { return crypto.randomBytes(n).toString('hex'); }
function sha256(s) { return crypto.createHash('sha256').update(s).digest('hex'); }

function hashPassword(pw, salt = crypto.randomBytes(16)) {
  const key = crypto.scryptSync(pw, salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt$${salt.toString('base64')}$${key.toString('base64')}`;
}
function checkPassword(pw, stored) {
  const [alg, s, k] = String(stored).split('$');
  if (alg !== 'scrypt') return false;
  const key = crypto.scryptSync(pw, Buffer.from(s, 'base64'), 64, { N: 16384, r: 8, p: 1 });
  const want = Buffer.from(k, 'base64');
  return want.length === key.length && crypto.timingSafeEqual(want, key);
}

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;
function normEmail(e) { return String(e || '').trim().toLowerCase(); }

class HttpError extends Error { constructor(status, code) { super(code); this.status = status; this.code = code; } }
const bad = (code) => new HttpError(400, code);

function cors(env, origin) {
  const allowed = String(env.ALLOWED_ORIGINS || 'https://aleksarulezzz.ru').split(',').map(s => s.trim());
  const h = { 'Vary': 'Origin' };
  if (origin && allowed.includes(origin)) {
    h['Access-Control-Allow-Origin'] = origin;
    h['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    h['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    h['Access-Control-Max-Age'] = '600';
  }
  return h;
}

function access(user, t = now()) {
  const trialEnds = user.createdAt + TRIAL_DAYS * DAY;
  const paidUntil = user.paidUntil || 0;
  const active = t < trialEnds || t < paidUntil;
  return { active, trialEnds, paidUntil, plan: t < paidUntil ? 'paid' : (t < trialEnds ? 'trial' : 'expired'),
    price: user.priceRub || 350 };
}
function publicUser(u) {
  return { id: u.uid, email: u.email, createdAt: u.createdAt, emailVerified: !!u.emailVerified,
    marketing: !!u.marketing, access: access(u) };
}

async function auth(req, store) {
  const h = req.headers.authorization || req.headers.Authorization || '';
  const m = /^Bearer ([a-f0-9]{64})$/.exec(h);
  if (!m) throw new HttpError(401, 'no_session');
  const s = await store.getSession(sha256(m[1]));
  if (!s || s.expiresAt < now()) throw new HttpError(401, 'no_session');
  const u = await store.getUserById(s.uid);
  if (!u) throw new HttpError(401, 'no_session');
  return { user: u, tokenHash: sha256(m[1]) };
}

async function newSession(store, uid) {
  const token = rid(32);
  await store.putSession({ tokenHash: sha256(token), uid, createdAt: now(), expiresAt: now() + SESSION_DAYS * DAY });
  return token;
}

function cleanChild(b) {
  const nick = String(b.nick || '').trim().slice(0, 24);
  if (!nick) throw bad('nick_required');
  const grade = Number(b.grade);
  if (!Number.isInteger(grade) || grade < 0 || grade > 11) throw bad('grade_invalid');
  const avatar = String(b.avatar || '⭐').slice(0, 8);
  return { nick, grade, avatar };
}

const routes = {
  'GET /health': async () => ({ ok: true, docs: DOC_VERSIONS }),

  'POST /register': async (req, store, env, ip) => {
    const b = req.body || {};
    const email = normEmail(b.email);
    if (!EMAIL_RE.test(email)) throw bad('email_invalid');
    if (typeof b.password !== 'string' || b.password.length < 8 || b.password.length > 128) throw bad('password_weak');
    // Обязательные отметки формы: 18+, согласие на ПД, оферта. Без них аккаунт не создаётся.
    if (b.adult !== true) throw bad('adult_required');
    if (b.consentPd !== true) throw bad('consent_required');
    if (b.acceptOffer !== true) throw bad('offer_required');
    if (await store.getUserByEmail(email)) throw new HttpError(409, 'email_taken');
    const t = now();
    const user = { uid: rid(), email, pw: hashPassword(b.password), createdAt: t, emailVerified: false,
      marketing: b.marketing === true, priceRub: 350 };
    await store.putUser(user);
    const base = { uid: user.uid, ts: t, ip: ip || '', ua: String(req.headers['user-agent'] || '').slice(0, 200) };
    await store.logConsent({ ...base, kind: 'adult_18', version: DOC_VERSIONS.consent });
    await store.logConsent({ ...base, kind: 'pd_consent', version: DOC_VERSIONS.consent });
    await store.logConsent({ ...base, kind: 'offer', version: DOC_VERSIONS.offer });
    if (user.marketing) await store.logConsent({ ...base, kind: 'marketing', version: DOC_VERSIONS.consent });
    const token = await newSession(store, user.uid);
    return { status: 201, body: { token, user: publicUser(user) } };
  },

  'POST /login': async (req, store) => {
    const b = req.body || {};
    const email = normEmail(b.email);
    const u = email && await store.getUserByEmail(email);
    // Защита от подбора: после 10 неудач подряд — пауза 15 минут.
    if (u && u.lockUntil && u.lockUntil > now()) throw new HttpError(429, 'too_many_attempts');
    if (!u || typeof b.password !== 'string' || !checkPassword(b.password, u.pw)) {
      if (u) {
        const fails = (u.fails || 0) + 1;
        await store.putUser({ ...u, fails, lockUntil: fails >= 10 ? now() + 15 * 60000 : 0 });
      }
      throw new HttpError(401, 'wrong_credentials');
    }
    if (u.fails) await store.putUser({ ...u, fails: 0, lockUntil: 0 });
    const token = await newSession(store, u.uid);
    return { token, user: publicUser(u) };
  },

  'POST /logout': async (req, store) => {
    const { tokenHash } = await auth(req, store);
    await store.deleteSession(tokenHash);
    return { ok: true };
  },

  'GET /me': async (req, store) => {
    const { user } = await auth(req, store);
    return { user: publicUser(user), children: await store.listChildren(user.uid) };
  },

  'POST /children': async (req, store) => {
    const { user } = await auth(req, store);
    const list = await store.listChildren(user.uid);
    if (list.length >= MAX_CHILDREN) throw bad('too_many_children');
    const child = { uid: user.uid, childId: rid(8), ...cleanChild(req.body || {}), createdAt: now() };
    await store.putChild(child);
    return { status: 201, body: { child } };
  },

  'PUT /children/:id': async (req, store, env, ip, p) => {
    const { user } = await auth(req, store);
    const c = await store.getChild(user.uid, p.id);
    if (!c) throw new HttpError(404, 'not_found');
    const child = { ...c, ...cleanChild({ ...c, ...(req.body || {}) }) };
    await store.putChild(child);
    return { child };
  },

  'DELETE /children/:id': async (req, store, env, ip, p) => {
    const { user } = await auth(req, store);
    await store.deleteChild(user.uid, p.id);
    return { ok: true };
  },

  'GET /progress/:id': async (req, store, env, ip, p) => {
    const { user } = await auth(req, store);
    if (!await store.getChild(user.uid, p.id)) throw new HttpError(404, 'not_found');
    return { progress: await store.getProgress(p.id) };
  },

  'PUT /progress/:id/:subject': async (req, store, env, ip, p) => {
    const { user } = await auth(req, store);
    if (!SUBJECTS.includes(p.subject)) throw bad('subject_invalid');
    if (!await store.getChild(user.uid, p.id)) throw new HttpError(404, 'not_found');
    const data = (req.body || {}).data;
    const raw = JSON.stringify(data ?? null);
    if (raw.length > MAX_PROGRESS_BYTES) throw new HttpError(413, 'too_large');
    // Прогресс сохраняем даже после окончания доступа, чтобы ничего не потерялось.
    await store.putProgress({ childId: p.id, subject: p.subject, data: raw, updatedAt: now() });
    return { ok: true, access: access(user) };
  },

  'POST /consent/revoke': async (req, store, env, ip) => {
    // Отзыв согласия = удаление аккаунта (без согласия обработка невозможна).
    const { user } = await auth(req, store);
    await store.logConsent({ uid: user.uid, ts: now(), ip: ip || '', kind: 'pd_revoked', version: DOC_VERSIONS.consent });
    await store.deleteUserCascade(user);
    return { ok: true, deleted: true };
  },

  'DELETE /me': async (req, store, env, ip) => {
    const { user } = await auth(req, store);
    const b = req.body || {};
    if (typeof b.password !== 'string' || !checkPassword(b.password, user.pw)) throw new HttpError(401, 'wrong_credentials');
    await store.logConsent({ uid: user.uid, ts: now(), ip: ip || '', kind: 'account_deleted', version: DOC_VERSIONS.consent });
    await store.deleteUserCascade(user);
    return { ok: true, deleted: true };
  },

  'GET /me/export': async (req, store) => {
    // Право субъекта знать, какие данные о нём хранятся.
    const { user } = await auth(req, store);
    const children = await store.listChildren(user.uid);
    const progress = {};
    for (const c of children) progress[c.childId] = await store.getProgress(c.childId);
    const { pw, fails, lockUntil, ...u } = user;
    return { user: u, children, progress, consents: await store.listConsents(user.uid) };
  },
};

function match(method, path) {
  for (const key of Object.keys(routes)) {
    const [m, pat] = key.split(' ');
    if (m !== method) continue;
    const a = pat.split('/'), b = path.split('/');
    if (a.length !== b.length) continue;
    const params = {};
    let ok = true;
    for (let i = 0; i < a.length; i++) {
      if (a[i].startsWith(':')) { if (!/^[a-z0-9]{1,40}$/.test(b[i])) { ok = false; break; } params[a[i].slice(1)] = b[i]; }
      else if (a[i] !== b[i]) { ok = false; break; }
    }
    if (ok) return { fn: routes[key], params };
  }
  return null;
}

async function handle(req, store, env = {}) {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
    ...cors(env, req.headers.origin || req.headers.Origin) };
  if (req.method === 'OPTIONS') return { status: 204, headers, body: '' };
  const path = ('/' + String(req.path || '/').replace(/^\/+(api\/)?/, '')).replace(/\/+$/, '') || '/';
  const r = match(req.method, path);
  try {
    if (!r) throw new HttpError(404, 'not_found');
    const out = await r.fn(req, store, env, req.ip, r.params);
    const status = out && out.status && out.body ? out.status : 200;
    const body = out && out.status && out.body ? out.body : out;
    return { status, headers, body: JSON.stringify(body) };
  } catch (e) {
    if (e instanceof HttpError) return { status: e.status, headers, body: JSON.stringify({ error: e.code }) };
    console.error(e);
    return { status: 500, headers, body: JSON.stringify({ error: 'server_error' }) };
  }
}

module.exports = { handle, hashPassword, checkPassword, access, DOC_VERSIONS, TRIAL_DAYS };
