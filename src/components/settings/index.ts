import { unProxyAjax } from "src/lib/ajax-proxy";
import { getStoreCookies, removeCookies } from "src/utils/cookie";
import { createElement, deleteAllValue } from "src/utils/helper";

/** 头像容器 */
const container: HTMLDivElement = document.createElement("div");
/** 获取用户数据 */
const userInfoURL = "//api.bilibili.com/x/web-interface/nav";

function avatar() {
	const { userCookie, vipCookie } = getStoreCookies();
	const cookie = vipCookie || userCookie;

	if (!cookie) return;

	enum vipStatus {
		/** 普通用户 */
		user = 0,
		/** 大会员用户 */
		vip = 1,
	}

	const SESSDATA = cookie.find((v) => v.name === "SESSDATA");
	if (SESSDATA) {
		GM_xmlhttpRequest({
			url: userInfoURL,
			cookie: `${SESSDATA.name}=${SESSDATA.value}`,
			onload(resp) {
				const result = JSON.parse(resp.response) as {
					data: {
						face: string;
						vipStatus: vipStatus;
					};
				};
        const { face, vipStatus } = result.data;
        const avatarClass = vipStatus ? "joybook-avatar" : "joybook-avatar user";
				const html = createElement(`<div class="${avatarClass}">
        <img src=${face}></img>
        </div>`);
				if (html) container.appendChild(html);
			},
		});
	}
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

		unProxyAjax();
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
