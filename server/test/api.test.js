'use strict';
// Запуск: node --test server/test
const test = require('node:test');
const assert = require('node:assert');
const { handle, access } = require('../src/app');
const { memoryStore } = require('../src/stores');

const ORIGIN = 'https://aleksarulezzz.ru';
function mk() {
  const store = memoryStore();
  const call = async (method, path, body, token) => {
    const headers = { origin: ORIGIN };
    if (token) headers.authorization = 'Bearer ' + token;
    const r = await handle({ method, path, headers, body, ip: '1.2.3.4' }, store, {});
    return { status: r.status, headers: r.headers, json: r.body ? JSON.parse(r.body) : null };
  };
  return { store, call };
}
const REG = { email: 'Parent@Example.ru', password: 'secret-123', adult: true, consentPd: true, acceptOffer: true };

test('регистрация требует все три отметки', async () => {
  const { call } = mk();
  for (const k of ['adult', 'consentPd', 'acceptOffer']) {
    const r = await call('POST', '/register', { ...REG, [k]: false });
    assert.equal(r.status, 400, k);
  }
  assert.equal((await call('POST', '/register', { ...REG, password: 'short' })).json.error, 'password_weak');
  assert.equal((await call('POST', '/register', { ...REG, email: 'nope' })).json.error, 'email_invalid');
});

test('регистрация, вход, триал 14 дней, журнал согласий', async () => {
  const { call, store } = mk();
  const r = await call('POST', '/register', REG);
  assert.equal(r.status, 201);
  assert.equal(r.json.user.email, 'parent@example.ru');
  assert.equal(r.json.user.access.plan, 'trial');
  assert.equal(r.headers['Access-Control-Allow-Origin'], ORIGIN);
  const kinds = store._dump().consents.map(c => c.kind).sort();
  assert.deepEqual(kinds, ['adult_18', 'offer', 'pd_consent']);
  assert.equal((await call('POST', '/register', REG)).status, 409);
  assert.equal((await call('POST', '/login', { email: REG.email, password: 'wrong-pass' })).status, 401);
  const l = await call('POST', '/login', { email: ' parent@example.ru ', password: REG.password });
  assert.equal(l.status, 200);
  const me = await call('GET', '/me', null, l.json.token);
  assert.equal(me.json.user.id, r.json.user.id);
  // пароль не хранится открытым текстом
  const u = [...store._dump().users.values()][0];
  assert.ok(u.pw.startsWith('scrypt$') && !u.pw.includes(REG.password));
});

test('после 14 дней доступ закрыт, после оплаты открыт', () => {
  const t0 = Date.now();
  const day = 86400000;
  assert.equal(access({ createdAt: t0 }, t0 + 13 * day).plan, 'trial');
  assert.equal(access({ createdAt: t0 }, t0 + 15 * day).plan, 'expired');
  assert.equal(access({ createdAt: t0, paidUntil: t0 + 40 * day }, t0 + 15 * day).plan, 'paid');
});

test('профили детей и прогресс доступны только своему родителю', async () => {
  const { call } = mk();
  const a = (await call('POST', '/register', REG)).json.token;
  const b = (await call('POST', '/register', { ...REG, email: 'other@example.ru' })).json.token;
  assert.equal((await call('POST', '/children', { nick: '', grade: 2 }, a)).status, 400);
  const c = (await call('POST', '/children', { nick: 'Ракета', grade: 2, avatar: '🚀' }, a)).json.child;
  assert.ok(c.childId);
  assert.equal((await call('PUT', `/progress/${c.childId}/math`, { data: { xp: 10 } }, a)).status, 200);
  assert.equal((await call('PUT', `/progress/${c.childId}/bad`, { data: {} }, a)).status, 400);
  assert.deepEqual((await call('GET', `/progress/${c.childId}`, null, a)).json.progress.math.data, { xp: 10 });
  assert.equal((await call('GET', `/progress/${c.childId}`, null, b)).status, 404);
  assert.equal((await call('PUT', `/progress/${c.childId}/math`, { data: {} }, b)).status, 404);
  assert.equal((await call('GET', '/me', null, 'x'.repeat(64))).status, 401);
});

test('удаление аккаунта и отзыв согласия стирают данные', async () => {
  const { call, store } = mk();
  const t = (await call('POST', '/register', REG)).json.token;
  const c = (await call('POST', '/children', { nick: 'Луна', grade: 1 }, t)).json.child;
  await call('PUT', `/progress/${c.childId}/en`, { data: { u: 1 } }, t);
  const exp = await call('GET', '/me/export', null, t);
  assert.ok(!('pw' in exp.json.user));
  assert.equal((await call('DELETE', '/me', { password: 'nope-nope' }, t)).status, 401);
  assert.equal((await call('DELETE', '/me', { password: REG.password }, t)).status, 200);
  const d = store._dump();
  assert.equal(d.users.size, 0);
  assert.equal(d.children.size, 0);
  assert.equal(d.progress.size, 0);
  assert.equal((await call('GET', '/me', null, t)).status, 401);

  const t2 = (await call('POST', '/register', REG)).json.token;
  assert.equal((await call('POST', '/consent/revoke', {}, t2)).json.deleted, true);
  assert.equal(store._dump().users.size, 0);
});

test('блокировка после 10 неверных паролей', async () => {
  const { call } = mk();
  await call('POST', '/register', REG);
  for (let i = 0; i < 10; i++) await call('POST', '/login', { email: REG.email, password: 'wrong-pass' });
  assert.equal((await call('POST', '/login', { email: REG.email, password: REG.password })).status, 429);
});

test('CORS: чужой сайт не получает разрешение', async () => {
  const store = memoryStore();
  const r = await handle({ method: 'OPTIONS', path: '/register', headers: { origin: 'https://evil.example' } }, store, {});
  assert.equal(r.status, 204);
  assert.equal(r.headers['Access-Control-Allow-Origin'], undefined);
});
