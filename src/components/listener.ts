import { proxy, XhrRequestConfig } from '@/lib/ajax-hook';
import videoDetect from './videoDetect';
import { userCookie, storeCookies, setCookies, vipCookie } from '@/utils/biliCookie';
import setting from './setting';
import { isVideo } from '@/utils/helper';

const navLoad = (config: XhrRequestConfig): void => {
	const { xhr } = config;
	const result = JSON.parse(xhr.responseText);
	setting();
	!userCookie &&
		result.data.isLogin &&
		result.data.vipStatus !== 1 &&
		storeCookies('userCookie').then(() => {
			isVideo && location.reload(false);
		});
};

const Main = (): void => {
	console.log('listening');

	if (userCookie && vipCookie) {
		let PGC: __PGC_USERSTATE__;
		Object.defineProperty(unsafeWindow, '__PGC_USERSTATE__', {
			set(value: __PGC_USERSTATE__) {
				PGC = {
					...value,
					vip_info: {
						status: 1,
						type: 2,
						due_date: 0,
					},
					pay: 1,
				};
			},
			get() {
				return PGC;
			},
		});
	}

	console.log(unsafeWindow.__playinfo__)

	proxy({
		onRequest: (config, handler) => {
			const { url, xhr } = config;
			videoDetect(config);
			if (url.endsWith('nav')) xhr.onload = (): void => navLoad(config);
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
