/**
 * Database Initialization Script for Lion Track Safari
 * Executes init.sql against the target PostgreSQL database.
 * Does not drop existing tables or data.
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

function isLocalHost(host) {
  return host === 'localhost' || host === '127.0.0.1' || host === '::1';
}

function resolveSsl(host, sslmode) {
  const mode = (sslmode || '').toLowerCase();
  if (mode === 'disable') return false;
  if (mode === 'require' || mode === 'verify-ca' || mode === 'verify-full') {
    return { rejectUnauthorized: false };
  }
  if (isLocalHost(host)) return false;
  return { rejectUnauthorized: false };
}

function resolveClientConfig() {
  const connectionString = process.env.DATABASE_URL;
  if (connectionString) {
    const trimmed = connectionString.trim();
    try {
      const parsed = new URL(trimmed);
      const host = decodeURIComponent(parsed.hostname);
      const database = decodeURIComponent(parsed.pathname.replace(/^\//, ''));
      return {
        user: decodeURIComponent(parsed.username),
        password: decodeURIComponent(parsed.password),
        host,
        port: parsed.port ? parseInt(parsed.port, 10) : 5432,
        database,
        ssl: resolveSsl(host, parsed.searchParams.get('sslmode')),
      };
    } catch {
      const match = trimmed.match(
        /^postgres(?:ql)?:\/\/([^:]+):(.*)@([^:/]+)(?::(\d+))?\/([^?]+)(?:\?(.*))?$/
      );
      if (match) {
        const [, user, password, host, port, database, query] = match;
        const params = new URLSearchParams(query || '');
        return {
          user: decodeURIComponent(user),
          password: decodeURIComponent(password),
          host,
          port: parseInt(port || '5432', 10),
          database: decodeURIComponent(database),
          ssl: resolveSsl(host, params.get('sslmode')),
        };
      }
    }
  }

  const host = process.env.PGHOST || 'localhost';
  return {
    host,
    port: parseInt(process.env.PGPORT || '5432', 10),
    database: process.env.PGDATABASE || 'lion_track_safari',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    ssl: resolveSsl(host, process.env.PGSSLMODE),
  };
}

async function initializeDatabase() {
  console.log('Lion Track Safari - Database Initialization Starting...');

  const config = resolveClientConfig();
  console.log(`Connecting to PostgreSQL at ${config.host}:${config.port}/${config.database}...`);

  const client = new Client(config);

  try {
    await client.connect();
    console.log('Connected to PostgreSQL database successfully.');

    const sqlPath = path.resolve(__dirname, '../init.sql');
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`init.sql file not found at ${sqlPath}`);
    }

    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    console.log('Executing schema DDL from init.sql...');

    await client.query(sqlContent);
    console.log('Schema tables and indices are ready (existing data was not dropped).');

    const uuidTables = [
      'safari_enquiries',
      'custom_safari_requests',
      'b2b_agent_applications',
      'quick_contact_leads',
    ];
    for (const table of uuidTables) {
      try {
        await client.query(`ALTER TABLE ${table} ALTER COLUMN id DROP DEFAULT`);
      } catch (alterErr) {
        console.warn(
          `Could not drop UUID default on ${table} (application still supplies crypto.randomUUID()):`,
          alterErr.message
        );
      }
    }

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
    console.log('\nVerified CTA Tables:');
    res.rows.forEach((row, idx) => {
      console.log(`  ${idx + 1}. ${row.table_name}`);
    });

    console.log('\nAll 6 Lion Track Safari CTA tables are ready.');
  } catch (err) {
    console.error('Database initialization failed:', err.message);
    if (err.code) {
      console.error('PostgreSQL error code:', err.code);
    }
    if (!process.env.DATABASE_URL && !process.env.PGHOST) {
      console.warn('Set DATABASE_URL or PGHOST/PGDATABASE/PGUSER/PGPASSWORD in the environment.');
    }
    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
}

initializeDatabase();
