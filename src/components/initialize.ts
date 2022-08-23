import { store } from "src/store";
import { getStoreCookies, removeCookies, setCookies, storeCookies } from "src/utils/cookie";

/** 获取用户数据 */
const userInfoURL = "//api.bilibili.com/x/web-interface/nav";

// TODO: 检测会员Cookie 是否失效

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

async function handleLogin(key: "vipCookie" | "userCookie"): Promise<void> {
	const storeKey = ["SESSDATA", "DedeUserID", "DedeUserID__ckMd5"];

	store.remove(key);

	await storeCookies(key, storeKey);

	store.set("cookiesReady", cookiesReady());

	const ready = store.get("cookiesReady");
  const { userCookie } = getStoreCookies();

	if (!ready) {
    removeCookies()
  } else {
    setCookies(userCookie)
  }

	window.location.reload();
}

export const initialize = async (): Promise<void> => {
	// 获取登录状态
	const { isLogin, vipStatus } = await getUserType();

	if (!isLogin || store.get("cookiesReady")) return;

  console.log(vipStatus)

	if (vipStatus) {
		// vip用户
		handleLogin("vipCookie");
	} else {
		// 普通用户
		handleLogin("userCookie");
	}
};
