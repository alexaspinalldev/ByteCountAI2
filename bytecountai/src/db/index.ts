import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from '@/db/schema/schema'; // import tables


config({ path: ".env" }); // Load your environment variables

// Initialize the PostgreSQL client
const client = postgres(process.env.DATABASE_URL!);

// Initialize Drizzle with the client
export const db = drizzle(client, { schema });
export * from '@/db/schema/schema'