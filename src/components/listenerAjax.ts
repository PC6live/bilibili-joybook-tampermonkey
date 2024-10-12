import { GM_xmlhttpRequest, unsafeWindow } from "$";
import { proxy, XhrRequestConfig } from "ajax-hook";
import { store } from "src/store";
import { cookie } from "src/utils/cookie";
import { cookieToString, message, sleep } from "src/utils/helper";

/**
 * 监听登录，帮助初始化函数储存 cookies
 */
const reloadByLogin = (url: string): void => {
	if (url.includes("/passport-login/web/login")) {
		message("login reload");
		sleep(1).then(() => window.location.reload());
	}
};

/**
 * 监听登出，并删除用户 cookies
 */
const listenLogout = async (url: string) => {
	if (url.includes("/login/exit")) {
		store.del("userCookie");

		await cookie.deleteAll();

		window.location.reload();
	}
};

const request = (config: XhrRequestConfig) => {
	return new Promise<Record<string, any> | void>((resolve) => {
		const { vipCookie } = store.getAll();
		if (!vipCookie) return;

		const url = new URL(config.url, window.location.href);

		GM_xmlhttpRequest<unknown, "json">({
			method: config.method,
			url: url.href,
			anonymous: true,
			cookie: cookieToString(vipCookie),
			headers: {
				referer: window.location.href,
			},
			responseType: "json",
			onload(event) {
				return resolve(event.response);
			},
			onabort() {
				return resolve();
			},
			onerror() {
				return resolve();
			},
		});
	});
};

const handlers: {
	url: string;
	on: (userResponse: any, vipResponse: any) => any;
}[] = [
	{
		// 视频信息
		url: "api.bilibili.com/x/player/wbi/playurl",
		on: (userResponse, vipResponse) => {
			// 移除播放时间信息
			delete vipResponse.data.last_play_cid;
			delete vipResponse.data.last_play_time;

			userResponse.data = {
				...userResponse.data,
				...vipResponse.data,
			};
			return userResponse;
		},
	},
	{
		// 用户信息
		url: "api.bilibili.com/x/player/wbi/v2",
		on: (userResponse, vipResponse) => {
			userResponse.data.vip = vipResponse.data.vip;
			return userResponse;
		},
	},
	{
		// bangumi 信息
		url: "api.bilibili.com/pgc/player/web/v2/playurl",
		on: (userResponse, vipResponse) => {
			userResponse.result = vipResponse.result;
			return userResponse;
		},
	},
];

export default () => {
	proxy(
		{
			//请求发起前进入
			onRequest: (config, handler) => {
				reloadByLogin(config.url);
				listenLogout(config.url);

				handler.next(config);
			},
			//请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
			onError: (err, handler) => {
				handler.next(err);
			},
			//请求成功后进入
			onResponse: async (response, handler) => {
				const requestUrl = response.config.url;

				for (const { url, on } of handlers) {
					if (requestUrl.includes(url)) {
						const vipResponse = await request(response.config);
						// 必然是 json，如果不是那就是接口变了
						const userResponse = JSON.parse(response.response);
						if (vipResponse) {
							response.response = on(
								structuredClone(userResponse),
								structuredClone(vipResponse)
							);

							return handler.resolve(response);
						}
					}
				}

				handler.next(response);
			},
		},
		unsafeWindow
	);
};
