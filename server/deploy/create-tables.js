'use strict';
const { DynamoDBClient, CreateTableCommand, DescribeTableCommand, UpdateTimeToLiveCommand } = require('@aws-sdk/client-dynamodb');
const c = new DynamoDBClient({ region: 'ru-central1', endpoint: process.env.YDB_DOCAPI_ENDPOINT,
  credentials: { accessKeyId: process.env.YDB_ACCESS_KEY_ID, secretAccessKey: process.env.YDB_SECRET_ACCESS_KEY } });
const S = (n) => ({ AttributeName: n, AttributeType: 'S' });
const tables = [
  ['zv_users', ['email']], ['zv_sessions', ['tokenHash']], ['zv_children', ['uid', 'childId']],
  ['zv_progress', ['childId', 'subject']], ['zv_consents', ['uid', 'ts_kind']],
];
(async () => {
  for (const [name, keys] of tables) {
    try { await c.send(new DescribeTableCommand({ TableName: name })); console.log('есть', name); continue; } catch {}
    await c.send(new CreateTableCommand({ TableName: name, AttributeDefinitions: keys.map(S),
      KeySchema: keys.map((k, i) => ({ AttributeName: k, KeyType: i ? 'RANGE' : 'HASH' })) }));
    console.log('создана', name);
  }
  try { await c.send(new UpdateTimeToLiveCommand({ TableName: 'zv_sessions', TimeToLiveSpecification: { Enabled: true, AttributeName: 'expiresTtl' } })); } catch (e) { console.log('TTL:', e.message); }
})();
