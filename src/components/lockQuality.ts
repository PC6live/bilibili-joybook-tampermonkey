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

  const qualityCookie = await getCookie("CURRENT_QUALITY")

  if (qualityCookie) {
    qualityCookie.value = quality.toString()
    GM_cookie.set(qualityCookie)
  }
};
