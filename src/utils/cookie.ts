import { StoreCookies, get, set, del } from "src/store";

export const getStoreCookies = (): StoreCookies => ({ userCookie: get("userCookie"), vipCookie: get("vipCookie") });

export function getCookies(detail: GM_cookie_list_details = { domain: ".bilibili.com" }): Promise<Cookie[]> {
	return new Promise((resolve) => {
		GM_cookie.list(detail, (cookies) => resolve(cookies));
	});
}

export async function removeCookies(): Promise<void> {
	const cookies = await getCookies();
	cookies.forEach((cookie) => {
		GM_cookie.delete({ name: cookie.name });
	});
}

export async function storeCookies(storeName: keyof StoreCookies, keys: string[]): Promise<void> {
	del(storeName);
	const cookies = (await getCookies()).filter((cookie) => keys.includes(cookie.name));
	set(storeName, cookies);
}

export function setCookies(cookies: Cookie[]) {
	cookies.forEach((cookie) => {
		GM_cookie.set(cookie);
	});
}

export function cookieToString(cookies: Cookie[]) {
	return cookies.map((v) => `${v.name}=${v.value}`).join("; ");
}
