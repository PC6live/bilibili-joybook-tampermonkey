export type TStoreCookies = {
	vipCookie: Cookie[];
	userCookie: Cookie[];
}

export interface IStore extends TStoreCookies {
	face: string;
	quality: string;
};

const set = <K extends keyof IStore>(key: K, value: IStore[K]) => {
	GM_setValue(key, value);
};

const get = <K extends keyof IStore>(key: K, defaultValue?: IStore[K]): IStore[K] => {
	return GM_getValue(key, defaultValue);
};

export const store = { set, get };
