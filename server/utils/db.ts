import { neon } from '@neondatabase/serverless';

let dbInstance: ReturnType<typeof neon> | null = null;

export function useDb() {
  if (!dbInstance) {
    const { databaseUrl } = useRuntimeConfig();
    dbInstance = neon(databaseUrl as string);
  }
  return dbInstance;
}
