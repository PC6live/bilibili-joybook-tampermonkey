import { StoreCookies, get, set, del } from "src/store";

export const getStoreCookies = (): StoreCookies => ({ userCookie: get("userCookie"), vipCookie: get("vipCookie") });

export async function cookieList(detail: GM_cookie_list_details): Promise<void> {
  return new Promise(resolve => GM_cookie.list(detail, () => resolve()))
}

export async function cookieDelete(detail: GM_cookie_delete_details): Promise<void> {
  return new Promise(resolve => GM_cookie.delete(detail, () => resolve()))
}

export async function cookieSet(detail: GM_cookie_set_details): Promise<void> {
  return new Promise(resolve => GM_cookie.set(detail, () => resolve()))
}

export function getCookies(detail: GM_cookie_list_details = { domain: ".bilibili.com" }): Promise<Cookie[]> {
	return new Promise((resolve) => {
		GM_cookie.list(detail, (cookies) => resolve(cookies));
	});
}

export async function removeCookies(): Promise<void> {
	const cookies = await getCookies();
	let promises: Promise<void>[] = [];
	cookies.forEach((cookie) =>
		promises.push(new Promise((resolve) => GM_cookie.delete({ name: cookie.name }, () => resolve())))
	);
  await Promise.all(promises)
}

export async function storeCookies(storeName: keyof StoreCookies, keys: string[]): Promise<void> {
	del(storeName);
	const cookies = (await getCookies()).filter((cookie) => keys.includes(cookie.name));
	set(storeName, cookies);
}

export async function setCookies(cookies: Cookie[]) {
  const promises: Promise<void>[] = [];
	cookies.forEach((cookie) => {
		promises.push(new Promise(resolve => GM_cookie.set(cookie, () => resolve())));
	});
  await Promise.all(promises)
}

export function cookieToString(cookies: Cookie[]) {
	return cookies.map((v) => `${v.name}=${v.value}`).join("; ");
}
