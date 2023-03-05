import { Writable } from "type-fest";

export type ProxyConfig = Writable<XMLHttpRequest> & {
	method: "GET" | "HEAD" | "POST";
	url: string;
	async: boolean;
	user: string;
	password: string;
	body: string;
	headers: Record<string, string>;
	cache: Partial<Record<`_${keyof XMLHttpRequest}`, string>>;
};

export type ProxyRequestEventFunc = (this: ProxyConfig, xhr: ProxyConfig, ev: ProgressEvent) => boolean | undefined;

export type ProxyRequestEvent = Record<
	"onreadystatechange" | "onabort" | "onerror" | "onload" | "onloadend" | "onloadstart" | "onprogress" | "ontimeout",
	ProxyRequestEventFunc
>;

export type ProxyXHRFunc = (this: ProxyConfig, xhr: ProxyConfig, args: any[]) => boolean | undefined;

export type ProxyXHR = Record<
	| "open"
	| "abort"
	| "getAllResponseHeaders"
	| "getResponseHeader"
	| "overrideMimeType"
	| "send"
	| "setRequestHeader"
	| "addEventListener"
	| "removeEventListener"
	| "dispatchEvent",
	ProxyXHRFunc
>;

export interface SetGetFn<T = any> {
	getter?: (this: ProxyConfig, xhr: ProxyConfig, value: T) => T | boolean;
	setter?: (this: ProxyConfig, xhr: ProxyConfig, value: T) => T | boolean;
}

export interface ProxyAttr {
	readyState?: SetGetFn<number>;
	response?: SetGetFn<any>;
	responseText?: SetGetFn<string>;
	responseType?: SetGetFn<XMLHttpRequestResponseType>;
	responseURL?: SetGetFn<string>;
	responseXML?: SetGetFn<Document | null>;
	status?: SetGetFn<number>;
	statusText?: SetGetFn<string>;
	timeout?: SetGetFn<number>;
	withCredentials?: SetGetFn<boolean>;
	upload?: SetGetFn<XMLHttpRequestUpload>;
	UNSENT?: SetGetFn<number>;
	OPENED?: SetGetFn<number>;
	HEADERS_RECEIVED?: SetGetFn<number>;
	LOADING?: SetGetFn<number>;
	DONE?: SetGetFn<number>;
}

export type ProxyOptions = Partial<ProxyRequestEvent & ProxyAttr & ProxyXHR>;

export type ProxyWin = Window & typeof unsafeWindow & { ["_xhr"]?: typeof XMLHttpRequest };
