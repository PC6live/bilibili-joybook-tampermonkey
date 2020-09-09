const userCookie: Cookie[] = GM_getValue("userCookie");
const vipCookie: Cookie[] = GM_getValue("vipCookie");
const checkCookieReady = (): boolean => {
	if (userCookie && vipCookie) {
		return true;
	}
	return false;
};

const getCookies = (): Promise<Cookie[]> => {
	return new Promise((resolve) => {
		const hostname = window.location.hostname;
		GM_cookie.list({ url: hostname }, (cookies) => resolve(cookies));
	});
};

const removeCookies = (): Promise<void> => {
	return new Promise((resolve) => {
		const hostname = window.location.hostname;
		getCookies()
			.then((cookies) => {
				cookies.forEach((cookie) => {
					GM_cookie.delete({ name: cookie.name, url: hostname });
				});
			})
			.then(resolve);
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
			resolve();
		});
	});
};

const setCookies = (cookies: Cookie[]): Promise<void> => {
	return new Promise((resolve) => {
		cookies.forEach((cookie) => {
			GM_cookie.set(cookie);
		});
		resolve();
	});
};

export {
	getCookies,
	removeCookies,
	storeCookies,
	setCookies,
	userCookie,
	vipCookie,
	checkCookieReady,
};
