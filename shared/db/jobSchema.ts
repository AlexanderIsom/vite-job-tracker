import { z } from "zod";

export const JobSchema = z.object({
	company_name: z.string().min(2).max(50),
	role_title: z.string().min(2).max(50),
	salary_range: z.string().max(50).optional(),
	remote: z.enum(["remote", "hybrid", "in-person", "unknown"]),
	notes: z.string().optional(),
	status: z
		.enum(["interviewing", "offer", "rejected", "applied"])
		.optional()
		.default("applied"),
});

export const JobSchemaWithId = JobSchema.extend({
	id: z.number(),
});

export const JobSchemaWithTags = JobSchema.extend({
	id: z.number(),
	stackTags: z.array(
		z.object({
			id: z.number(),
			name: z.string(),
		})
	),
	industryTags: z.array(
		z.object({
			id: z.number(),
			name: z.string(),
		})
	),
});

export const JobSchemaWithStaleStatus = JobSchemaWithId.extend({
	stale: z.string(),
	date_applied: z.date().default(new Date()),
	last_updated: z.date().default(new Date()),
});

export type JobSchemaWithStaleStatusType = z.infer<
	typeof JobSchemaWithStaleStatus
>;
