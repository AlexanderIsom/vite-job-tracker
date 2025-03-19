import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const jobs = sqliteTable("jobs", {
	id: integer().primaryKey({ autoIncrement: true }),
	company_name: text().notNull().default(""),
	role_title: text().notNull().default(""),
	salary_range: text().notNull().default(""),
	remote: text({ enum: ["remote", "hybrid", "in-person", "unknown"] })
		.notNull()
		.default("unknown"),
	date_applied: integer({ mode: "timestamp" }).notNull(),
	notes: text().notNull().default(""),
	status: text({ enum: ["interviewing", "offer", "rejected", "applied"] })
		.notNull()
		.default("applied"),
	last_updated: integer({ mode: "timestamp" }).notNull(),
});
