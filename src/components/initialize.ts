import { store } from "src/store";
import { getStoreCookies, removeCookies, setCookies, storeCookies } from "src/utils/cookie";

/** 获取用户数据 */
const userInfoURL = "//api.bilibili.com/x/web-interface/nav";

const getUserType = async (): Promise<{
	isLogin: boolean;
	vipStatus: number;
}> => {
	const resp = await fetch(userInfoURL, { method: "get", credentials: "include" });
	const result = await resp.json();

	return result.data;
};

const cookiesReady = () => {
	const { userCookie, vipCookie } = getStoreCookies();
	return !!userCookie && !!vipCookie;
};

export const initialize = async (): Promise<void> => {
	// 初始化tampermonkey store & 状态
	store.initStore();

	// 获取登录状态
	const { isLogin, vipStatus } = await getUserType();
	if (!isLogin) return;

	const storeKey = ["SESSDATA", "DedeUserID", "DedeUserID__ckMd5"];
	const { vipCookie, userCookie } = getStoreCookies();

	store.set("cookiesReady", cookiesReady());
	if (store.get("cookiesReady")) return setCookies(userCookie);
	console.log(store.get("cookiesReady"));

	const reload = () => window.location.reload();

	if (vipStatus) {
		// vip用户
		if (userCookie) {
			// 登录为vip用户并且储存了userCookie
			storeCookies("vipCookie", storeKey).then(() => {
				reload();
			});
		} else {
			// 登录为vip用户且未储存userCookie
			storeCookies("vipCookie", storeKey).then(() => {
				removeCookies().then(() => {
					reload();
				});
			});
		}
	} else {
		// 普通用户
		if (vipCookie) {
			// 登录为普通用户并且储存了vipCookie
			storeCookies("userCookie", storeKey).then(() => {
				reload();
			});
		} else {
			// 登录为普通用户且未储存vipCookie
			storeCookies("userCookie", storeKey).then(() => {
				removeCookies().then(() => {
					reload();
				});
			});
		}
	}
};
