import { store } from "@/store";
import { setCookies } from "@/utils/cookie";

const biliQuality = {
	"1080P60fps": "112",
	"1080p": "80",
	"720p": "64",
	"480p": "32",
	"360p": "16",
};

const setQualityCookies = (quality: string): void => {
	setCookies([
		{
			domain: ".bilibili.com",
			name: "CURRENT_QUALITY",
			value: quality,
			path: "/",
			httpOnly: true,
		},
	]);
};

export const lockQuality = () => {
	const quality = store.get("quality");
	if (quality) {
		const bilibiliPlayerSettings = localStorage.getItem("bilibili_player_settings");
		if (bilibiliPlayerSettings) {
			const bilibiliPlayerSettingsParse = JSON.parse(bilibiliPlayerSettings);
			bilibiliPlayerSettingsParse.setting_config.defquality = quality;
			localStorage.setItem("bilibili_player_settings", JSON.stringify(bilibiliPlayerSettingsParse));
		}
		setQualityCookies(quality);
	} else {
		store.set("quality", biliQuality["1080P60fps"]);
		lockQuality();
	}
};
