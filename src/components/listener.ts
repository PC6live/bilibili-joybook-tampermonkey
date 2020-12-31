import { proxy, Proxy } from "@/lib/ajax-hook";
import urlHandle from "./urlHandle";
import { storeCookies, setCookies, getUserCookie, getVipCookie } from "@/utils/biliCookie";
import { getUserType } from "@/utils/helper";

const checkUserCookie = ({ face, isLogin, vipStatus }: NavData): void => {
	if (!isLogin) return;
	if (vipStatus === 0) {
		storeCookies("userCookie", ["SESSDATA"]);
	} else {
		GM_setValue("face", face);
		storeCookies("vipCookie", ["SESSDATA"]);
	}
};

const unlockVideo = (): void => {
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
};

const Main = async (): Promise<void> => {
	// TODO 添加失效登陆识别
	console.log("listening");
	const userCookie = getUserCookie();
	const vipCookie = getVipCookie();

	if (!userCookie || !vipCookie) {
		await getUserType().then((resp) => checkUserCookie(resp));

		return;
	}

	unlockVideo();

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

export default Main;
