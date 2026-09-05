const { Client } = require('pg');

const c = new Client({
  host: 'aws-0-ap-northeast-2.pooler.supabase.com',
  port: 5432,
  user: 'postgres.shavgttipitgwhmafocn',
  password: 'Sih2026almsproject',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await c.connect();
  const tables = await c.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;");
  console.log('Tables in Supabase:', tables.rows.map(r => r.table_name));
  
  const tablesToCheck = ['users', 'artisans', 'products', 'product_images', 'rfqs', 'orders', 'escrow_transactions', 'trust_score_weights'];
  for (const t of tablesToCheck) {
    try {
      const count = await c.query(`SELECT count(*) FROM ${t}`);
      console.log(`${t} count: ${count.rows[0].count}`);
    } catch (e) {
      console.log(`${t}: ${e.message}`);
    }
  }
  await c.end();
}

main().catch(console.error);
