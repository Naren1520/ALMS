const { Client } = require('pg');

const c = new Client({
  host: 'aws-0-ap-northeast-2.pooler.supabase.com',
  port: 5432,
  user: 'postgres.shavgttipitgwhmafocn',
  password: 'Sih2026almsproject',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function check() {
  await c.connect();
  const res = await c.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;");
  console.log('PUBLIC TABLES COUNT:', res.rows.length);
  console.log('PUBLIC TABLES:', res.rows.map(r => r.table_name));
  await c.end();
}

check().catch(console.error);
