import { relations } from "drizzle-orm";
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

export const jobsRelations = relations(jobs, ({ many }) => ({
	jobToStackTags: many(jobToStackTable),
	jobsToIndustryTable: many(jobsToIndustryTable),
}));

// Stack tags
export const stackTags = sqliteTable("stack_tags", {
	id: integer().primaryKey({ autoIncrement: true }),
	name: text().notNull().default(""),
});

export const stackTagsRelations = relations(stackTags, ({ many }) => ({
	jobToStackTags: many(jobToStackTable),
}));

// Industry tags
export const industryTags = sqliteTable("industry_tags", {
	id: integer().primaryKey({ autoIncrement: true }),
	name: text().notNull().default(""),
});

export const industryTagsRelations = relations(industryTags, ({ many }) => ({
	jobToIndustryTags: many(jobsToIndustryTable),
}));

/// Relations

// job, stack relations
export const jobToStackTable = sqliteTable("job_stack_junction", {
	jobId: integer("job_id")
		.notNull()
		.references(() => jobs.id, { onDelete: "cascade" }),
	stackTagId: integer("stack_tag_id")
		.notNull()
		.references(() => stackTags.id, { onDelete: "cascade" }),
});

export const jobToStackRelations = relations(jobToStackTable, ({ one }) => ({
	jobs: one(jobs, {
		fields: [jobToStackTable.jobId],
		references: [jobs.id],
	}),
	stackTags: one(stackTags, {
		fields: [jobToStackTable.stackTagId],
		references: [stackTags.id],
	}),
}));

// job, industry relations
export const jobsToIndustryTable = sqliteTable("jobs_industry_junction", {
	jobId: integer("job_id")
		.notNull()
		.references(() => jobs.id, { onDelete: "cascade" }),
	industryTagId: integer("industry_tag_id")
		.notNull()
		.references(() => industryTags.id, { onDelete: "cascade" }),
});

export const jobsToIndustryTagsRelations = relations(
	jobsToIndustryTable,
	({ one }) => ({
		jobs: one(jobs, {
			fields: [jobsToIndustryTable.jobId],
			references: [jobs.id],
		}),
		industryTags: one(industryTags, {
			fields: [jobsToIndustryTable.industryTagId],
			references: [industryTags.id],
		}),
	})
);
