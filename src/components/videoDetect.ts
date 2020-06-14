import { userCookie, vipCookie, setCookies, removeCookies } from "@/utils/biliCookie";
import { XhrRequestConfig } from "@/lib/ajax-hook";
import { isVideo } from "@/utils/helper";

const Main = (config: XhrRequestConfig): Promise<void> => {
	return new Promise((resolve) => {
		const { url, xhr } = config;
		const urls = ["playurl?cid", "data?"];
		const detectUrl = (strs: string[]): void => {
			strs.forEach((str) => {
				if (url.includes(str)) {
					setCookies(vipCookie);
					xhr.onloadend = (): Promise<void> => setCookies(userCookie);
				}
			});
		};
		const video = (): void => {
			if (url.includes("playurl?cid")) {
				console.log("video working");
				xhr.onloadend = (): void => {
					let resp;
					xhr.responseType === "json" ? (resp = xhr.response) : (resp = JSON.parse(xhr.responseText));
					if (resp.code !== 0) {
						alert("大会员账号失效！请重新登录大会员账号");
						removeCookies()
							.then(() => {
								GM_deleteValue("vipCookie");
								GM_deleteValue("face");
							})
							.then(() => location.reload(false));
					}
				};
			}
			detectUrl(urls);
		};
		if (isVideo) video();
		return resolve();
	});
};

export default Main;
