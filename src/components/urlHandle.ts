import { vipCookie, setCookies } from "@/utils/biliCookie";
import { XhrRequestConfig } from "@/lib/ajax-hook";
import { isVideo } from "@/utils/helper";

const Main = (config: XhrRequestConfig): void => {
		const { url, xhr } = config;
		const videoUrls = ["playurl?cid", "data?", "order"];
		const detectUrl = (strs: string[]): void => {
			for (let count = 0; count < strs.length; count += 1) {
				if (url.includes(strs[count])) {
					xhr.onloadstart = (): void => {
						setCookies(vipCookie);
					};
					return;
				}
			}
		};
		if (isVideo()) detectUrl(videoUrls);
};

export default Main;
