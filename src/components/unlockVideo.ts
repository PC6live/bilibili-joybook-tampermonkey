import { printMessage } from "@/utils/helper";

const main = (): void => {
	printMessage("unlockVideo-start");
	let PGC: __PGC_USERSTATE__;
	let playinfo: __playinfo__;

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
			if (value.result) {
				const highQuality = value.result.accept_quality[0];
				playinfo = {
					...value,
					result: {
						...value.result,
						quality: highQuality,
					},
				};
			} else if (value.data) {
				const highQuality = value.data.accept_quality[0];
				playinfo = {
					...value,
					data: {
						...value.data,
						quality: highQuality,
					},
				};
			}

		},
		get() {
			return playinfo;
		},
	});

	printMessage("unlockVideo-end");
};

export default main;
