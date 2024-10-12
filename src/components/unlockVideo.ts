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
};
