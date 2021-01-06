import { getStoreCookies, removeCookies } from "@/utils/biliCookie";
import { createElement, deleteAllValue } from "@/utils/helper";
import state from "./state";

const tick = async () => {
	addReloadBtn();
	genAvator();

	requestAnimationFrame(tick);
};

const genAvator = (): void => {
	const { vipCookie } = getStoreCookies();
	const { isLogin, vipStatus, vipAvator } = state;
	if (vipAvator) return;
	const avator = document.querySelector(".mini-avatar");
	const logoutAvator = document.querySelector(".mini-login") as HTMLElement;
	if (avator || logoutAvator) {
		console.log("gen avator");
		state.vipAvator = true;
		if (avator) {
			if (isLogin && vipStatus === 0) {
				if (!vipCookie) return;
				const cloneAvator = avator.cloneNode(true) as HTMLDivElement;
				const img = cloneAvator.querySelector("img");
				if (img) {
					img.src = GM_getValue("face");
				}
				if (avator.parentElement) {
					avator.parentElement.style.display = "flex";
				}
				avator.parentNode?.appendChild(cloneAvator);
			}
		} else if (logoutAvator) {
			if (!vipCookie) return;
			const lougoutImg = logoutAvator.querySelector("img");
			const cloneAvator = lougoutImg?.cloneNode(true) as HTMLImageElement;
			if (cloneAvator) {
				cloneAvator.id = "bili-avatar";
				cloneAvator.src = GM_getValue("face");
				if (logoutAvator.parentElement) {
					logoutAvator.parentElement.style.display = "flex";
					logoutAvator.parentElement.insertBefore(cloneAvator, logoutAvator);
				}
			}
		}
	}
};

const addReloadBtn = (): void => {
	const { isLogin, vipStatus, logoutBtn } = state;
	if (logoutBtn) return;

	const btn = document.querySelector(".logout");
	if (btn) {
		console.log("gen button");
		state.logoutBtn = true;
		if (isLogin) {
			const clearBtnHtml = `
				<div id="clear-btn">
				<span>清除脚本数据</span>
				</div>
				`;
			const clearBtn = createElement(clearBtnHtml);
			if (clearBtn) {
				clearBtn.addEventListener("click", () => {
					removeCookies().then(() => {
						deleteAllValue();
						window.location.reload();
					});
				});
				btn.parentNode?.appendChild(clearBtn);
			}
		}
		if (isLogin && vipStatus !== 0) {
			const vipBtnHtml = `
						<div id="vip-btn">
							<span>共享大会员</span>
						</div>
					`;
			const vipBtn = createElement(vipBtnHtml);
			if (vipBtn) {
				vipBtn.addEventListener("click", () => {
					console.log("reload");
					GM_deleteValue("userCookie");
					removeCookies().then(() => {
						window.location.reload();
					});
				});
				// remove all event
				btn.parentNode?.appendChild(vipBtn);
			}
		}
	}
};

const Main = (): void => {
	requestAnimationFrame(tick);
};

export default Main;
