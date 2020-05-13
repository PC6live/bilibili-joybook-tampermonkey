import { userCookie, vipCookie, setCookies, removeCookies } from '@/utils/biliCookie';
import { XhrRequestConfig } from '@/lib/ajax-hook';
import { isVideo } from '@/utils/helper';

const Main = (config: XhrRequestConfig): Promise<void> => {
	return new Promise((resolve) => {
		const ready = userCookie && vipCookie;
		const { url, xhr } = config;
		const video = (): void => {
			if (url.includes('playurl?cid')) {
				console.log('video working');
				xhr.onloadstart = (): void => {
					setCookies(vipCookie);
				};
				xhr.onloadend = (): void => {
					setCookies(userCookie);
					let resp;
					xhr.responseType === 'json' ? (resp = xhr.response) : (resp = JSON.parse(xhr.responseText));
					if (resp.code !== 0) {
						alert('大会员账号失效！请重新登录大会员账号');
						removeCookies()
							.then(() => {
								GM_deleteValue('vipCookie');
								GM_deleteValue('face');
							})
							.then(() => location.reload(false));
					}
				};
			}
		};
		ready && isVideo && video();
		return resolve();
	});
};

export default Main;
