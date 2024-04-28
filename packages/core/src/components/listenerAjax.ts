import { sleep, cookiesReady, printMessage } from "utils/helper";
import { cookieToString, getStoreCookies, removeCookies } from "utils/cookie";
import { del } from "store";
import { proxy, type ProxyWin, type ProxyOptions, type ProxyXHR } from "ajax-proxy";

// 监听登录&reload
// TODO: 验证登录是否成功
// FIXME: 似乎影响了chrome密码自动填充
const reloadByLogin = (url: string): void => {
	if (url.includes("/passport-login/web/login")) {
		printMessage("login reload");
		sleep(1).then(() => window.location.reload());
	}
};

// 监听登出&reload
const listenLogout = (url: string): void => {
	if (url.includes("/login/exit/")) {
		del("userCookie");
		printMessage("logout reload");
		removeCookies().then(() => window.location.reload());
	}
};

const proxyUrls: string[] = [
	// 视频信息
	"api.bilibili.com/x/player/wbi/playurl",

	// 用户信息
	"api.bilibili.com/x/player/wbi/v2",

	// bangumi 信息
	"api.bilibili.com/pgc/player/web/v2/playurl",
];

// 需要代理的链接
const handleUrl = (url: string): boolean => {
	if (!cookiesReady()) return false;

	if (proxyUrls.findIndex((v) => url.includes(v)) > -1) return true;

	return false;
};

async function handleResponse(xhr: ProxyXHR) {
	const { vipCookie } = getStoreCookies();

	const url = new URL(xhr.url, window.location.href);

	xhr.url = url.href;

	// 使用vip账号获取数据
	const request = await GM.xmlHttpRequest({
		method: xhr.method,
		url: xhr.url,
		anonymous: true,
		cookie: cookieToString(vipCookie),
		headers: {
			referer: window.location.href,
		},
	}).catch((e) => console.error(e));

	if (!request) return;

	// 重新打开链接
	xhr.open(xhr.method, xhr.url, xhr.async !== false, xhr.user, xhr.password);

	for (const key in xhr.headers) {
		xhr.setRequestHeader(key, xhr.headers[key]);
	}

	// 替换必要的数据
	// TODO: catch 数据结构变化输出错误
	xhr.onreadystatechange = () => {
		if (xhr.readyState === 4) {
			const originResponse = JSON.parse(xhr.response);
			const proxyResponse = JSON.parse(request.response);

			// TODO: 包装log输出
			console.log(xhr.url);

			// video
			if (xhr.url.includes(proxyUrls[0])) {
				originResponse.data = proxyResponse.data;
			}

			// response 中包含上次播放时间
			if (xhr.url.includes(proxyUrls[1])) {
				originResponse.data.vip = proxyResponse.data.vip;
			}

			// bangumi
			if (xhr.url.includes(proxyUrls[2])) {
				// originResponse.result = proxyResponse.result;
				originResponse.result.video_info = proxyResponse.result.video_info;
				originResponse.result.view_info = proxyResponse.result.view_info;
			}

			xhr._responseText = JSON.stringify(originResponse);
		}
	};

	// 发送链接
	xhr.send(xhr.body);
}

export function listenerAjax(): void {
	const config: ProxyOptions = {
		open(xhr) {
			reloadByLogin(xhr.url);
			listenLogout(xhr.url);

			if (handleUrl(xhr.url)) {
				handleResponse(xhr);
				return true;
			}

			return false;
		},
		send(xhr) {
			if (handleUrl(xhr.url)) return true;

			return false;
		},
		setRequestHeader(xhr) {
			if (handleUrl(xhr.url)) return true;

			return false;
		},
	};

	proxy(config, unsafeWindow as ProxyWin);
}
