import { GM_deleteValue, GM_listValues } from "$";
import { store } from "src/store";
import { CbCookie, cookie } from "./cookie";

export const sleep = (time = 1): Promise<void> =>
	new Promise((resolve) => setTimeout(resolve, 1000 * time));

export const createElement = (str: string): Element | null => {
	const el = document.createElement("div");
	el.innerHTML = str;
	return el.firstElementChild;
};

export const isVideo = (): boolean =>
	/(bangumi\/play\/*)|(video\/*)/gi.test(window.location.pathname);

export const deleteAllValue = (): void =>
	GM_listValues().forEach((v) => GM_deleteValue(v));

export const message = (message: string): void => {
	console.log(`bili-joybook: ${message}`);
};

export function cookiesReady(): boolean {
	const { userCookie, vipCookie } = store.getAll();
	return !!userCookie && !!vipCookie;
}

export async function changeUser(type: "vip" | "user") {
	if (!cookiesReady()) return;

	const { userCookie, vipCookie } = store.getAll();

	await cookie.set(type === "vip" ? vipCookie! : userCookie!);
}

export function cookieToString(cookies: CbCookie[]) {
	return cookies.map((v) => `${v.name}=${v.value}`).join("; ");
}
