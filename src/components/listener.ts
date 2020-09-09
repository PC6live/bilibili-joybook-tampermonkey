import { proxy } from "@/lib/ajax-hook";
import videoDetect from "./videoDetect";
import { storeCookies, setCookies, checkCookieReady, userCookie } from "@/utils/biliCookie";
import { isVideo } from "@/utils/helper";

const checkUserCookie = (data: { isLogin: boolean; vipStatus: number }): void => {
	if (data.isLogin && data.vipStatus === 0) {
		storeCookies("userCookie", ["SESSDATA", "DedeUserID", "DedeUserID__ckMd5"]);
	}
};

const unlockVideo = (): void => {
	if (checkCookieReady() && isVideo) {
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
	}
};

const Main = (): void => {
	console.log("listening");

	const cookieReady = checkCookieReady();

	unlockVideo();

	proxy({
		onRequest: (config, handler) => {
			const { url, xhr } = config;

			xhr.onloadend = (): void => {
				if (url.includes("nav") && !userCookie) {
					const result = JSON.parse(xhr.response);
					checkUserCookie(result.data);
				}
			};

			if (cookieReady) {
				xhr.onloadstart = (): void => {
					setCookies(userCookie);
				};
				videoDetect(config);
			}

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
