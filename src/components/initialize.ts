import { USER_INFO_URL } from "src/constant";
import { store } from "src/store";
import { cookie } from "src/utils/cookie";
import { cookiesReady } from "src/utils/helper";

export interface UserInfo {
	face: string;
	isLogin: boolean;
	vipStatus: number;
}

const getUserType = async (): Promise<UserInfo> => {
	const resp = await fetch(USER_INFO_URL, {
		method: "get",
		credentials: "include",
	});
	const result = await resp.json();

	return result.data;
};

async function handleLogin(key: "vipCookie" | "userCookie"): Promise<void> {
	const storeKey = ["SESSDATA", "DedeUserID", "DedeUserID__ckMd5", "bili_jct"];

	const cookies = await cookie.get({ domain: ".bilibili.com" });

	// 储存用户 cookies
	store.set(
		key,
		cookies.filter((v) => storeKey.includes(v.name))
	);

	// 因为需要再次进行登录，所以删除浏览器 cookies
	await cookie.deleteAll();

	// 如果已完成初始化，则设置为 user cookies
	const { userCookie, vipCookie } = store.getAll();
	if (userCookie && vipCookie) {
		await cookie.set(userCookie);
	}

	window.location.reload();
}

// 处理用户登录
export default async () => {
	// 获取登录状态
	const { isLogin, vipStatus } = await getUserType();

	if (!isLogin || cookiesReady()) return;

	const user = vipStatus ? "vipCookie" : "userCookie";

	await handleLogin(user);
};
