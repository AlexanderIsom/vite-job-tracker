import { Request, Response, Router } from "express";
import { db } from "../db/config";
import { jobs } from "../db/schema";
import { eq } from "drizzle-orm";
import { differenceInDays, startOfDay } from "date-fns";
import { JobSchemaWithStaleStatusType } from "shared/db/jobSchema";

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

export default router;
