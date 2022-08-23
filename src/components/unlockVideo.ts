import { lockQuality } from "./lockQuality";

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
			const highQuality = (value.result || value.data)?.accept_quality[0];
			if (highQuality) lockQuality(highQuality);
		},
		get() {
			return {};
		},
	});
};
