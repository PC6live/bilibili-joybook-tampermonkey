const sleep = (time = 1): Promise<void> => new Promise((resolve) => setTimeout(resolve, 1000 * time));

const createElement = (str: string): Element | null => {
	const el = document.createElement("div");
	el.innerHTML = str;
	return el.firstElementChild;
};

const isVideo = (): boolean => /(bangumi\/play\/*)|(video\/*)/gi.test(window.location.href);

const deleteAllValue = (): void => GM_listValues().forEach(v => GM_deleteValue(v));

export { sleep, createElement, isVideo, deleteAllValue };
