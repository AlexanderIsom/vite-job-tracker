"use server";

import { unauthorisedRedirect } from "../fetchUtils";

export async function createIndustryTag(tagName: string) {
	const response = await fetch("/api/industry-tags/create", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ tagName: tagName }),
	});

	unauthorisedRedirect(response);

	if (!response.ok) {
		throw new Error("Failed to create industry tag");
	}

	return await response.json();
}

export async function deleteIndustryTag(id: number) {
	const response = await fetch(`/api/industry-tags/delete/${id}`, {
		method: "DELETE",
	});
	unauthorisedRedirect(response);

	if (!response.ok) {
		throw new Error("Failed to delete industry tag");
	}

	return { error: null, data: await response.json() };
}

export async function fetchIndustryTags() {
	try {
		const response = await fetch("/api/industry-tags");
		unauthorisedRedirect(response);

		if (!response.ok) {
			throw new Error("Failed to fetch industry tags");
		}

		const data = await response.json();
		return { error: null, data };
	} catch (error) {
		console.error(error);
		return { error: "Failed to get industry tags", data: null };
	}
}
