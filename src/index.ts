import { listener } from "@/components/listener";
import unlockVideo from "@/components/unlockVideo";
import { initState } from "@/components/state";
import settings from "@/components/settings";
import {  isVideo } from "@/utils/helper";
import { getStoreCookies, setCookies } from "./utils/cookie";

// FIXME: 修复csrf错误

const { userCookie, vipCookie } = getStoreCookies();

// 解锁会员
unlockVideo();

// 判断是否是视频
if (isVideo() && userCookie && vipCookie) {
	listener(userCookie, vipCookie);
} else if (!isVideo() && userCookie) {
	setCookies(userCookie);
}

// 初始化用户数据
initState();

window.addEventListener("load", () => {
	import("@/styles/global.scss");
	// 渲染设定
	settings();
});
