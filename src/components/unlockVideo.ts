import { getCookie } from "src/utils/cookie";

async function setDefaultQuality(quality: number): Promise<void> {
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
	} else {
		qualityCookie.value = quality.toString();
	}

	GM_cookie.set(qualityCookie);
}

export const unlockVideo = (): void => {
	let PGC: __PGC_USERSTATE__;

	Object.defineProperty(unsafeWindow, "__PGC_USERSTATE__", {
		set(value: __PGC_USERSTATE__) {
			PGC = {
				...value,
				area_limit: 0,
				ban_area_show: 1,
				follow: 1,
				follow_status: 2,
				login: 1,
				pay: 1,
				pay_pack_paid: 0,
				sponsor: 0,
				vip_info: {
					due_date: 0,
					status: 1,
					type: 2,
				},
			};
			delete PGC.dialog;
		},
		get() {
			return PGC;
		},
	});

	Object.defineProperty(unsafeWindow, "__playinfo__", {
		configurable: true,
		set(value: __playinfo__) {
			const quality = (value.result || value.data)?.accept_quality[0];
			if (quality) setDefaultQuality(quality);
		},
		get() {
			return {};
		},
	});
};
