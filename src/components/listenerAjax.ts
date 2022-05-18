import { printMessage, sleep } from "src/utils/helper";
import { ProxyMap, proxyAjax } from "src/lib/ajax-proxy";
import { getStoreCookies, removeCookies, setCookies } from "src/utils/cookie";
import { store } from "src/store";

// 监听登录&reload
const reloadByLogin = (url: string): void => {
	if (url.includes("/passport-login/web/")) {
    console.log("login reload")
		sleep(1).then(() => window.location.reload());
	}
};

// 监听登出&reload
const listenLogout = (url: string): void => {
	if (url.includes("/login/exit/")) {
		store.remove("userCookie");
		removeCookies().then(() => window.location.reload());
	}
};

// 判断主要链接
const handleUrl = (url: string): boolean => {
	const includes = [
		// bangumi
		"api.bilibili.com/pgc/player/web/playurl",
		// video
		"api.bilibili.com/x/player/playurl",
		"api.bilibili.com/x/player/v2",
	];
	const excludes = ["data.bilibili.com"];

	for (let i = 0; i < excludes.length; ++i) {
		if (url.includes(excludes[i])) return false;
	}
	for (let i = 0; i < includes.length; ++i) {
		if (url.includes(includes[i])) return true;
	}

	return false;
};

export const listenerAjax = async (): Promise<void> => {
	printMessage("白嫖");

	const { vipCookie, userCookie } = getStoreCookies();

	const proxySettings: ProxyMap = {
		open: (_args, xhr) => {
			reloadByLogin(xhr.url);
			listenLogout(xhr.url);
		},
		send: (_args, xhr, next) => {
			if (handleUrl(xhr.url) && store.get("cookiesReady")) setCookies(vipCookie);

      next();
		},
    onloadend: () => {
      if (store.get("cookiesReady")) setCookies(userCookie);
    }
	};

	proxyAjax(proxySettings);
};
