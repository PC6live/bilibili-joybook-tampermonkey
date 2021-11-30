import { store } from "@/store";
import { getCookies, getStoreCookies, removeCookies, storeCookies } from "@/utils/cookie";
import { printMessage } from "@/utils/helper";

export const state = {
	isLogin: false,
	vipStatus: 0,
	face: "",
	highQuality: "",
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

	if (logout && document.body.contains(logout) && logout.getAttribute("flag") !== "true") {
		const clone = logout.cloneNode(true);
		if (clone instanceof HTMLElement) {
			clone.setAttribute("flag", "true");
			clone.addEventListener("click", () => {
				store.remove("userCookie");
				removeCookies().then(() => {
					window.location.reload();
				});
			});
			logout.parentNode?.replaceChild(clone, logout);
		}
	} else {
		setTimeout(() => {
			listenLogout();

		}, 1000);
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

	// 登录为vip用户且未储存vipCookie
	if (!vipCookie && vipStatus) {
		store.set("face", face);
		storeCookies("vipCookie", storeKey).then(() => {
			removeCookies().then(() => {
				window.location.reload();
			});
		});
	}

	// 登录为普通用户且未储存vipCookie&userCookie
	if (!vipStatus) {
		if (!vipCookie) {
			storeCookies("userCookie", storeKey).then(() => {
				removeCookies().then(() => {
					window.location.reload();
				});
			});
		} else if (!userCookie) {
			storeCookies("userCookie", storeKey).then(() => {
				window.location.reload();
			});
		}
	}

	printMessage("initState-end");
};
