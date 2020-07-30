import { proxy } from "@/lib/ajax-hook";
import videoDetect from "./videoDetect";
import { storeCookies, setCookies, cookieReady, userCookie, vipCookie } from "@/utils/biliCookie";
import setting from "./setting";
import { isVideo } from "@/utils/helper";

const checkUserCookie = (data: { isLogin: boolean; vipStatus: number }): void => {
	if (!userCookie && data.isLogin && data.vipStatus !== 1) {
		storeCookies("userCookie", ["SESSDATA", "DedeUserID", "DedeUserID__ckMd5"]);
	}
};

const unlockVideo = (): void => {
	if (cookieReady && isVideo) {
		let PGC: __PGC_USERSTATE__;
		Object.defineProperty(unsafeWindow, "__PGC_USERSTATE__", {
			set(value: __PGC_USERSTATE__) {
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
		// Object.defineProperty(unsafeWindow, "__playinfo__", {
		// 	configurable: true,
		// 	enumerable: true,
		// 	get() {
		// 		return {};
		// 	},
		// });
	}
};

const Main = (): void => {
	console.log("listening");

	unlockVideo();
	setting();

	fetch("https://api.bilibili.com/x/web-interface/nav", { credentials: "include" })
		.then((resp) => resp.json())
		.then((result) => {
			checkUserCookie(result.data);
		});

	if (cookieReady) {
		setCookies(userCookie);
	}

	proxy({
		onRequest: (config, handler) => {
			if (cookieReady)
				videoDetect(config).then(() => {
					handler.next(config);
				});
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
