const obj = {
  cookiesReady: false,
  init: false,
};

export type Store = typeof obj & StoreCookies;

const set = <K extends keyof Store>(key: K, value: Store[K]) => {
	GM_setValue(key, value);
};

const get = <K extends keyof Store>(key: K, defaultValue?: Store[K]): Store[K] => {
	return GM_getValue(key, defaultValue);
};

const remove = (key: keyof Store) => {
	GM_deleteValue(key);
};

const initStore = (): void => {
  if (get("init")) return;
  Object.keys(obj).forEach(v => {
    const key = v as keyof typeof obj;
    set(key, obj[key])
  })
  set("init", true);
}

const getAll = (): Store => {
  const result = {} as Store;
  Object.keys(obj).forEach(v => {
    const key = v as keyof Store;
    (result[key] as any) = get(key);
  })
  return result;
}

export const store = { set, get, remove, initStore, getAll };

export type StoreCookies = {
	vipCookie: Cookie[];
	userCookie: Cookie[];
};
