const { Client } = require('pg');

const c = new Client({
  host: 'aws-0-ap-northeast-2.pooler.supabase.com',
  port: 5432,
  user: 'postgres.shavgttipitgwhmafocn',
  password: 'Sih2026almsproject',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function verify() {
  await c.connect();
  console.log('=== SUPABASE DATABASE LIVE STATUS ===\n');
  
  const tables = [
    'users',
    'artisan_profiles',
    'buyer_profiles',
    'products',
    'product_media',
    'seo_metadata',
    'trust_scores',
    'rfqs',
    'region_stats'
  ];

  for (const t of tables) {
    const res = await c.query(`SELECT count(*) FROM ${t}`);
    console.log(` Table ${t.padEnd(22)}: ${res.rows[0].count} rows`);
  }
  
  console.log('\n--- Sample Products in Supabase ---');
  const prods = await c.query('SELECT title, category, retail_price, wholesale_price, moq FROM products LIMIT 5');
  prods.rows.forEach((r, i) => {
    console.log(` ${i+1}. ${r.title} | ₹${r.retail_price} | Wholesale: ₹${r.wholesale_price} | MOQ: ${r.moq}`);
  });

  console.log('\n--- Sample Users in Supabase ---');
  const users = await c.query('SELECT email, role, status FROM users LIMIT 6');
  users.rows.forEach((u, i) => {
    console.log(` ${i+1}. ${u.email.padEnd(30)} [${u.role}] - Status: ${u.status}`);
  });

  await c.end();
}

verify().catch(console.error);
