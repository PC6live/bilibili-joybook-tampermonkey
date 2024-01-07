import { cookieList } from "src/utils/cookie";

export async function setQuality(quality: string) {
	let qualityCookie = (await cookieList({ name: "CURRENT_QUALITY" }))[0];

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
			value: quality,
		};
	} else {
		qualityCookie.value = quality;
	}

	GM_cookie.set(qualityCookie);
}

export async function highQuality(): Promise<void> {
  // 直接设置4K画质，这样就可以默认最高画质了
  setQuality("120")
}
