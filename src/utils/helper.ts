const sleep = (time = 1): Promise<void> => new Promise((resolve) => setTimeout(resolve, 1000 * time));

const createElement = (str: string): Element | null => {
	const el = document.createElement("div");
	el.innerHTML = str;
	return el.firstElementChild;
};

const isVideo = (): boolean => /(bangumi\/play\/*)|(video\/*)/gi.test(window.location.href);

const getUserType = (): Promise<NavData> => {
	return fetch("https://api.bilibili.com/x/web-interface/nav", { method: "Get", credentials: "include" })
		.then((resp) => resp.json())
		.then((result) => result.data);
};

export { sleep, createElement, isVideo, getUserType };
