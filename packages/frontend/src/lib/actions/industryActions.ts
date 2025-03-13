"use server";

import { db } from "@/lib/turso";
import { industryTags } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function createIndustryTag(tagName: string) {
	// const { user } = await useUser();

	// if (!user) {
	// 	return { error: "Not authenticated", data: null };
	// }

	const result = await db
		.insert(industryTags)
		.values({ name: tagName })
		.returning();
	return { error: null, data: result[0] };
}

export async function deleteIndustryTag(id: number) {
	// const { user } = await useUser();
	// if (!user) {
	// 	return { error: "Not authenticated", data: null };
	// }

	await db.delete(industryTags).where(eq(industryTags.id, id));
}

export async function getIndustryTags() {
	// const { user } = await useUser();
	// if (!user) {
	// 	return { error: "Not authenticated", data: null };
	// }

	return { error: null, data: await db.select().from(industryTags) };
}
