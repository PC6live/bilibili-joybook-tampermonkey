import { getStoreCookies, setCookies } from "@/utils/cookie";

const main = async (url: string): Promise<void> => {

	const videoUrls = ["/player/"];
	const { vipCookie } = getStoreCookies();

	for (let count = 0; count < videoUrls.length; count += 1) {
		if (url.includes(videoUrls[count])) {
			if (vipCookie) {
				setCookies(vipCookie);
			}
			return;
		}
	}
};

export default main;
