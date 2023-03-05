interface vipInfo {
	is_vip: boolean;
	due_date: number;
	status: number;
	type: number;
}

interface Cookie {
	domain: string;
	firstPartyDomain?: string;
	hostOnly: boolean;
	httpOnly: boolean;
	name: string;
	path: string;
	sameSite: string;
	secure: boolean;
	session: boolean;
	value: string;
}

interface GM_cookie_list_details {
	url?: string;
	domain?: string;
	name?: string;
	path?: string;
}

interface GM_cookie_set_details {
	url?: string;
	name: string;
	value: string;
	domain?: string;
	firstPartyDomain?: string;
	path?: string;
	secure?: boolean;
	httpOnly?: boolean;
	expirationDate?: boolean;
}

interface GM_cookie_delete_details {
	url?: string;
	name?: string;
	firstPartyDomain?: string;
}

interface GM_cookie {
	list(details?: GM_cookie_list_details, callback?: (cookies: Cookie[], error: string) => void): void;
	set(details: GM_cookie_set_details, callback?: (error: string) => void): void;
	delete(details: GM_cookie_delete_details, callback?: (error: string) => void): void;
}

declare const GM_cookie: GM_cookie;
