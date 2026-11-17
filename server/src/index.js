'use strict';
// Точка входа Yandex Cloud Function (HTTP-вызов или API Gateway).
const { handle } = require('./app');
const { ydbStore } = require('./stores');

let store;

module.exports.handler = async (event) => {
  store = store || ydbStore(process.env);
  const lower = {};
  for (const [k, v] of Object.entries(event.headers || {})) lower[k.toLowerCase()] = v;
  let body = event.body || '';
  if (event.isBase64Encoded && body) body = Buffer.from(body, 'base64').toString('utf8');
  let parsed = null;
  if (body) { try { parsed = JSON.parse(body); } catch { parsed = null; } }
  const path = (event.params && event.params.path) ? '/' + event.params.path : (event.path || event.url || '/').split('?')[0];
  const ip = (event.requestContext && event.requestContext.identity && event.requestContext.identity.sourceIp) || '';
  const r = await handle({ method: event.httpMethod, path, headers: lower, body: parsed, ip }, store, process.env);
  return { statusCode: r.status, headers: r.headers, body: r.body };
};
