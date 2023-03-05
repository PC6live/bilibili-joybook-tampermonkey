import { getCookies } from "src/utils/cookie";

export async function setQuality(quality: string) {
	let qualityCookie = (await getCookies({ name: "CURRENT_QUALITY" }))[0];

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
	// 处理 video 画质
	Object.defineProperty(unsafeWindow, "__playinfo__", {
		configurable: true,
		set(value: any) {
			const quality = (value.result || value.data)?.accept_quality[0] as string;
			if (quality) setQuality(quality);
		},
		get() {
			return {};
		},
	});

	// 处理 bangumi 画质
	if (window.location.pathname.includes("bangumi")) {
		const search = new URLSearchParams(window.location.search);
		const url = `https://api.bilibili.com/pgc/player/web/playurl?fnval=4048&ep_id=${search.get("videoId")?.slice(2)}`;
		const resp = await (await fetch(url)).json();
    const quality = resp.result.accept_quality[0]
    setQuality(quality)
	}
}
