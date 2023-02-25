import { printMessage, sleep } from "src/utils/helper";
import { proxy, ProxyConfig, ProxyOptions } from "src/lib/ajaxProxy";
import { cookieToString, getStoreCookies, removeCookies } from "src/utils/cookie";
import { store } from "src/store";

// // 监听登录&reload
const reloadByLogin = (url: string): void => {
	if (url.includes("/passport-login/web/login")) {
		console.log("login reload");
		sleep(1).then(() => window.location.reload());
	}
};

// // 监听登出&reload
const listenLogout = (url: string): void => {
	if (url.includes("/login/exit/")) {
		store.remove("userCookie");
		console.log("logout reload");
		removeCookies().then(() => window.location.reload());
	}
};

// // 判断主要链接
const handleUrl = (url: string): boolean => {
	const includes = [
		// bangumi
		"api.bilibili.com/pgc/player/web/playurl",
		// video
		"api.bilibili.com/x/player/playurl",
		"api.bilibili.com/x/player/v2",
		"api.bilibili.com/x/player/wbi/playurl",
		"api.bilibili.com/pgc/view/web/season",
	];
	const excludes = ["data.bilibili.com"];

	if (excludes.findIndex((v) => url.includes(v)) > -1) {
		return false;
	}
	if (includes.findIndex((v) => url.includes(v)) > -1) {
		return true;
	}

	return false;
};

function changeResponse(this: ProxyConfig, xhr: ProxyConfig) {
	const { vipCookie } = getStoreCookies();

	GM_xmlhttpRequest({
		method: xhr.method,
		url: xhr.url,
		anonymous: true,
		cookie: cookieToString(vipCookie),
		headers: {
			referer: window.location.href,
		},
		onreadystatechange: (resp) => {
			if (resp.readyState === 4) {
				xhr.open(xhr.method, xhr.url, xhr.async !== false, xhr.user, xhr.password);
				xhr.send(xhr.body);

				this.response = resp.response;
				this.responseText = resp.responseText;
			}
		},
	});
}

export const listenerAjax = async (): Promise<void> => {
  const ready = store.get("cookiesReady");

  if (ready) {
    printMessage("白嫖");
  } else {
    printMessage("请按照wiki指示登录账号 https://github.com/PC6live/bilibili-joybook-tampermonkey/wiki/%E4%BD%BF%E7%94%A8")
  }

	const config: ProxyOptions = {
		open(xhr) {
			reloadByLogin(xhr.url);
			listenLogout(xhr.url);

			if (handleUrl(xhr.url) && ready) {
				changeResponse.call(this, xhr);
				return true;
			}

			return false;
		},
		send(xhr) {
			if (handleUrl(xhr.url) && ready) {
				return true;
			}
			return false;
		},
		setRequestHeader(xhr) {
			if (handleUrl(xhr.url) && ready) {
				return true;
			}
			return false;
		},
	};

	proxy(config, unsafeWindow);
};
