import { getCookie } from "src/utils/cookie";

export const lockQuality = async (quality: number) => {
	const bilibili_player_settings = localStorage.getItem("bilibili_player_settings");
	const bpx_player_profile = localStorage.getItem("bpx_player_profile");

	if (bilibili_player_settings) {
		const parse = JSON.parse(bilibili_player_settings);

		parse.setting_config.defquality = quality;
		localStorage.setItem("bilibili_player_settings", JSON.stringify(parse));
	}

	if (bpx_player_profile) {
		const parse = JSON.parse(bpx_player_profile);

		parse.media.quality = quality;
		localStorage.setItem("bpx_player_profile", JSON.stringify(parse));
	}

	let qualityCookie = await getCookie("CURRENT_QUALITY");

	const date = new Date();

	if (!qualityCookie) {
		qualityCookie = {
			domain: ".bilibili.com",
			expirationDate: new Date(date.getFullYear() + 1, date.getMonth(), date.getDate()).getTime(),
			hostOnly: false,
			httpOnly: false,
			name: "CURRENT_QUALITY",
			path: "/",
			sameSite: "unspecified",
			secure: false,
			session: false,
			value: quality.toString(),
		};
	}
  GM_cookie.set(qualityCookie);
};
