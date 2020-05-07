import listener from './components/listener';
import { setCookies, vipCookie, userCookie } from './utils/biliCookie';
import { isVideo } from './utils/helper';
import './styles/global.scss';

const biliReload = (): void => {
	GM_setValue('lock', false);
	setCookies(vipCookie).then(() => location.reload(false));
};

const Main = (): void => {
	const lock = GM_getValue('lock', true);
	console.log('run main');
	lock && vipCookie && userCookie && isVideo && biliReload();
	listener();
};

Main();
