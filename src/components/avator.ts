import { getVipCookie, removeCookies } from "@/utils/biliCookie";
import { createElement, getUserType } from "@/utils/helper";

const state = {
	logoutBtn: false,
	vipAvator: false,
};

const tick = async () => {
	addReloadEvent();
	genAvator();

	requestAnimationFrame(tick);
};

const genAvator = (): void => {
	if (state.vipAvator) return;
	const avator = document.querySelector(".mini-avatar");
	const logoutAvator = document.querySelector(".mini-login") as HTMLElement;
	if (avator) {
		state.vipAvator = true;
		getUserType().then(resp => {
			if (resp.isLogin && resp.vipStatus === 0) {
				const vipCookie = getVipCookie();
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
		});
	} else if (logoutAvator) {
		state.vipAvator = true;
		const vipCookie = getVipCookie();
		if (!vipCookie) return;
		const lougoutImg = logoutAvator.querySelector("img");
		const cloneAvator =lougoutImg?.cloneNode(true) as HTMLImageElement;
		if (cloneAvator) {
			cloneAvator.id = "bili-avatar";
			cloneAvator.src = GM_getValue("face");
			if (logoutAvator.parentElement) {
				logoutAvator.parentElement.style.display = "flex";
				logoutAvator.parentElement.insertBefore(cloneAvator, logoutAvator);
			}
		}
	}
};

const addReloadEvent = (): void => {
	if (state.logoutBtn) return;

	const btn = document.querySelector(".logout");
	if (btn) {
		console.log("gen avator");
		state.logoutBtn = true;
		getUserType().then((resp) => {
			if (resp.isLogin && resp.vipStatus !== 0) {
				const html = `
						<div id="vip-btn">
							<span>共享大会员</span>
						</div>
					`;
				const vipBtn = createElement(html);
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
		});
	}
};

const Main = (): void => {
	requestAnimationFrame(tick);
};

export default Main;
