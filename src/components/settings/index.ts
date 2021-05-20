import ajaxProxy from "@/lib/ajax-proxy";
import { store } from "@/store";
import { removeCookies } from "@/utils/cookie";
import { createElement, deleteAllValue, printMessage } from "@/utils/helper";

const container: HTMLDivElement = document.createElement("div");

function avatar() {
	const face = store.get("face");
	if (!face) return;
	const html = createElement(`<div id="joybook-avatar">
	<img src=${face}></img>
	</div>`);
	if (html) container.appendChild(html);
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

		ajaxProxy.unProxyAjax();
		deleteAllValue();
		await removeCookies();

		window.location.reload();
	};

	container.addEventListener("mouseenter", onMouseEnter);
	container.addEventListener("mouseleave", onMouseLeave);
	container.addEventListener("click", onDeleteClick);
}

function createContainer(): void {
	printMessage("settings-start");

	container.id = "joybook-container";
	document.body.appendChild(container);

	avatar();
	handleEvent();

	printMessage("settings-end");
}

const Main = (): void => {
	createContainer();
};

export default Main;
