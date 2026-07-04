import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

// Use max:1 for serverless/edge; adjust for traditional Node servers
const client = postgres(connectionString, { max: 10 });

export const db = drizzle(client, { schema });
