import { proxy, XhrRequestConfig } from "@/lib/ajax-hook";
import videoDetect from "./videoDetect";
import { storeCookies, setCookies, cookieReady, userCookie } from "@/utils/biliCookie";
import setting from "./setting";
import { isVideo } from "@/utils/helper";

const navLoad = (config: XhrRequestConfig): void => {
	const { xhr } = config;
	const result = JSON.parse(xhr.responseText);
	setting();
	if (!userCookie && result.data.isLogin && result.data.vipStatus !== 1) {
		storeCookies("userCookie", ["SESSDATA", "DedeUserID", "DedeUserID__ckMd5"]).then(() => {
			isVideo && location.reload(false);
		});
	}
};

const Main = (): void => {
	console.log("listening");

	if (cookieReady && isVideo) {
		let PGC: __PGC_USERSTATE__;
		Object.defineProperty(unsafeWindow, "__PGC_USERSTATE__", {
			set(value: __PGC_USERSTATE__) {
				PGC = {
					...value,
					vip_info: {
						status: 1,
						type: 2,
						due_date: 0,
					},
					pay: 1,
				};
			},
			get() {
				return PGC;
			},
		});
	}

	proxy({
		onRequest: (config, handler) => {
			const { url, xhr } = config;
			if (url.endsWith("nav")) {
				if (!cookieReady) {
					xhr.onload = (): void => navLoad(config);
				} else {
					setCookies(userCookie);
					xhr.onload = (): void => setting();
				}
			}
			if (cookieReady) videoDetect(config);
			handler.next(config);
		},
		onResponse: (response, handler) => {
			handler.next(response);
		},
		onError: (err, handler) => {
			handler.next(err);
		},
	});
};

export default Main;
