import { getStoreCookies, setCookies } from "./cookie";

export const sleep = (time = 1): Promise<void> => new Promise((resolve) => setTimeout(resolve, 1000 * time));

export const createElement = (str: string): Element | null => {
	const el = document.createElement("div");
	el.innerHTML = str;
	return el.firstElementChild;
};

export const isVideo = (): boolean => /(bangumi\/play\/*)|(video\/*)/gi.test(window.location.pathname);

export const deleteAllValue = (): void => GM_listValues().forEach((v) => GM_deleteValue(v));

export const printMessage = (message: string): void => {
	if (process.env.NODE_ENV === "development") console.log(`Tampermonkey: ${message}`);
};

export function cookiesReady() {
	const { userCookie, vipCookie } = getStoreCookies();
	return userCookie && vipCookie;
}

export function changeUser (type: "vip" | "user") {
  if (!cookiesReady()) return;
  const { userCookie, vipCookie } = getStoreCookies();

  const cookie = type === "vip" ? vipCookie : userCookie

  setCookies(cookie);
}
