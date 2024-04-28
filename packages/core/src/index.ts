import { initialize, listenerAjax, createAvatar, highQuality, removeTips, unlockVideo } from "components";
import { cookiesReady, printMessage } from "./utils/helper";
import "./styles/global.scss";
import { cookieList, getStoreCookies, setCookies } from "utils/cookie";

(() => {
	const ready = cookiesReady();

	if (ready) {
		printMessage("白嫖");
	} else {
		printMessage(
			"请按照操作说明 https://github.com/PC6live/bilibili-joybook-tampermonkey#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9 登录账号"
		);
	}

	// 自动设置最高画质
	highQuality();

	// 初始化用户数据&储存cookies
	initialize();

	// 监听XHR
	listenerAjax();

	// 创建头像
	createAvatar();

	// 移除广告拦截提示
	removeTips();

	// 更改服务端渲染携带的用户信息
	unlockVideo();

	const switchUser = async () => {
		const { vipCookie, userCookie } = getStoreCookies();

		const cookies = await cookieList();

		const userId = userCookie.find((v) => v.name === "DedeUserID");
		const currentId = cookies.find((v) => v.name === "DedeUserID");

		const isVip = userId?.value !== currentId?.value;

		console.log(isVip, userId, currentId);

		setCookies(isVip ? userCookie : vipCookie);
	};

	unsafeWindow.switchUser = switchUser;
})();
