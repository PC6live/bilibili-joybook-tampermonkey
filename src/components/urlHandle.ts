import { getStoreCookies, setCookies } from "@/utils/biliCookie";
import { XhrRequestConfig } from "@/lib/ajax-hook";
import { isVideo } from "@/utils/helper";

const main = async (config: XhrRequestConfig): Promise<void> => {
	const { url, xhr } = config;
	const videoUrls = ["playurl?cid", "player/v2"];
	const detectUrl = async(strs: string[]): Promise<void> => {
		for (let count = 0; count < strs.length; count += 1) {
			if (url.includes(strs[count])) {
				const { vipCookie, userCookie } = getStoreCookies();
				xhr.onloadstart = (): void => {
					if (vipCookie) setCookies(vipCookie);
				};
				xhr.onload = () => {
					if (userCookie) setCookies(userCookie);
				};
				return Promise.resolve();
			}
		}
	};
	if (isVideo()) await detectUrl(videoUrls);
	return Promise.resolve();
};

export default main;
