export default () => {
	window.addEventListener("DOMContentLoaded", () => {
		const tips = document.querySelector(".adblock-tips");
		tips?.parentElement?.removeChild(tips);
	});
};
