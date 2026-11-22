import { PostgresStore } from '@mastra/pg';

export const pStore = new PostgresStore({
  id: 'mastra-store',
  connectionString: process.env.DATABASE_URL!,
});
