"use server";

import { db } from "@/lib/turso";
import { stackTags } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function createStackTag(tagName: string) {
	// const { user } = useUser();
	// if (!user) {
	// 	return { error: "Not authenticated", data: null };
	// }

	const result = await db
		.insert(stackTags)
		.values({ name: tagName })
		.returning();
	return { error: null, data: result[0] };
}

export async function deleteStackTag(id: number) {
	// const { user } = useUser();
	// if (!user) {
	// 	return { error: "Not authenticated", data: null };
	// }

	await db.delete(stackTags).where(eq(stackTags.id, id));
}

export async function getStackTags() {
	// const { user } = useUser();
	// if (!user) {
	// 	return { error: "Not authenticated", data: null };
	// }

	return { error: null, data: await db.select().from(stackTags) };
}
