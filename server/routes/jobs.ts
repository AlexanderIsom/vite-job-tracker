import { Request, Response, Router } from "express";
import { db } from "../db/config";
import { jobs, jobsToIndustryTable, jobToStackTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { differenceInDays, startOfDay } from "date-fns";
import {
	JobSchemaWithStaleStatusType,
	JobSchemaWithTags,
} from "shared/db/jobSchema";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
	try {
		const allJobs = await db.select().from(jobs);
		res.json(allJobs);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Server error" });
	}
});

router.get("/:id", async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const [job] = await db
			.select()
			.from(jobs)
			.where(eq(jobs.id, parseInt(id)));
		res.json(job);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Server error" });
	}
});

router.get("/stale", async (req: Request, res: Response) => {
	const data = await db.select().from(jobs);
	const jobsWithStaleStatus = data.map((job) => {
		const newJob = job as JobSchemaWithStaleStatusType;
		newJob.stale =
			differenceInDays(new Date(), startOfDay(newJob.date_applied)) >= 14
				? "stale"
				: "fresh";
		return newJob;
	});
	res.json(jobsWithStaleStatus);
});

router.post("/create", async (req: Request, res: Response) => {
	const result = JobSchemaWithTags.safeParse(req.body);

	if (!result.success) {
		res.status(400).json({ error: result.error.format(), data: req.body });
		return;
	}

	const {
		company_name,
		role_title,
		salary_range,
		remote,
		industryTags,
		stackTags,
		notes,
		status,
	} = result.data;

	const [newJob] = await db
		.insert(jobs)
		.values({
			company_name: company_name,
			role_title: role_title,
			salary_range: salary_range,
			remote: remote,
			date_applied: new Date(),
			notes: notes,
			last_updated: new Date(),
			status: status,
		})
		.returning();

	if (stackTags.length > 0) {
		await db
			.insert(jobToStackTable)
			.values(
				stackTags.map((tag) => ({
					jobId: newJob.id,
					stackTagId: tag.id,
				}))
			)
			.onConflictDoNothing();
	}

	if (industryTags.length > 0) {
		await db
			.insert(jobsToIndustryTable)
			.values(
				industryTags.map((tag) => ({
					jobId: newJob.id,
					industryTagId: tag.id,
				}))
			)
			.onConflictDoNothing();
	}

	res.json({ error: null, data: newJob });
});
export default router;
