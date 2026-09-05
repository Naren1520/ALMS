const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const c = new Client({
  host: 'aws-0-ap-northeast-2.pooler.supabase.com',
  port: 5432,
  user: 'postgres.shavgttipitgwhmafocn',
  password: 'Sih2026almsproject',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');

async function run() {
  await c.connect();
  console.log('Connected to Supabase PostgreSQL...');

  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  console.log(`Found ${files.length} migration files:`, files);

  for (const file of files) {
    const fullPath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(fullPath, 'utf8');
    console.log(`\nExecuting: ${file}...`);
    try {
      await c.query(sql);
      console.log(`✓ SUCCESS: ${file}`);
    } catch (err) {
      console.error(`✗ ERROR in ${file}:`, err.message);
      // If error is non-fatal (e.g. extension already exists or type exists), continue or log
    }
  }

  const res = await c.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;");
  console.log(`\n========================================`);
  console.log(`Total migrated tables in 'public': ${res.rows.length}`);
  console.log(`Tables:`, res.rows.map(r => r.table_name));
  console.log(`========================================\n`);

  await c.end();
}

run().catch(console.error);
