import { store, TStoreCookies, TStoreCookiesItem } from "@/store";

const getStoreCookies = (): TStoreCookies => {
	const userCookie = store.get("userCookie");
	const vipCookie = store.get("vipCookie");
	return {
		userCookie,
		vipCookie,
	};
};

const getCookies = (): Promise<Cookie[]> => {
	return new Promise((resolve) => {
		GM_cookie.list({}, (cookies) => resolve(cookies));
	});
};

const removeCookies = async (): Promise<void> => {
	const cookies = await getCookies();
	cookies.forEach((cookie) => {
		GM_cookie.delete({ name: cookie.name });
	});
};

const storeCookies = async (name: keyof TStoreCookies, queryName: string[]): Promise<void> => {
	const cookies = (await getCookies()).filter((cookie) => {
		return cookie.name && queryName.includes(cookie.name);
	});
	store.set(name, cookies);
};

const setCookies = (cookies: TStoreCookiesItem) => {
	let formatCookies: TStoreCookiesItem;
	if (cookies instanceof Array) {
		formatCookies = cookies.map((cookie) => {
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
	} else {
		formatCookies = Object.keys(cookies).map((v) => {
			const value = cookies[v];
			return {
				domain: value.domain,
				expirationDate: value.expirationDate,
				hostOnly: value.hostOnly,
				httpOnly: value.httpOnly,
				name: value.name,
				path: value.path,
				sameSite: value.sameSite,
				secure: value.secure,
				value: value.value,
			};
		});
	}

	formatCookies.forEach((cookie) => {
		GM_cookie.set(cookie);
	});
};

export { getCookies, removeCookies, storeCookies, setCookies, getStoreCookies };
