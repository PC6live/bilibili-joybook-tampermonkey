import { listener } from "@/components/listener";
import unlockVideo from "@/components/unlockVideo";
import { initState } from "@/components/state";
import settings from "@/components/settings";
import { isVideo } from "@/utils/helper";
import { getStoreCookies, setCookies } from "@/utils/cookie";

const { userCookie, vipCookie } = getStoreCookies();

// 解锁会员限制
unlockVideo();

// 判断是否是视频
if (userCookie && vipCookie) {
	if (isVideo()) {
		listener({ userCookie, vipCookie });
	} else {
		setCookies(userCookie);
	}
}

// 初始化用户数据&储存cookies
initState();

window.addEventListener("load", () => {
	import("@/styles/global.scss");
	// 渲染设定
	settings();
});
