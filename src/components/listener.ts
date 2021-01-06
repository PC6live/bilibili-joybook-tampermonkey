import { proxy, Proxy } from "@/lib/ajax-hook";
import urlHandle from "./urlHandle";
import { getStoreCookies, setCookies } from "@/utils/biliCookie";

const main = async (): Promise<void> => {
	// TODO 添加失效登陆识别
	console.log("listening");
	const { vipCookie, userCookie } = getStoreCookies();

	if (!userCookie || !vipCookie) return;

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
