import { vipCookie, setCookies, removeCookies, userCookie } from "@/utils/biliCookie";
import { XhrRequestConfig } from "@/lib/ajax-hook";
import { isVideo } from "@/utils/helper";

const Main = (config: XhrRequestConfig): Promise<void> => {
	return new Promise((resolve) => {
		const { url, xhr } = config;
		const urls = ["playurl?cid", "data?"];
		const detectUrl = (strs: string[]): void => {
			for (let count = 0; count < strs.length; count += 1) {
				if (url.includes(strs[count])) {
					xhr.onloadstart = (): void => {
						setCookies(vipCookie);
					};
					xhr.onloadend = (): void => {
						setCookies(userCookie);
					};
					return;
				}
			}
		};
		const video = (): void => {
			// todo: 重置按钮

			// if (url.includes("playurl?cid")) {
			// 	console.log("video working");
			// 	xhr.onloadend = (): void => {
			// 		let resp;
			// 		xhr.responseType === "json" ? (resp = xhr.response) : (resp = JSON.parse(xhr.responseText));
			// 		if (resp.code !== 0) {
			// 			removeCookies()
			// 				.then(() => {
			// 					GM_deleteValue("vipCookie");
			// 					GM_deleteValue("face");
			// 				})
			// 				.then(() => location.reload(false));
			// 		}
			// 	};
			// }
			detectUrl(urls);
		};
		if (isVideo) video();
		return resolve();
	});
};

export default Main;
