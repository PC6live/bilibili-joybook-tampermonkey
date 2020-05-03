interface Window {
	__INITIAL_STATE__: __INITIAL_STATE__;
	__BILI_USER_INFO__: __BILI_USER_INFO__;
	GM_cookie: GM_cookie;
	player: any;
}

interface __INITIAL_STATE__ {
	epPayMent: {
		isPay: boolean;
		isVip: boolean;
		payPack: number;
		status: number;
		vipNeedPay: boolean;
	};
}

interface __BILI_USER_INFO__ {
	vipStatus: number;
	vipType: number;
	isLogin: boolean;
	face: string;
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
