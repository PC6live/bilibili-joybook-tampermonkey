import { setCookies } from "@/utils/cookie";
import { printMessage } from "@/utils/helper";
import { vipUrlHandle } from "@/components/vipUrlHandle";
import { proxy } from "@/lib/ajax-hook";

const main = async (userCookie: Cookie[], vipCookie: Cookie[]): Promise<void> => {
	printMessage("listening-start");

	proxy({
		//请求发起前进入
		onRequest: (config, handler) => {
			const { url } = config;

			// 默认操作
			setCookies(userCookie);

			// 处理视频
			vipUrlHandle(url, config, vipCookie);

			handler.next(config);
		},
		//请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
		onError: (err, handler) => {
			handler.next(err);
		},
		//请求成功后进入
		onResponse: (response, handler) => {
			handler.next(response);
		},
	});

	printMessage("listening-end");
};

export default main;
