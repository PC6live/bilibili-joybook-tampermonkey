type CacheXMLHttpRequest = Record<`_${keyof XMLHttpRequest}`, string>;

export type ProxyConfig = {
	method: "GET" | "HEAD" | "POST";
	url: string;
	async: boolean;
	user: string;
	password: string;
	body: string;
	headers: Record<string, string>;
	withCredentials: boolean;
} & CacheXMLHttpRequest & XMLHttpRequest;

export type ProxyXHREventFunc = (xhr: ProxyConfig, ev: ProgressEvent, receiver: ProxyConfig) => boolean | undefined;

export type ProxyXHRFunc = (xhr: ProxyConfig, args: any[], receiver: ProxyConfig) => boolean | undefined;

export interface SetGetFn<T = any> {
	getter?: (xhr: ProxyConfig, value: T, receiver: ProxyConfig) => T | boolean;
	setter?: (xhr: ProxyConfig, value: T, receiver: ProxyConfig) => T | boolean;
}

export type ProxyOptions = {
	// 事件属性
	onreadystatechange?: ProxyXHREventFunc;
	onabort?: ProxyXHREventFunc;
	onerror?: ProxyXHREventFunc;
	onload?: ProxyXHREventFunc;
	onloadend?: ProxyXHREventFunc;
	onloadstart?: ProxyXHREventFunc;
	onprogress?: ProxyXHREventFunc;
	ontimeout?: ProxyXHREventFunc;

	// 方法
	abort?: ProxyXHRFunc;
	getAllResponseHeaders?: ProxyXHRFunc;
	getResponseHeader?: ProxyXHRFunc;
	open?: ProxyXHRFunc;
	overrideMimeType?: ProxyXHRFunc;
	send?: ProxyXHRFunc;
	setRequestHeader?: ProxyXHRFunc;
	addEventListener?: ProxyXHRFunc;
	removeEventListener?: ProxyXHRFunc;
	dispatchEvent?: ProxyXHRFunc;

	// 只读属性
	response?: SetGetFn;
	responseText?: SetGetFn<string>;
	readyState?: SetGetFn<number>;
	responseType?: SetGetFn<XMLHttpRequestResponseType>;
	responseURL?: SetGetFn<string>;
	responseXML?: SetGetFn<Document | null>;
	status?: SetGetFn<number>;
	statusText?: SetGetFn<string>;
	timeout?: SetGetFn<number>;
	upload?: SetGetFn<XMLHttpRequestUpload>;
	withCredentials?: SetGetFn<boolean>;
	UNSENT?: SetGetFn<number>;
	OPENED?: SetGetFn<number>;
	HEADERS_RECEIVED?: SetGetFn<number>;
	LOADING?: SetGetFn<number>;
	DONE?: SetGetFn<number>;
};

export type ProxyWin = Window & typeof globalThis & { ["_xhr"]?: typeof XMLHttpRequest };
