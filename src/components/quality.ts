import { GM_cookie, unsafeWindow } from "$";
import { cookie } from "src/utils/cookie";

export default async () => {
	// 直接设置4K画质，这样就可以默认最高画质了

	let qualityCookie = (await cookie.get({ name: "CURRENT_QUALITY" }))[0];

	if (!qualityCookie) {
		qualityCookie = {
			domain: ".bilibili.com",
			hostOnly: false,
			httpOnly: false,
			name: "CURRENT_QUALITY",
			path: "/",
			sameSite: "unspecified",
			secure: false,
			session: false,
			value: "120",
		};
	} else {
		qualityCookie.value = "120";
	}

	GM_cookie.set(qualityCookie);

	// 处理 video 画质
	Object.defineProperty(unsafeWindow, "__playinfo__", {
		configurable: true,
		set() {
			// const quality = (value.result || value.data)?.accept_quality[0] as string;
			// if (quality) setQuality(quality);
		},
		get() {
			// return "120";
		},
	});
};
