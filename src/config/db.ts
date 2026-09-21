import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const isProduction = process.env.NODE_ENV === 'production';

const CONNECTION_ERROR_CODES = new Set([
  'ECONNREFUSED',
  'ENOTFOUND',
  'EAI_AGAIN',
  'ETIMEDOUT',
  'ECONNRESET',
  '57P01',
  '57P02',
  '57P03',
  '08000',
  '08001',
  '08003',
  '08004',
  '08006',
  '08007',
  '28P01',
  '3D000',
]);

function isLocalHost(host: string | undefined): boolean {
  return host === 'localhost' || host === '127.0.0.1' || host === '::1';
}

function resolveSsl(host: string, sslmode: string | null | undefined): boolean | { rejectUnauthorized: boolean } {
  const mode = (sslmode || '').toLowerCase();

  if (mode === 'disable') {
    return false;
  }

  if (mode === 'require' || mode === 'verify-ca' || mode === 'verify-full') {
    return { rejectUnauthorized: false };
  }

  if (isLocalHost(host)) {
    return false;
  }

  return { rejectUnauthorized: false };
}

function parseDatabaseUrl(connectionString: string): pkg.PoolConfig | null {
  const trimmed = connectionString.trim();

  try {
    const parsed = new URL(trimmed);
    if (!/^postgres(ql)?:$/i.test(parsed.protocol)) {
      return null;
    }

    const host = decodeURIComponent(parsed.hostname);
    const database = decodeURIComponent(parsed.pathname.replace(/^\//, ''));
    const sslmode = parsed.searchParams.get('sslmode');

    return {
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      host,
      port: parsed.port ? parseInt(parsed.port, 10) : 5432,
      database,
      ssl: resolveSsl(host, sslmode),
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };
  } catch {
    const match = trimmed.match(
      /^postgres(?:ql)?:\/\/([^:]+):(.*)@([^:/]+)(?::(\d+))?\/([^?]+)(?:\?(.*))?$/
    );
    if (!match) {
      return null;
    }

    const [, user, password, host, port, database, query] = match;
    const params = new URLSearchParams(query || '');

    return {
      user: decodeURIComponent(user),
      password: decodeURIComponent(password),
      host,
      port: parseInt(port || '5432', 10),
      database: decodeURIComponent(database),
      ssl: resolveSsl(host, params.get('sslmode')),
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };
  }
}

function resolvePoolConfig(): pkg.PoolConfig {
  const connectionString = process.env.DATABASE_URL;
  if (connectionString) {
    const parsed = parseDatabaseUrl(connectionString);
    if (parsed) {
      return parsed;
    }

    const trimmed = connectionString.trim();
    const hostHint = trimmed.includes('127.0.0.1') || trimmed.includes('localhost') ? '127.0.0.1' : '';
    const sslmode = /sslmode=([^&]+)/i.exec(trimmed)?.[1];

    return {
      connectionString: trimmed,
      ssl: resolveSsl(hostHint, sslmode),
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };
  }

  const host = process.env.PGHOST || 'localhost';

  return {
    host,
    port: parseInt(process.env.PGPORT || '5432', 10),
    database: process.env.PGDATABASE || 'lion_track_safari',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    ssl: resolveSsl(host, process.env.PGSSLMODE),
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  };
}

const poolConfig = resolvePoolConfig();
export const pool = new Pool(poolConfig);

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

function sanitizeDbError(err: any): string {
  let msg = String(err?.message || 'Unknown database error');
  msg = msg.replace(/postgres(?:ql)?:\/\/\S+/gi, '[redacted-database-url]');
  msg = msg.replace(/password\s*=\s*\S+/gi, 'password=[redacted]');
  return msg;
}

export function logPostgresQueryError(err: any, text: string): void {
  console.error('PostgreSQL query failed', {
    message: err?.message,
    code: err?.code,
    detail: err?.detail,
    hint: err?.hint,
    query: text,
  });
}

export async function testDbConnection(forceCheck = false): Promise<boolean> {
  if (dbConnectionTested && !forceCheck) return isPostgresConnected;
  try {
    const res = await pool.query('SELECT 1 AS ok, NOW() AS current_time');
    if (res && res.rows && res.rows.length > 0) {
      isPostgresConnected = true;
      lastConnectionError = null;
      console.log('PostgreSQL pool connected successfully at:', res.rows[0].current_time);
    }
  } catch (err: any) {
    isPostgresConnected = false;
    lastConnectionError = sanitizeDbError(err);
    if (isProduction) {
      console.error('PostgreSQL connection failed in production:', lastConnectionError);
    } else {
      console.warn(
        `PostgreSQL connection not available (${lastConnectionError}). Development in-memory fallback may be used for CTA captures.`
      );
    }
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
    storageEngine: isPostgresConnected ? 'PostgreSQL (pg pool)' : isProduction ? 'PostgreSQL unavailable' : 'In-Memory Fallback',
    targetHost: configuredHost,
    targetDatabase: configuredDb,
    targetUser: configuredUser,
    lastConnectionError,
  };
}

export async function getPersistedRecordCounts(): Promise<{
  available: boolean;
  source: 'postgresql' | 'unavailable';
  counts: Record<string, number> | null;
}> {
  if (!isPostgresConnected) {
    return { available: false, source: 'unavailable', counts: null };
  }

  const countQuery = `
    SELECT
      (SELECT COUNT(*)::int FROM safari_enquiries) AS safari_enquiries,
      (SELECT COUNT(*)::int FROM custom_safari_requests) AS custom_safari_requests,
      (SELECT COUNT(*)::int FROM b2b_agent_applications) AS b2b_agent_applications,
      (SELECT COUNT(*)::int FROM newsletter_subscribers) AS newsletter_subscribers,
      (SELECT COUNT(*)::int FROM quick_contact_leads) AS quick_contact_leads,
      (SELECT COUNT(*)::int FROM blog_feedbacks) AS blog_feedbacks
  `;

  try {
    const res = await pool.query(countQuery);
    return {
      available: true,
      source: 'postgresql',
      counts: res.rows[0] || null,
    };
  } catch (err: any) {
    logPostgresQueryError(err, countQuery);
    return { available: false, source: 'unavailable', counts: null };
  }
}

export async function executeQuery<T = any>(
  text: string,
  params: any[] = [],
  fallbackHandler?: () => Promise<T> | T
): Promise<{ rows: T[]; rowCount: number }> {
  try {
    const res = await pool.query(text, params);
    isPostgresConnected = true;
    lastConnectionError = null;
    return {
      rows: res.rows,
      rowCount: res.rowCount ?? res.rows.length,
    };
  } catch (err: any) {
    logPostgresQueryError(err, text);

    if (CONNECTION_ERROR_CODES.has(String(err?.code))) {
      isPostgresConnected = false;
      lastConnectionError = sanitizeDbError(err);
    }

    if (isProduction) {
      throw err;
    }

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

pool.on('error', (err) => {
  isPostgresConnected = false;
  lastConnectionError = sanitizeDbError(err);
  console.error('Unexpected error on idle pg client', {
    message: err.message,
    code: (err as any).code,
  });
});
