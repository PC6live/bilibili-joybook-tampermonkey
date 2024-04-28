import { StoreCookies, get, set, del } from "store";

export const getStoreCookies = (): StoreCookies => ({ userCookie: get("userCookie"), vipCookie: get("vipCookie") });

export async function cookieList(
	detail: Tampermonkey.ListCookiesDetails = { domain: ".bilibili.com" }
): Promise<Tampermonkey.Cookie[]> {
	return new Promise((resolve) => GM_cookie.list(detail, (cookies) => resolve(cookies)));
}

export async function cookieDelete(detail: Tampermonkey.DeleteCookiesDetails): Promise<void> {
	return new Promise((resolve) => GM_cookie.delete(detail, () => resolve()));
}

export async function cookieSet(detail: Tampermonkey.SetCookiesDetails): Promise<void> {
	return new Promise((resolve) => GM_cookie.set(detail, () => resolve()));
}

export async function removeCookies(): Promise<void> {
	const cookies = await cookieList();
	for (const cookie of cookies) {
		await cookieDelete({
			name: cookie.name,
			url: "",
			firstPartyDomain: "",
		});
	}
}

export async function storeCookies(storeName: keyof StoreCookies, keys: string[]): Promise<void> {
	del(storeName);
	const cookies = (await cookieList()).filter((cookie) => keys.includes(cookie.name));
	set(storeName, cookies);
}

export async function setCookies(cookies: Tampermonkey.Cookie[]) {
	for (const cookie of cookies) {
		await cookieSet(cookie);
	}
}

export function cookieToString(cookies: Tampermonkey.Cookie[]) {
	return cookies.map((v) => `${v.name}=${v.value}`).join("; ");
}
