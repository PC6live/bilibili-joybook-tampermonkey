interface Window {
	UserStatus: UserStatus;
	GM_cookie: GM_cookie;
	__PGC_USERSTATE__: __PGC_USERSTATE__;
	__INITIAL_STATE__: __INITIAL_STATE__;
	__BILI_USER_INFO__: any;
	__playinfo__: any;
}

interface __PGC_USERSTATE__ {
	area_limit: number;
	dialog: {
		btn_right: { title: string; type: string };
		desc: string;
		title: string;
	};
	ban_area_show: number;
	follow: number;
	follow_status: number;
	login: number;
	pay: number;
	pay_pack_paid: number;
	progress: { last_ep_id: number; last_ep_index: string; last_time: number };
	paster: { aid: number; allow_jump: number; cid: number; duration: number; type: number; url: string };
	sponsor: number;
	vip_info: {
		due_date: number;
		status: number;
		type: number;
	};
}

interface __INITIAL_STATE__ {
	user: {
		vipDueDate: number;
		vipStatus: number;
		vipType: number;
		vip_pay_type?: number;
		vip_theme_type?: number;
	};
	vipDueDate: number;
	vipStatus: number;
	vipType: number;
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
