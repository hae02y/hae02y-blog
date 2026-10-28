import 'server-only';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Lazy singleton so importing this module never requires DATABASE_URL at
// build time — only an actual query (at request time on Vercel) does.
const globalForDb = globalThis as unknown as {
  __pool?: Pool;
  __db?: NodePgDatabase<typeof schema>;
};

export function getDb(): NodePgDatabase<typeof schema> {
  if (globalForDb.__db) return globalForDb.__db;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  const pool = globalForDb.__pool ?? new Pool({ connectionString });
  const db = drizzle(pool, { schema });

  globalForDb.__pool = pool;
  globalForDb.__db = db;
  return db;
}

export { schema };
