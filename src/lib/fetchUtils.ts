import { redirect } from "@tanstack/react-router";

export async function authorisedFetch(url: string) {
	const res = await fetch(url);
	if (res.status === 401) {
		throw redirect({ to: "/login" });
	}
	return res;
}

export function unauthorisedRedirect(res: Response) {
	if (res.status === 401) {
		throw redirect({ to: "/login" });
	}
}
