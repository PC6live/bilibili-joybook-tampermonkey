import { getStoreCookies, setCookies } from "@/utils/cookie";
import { printMessage } from "@/utils/helper";
import urlHandle from "@/components/urlHandle";
import ajaxProxy, { ProxyMap } from "@/lib/proxy";

const main = async (): Promise<void> => {
	printMessage("listening-start");
	const proxySettings: ProxyMap = {
		open(args) {
			const { vipCookie, userCookie } = getStoreCookies();
			const url = args[1];

			if (!userCookie || !vipCookie) return;

			// 默认操作
			setCookies(userCookie);

			// 处理视频
			urlHandle(url);

			return false;
		},
	};

	ajaxProxy.proxyAjax(proxySettings);

	printMessage("listening-end");
};

export default main;
