const equals = (a: any, b: any): boolean => {
	if (a === b) return true;
	if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
	if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) return a === b;
	if (a.prototype !== b.prototype) return false;
	const keys = Object.keys(a);
	if (keys.length !== Object.keys(b).length) return false;
	return keys.every((k) => equals(a[k], b[k]));
};

const sleep = (time = 1): Promise<void> => {
	return new Promise((resolve) => setTimeout(resolve, 1000 * time));
};

const createElement = (str: string): Element | null => {
	const el = document.createElement('div');
	el.innerHTML = str;
	return el.firstElementChild;
};

const isVideo: boolean = /(bangumi\/play\/ss\d+)|(bangumi\/play\/ep\d+)|(video\/bv\d+)/gi.test(window.location.href);
const isVip = (): boolean => {
	return unsafeWindow.UserStatus.userInfo.vipStatus === 1;
};
const user = (): UserStatus['userInfo'] => unsafeWindow.UserStatus.userInfo;

export { equals, sleep, createElement, isVideo, isVip, user };
