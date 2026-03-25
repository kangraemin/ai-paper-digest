import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

type DB = ReturnType<typeof drizzle<typeof schema>>;

let _db: DB | null = null;

function getDb(): DB {
  if (!_db) {
    if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
      throw new Error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set');
    }
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    _db = drizzle(client, { schema });
  }
  return _db;
}

export const db = new Proxy({} as DB, {
  get(_target, prop: string | symbol) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (getDb() as any)[prop];
  },
});
