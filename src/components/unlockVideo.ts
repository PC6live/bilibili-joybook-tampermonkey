import { GM_getTab, GM_saveTab } from "$";
import { store } from "src/store";
import { cookie } from "src/utils/cookie";

// 解除非会员点击切换画质限制
export default () => {
	const { vipCookie, userCookie } = store.getAll();

	if (!vipCookie || !userCookie) return;

	// FIXME: 不行，ssr 中包含播放时间等信息
	if (window.location.pathname.includes("bangumi")) {
		GM_getTab((tab) => {
			if (tab.dirty) {
				cookie.set(userCookie);
				tab.dirty = false;
				GM_saveTab(tab);
			} else {
				cookie.set(vipCookie);
				tab.dirty = true;
				GM_saveTab(tab);
				window.location.reload();
			}
		});
	}

	// GM_getTab(async (tab) => {
	// 	console.log(tab.__NEXT_DATA__);

	// 	if (tab.__NEXT_DATA__) {
	// 		let store;
	// 		Object.defineProperty(unsafeWindow, "__NEXT_DATA__", {
	// 			set(value) {
	// 				console.log(value);

	// 				store = value;
	// 			},
	// 			get() {
	// 				// store.props.pageProps.dehydratedState =
	// 				// 	tab.__NEXT_DATA__.props.pageProps.dehydratedState;

	// 				return tab.__NEXT_DATA__;
	// 			},
	// 		});
	// 	} else {
	// 		// 使用会员 cookies 请求 ssr data 并保存在 tab
	// 		GM_xmlhttpRequest({
	// 			url: window.location.href,
	// 			cookie: cookieToString(vipCookie),
	// 			responseType: "document",
	// 			onload(event) {
	// 				const dom = event.responseXML;
	// 				const __NEXT_DATA__ = dom?.getElementById("__NEXT_DATA__");
	// 				if (__NEXT_DATA__) {
	// 					const data = JSON.parse(__NEXT_DATA__.innerHTML);
	// 					tab.__NEXT_DATA__ = data;
	// 					GM_saveTab(tab);
	// 					window.location.reload();
	// 				}
	// 			},
	// 		});
	// 	}
	// });

	// GM_xmlhttpRequest({
	// 	url: window.location.href,
	// 	cookie: cookieToString(vipCookie),
	// 	responseType: "document",
	// 	onload(event) {
	// 		const dom = event.responseXML;
	// 		const __NEXT_DATA__ = dom?.getElementById("__NEXT_DATA__");
	// 		if (__NEXT_DATA__) {
	// 			const data = JSON.parse(__NEXT_DATA__.innerHTML);
	// 			console.log(data);
	// 		}
	// 	},
	// });

	// let cache: any = {};

	// Object.defineProperty(unsafeWindow, "__NEXT_DATA__", {
	// 	set(value) {
	// 		console.log(value);
	// 		cache = value;
	// 	},
	// 	get() {
	// 		cache.props.pageProps.dehydratedState.queries[0].state.data.result.play_view_business_info.user_status.vip_info =
	// 			{
	// 				real_vip: true,
	// 				status: 1,
	// 				type: 1,
	// 			};

	// 		return cache;
	// 	},
	// });
};
