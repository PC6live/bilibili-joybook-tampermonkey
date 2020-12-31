const getUserCookie = (): Cookie[] | null => GM_getValue("userCookie");
const getVipCookie = (): Cookie[] | null => GM_getValue("vipCookie");

const getCookies = (): Promise<Cookie[]> => {
	return new Promise((resolve) => {
		const { hostname, protocol } = window.location;
		const url = `${protocol}//${hostname}/`;
		GM_cookie.list({ url }, (cookies) => resolve(cookies));
	});
};

const removeCookies = (): Promise<void> => {
	return new Promise((resolve) => {
		const { hostname, protocol } = window.location;
		const url = `${protocol}//${hostname}/`;
		getCookies().then((cookies) => {
			cookies.forEach((cookie) => {
				GM_cookie.delete({ name: cookie.name, url });
			});
			return resolve();
		});
	});
};

const storeCookies = (name: string, queryName: string[]): Promise<void> => {
	return new Promise((resolve) => {
		getCookies().then((result) => {
			const cookies: Cookie[] = [];
			result.forEach((cookie) => {
				if (cookie.name && queryName.includes(cookie.name)) {
					cookies.push({
						domain: cookie.domain,
						storeId: cookie.storeId,
						expirationDate: cookie.expirationDate,
						httpOnly: cookie.httpOnly,
						name: cookie.name,
						path: cookie.path,
						sameSite: cookie.sameSite,
						secure: cookie.secure,
						value: cookie.value,
					});
				}
			});
			GM_setValue(name, cookies);
			return resolve();
		});
	});
};

const setCookies = (cookies: Cookie[]): Promise<void> => {
	return new Promise((resolve) => {
		cookies.forEach((cookie) => {
			GM_cookie.set(cookie);
		});
		return resolve();
	});
};

export { getCookies, removeCookies, storeCookies, setCookies, getUserCookie, getVipCookie };
