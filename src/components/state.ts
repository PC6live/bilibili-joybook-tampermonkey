import { store } from "@/store";
import { getStoreCookies, removeCookies, storeCookies } from "@/utils/cookie";
import { printMessage } from "@/utils/helper";

export const state = {
	isLogin: false,
	vipStatus: 0,
	face: "",
};

const getUserType = async (): Promise<void> => {
	const resp = await fetch("https://api.bilibili.com/x/web-interface/nav", { method: "Get", credentials: "include" });
	if (!resp) return;
	const result = await resp.json();
	const data = result.data;
	state.isLogin = data.isLogin;
	state.vipStatus = data.vipStatus;
	state.face = data.face;
};

function listenLogout() {
	const logout = document.querySelector(".logout");

	if (logout) {
		const clone = logout.cloneNode(true);
		clone.addEventListener("click", () => {
			store.remove("userCookie");
			removeCookies().then(() => {
				window.location.reload();
			});
		});
		logout.parentNode?.replaceChild(clone, logout);
	} else {
		setTimeout(() => {
			listenLogout();
		}, 100);
	}
}

export const initState = async (): Promise<void> => {
	printMessage("initState-start");

	await getUserType();

	const storeKey = ["SESSDATA", "DedeUserID", "DedeUserID__ckMd5"];
	const { isLogin, vipStatus, face } = state;
	const { vipCookie, userCookie } = getStoreCookies();

	if (!isLogin) return;

	listenLogout();

	if (!vipCookie && vipStatus) {
		store.set("face", face);
		storeCookies("vipCookie", storeKey).then(() => {
			removeCookies().then(() => {
				window.location.reload();
			});
		});
	}

	if (!userCookie && !vipStatus) {
		storeCookies("userCookie", storeKey);
		if (vipCookie) {
			window.location.reload();
		}
	}

	printMessage("initState-end");
};

