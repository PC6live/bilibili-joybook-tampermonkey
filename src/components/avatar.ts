import { GM_xmlhttpRequest } from "$";
import { USER_INFO_URL } from "src/constant";
import { store } from "src/store";
import { cookie } from "src/utils/cookie";
import {
	cookieToString,
	createElement,
	deleteAllValue,
} from "src/utils/helper";
import { UserInfo } from "./initialize";

/** 头像容器 */
const container: HTMLDivElement = document.createElement("div");

function avatar() {
	const { userCookie, vipCookie } = store.getAll();

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

		deleteAllValue();

		await cookie.deleteAll();

		window.location.reload();
	};

	container.addEventListener("mouseenter", onMouseEnter);
	container.addEventListener("mouseleave", onMouseLeave);
	container.addEventListener("click", onDeleteClick);
}

// 生成左下角用户头像
export default () => {
	window.addEventListener("load", () => {
		// 渲染设定
		container.id = "joybook-container";
		document.body.appendChild(container);

		avatar();
		handleEvent();
	});
};
