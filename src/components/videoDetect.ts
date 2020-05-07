import { userCookie, vipCookie, setCookies } from '@/utils/biliCookie';
import { XhrRequestConfig } from '@/lib/ajax-hook';
import { isVideo } from '@/utils/helper';

const Main = (config: XhrRequestConfig): Promise<void> => {
	return new Promise((resolve) => {
		const ready = userCookie && vipCookie;
		const { url, xhr } = config;
		const video = (): void => {
			if (url.includes('playurl?cid')) {
				console.log('video working')
				xhr.onloadstart = (): void => {
					setCookies(vipCookie);
				};
				xhr.onloadend = (): void => {
					setCookies(userCookie);
				};
			}
		};
		ready && isVideo && video();
		return resolve();
	});
};

export default Main;
