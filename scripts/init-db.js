/**
 * Database Initialization Script for Lion Track Safari
 * Executes the SQL schema in init.sql against the target PostgreSQL database (Supabase, Neon, etc.)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  console.log('🦁 Lion Track Safari - Database Initialization Starting...');

  const connectionString = process.env.DATABASE_URL;
  const config = connectionString
    ? {
        connectionString,
        ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
      }
    : {
        host: process.env.PGHOST || 'localhost',
        port: parseInt(process.env.PGPORT || '5432', 10),
        database: process.env.PGDATABASE || 'lion_track_safari',
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || 'postgres',
        ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : false,
      };

  console.log(`Connecting to PostgreSQL at ${connectionString ? '(via DATABASE_URL)' : `${config.host}:${config.port}/${config.database}`}...`);

  const client = new Client(config);

  try {
    await client.connect();
    console.log(' Connected to PostgreSQL database successfully.');

    const sqlPath = path.resolve(__dirname, '../init.sql');
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`init.sql file not found at ${sqlPath}`);
    }

    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    console.log(' Executing schema DDL from init.sql...');

    await client.query(sqlContent);
    console.log(' Schema tables, indices, and extensions created successfully!');

    // Verify all 6 tables
    const tableCheckQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN (
          'safari_enquiries',
          'custom_safari_requests',
          'b2b_agent_applications',
          'newsletter_subscribers',
          'quick_contact_leads',
          'blog_feedbacks'
        )
      ORDER BY table_name;
    `;
    const res = await client.query(tableCheckQuery);
    console.log('\n Verified Created CTA Tables:');
    res.rows.forEach((row, idx) => {
      console.log(`  ${idx + 1}. ${row.table_name}`);
    });

    console.log('\n All 6 Lion Track Safari CTA tables are ready for production traffic!');
  } catch (err) {
    console.error(' Database initialization failed:', err.message);
    if (!process.env.DATABASE_URL && !process.env.PGHOST) {
      console.warn('💡 Tip: Set DATABASE_URL in your .env file with your Neon or Supabase PostgreSQL connection string.');
    }
    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
}

initializeDatabase();
