import { proxy } from "@/lib/ajax-hook";
import videoDetect from "./videoDetect";
import { storeCookies, setCookies, cookieReady, userCookie } from "@/utils/biliCookie";
import setting from "./setting";
import { isVideo } from "@/utils/helper";

const checkUserCookie = (data: {isLogin: boolean, vipStatus: number}): void => {
	if (!userCookie && data.isLogin && data.vipStatus !== 1) {
		storeCookies("userCookie", ["SESSDATA", "DedeUserID", "DedeUserID__ckMd5"]);
	}
};

const Main = (): void => {
	console.log("listening");

	setting();

	fetch("https://api.bilibili.com/x/web-interface/nav", { credentials: "include"})
		.then(resp => resp.json())
		.then(result => {
			checkUserCookie(result.data);
		});

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
			const { url } = config;
			if (url.endsWith("nav")) {
				if (cookieReady) setCookies(userCookie);
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
