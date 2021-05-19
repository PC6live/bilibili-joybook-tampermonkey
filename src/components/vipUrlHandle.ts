import { XhrRequestConfig } from "@/lib/ajax-hook";
import { store } from "@/store";
import { setCookies } from "@/utils/cookie";
import state from "./state";

const initQuality = (url: string, xhr: XhrRequestConfig) => {
	const [host, params] = url.split("?");
	if (params && !state.initQuality) {
		const newParams = new URLSearchParams(params);
		const qn = newParams.get("qn");
		if (qn) {
			const quality = store.get("quality");
			newParams.set("qn", quality);
			xhr.url = `${host}?${newParams.toString()}`;
			state.initQuality = true;
		}
	}
};

export const vipUrlHandle = async (url: string, xhr: XhrRequestConfig, vipCookie: Cookie[]): Promise<void> => {
	const videoUrls = ["/player/"];

	for (let count = 0; count < videoUrls.length; count += 1) {
		if (url.includes(videoUrls[count])) {
			initQuality(url, xhr);
			if (vipCookie) {
				setCookies(vipCookie);
			}
			return;
		}
	}
};
