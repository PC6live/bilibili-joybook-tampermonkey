const getStoreCookies = (): { vipCookie: Cookie[] | null; userCookie: Cookie[] | null } => {
	const userCookie: Cookie[] = GM_getValue("userCookie");
	const vipCookie: Cookie[] = GM_getValue("vipCookie");
	return {
		userCookie,
		vipCookie,
	};
};

const getCookies = (): Promise<Cookie[]> => {
	return new Promise((resolve) => {
		const { hostname, protocol } = window.location;
		const url = `${protocol}//${hostname}/`;
		GM_cookie.list({ url }, (cookies) => resolve(cookies));
	});
};

const removeCookies = async (): Promise<void> => {
	const { hostname, protocol } = window.location;
	const url = `${protocol}//${hostname}/`;
	const cookies = await getCookies();
	cookies.forEach((cookie) => {
		GM_cookie.delete({ name: cookie.name, url });
	});
};

const storeCookies = async (name: string, queryName: string[]): Promise<void> => {
	const cookies = await (await getCookies()).filter((cookie) => {
		return cookie.name && queryName.includes(cookie.name);
	});
	GM_setValue(name, cookies);
};

const setCookies = (cookies: Cookie[]) => {
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

export { getCookies, removeCookies, storeCookies, setCookies, getStoreCookies };
