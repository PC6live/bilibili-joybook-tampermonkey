interface Window {
	UserStatus: UserStatus;
	GM_cookie: GM_cookie;
	TabObj: TabObj;
	__PGC_USERSTATE__: __PGC_USERSTATE__;
	__INITIAL_STATE__: __INITIAL_STATE__;
	__BILI_USER_INFO__: any;
	__playinfo__: __playinfo__;
}

interface TabObj {
	lock?: boolean;
	PGC?: __PGC_USERSTATE__;
	playinfo?: __playinfo__;
	[key: string]: unknown;
}

interface __PGC_USERSTATE__ {
	area_limit: number;
	dialog?: {
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
	paster?: { aid: number; allow_jump: number; cid: number; duration: number; type: number; url: string };
	sponsor: number;
	vip_info: {
		due_date: number;
		status: number;
		type: number;
	};
}

interface support_quality {
	display_desc: string;
	superscript: string;
	need_login: boolean;
	format: string;
	description: string;
	need_vip: boolean;
	quality: number;
	new_description: string;
}

interface playinfoData {
	accept_format: string;
	code: number;
	seek_param: string;
	is_preview: number;
	fnval: number;
	video_project: boolean;
	fnver: number;
	type: string;
	bp: number;
	result: string;
	seek_type: string;
	vip_type: number;
	from: string;
	video_codecid: number;
	no_rexcode: number;
	format: string;
	support_formats: support_quality[];
	message: string;
	accept_quality: number[];
	quality: number;
	timelength: number;
	has_paid: boolean;
	vip_status: number;
	accept_description: string[];
	status: number;
}
interface __playinfo__ {
	code: number;
	message: string;
	data?: playinfoData;
	result?: playinfoData;
	session: string;
	ttl: number;
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
	videoData: any;
}

interface UserStatus {
	userInfo: {
		vipStatus: number;
		vipType: number;
		isLogin: boolean;
	};
}
interface Cookie {
	name?: string;
	value?: string;
	domain?: string;
	path?: string;
	secure?: boolean;
	hostOnly?: boolean;
	httpOnly?: boolean;
	sameSite?: string;
	expirationDate?: number;
  session?: boolean;
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
