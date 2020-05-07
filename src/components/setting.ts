import { createElement, isVip, user } from '@/utils/helper';
import { storeCookies, removeCookies } from '@/utils/biliCookie';

const storeVipInfo = (): void => {
	const handlerClick = (): void => {
		GM_setValue('face', user().face);
		storeCookies('vipCookie')
			.then(() => removeCookies())
			.then(() => location.reload(false));
	};
	isVip() ? handlerClick() : alert('此账号不是大会员账号');
};

const genVipAvatar = (): void => {
	const container = document.querySelector('.mini-avatar')?.parentElement;
	const avatar = document.getElementById('bili-avatar');
	const face = GM_getValue('face', '//static.hdslb.com/images/akari.jpg');
	const html = `<div id="bili-avatar">
		<img src=${face} />
	</div>`;
	const vipAvatar = createElement(html) as Element;

	if (container && !avatar) {
		console.log('gen avatar');
		container.style.display = 'flex';
		container?.appendChild(vipAvatar);
		!GM_getValue('vipCookie') && vipAvatar.addEventListener('click', storeVipInfo);
	}
};

const logout = (): void => {
	const btn = document.querySelector('.logout');
	btn &&
		btn.addEventListener('click', () => {
			console.log('change user')
			GM_deleteValue('userCookie')
		});
};

const Main = (): void => {
	genVipAvatar();
	logout();
};

export default Main;
