// import { unProxyAjax } from "src/lib/ajax-proxy";
import { unProxy } from "src/lib/ajaxProxy";
import { cookieToString, getStoreCookies, removeCookies } from "src/utils/cookie";
import { createElement, deleteAllValue } from "src/utils/helper";
import { USER_INFO_URL } from "src/utils/url";
import { UserInfo } from "./initialize";

/** 头像容器 */
const container: HTMLDivElement = document.createElement("div");

function avatar() {
	const { userCookie, vipCookie } = getStoreCookies();
	const cookie = vipCookie || userCookie;

	GM_xmlhttpRequest({
		url: USER_INFO_URL,
		cookie: cookie && cookieToString(cookie),
		anonymous: true,
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

		unProxy(unsafeWindow);
		deleteAllValue();
		await removeCookies();

		window.location.reload();
	};

	container.addEventListener("mouseenter", onMouseEnter);
	container.addEventListener("mouseleave", onMouseLeave);
	container.addEventListener("click", onDeleteClick);
}

function createContainer(): void {
	container.id = "joybook-container";
	document.body.appendChild(container);

	avatar();
	handleEvent();
}

export const settings = (): void => {
	createContainer();
};
