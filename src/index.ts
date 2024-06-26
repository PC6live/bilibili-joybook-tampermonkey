import { initialize, listenerAjax, createAvatar, highQuality, unlockVideo } from "src/components";
import { cookiesReady, printMessage } from "./utils/helper";
import { removeTips } from "./components/removeTips";
import "src/styles/global.scss";

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

	unlockVideo();
})();
