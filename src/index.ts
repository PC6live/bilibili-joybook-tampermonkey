import { proxy } from 'ajax-hook';
import { setCookies } from '@/utils/biliCookie';
import './styles/global.scss';
import Share from '@/components/share';

const userCookie: Cookie[] = GM_getValue('userCookie');
const vipCookie: Cookie[] = GM_getValue('vipCookie');
const isBangumi: boolean = window.location.href.includes('bangumi');

const status = {
	firstLoad: true,
}

const listener = (): void => {
	window.addEventListener('beforeunload', (e) => {
		console.log('refresh');
		setCookies(vipCookie);
	});
	// 需要修改ajax-hoook文件将window指向unsafeWindow
	proxy({
		onRequest: async (config, handler) => {
			const { url, xhr } = config;
			const next = (): void => handler.next(config);

			const navLoad = () => {
				setCookies(userCookie);
				status.firstLoad = !status.firstLoad
			}

			const mian = (): Promise<void> => {
				return new Promise(resolve => {
					if (url.includes('playurl?cid') && !status.firstLoad) {
						xhr.onloadstart = (): void => {
							setCookies(vipCookie)
							console.log(xhr.status)
						}
						xhr.onloadend = (): void => {
							setCookies(userCookie)
							console.log(xhr.status)
						}
					}
	
					url.endsWith('nav') && navLoad();
					return resolve()
				})
			}
			await mian();
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
	isBangumi ? listener() : setCookies(userCookie);
};

Main();
