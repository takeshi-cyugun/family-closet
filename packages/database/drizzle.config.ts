import path from 'node:path';
import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// DATABASE_URL は apps/web/.env.local を単一の情報源として利用する
config({ path: path.resolve(__dirname, '../../apps/web/.env.local') });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Check apps/web/.env.local');
}

export default defineConfig({
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
