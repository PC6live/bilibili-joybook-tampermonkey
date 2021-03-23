import { getStoreCookies } from "@/utils/cookie";
import { printMessage } from "@/utils/helper";

const main = (): void => {
	printMessage("unlockVideo-start");
	const { userCookie, vipCookie } = getStoreCookies();
	if (!userCookie || !vipCookie) return;
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
		},
		get() {
			return PGC;
		},
	});

	printMessage("unlockVideo-end");
};

export default main;
