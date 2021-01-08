import { getStoreCookies, storeCookies } from "@/utils/biliCookie";

const state = {
	isLogin: false,
	vipStatus: 0,
	face: "",
	logoutBtn: false,
	vipAvator: false,
};

const getUserType = async (): Promise<void> => {
	const resp = await fetch("https://api.bilibili.com/x/web-interface/nav", { method: "Get", credentials: "include" });
	const result = await resp.json();
	const data = result.data;
	state.isLogin = data.isLogin;
	state.vipStatus = data.vipStatus;
	state.face = data.face;
};

const initState = async (): Promise<void> => {
	await getUserType();

	// dynamic add style
	import("@/styles/global.scss");

	const { isLogin, vipStatus, face } = state;
	if (!isLogin) return;
	const { vipCookie, userCookie } = getStoreCookies();
	if (vipStatus !== 0) {
		GM_setValue("face", face);
		storeCookies("vipCookie", ["SESSDATA"]);
	}
	if (vipStatus === 0 && !userCookie) {
		storeCookies("userCookie", ["SESSDATA"]);
		if (vipCookie) window.location.reload();
	}
};

export { initState };

export default state;
