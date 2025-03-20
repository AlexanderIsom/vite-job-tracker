import { differenceInDays, startOfDay } from "date-fns";
import { and, eq, notInArray } from "drizzle-orm";
import { jobs, jobsToIndustryTable, jobToStackTable } from "../db/schema";
import {
	JobSchemaWithStaleStatusType,
	JobSchemaWithTags,
} from "../../../shared/db/jobSchema";
import { redirect } from "@tanstack/react-router";
import { authorisedFetch, unauthorisedRedirect } from "../fetchUtils";

type AddJobResponse = {
	error: string | null;
	data: string | null;
};

export async function addJob(formData: unknown): Promise<AddJobResponse> {
	// const result = JobSchemaWithTags.safeParse(formData);

	// if (!result.success) {
	// 	return { error: "Invalid form data", data: null };
	// }

	// const {
	// 	company_name,
	// 	role_title,
	// 	salary_range,
	// 	remote,
	// 	industryTags,
	// 	stackTags,
	// 	notes,
	// 	status,
	// } = result.data;

	// const job = await db
	// 	.insert(jobs)
	// 	.values({
	// 		company_name: company_name,
	// 		role_title: role_title,
	// 		salary_range: salary_range,
	// 		remote: remote,
	// 		date_applied: new Date(),
	// 		notes: notes,
	// 		last_updated: new Date(),
	// 		status: status,
	// 	})
	// 	.returning();

	// await db
	// 	.insert(jobToStackTable)
	// 	.values(
	// 		stackTags.map((tag) => ({
	// 			jobId: job[0].id,
	// 			stackTagId: tag.id,
	// 		}))
	// 	)
	// 	.onConflictDoNothing();

	// await db
	// 	.insert(jobsToIndustryTable)
	// 	.values(
	// 		industryTags.map((tag) => ({
	// 			jobId: job[0].id,
	// 			industryTagId: tag.id,
	// 		}))
	// 	)
	// 	.onConflictDoNothing();

	return { error: null, data: "Job added" };
}

export const fetchAllJobs = async () => {
	const res = await fetch("/api/jobs");
	unauthorisedRedirect(res);
	if (!res.ok) {
		throw new Error("Failed to fetch jobs");
	}
	return res.json();
};

export const fetchJobById = async (id: string) => {
	const res = await fetch(`/api/jobs/${id}`);
	unauthorisedRedirect(res);
	if (!res.ok) {
		throw new Error("Failed to fetch job");
	}
	return res.json();
};

export async function updateJob(formData: unknown) {
	const result = JobSchemaWithTags.safeParse(formData);

	// if (!result.success) {
	// 	return { error: "Invalid form data", data: null };
	// }

	// const {
	// 	id,
	// 	company_name,
	// 	role_title,
	// 	salary_range,
	// 	remote,
	// 	industryTags,
	// 	stackTags,
	// 	notes,
	// 	status,
	// } = result.data;

	// const job = await db.query.jobs.findFirst({
	// 	where: eq(jobs.id, id),
	// 	with: {
	// 		jobToStackTags: {
	// 			columns: {},
	// 			with: {
	// 				stackTags: true,
	// 			},
	// 		},
	// 		jobsToIndustryTable: {
	// 			columns: {},
	// 			with: {
	// 				industryTags: true,
	// 			},
	// 		},
	// 	},
	// });

	// if (!job) {
	// 	return { error: "Could not find job", data: null };
	// }

	// const existingStackTags = job.jobToStackTags.map((jst) => jst.stackTags);
	// const existingIndustryTags = job.jobsToIndustryTable.map(
	// 	(jit) => jit.industryTags
	// );
	// const newStackTags = stackTags.filter(
	// 	(tag) => !existingStackTags.some((t) => t.id === tag.id)
	// );
	// const newIndustryTags = industryTags.filter(
	// 	(tag) => !existingIndustryTags.some((t) => t.id === tag.id)
	// );

	// await db
	// 	.update(jobs)
	// 	.set({
	// 		company_name: company_name,
	// 		role_title: role_title,
	// 		salary_range: salary_range,
	// 		remote: remote,
	// 		notes: notes,
	// 		last_updated: new Date(),
	// 		status: status,
	// 	})
	// 	.where(eq(jobs.id, id));

	// if (newStackTags.length > 0) {
	// 	await db
	// 		.insert(jobToStackTable)
	// 		.values(
	// 			newStackTags.map((tag) => ({
	// 				jobId: id,
	// 				stackTagId: tag.id,
	// 			}))
	// 		)
	// 		.onConflictDoNothing();
	// }

	// if (newIndustryTags.length > 0) {
	// 	await db
	// 		.insert(jobsToIndustryTable)
	// 		.values(
	// 			newIndustryTags.map((tag) => ({
	// 				jobId: id,
	// 				industryTagId: tag.id,
	// 			}))
	// 		)
	// 		.onConflictDoNothing();
	// }

	// await db.delete(jobToStackTable).where(
	// 	and(
	// 		eq(jobToStackTable.jobId, id),
	// 		notInArray(
	// 			jobToStackTable.stackTagId,
	// 			stackTags.map((tag) => tag.id)
	// 		)
	// 	)
	// );

	// await db.delete(jobsToIndustryTable).where(
	// 	and(
	// 		eq(jobsToIndustryTable.jobId, id),
	// 		notInArray(
	// 			jobsToIndustryTable.industryTagId,
	// 			industryTags.map((tag) => tag.id)
	// 		)
	// 	)
	// );

	return { error: null, data: null };
	// redirect('/jobs');
}

export async function deleteJob(id: number) {
	// await db.delete(jobs).where(eq(jobs.id, id));
	redirect({ to: "/" });
}

export async function getJobById(id: number) {
	// const job = await db.query.jobs.findFirst({
	// 	where: eq(jobs.id, id),
	// 	with: {
	// 		jobToStackTags: {
	// 			columns: {},
	// 			with: {
	// 				stackTags: true,
	// 			},
	// 		},
	// 		jobsToIndustryTable: {
	// 			columns: {},
	// 			with: {
	// 				industryTags: true,
	// 			},
	// 		},
	// 	},
	// });
	// if (job) {
	// 	const { jobToStackTags, jobsToIndustryTable, ...rest } = job;
	// 	const transformedJob = {
	// 		...rest,
	// 		stackTags: jobToStackTags.map((jst) => jst.stackTags),
	// 		industryTags: jobsToIndustryTable.map((jit) => jit.industryTags),
	// 	};
	// 	return transformedJob;
	// }
}
