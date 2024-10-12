import { GM_cookie } from "$";
import type { Merge } from "type-fest";

export type ChromeCookie = Parameters<typeof GM_cookie.set>[0];
export type CbCookie = Merge<
	Awaited<ReturnType<typeof GM_cookie.list>>[number],
	{
		sameSite: ChromeCookie["sameSite"];
	}
>;

export const cookie = {
	get: (details: Parameters<typeof GM_cookie.list>[0] = {}) =>
		new Promise<CbCookie[]>((resolve) =>
			GM_cookie.list(details, (cookies) => resolve(cookies as CbCookie[]))
		),

	set: async (cookies: ChromeCookie[]) =>
		Promise.all(
			cookies.map(
				(v) =>
					new Promise((resolve) => GM_cookie.set(v, (error) => resolve(error)))
			)
		),

	delete: async (cookies: Parameters<typeof GM_cookie.delete>[0][]) =>
		Promise.all(
			cookies.map(
				(v) =>
					new Promise((resolve) =>
						GM_cookie.delete(v, (error) => resolve(error))
					)
			)
		),

	deleteAll: async () => cookie.delete(await cookie.get()),
};
