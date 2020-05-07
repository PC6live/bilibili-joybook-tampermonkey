interface Window {
	UserStatus: UserStatus;
	GM_cookie: GM_cookie;
}

interface UserStatus {
	userInfo: {
		vipStatus: number;
		vipType: number;
		isLogin: boolean;
		face: string;
	};
}

interface Cookie {
	name?: string;
	value?: string;
	domain?: string;
	path?: string;
	secure?: boolean;
	httpOnly?: boolean;
	sameSite?: string;
	expirationDate?: number;
	storeId: string;
}

interface GM_cookie {
	list(
		cookies: { name?: string; url?: string; domain?: string; path?: string },
		callback?: (cookies: Cookie[], error: string) => void
	): void;
	set(cookies: Cookie, callback?: (error: string) => void): void;
	delete(cookies: { name?: string; url?: string }, callback?: (cookies: Cookie[], error: string) => void): void;
}

declare const GM_cookie: GM_cookie;
