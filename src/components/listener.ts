import { proxy, Proxy } from "@/lib/ajax-hook";
import urlHandle from "./urlHandle";
import { storeCookies, setCookies, checkCookieReady, userCookie, vipCookie } from "@/utils/biliCookie";
import { isVideo } from "@/utils/helper";

const checkUserCookie = (data: { isLogin: boolean; vipStatus: number }): void => {
	if (data.isLogin && data.vipStatus === 0) {
		storeCookies("userCookie", ["SESSDATA", "DedeUserID", "DedeUserID__ckMd5"]);
	}
};

const unlockVideo = (): void => {
	let PGC: __PGC_USERSTATE__;
	Object.defineProperty(unsafeWindow, "__PGC_USERSTATE__", {
		set(value: __PGC_USERSTATE__) {
			console.log(value);
			PGC = {
				...value,
				vip_info: {
					status: 1,
					type: 2,
					due_date: 1614614400000,
				},
				pay: 1,
			};
			delete PGC.dialog;
		},
		get() {
			return PGC;
		},
	});
};

const Main = (): void => {
	console.log("listening");

	if (!checkCookieReady()) return;

	unlockVideo();

	const proxyConfig: Proxy = {
		onRequest: (config, handler) => {
			const { url, xhr } = config;

			xhr.onloadend = (): void => {
				if (url.includes("nav") && !userCookie) {
					const result = JSON.parse(xhr.response);
					checkUserCookie(result.data);
				}
			};

			xhr.onloadstart = (): void => {
				setCookies(userCookie);
			};
			urlHandle(config);

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

export default Main;
