export const lockQuality = (quality: string | number) => {
	const qualityFormat: string = typeof quality === "number" ? quality.toString() : quality;
	const bilibiliPlayerSettings = localStorage.getItem("bilibili_player_settings");
	if (bilibiliPlayerSettings) {
		const bilibiliPlayerSettingsParse = JSON.parse(bilibiliPlayerSettings);
		bilibiliPlayerSettingsParse.setting_config.defquality = qualityFormat;
		localStorage.setItem("bilibili_player_settings", JSON.stringify(bilibiliPlayerSettingsParse));
	}
};
