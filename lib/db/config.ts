// src/db/config.ts
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const client = createClient({
	url: process.env.TURSO_DATABASE_URL!, // e.g. "libsql://<my-project>.turso.io"
	authToken: process.env.TURSO_DB_AUTH_TOKEN, // provided by Turso
});

export const db = drizzle(client);
