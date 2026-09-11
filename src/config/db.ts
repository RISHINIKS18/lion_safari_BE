import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// Determine connection strategy with resilient parsing for passwords with special chars and spaced DB names
function resolvePoolConfig(): pkg.PoolConfig {
  const connectionString = process.env.DATABASE_URL;
  if (connectionString) {
    const trimmed = connectionString.trim();
    // Check for postgresql connection URL format
    const match = trimmed.match(/^postgres(?:ql)?:\/\/([^:]+):(.*)@([^:/]+)(?::(\d+))?\/([^?]+)(?:\?(.*))?$/);
    if (match) {
      const [, user, password, host, port, database, query] = match;
      const cleanDb = decodeURIComponent(database).replace(/\s+/g, '');
      const isLocal = host === 'localhost' || host === '127.0.0.1';
      const isRequireSsl = query && query.includes('sslmode=require');

      return {
        user: decodeURIComponent(user),
        password: decodeURIComponent(password),
        host,
        port: parseInt(port || '5432', 10),
        database: cleanDb,
        ssl: isRequireSsl ? { rejectUnauthorized: false } : false,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      };
    }

    return {
      connectionString: trimmed,
      ssl: trimmed.includes('localhost') ? false : { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };
  }

  return {
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432', 10),
    database: (process.env.PGDATABASE || 'lion_track_safari').replace(/\s+/g, ''),
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  };
}

const poolConfig = resolvePoolConfig();
export const pool = new Pool(poolConfig);

// In-memory fallback repository when live PostgreSQL instance is not yet connected
interface InMemDB {
  safari_enquiries: any[];
  custom_safari_requests: any[];
  b2b_agent_applications: any[];
  newsletter_subscribers: any[];
  quick_contact_leads: any[];
  blog_feedbacks: any[];
}

export const inMemoryDb: InMemDB = {
  safari_enquiries: [],
  custom_safari_requests: [],
  b2b_agent_applications: [],
  newsletter_subscribers: [
    {
      id: 1,
      email: 'founder@liontracksafari.com',
      source: 'Default_Seed',
      tags: ['Bush Journal', 'Great Migration Updates'],
      is_active: true,
      subscribed_at: new Date().toISOString(),
    },
  ],
  quick_contact_leads: [],
  blog_feedbacks: [],
};

let dbConnectionTested = false;
let isPostgresConnected = false;
let lastConnectionError: string | null = null;

export async function testDbConnection(forceCheck = false): Promise<boolean> {
  if (dbConnectionTested && !forceCheck) return isPostgresConnected;
  try {
    const res = await pool.query('SELECT NOW() AS current_time');
    if (res && res.rows && res.rows.length > 0) {
      isPostgresConnected = true;
      lastConnectionError = null;
      console.log('🐘 PostgreSQL pool connected successfully at:', res.rows[0].current_time);
    }
  } catch (err: any) {
    isPostgresConnected = false;
    lastConnectionError = err.message || 'Unknown database connection error';
    console.warn(`⚠️ PostgreSQL connection not available (${err.message}). Operating with in-memory persistence fallback for CTA captures.`);
  } finally {
    dbConnectionTested = true;
  }
  return isPostgresConnected;
}

export function getDbStatus() {
  const configuredHost = poolConfig.host || (process.env.DATABASE_URL ? 'connection string' : 'none');
  const configuredDb = poolConfig.database || process.env.PGDATABASE;
  const configuredUser = poolConfig.user || process.env.PGUSER;

  return {
    postgresConfigured: Boolean(process.env.DATABASE_URL || process.env.PGHOST),
    isPostgresConnected,
    storageEngine: isPostgresConnected ? 'PostgreSQL (pg pool)' : 'In-Memory Fallback',
    targetHost: configuredHost,
    targetDatabase: configuredDb,
    targetUser: configuredUser,
    lastConnectionError,
    counts: {
      safari_enquiries: inMemoryDb.safari_enquiries.length,
      custom_safari_requests: inMemoryDb.custom_safari_requests.length,
      b2b_agent_applications: inMemoryDb.b2b_agent_applications.length,
      newsletter_subscribers: inMemoryDb.newsletter_subscribers.length,
      quick_contact_leads: inMemoryDb.quick_contact_leads.length,
      blog_feedbacks: inMemoryDb.blog_feedbacks.length,
    },
  };
}

/**
 * Robust database query wrapper with automatic fallback
 */
export async function executeQuery<T = any>(
  text: string,
  params: any[] = [],
  fallbackHandler?: () => Promise<T> | T
): Promise<{ rows: T[]; rowCount: number }> {
  try {
    const res = await pool.query(text, params);
    isPostgresConnected = true;
    return {
      rows: res.rows,
      rowCount: res.rowCount ?? res.rows.length,
    };
  } catch (err: any) {
    isPostgresConnected = false;
    if (fallbackHandler) {
      const fallbackResult = await fallbackHandler();
      const rows = Array.isArray(fallbackResult) ? fallbackResult : [fallbackResult];
      return {
        rows: rows.filter(Boolean),
        rowCount: rows.length,
      };
    }
    throw err;
  }
}

// Error listener to prevent unhandled node crash on idle client error
pool.on('error', (err) => {
  console.error('Unexpected error on idle pg client', err);
});
