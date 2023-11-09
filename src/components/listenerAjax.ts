import { sleep, cookiesReady, printMessage } from "src/utils/helper";
import { proxy } from "src/lib/ajaxProxy";
import { cookieToString, getStoreCookies, removeCookies } from "src/utils/cookie";
import { del } from "src/store";
import { ProxyConfig, ProxyOptions } from "src/lib/ajaxProxy.types";

// // 监听登录&reload
const reloadByLogin = (url: string): void => {
	if (url.includes("/passport-login/web/login")) {
		printMessage("login reload");
		sleep(1).then(() => window.location.reload());
	}
};

// // 监听登出&reload
const listenLogout = (url: string): void => {
	if (url.includes("/login/exit/")) {
		del("userCookie");
		printMessage("logout reload");
		removeCookies().then(() => window.location.reload());
	}
};

// // 判断主要链接
const handleUrl = (url: string): boolean => {
	const includes = [
		// bangumi
    "/pgc/player/web/v2/playurl",
		"/pgc/player/web/playurl",
		"/pgc/view/web/season",

		// video
		"/player/playurl",
		"/player/v2",

    // video wbi
		"/player/wbi/playurl",
    "/player/wbi/v2"
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

function requestHandle(xhr: ProxyConfig) {
	xhr.open(xhr.method, xhr.url, xhr.async !== false, xhr.user, xhr.password);

	for (const key in xhr.headers) {
		xhr.setRequestHeader(key, xhr.headers[key]);
	}

	xhr.send(xhr.body);
}

function changeResponse(this: ProxyConfig, xhr: ProxyConfig) {
	const { vipCookie } = getStoreCookies();

	const url = new URL(xhr.url, window.location.href);

	xhr.url = url.href;

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
				requestHandle(xhr);

				this.response = resp.response;
				this.responseText = resp.responseText;
			}
		},
	});
}

export function listenerAjax(): void{
	const ready = cookiesReady();

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
}
