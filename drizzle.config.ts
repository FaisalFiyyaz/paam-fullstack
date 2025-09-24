import type { Config } from 'drizzle-kit'

/**
 * Drizzle configuration for database migrations and schema management
 * @see https://orm.drizzle.team/kit-docs/conf
 */
export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: 'postgresql://postgres:7vU13da65PfXacqv@db.shgwaebwsuhhlpuygqhz.supabase.co:5432/postgres',
  },
  verbose: true,
  strict: true,
} satisfies Config
