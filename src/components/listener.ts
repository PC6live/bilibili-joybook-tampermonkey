import { setCookies } from "@/utils/cookie";
import { printMessage } from "@/utils/helper";
import { vipUrlHandle } from "@/components/vipUrlHandle";
import ajaxProxy, { ProxyMap } from "@/lib/ajax-proxy";
import { lockQuality } from "./lockQuality";
import { state } from "./state";
import { TStoreCookies } from "@/store";

export const listener = async (props: TStoreCookies): Promise<void> => {
  printMessage("listening-start");

  const { userCookie, vipCookie } = props;
	const proxySettings: ProxyMap = {
		open(args) {
			// 默认操作
			if (state.highQuality) lockQuality(state.highQuality);
			setCookies(userCookie);

			// 处理视频
			vipUrlHandle(args, vipCookie);

			return false;
		},
	};

	ajaxProxy.proxyAjax(proxySettings);

	printMessage("listening-end");
};
