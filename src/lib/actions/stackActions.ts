"use server";

import { unauthorisedRedirect } from "../fetchUtils";

export async function createStackTag(tagName: string) {
	const response = await fetch("/api/stack-tags/create", {
		method: "POST",
		body: JSON.stringify({ tagName }),
		headers: {
			"Content-Type": "application/json",
		},
	});

	unauthorisedRedirect(response);

	if (!response.ok) {
		throw new Error("Failed to create industry tag");
	}

	return await response.json();
}

export async function deleteStackTag(id: number) {
	const response = await fetch(`/api/stack-tags/delete/${id}`, {
		method: "DELETE",
	});
	unauthorisedRedirect(response);

	if (!response.ok) {
		throw new Error("Failed to delete industry tag");
	}

	return await response.json();
}

export async function fetchStackTags() {
	try {
		const response = await fetch("/api/stack-tags");
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
