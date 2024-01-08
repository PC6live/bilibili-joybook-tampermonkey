import { unProxy } from "src/lib/ajaxProxy";
import { cookieToString, getStoreCookies, removeCookies } from "src/utils/cookie";
import { createElement, deleteAllValue } from "src/utils/helper";
import { USER_INFO_URL } from "src/utils/url";
import { UserInfo } from "./initialize";
import { ProxyWin } from "src/lib/ajaxProxy.types";

// TODO: 添加快速切换会员账户，用于脚本失效场景。
/** 头像容器 */
const container: HTMLDivElement = document.createElement("div");

function avatar() {
	const { userCookie, vipCookie } = getStoreCookies();
	const cookie = vipCookie || userCookie;
	GM_xmlhttpRequest({
		url: USER_INFO_URL,
		cookie: cookie && cookieToString(cookie),
		anonymous: true,
		headers: {
			referer: window.location.href,
		},
		onload(resp) {
			const { face, vipStatus } = JSON.parse(resp.response).data as UserInfo;
			const avatarClass = vipStatus ? "joybook-avatar" : "joybook-avatar user";

			const img = face ? `<img src=${face}></img>` : "";
			const html = createElement(`
          <div class="${avatarClass}">
            ${img}
          </div>
        `);
			if (html) container.appendChild(html);
		},
	});
}

function handleEvent() {
	const delay = 1500;
	let timeout: number;
	const onMouseEnter = () => {
		if (timeout) window.clearTimeout(timeout);
		container.style.transform = "translateX(50px)";
	};

	const onMouseLeave = () => {
		timeout = window.setTimeout(() => {
			container.style.transform = "translateX(0px)";
		}, delay);
	};
	const onDeleteClick = async () => {
		const result = window.confirm("确定要删除脚本数据吗？");
		if (!result) return;

		unProxy(unsafeWindow as ProxyWin);
		deleteAllValue();
		await removeCookies();

		window.location.reload();
	};

	container.addEventListener("mouseenter", onMouseEnter);
	container.addEventListener("mouseleave", onMouseLeave);
	container.addEventListener("click", onDeleteClick);
}

export function createAvatar(): void {
	window.addEventListener("load", () => {
		// 渲染设定
		container.id = "joybook-container";
		document.body.appendChild(container);

		avatar();
		handleEvent();
	});
}
