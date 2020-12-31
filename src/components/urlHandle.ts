import { getVipCookie, setCookies } from "@/utils/biliCookie";
import { XhrRequestConfig } from "@/lib/ajax-hook";
import { isVideo } from "@/utils/helper";

const Main = async (config: XhrRequestConfig): Promise<void> => {
	const { url, xhr } = config;
	const videoUrls = ["playurl?cid", "data?", "order"];
	const detectUrl = async(strs: string[]): Promise<void> => {
		for (let count = 0; count < strs.length; count += 1) {
			if (url.includes(strs[count])) {
				xhr.onloadstart = (): void => {
					const vipCookie = getVipCookie();
					if (vipCookie) setCookies(vipCookie);
				};
				return Promise.resolve();
			}
		}
	};
	if (isVideo()) await detectUrl(videoUrls);
	return Promise.resolve();
};

export default Main;
