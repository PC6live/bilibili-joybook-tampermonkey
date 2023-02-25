import { getStoreCookies, removeCookies, setCookies, storeCookies } from "src/utils/cookie";
import { USER_INFO_URL } from "src/utils/url";

// TODO: 检测会员Cookie 是否失效

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

export function cookiesReady() {
	const { userCookie, vipCookie } = getStoreCookies();
	return userCookie && vipCookie;
}

async function handleLogin(key: "vipCookie" | "userCookie"): Promise<void> {
	const storeKey = ["SESSDATA", "DedeUserID", "DedeUserID__ckMd5"];

	await storeCookies(key, storeKey);

	const { userCookie } = getStoreCookies();

	if (!cookiesReady()) {
		removeCookies();
	} else {
		setCookies(userCookie);
	}

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
