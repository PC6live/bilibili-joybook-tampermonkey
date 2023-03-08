import { StoreCookies, get, set, del } from "src/store";

export const getStoreCookies = (): StoreCookies => ({ userCookie: get("userCookie"), vipCookie: get("vipCookie") });

export async function cookieList(detail: GM_cookie_list_details = { domain: ".bilibili.com" }): Promise<Cookie[]> {
	return new Promise((resolve) => GM_cookie.list(detail, (cookies) => resolve(cookies)));
}

export async function cookieDelete(detail: GM_cookie_delete_details): Promise<void> {
	return new Promise((resolve) => GM_cookie.delete(detail, () => resolve()));
}

export async function cookieSet(detail: GM_cookie_set_details): Promise<void> {
	return new Promise((resolve) => GM_cookie.set(detail, () => resolve()));
}

export async function removeCookies(): Promise<void> {
	const cookies = await cookieList();
  for (const cookie of cookies) {
    await cookieDelete({name: cookie.name})
  }
}

export async function storeCookies(storeName: keyof StoreCookies, keys: string[]): Promise<void> {
	del(storeName);
	const cookies = (await cookieList()).filter((cookie) => keys.includes(cookie.name));
	set(storeName, cookies);
}

export async function setCookies(cookies: Cookie[]) {
  for (const cookie of cookies) {
    await cookieSet(cookie)
  }
}

export function cookieToString(cookies: Cookie[]) {
	return cookies.map((v) => `${v.name}=${v.value}`).join("; ");
}
