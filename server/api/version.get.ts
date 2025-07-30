import { neon } from '@neondatabase/serverless';

export default defineCachedEventHandler(
  async (event) => {
    const { databaseUrl } = useRuntimeConfig();
    const db = neon(databaseUrl as string);
    const result = await db`SELECT version()`;
    return result;
  },
  {
    maxAge: 60 * 60 * 24, // cache it for a day
  }
);