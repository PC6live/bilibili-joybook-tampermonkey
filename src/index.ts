import listener from './components/listener';
import { vipCookie, userCookie, setCookies } from './utils/biliCookie';
import { isVideo, biliReload } from './utils/helper';
import './styles/global.scss';

const Main = (): void => {
	const lock = GM_getValue('lock', true);
	console.log('run main');
	lock && vipCookie && userCookie && isVideo && setCookies(vipCookie).then(() => biliReload());
	listener();
};

Main();
