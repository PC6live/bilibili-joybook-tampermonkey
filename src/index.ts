import listener from "@/components/listener";
import unlockVideo from "@/components/unlockVideo";
import { initState } from "@/components/state";
import settings from "@/components/settings";
import { isVideo } from "@/utils/helper";
import { getStoreCookies, setCookies } from "./utils/cookie";
import { lockQuality } from "@/components/lockQuality";

// FIXME: 修复csrf错误


const { userCookie, vipCookie } = getStoreCookies();

// 锁定画质
lockQuality();

// 判断是否是视频
if (isVideo() && userCookie && vipCookie) {
	unlockVideo();
	listener(userCookie, vipCookie);
} else if (!isVideo() && userCookie) {
	setCookies(userCookie);
}

// 初始化用户数据
initState();

// 渲染设定
window.addEventListener("load", () => {
	import("@/styles/global.scss");
	settings();
});
