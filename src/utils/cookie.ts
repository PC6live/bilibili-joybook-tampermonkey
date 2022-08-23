import { store, StoreCookies } from "src/store";

export const getStoreCookies = (): StoreCookies => {
	const userCookie = store.get("userCookie");
	const vipCookie = store.get("vipCookie");
	return {
		userCookie,
		vipCookie,
	};
};

export const getCookie = (key: string): Promise<Cookie | undefined> => {
	return new Promise((resolve) => {
		GM_cookie.list({}, (cookies) => resolve(cookies.find((c) => c.name === key)));
	});
};

export const getCookies = (): Promise<Cookie[]> => {
	return new Promise((resolve) => {
		GM_cookie.list({}, (cookies) => resolve(cookies));
	});
};

export const removeCookies = async (): Promise<void> => {
	const cookies = await getCookies();
	cookies.forEach((cookie) => {
		GM_cookie.delete({ name: cookie.name });
	});
};

export const storeCookies = async (name: keyof StoreCookies, queryName: string[]): Promise<void> => {
	const cookies = (await getCookies()).filter((cookie) => {
		return cookie.name && queryName.includes(cookie.name);
	});
	store.set(name, cookies);
};

export const setCookies = (cookies: Cookie[]) => {
	const formatCookies = cookies.map((cookie) => {
		return {
			domain: cookie.domain,
			expirationDate: cookie.expirationDate,
			hostOnly: cookie.hostOnly,
			httpOnly: cookie.httpOnly,
			name: cookie.name,
			path: cookie.path,
			sameSite: cookie.sameSite,
			secure: cookie.secure,
			value: cookie.value,
		};
	});

	formatCookies.forEach((cookie) => {
		GM_cookie.set(cookie);
	});
};

export function cookieToString(cookies: Cookie[]) {
  return cookies.map(v => `${v.name}=${v.value}`).join("; ")
}
