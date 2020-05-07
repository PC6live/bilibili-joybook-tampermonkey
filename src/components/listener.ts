import { proxy, XhrRequestConfig  } from '@/lib/ajax-hook';
import videoDetect from './videoDetect';
import { userCookie, setCookies, storeCookies } from '@/utils/biliCookie';
import setting from "./setting";
import { isVideo, biliReload } from '@/utils/helper';

const navLoad = (config: XhrRequestConfig): void => {
	const { xhr } = config;
	const result = JSON.parse(xhr.responseText);
	setting();
	GM_setValue('lock', true);
	!userCookie && result.data.isLogin && result.vipStatus !== 1 && storeCookies('userCookie').then(() => {
		isVideo && biliReload()
	})
};

const Main = (): void => {
	console.log('listening');
	// remenber change ajax-hook window
	proxy({
		onRequest: async (config, handler) => {
			const { url, xhr } = config;
			const nav = (): Promise<void> => {
				return new Promise((resolve) => {
					xhr.onloadstart = (): void => {
						userCookie && setCookies(userCookie);
					};
					xhr.onload = (): void => navLoad(config)
					return resolve();
				});
			};

			await videoDetect(config);
			url.endsWith('nav') && (await nav());
			handler.next(config);
		},
		onResponse: (response, handler) => {
			handler.next(response);
		},
		onError: (err, handler) => {
			handler.next(err);
		},
	});
};

export default Main;
