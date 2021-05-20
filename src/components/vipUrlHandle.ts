import { setCookies } from "@/utils/cookie";

export const vipUrlHandle = async (
	args: any[],
	vipCookie: Cookie[]
): Promise<void> => {
	const url = args[1];
	const videoUrls = ["/player/"];

	for (let count = 0; count < videoUrls.length; count += 1) {
		if (url.includes(videoUrls[count])) {
			if (vipCookie) {
				setCookies(vipCookie);
			}
			return;
		}
	}
};
