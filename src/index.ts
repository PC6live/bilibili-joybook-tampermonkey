import { unlockVideo, initialize, listenerAjax, settings } from "src/components";

// 解锁会员限制
unlockVideo();

// 初始化用户数据&储存cookies
initialize();

// 监听XHR
listenerAjax();

window.addEventListener("load", () => {
	import("src/styles/global.scss");
	// 渲染设定
	settings();
});
