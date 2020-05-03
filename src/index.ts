import { proxy } from 'ajax-hook';
import { setCookies } from '@/utils/biliCookie';
import './styles/global.scss';

const userCookie: Cookie[] = GM_getValue('userCookie');
const vipCookie: Cookie[] = GM_getValue('vipCookie');
const isBangumi: boolean = window.location.href.includes('bangumi');

const status = {
	firstLoad: true,
};

const biliReload = (): void => {
	setCookies(vipCookie).then(() => location.reload(false));
	GM_setValue('lock', true);
};

const listener = (): void => {
	GM_setValue('lock', false);

	proxy({
		onRequest: async (config, handler) => {
			const { url, xhr } = config;
			const next = (): void => handler.next(config);

			const navLoad = (): void => {
				setCookies(userCookie);
				status.firstLoad = !status.firstLoad;
			};

			const listening = (): Promise<void> => {
				return new Promise((resolve) => {
					if (url.includes('playurl?cid') && !status.firstLoad) {
						xhr.onloadstart = (): void => {
							setCookies(vipCookie);
						};
						xhr.onloadend = (): void => {
							setCookies(userCookie);
						};
					}

					url.endsWith('nav') && navLoad();
					return resolve();
				});
			};
			await listening();
			next();
		},
		onResponse: (response, handler) => {
			handler.next(response);
		},
		onError: (err, handler) => {
			handler.next(err);
		},
	});
};

const Main = (): void => {
	console.log('run main');
	const lock = GM_getValue('lock');

	isBangumi ? (lock ? listener() : biliReload()) : setCookies(userCookie)
};

Main();
