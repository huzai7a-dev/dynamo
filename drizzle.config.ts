import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './drizzle/schema.ts', // Where you want the types to live
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!, // Your Neon connection string
    },
});