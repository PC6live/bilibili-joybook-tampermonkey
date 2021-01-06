import { proxy, Proxy } from "@/lib/ajax-hook";
import urlHandle from "./urlHandle";
import { storeCookies, setCookies, getUserCookie, getVipCookie } from "@/utils/biliCookie";
import state from "./state";

const checkUserCookie = (): void => {
	const { isLogin, vipStatus, face } = state;
	if (!isLogin) return;
	if (vipStatus === 0) {
		storeCookies("userCookie", ["SESSDATA"]);
	} else {
		GM_setValue("face", face);
		storeCookies("vipCookie", ["SESSDATA"]);
	}
};

const main = async (): Promise<void> => {
	// TODO 添加失效登陆识别
	console.log("listening");
	const userCookie = getUserCookie();
	const vipCookie = getVipCookie();

	if (!userCookie || !vipCookie) {
		checkUserCookie();

		return;
	}

	const proxyConfig: Proxy = {
		onRequest: async (config, handler) => {
			const { xhr } = config;

			xhr.onloadstart = (): void => {
				setCookies(userCookie);
			};

			await urlHandle(config);

			handler.next(config);
		},
		onResponse: (response, handler) => {
			handler.next(response);
		},
		onError: (err, handler) => {
			handler.next(err);
		},
	};

	proxy(proxyConfig);
};

export default main;
