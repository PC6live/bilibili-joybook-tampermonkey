import { getStoreCookies, removeCookies, setCookies, storeCookies } from "src/utils/cookie";
import { cookiesReady } from "src/utils/helper";
import { USER_INFO_URL } from "src/utils/url";

export interface UserInfo {
  face: string;
	isLogin: boolean;
	vipStatus: number;
}

const getUserType = async (): Promise<UserInfo> => {
	const resp = await fetch(USER_INFO_URL, { method: "get", credentials: "include" });
	const result = await resp.json();

	return result.data;
};

async function handleLogin(key: "vipCookie" | "userCookie"): Promise<void> {
	const storeKey = ["SESSDATA", "DedeUserID", "bili_jct"];

	await storeCookies(key, storeKey);

	const { userCookie } = getStoreCookies();

  removeCookies();

  if (cookiesReady()) setCookies(userCookie)

	window.location.reload();
}

export const initialize = async (): Promise<void> => {
	// 获取登录状态
	const { isLogin, vipStatus } = await getUserType();

	if (!isLogin || cookiesReady()) return;

	if (vipStatus) {
		// vip用户
		handleLogin("vipCookie");
	} else {
		// 普通用户
		handleLogin("userCookie");
	}
};
