import { getStoreCookies, removeCookies, setCookies, storeCookies } from "utils/cookie";
import { cookiesReady } from "utils/helper";
import { USER_INFO_URL } from "utils/url";

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
	const storeKey = ["SESSDATA", "DedeUserID", "DedeUserID__ckMd5", "bili_jct"];

	await storeCookies(key, storeKey);

	const { userCookie } = getStoreCookies();

	await removeCookies();

	if (cookiesReady()) await setCookies(userCookie);

	window.location.reload();
}

export async function initialize(): Promise<void> {
	// 获取登录状态
	const { isLogin, vipStatus } = await getUserType();

	if (!isLogin || cookiesReady()) return;

  const user = vipStatus ? "vipCookie": "userCookie";

  await handleLogin(user);
}
