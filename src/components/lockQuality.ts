export const lockQuality = (quality: string) => {
	const bilibiliPlayerSettings = localStorage.getItem("bilibili_player_settings");
	if (bilibiliPlayerSettings) {
		const bilibiliPlayerSettingsParse = JSON.parse(bilibiliPlayerSettings);
		bilibiliPlayerSettingsParse.setting_config.defquality = Number(quality);
		localStorage.setItem("bilibili_player_settings", JSON.stringify(bilibiliPlayerSettingsParse));
	}
};
