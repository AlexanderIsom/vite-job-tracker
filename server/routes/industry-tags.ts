import dotenv from "dotenv";
import { Request, Response, Router } from "express";
import { db } from "../db/config";
import { industryTags } from "../db/schema";
import { eq } from "drizzle-orm";

dotenv.config();

const router = Router();

router.get("/", async (req: Request, res: Response) => {
	try {
		res.json(await db.select().from(industryTags));
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Server error" });
	}
});

router.post("/create", async (req: Request, res: Response) => {
	const { tagName } = req.body;

	if (!tagName || tagName.length === 0) {
		res.status(400).json({ error: "Tag name is required" });
		return;
	}

	const [result] = await db
		.insert(industryTags)
		.values({ name: tagName })
		.returning();

	res.json({ error: null, data: result });
});

router.delete("/delete/:id", async (req: Request, res: Response) => {
	const { id } = req.params;

	await db.delete(industryTags).where(eq(industryTags.id, parseInt(id)));
	res.json({ error: null, data: null });
});

export default router;
