const store = {
  // init: false,
};

export type Store = typeof store & StoreCookies;

export const set = <K extends keyof Store>(key: K, value: Store[K]) => {
	GM_setValue(key, value);
};

export const get = <K extends keyof Store>(key: K, defaultValue?: Store[K]): Store[K] => {
	return GM_getValue(key, defaultValue);
};

export const del = (key: keyof Store) => {
	GM_deleteValue(key);
};

export const getAll = (): Store => {
  const result = {} as Store;
  Object.keys(store).forEach(v => {
    const key = v as keyof Store;
    (result[key] as any) = get(key);
  })
  return result;
}


export type StoreCookies = {
	vipCookie: Cookie[];
	userCookie: Cookie[];
};
