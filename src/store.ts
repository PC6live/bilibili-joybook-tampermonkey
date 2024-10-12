import { GM_deleteValue, GM_getValue, GM_listValues, GM_setValue } from "$";
import { CbCookie } from "./utils/cookie";

type Store = {
	vipCookie?: CbCookie[];
	userCookie?: CbCookie[];
};

const get = <K extends keyof Store>(
	key: K,
	defaultValue?: Store[K]
): Store[K] => {
	return GM_getValue(key, defaultValue);
};

const set = <K extends keyof Store>(key: K, value: Store[K]) => {
	GM_setValue(key, value);
};

const del = (key: keyof Store) => {
	GM_deleteValue(key);
};

export const store = {
	get,
	set,
	del,
	getAll: () => {
		const key = GM_listValues();
		const obj = {} as Store;
		key.forEach((v) => {
			obj[v as keyof Store] = GM_getValue(v);
		});
		return obj;
	},
};
