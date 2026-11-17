'use strict';
// Два хранилища с одинаковым интерфейсом:
//  memoryStore() — для тестов;
//  ydbStore()    — YDB serverless через Document API (совместим с DynamoDB), данные в РФ.

function memoryStore() {
  const users = new Map(), byEmail = new Map(), sessions = new Map(), children = new Map(),
    progress = new Map(), consents = [];
  return {
    async getUserByEmail(e) { const id = byEmail.get(e); return id ? { ...users.get(id) } : null; },
    async getUserById(id) { return users.has(id) ? { ...users.get(id) } : null; },
    async putUser(u) { users.set(u.uid, { ...u }); byEmail.set(u.email, u.uid); },
    async getSession(h) { return sessions.get(h) || null; },
    async putSession(s) { sessions.set(s.tokenHash, s); },
    async deleteSession(h) { sessions.delete(h); },
    async listChildren(uid) { return [...children.values()].filter(c => c.uid === uid); },
    async getChild(uid, id) { const c = children.get(id); return c && c.uid === uid ? c : null; },
    async putChild(c) { children.set(c.childId, c); },
    async deleteChild(uid, id) { const c = children.get(id); if (c && c.uid === uid) { children.delete(id); progress.delete(id); } },
    async getProgress(id) { const p = progress.get(id) || {}; const o = {}; for (const [k, v] of Object.entries(p)) o[k] = { data: JSON.parse(v.data), updatedAt: v.updatedAt }; return o; },
    async putProgress(r) { const p = progress.get(r.childId) || {}; p[r.subject] = r; progress.set(r.childId, p); },
    async logConsent(c) { consents.push(c); },
    async listConsents(uid) { return consents.filter(c => c.uid === uid); },
    async deleteUserCascade(u) {
      for (const c of await this.listChildren(u.uid)) await this.deleteChild(u.uid, c.childId);
      for (const [h, s] of sessions) if (s.uid === u.uid) sessions.delete(h);
      users.delete(u.uid); byEmail.delete(u.email);
      // Журнал согласий хранится отдельно как доказательство (без email), см. политику.
    },
    _dump: () => ({ users, sessions, children, progress, consents }),
  };
}

// Таблицы (создаёт deploy/setup.sh):
//  zv_users     PK email            (uid, pw, createdAt, paidUntil, ...)
//  zv_sessions  PK tokenHash        (uid, expiresAt)  — TTL по expiresTtl
//  zv_children  PK uid, SK childId
//  zv_progress  PK childId, SK subject
//  zv_consents  PK uid, SK ts_kind
// Поиск пользователя по uid — через zv_sessions/zv_children не нужен: uid храним и в users, и
// отдельную запись-указатель uid -> email в zv_users с PK "uid#<uid>".
function ydbStore(env) {
  const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
  const D = require('@aws-sdk/lib-dynamodb');
  const client = D.DynamoDBDocumentClient.from(new DynamoDBClient({
    region: 'ru-central1', endpoint: env.YDB_DOCAPI_ENDPOINT,
    credentials: { accessKeyId: env.YDB_ACCESS_KEY_ID, secretAccessKey: env.YDB_SECRET_ACCESS_KEY },
  }), { marshallOptions: { removeUndefinedValues: true } });
  const T = { users: 'zv_users', sessions: 'zv_sessions', children: 'zv_children', progress: 'zv_progress', consents: 'zv_consents' };
  const get = async (t, Key) => (await client.send(new D.GetCommand({ TableName: t, Key }))).Item || null;
  const put = (t, Item) => client.send(new D.PutCommand({ TableName: t, Item }));
  const del = (t, Key) => client.send(new D.DeleteCommand({ TableName: t, Key }));
  const query = async (t, k, v) => (await client.send(new D.QueryCommand({ TableName: t,
    KeyConditionExpression: '#k = :v', ExpressionAttributeNames: { '#k': k }, ExpressionAttributeValues: { ':v': v } }))).Items || [];

  return {
    async getUserByEmail(email) { return get(T.users, { email }); },
    async getUserById(uid) { const p = await get(T.users, { email: 'uid#' + uid }); return p ? get(T.users, { email: p.ref }) : null; },
    async putUser(u) { await put(T.users, u); await put(T.users, { email: 'uid#' + u.uid, ref: u.email }); },
    async getSession(tokenHash) { return get(T.sessions, { tokenHash }); },
    async putSession(s) { await put(T.sessions, { ...s, expiresTtl: Math.floor(s.expiresAt / 1000) }); },
    async deleteSession(tokenHash) { await del(T.sessions, { tokenHash }); },
    async listChildren(uid) { return query(T.children, 'uid', uid); },
    async getChild(uid, childId) { return get(T.children, { uid, childId }); },
    async putChild(c) { await put(T.children, c); },
    async deleteChild(uid, childId) {
      if (!await get(T.children, { uid, childId })) return;
      for (const p of await query(T.progress, 'childId', childId)) await del(T.progress, { childId, subject: p.subject });
      await del(T.children, { uid, childId });
    },
    async getProgress(childId) {
      const o = {};
      for (const p of await query(T.progress, 'childId', childId)) o[p.subject] = { data: JSON.parse(p.data), updatedAt: p.updatedAt };
      return o;
    },
    async putProgress(r) { await put(T.progress, r); },
    async logConsent(c) { await put(T.consents, { ...c, ts_kind: `${c.ts}_${c.kind}` }); },
    async listConsents(uid) { return query(T.consents, 'uid', uid); },
    async deleteUserCascade(u) {
      for (const c of await this.listChildren(u.uid)) await this.deleteChild(u.uid, c.childId);
      // Сессии истекут по TTL, но без пользователя они уже не работают (auth проверяет user).
      await del(T.users, { email: 'uid#' + u.uid });
      await del(T.users, { email: u.email });
    },
  };
}

module.exports = { memoryStore, ydbStore };
