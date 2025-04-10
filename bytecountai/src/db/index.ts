import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from './schema/schema'; // import tables


config({ path: ".env" }); // Load your environment variables

// Initialize the PostgreSQL client
const client = postgres(process.env.DATABASE_URL!);

// Initialize Drizzle with the client
export const db = drizzle(client);
export * from "./schema/schema"; // Export the schema for use in other files
