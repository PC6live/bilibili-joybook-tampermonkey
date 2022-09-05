import { Writable } from "type-fest";

export type ProxyConfig = Writable<XMLHttpRequest> & {
	method: "GET" | "HEAD" | "POST";
	url: string;
	async: boolean;
	user: string;
	password: string;
	body: string;
	headers: Record<string, string>;
	next: boolean;
	cache: Partial<Record<`_${keyof XMLHttpRequest}`, string>>;
};

type ProxyRequestEventFunc = (this: ProxyConfig, xhr: ProxyConfig, ev: ProgressEvent) => boolean | undefined;

type ProxyRequestEvent = Record<
	"onreadystatechange" | "onabort" | "onerror" | "onload" | "onloadend" | "onloadstart" | "onprogress" | "ontimeout",
	ProxyRequestEventFunc
>;

type ProxyXHRFunc = (this: ProxyConfig, xhr: ProxyConfig, args: any[]) => boolean | undefined;

type ProxyXHR = Record<
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

interface SetGetFn<T = any> {
	getter?: (this: ProxyConfig, xhr: ProxyConfig, value: T) => T | boolean;
	setter?: (this: ProxyConfig, xhr: ProxyConfig, value: T) => T | boolean;
}

interface ProxyAttr {
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

type ProxyWin = Window & typeof globalThis & { ["_xhr"]?: typeof XMLHttpRequest };

const realXHR = "_xhr";

function setValue<K extends keyof XMLHttpRequest>(arg: XMLHttpRequest, key: K, value: any): void {
	arg[key] = value;
}

export function proxy(proxy: ProxyOptions, win: ProxyWin = window): void {
	win[realXHR] = win[realXHR] || win.XMLHttpRequest;

  const instance = new win[realXHR]();

	win.XMLHttpRequest = new Proxy(win.XMLHttpRequest, {
		construct(Target) {
			// 代理 new 操作符
			const xhr = new Target();
			const xhrProxy = new Proxy(xhr, {
				get: getterFactory,
				set: setterFactory,
			});
			return xhrProxy;
		},
	});

	function setConfig(receiver: ProxyConfig, p: keyof XMLHttpRequest, args: any) {
		if (p === "open") {
			receiver.method = args[0];
			receiver.url = args[1];
			receiver.async = args[2];
			receiver.user = args[3];
			receiver.password = args[4];
		}
		if (p === "send") {
			receiver.body = args[0];
		}
		if (p === "setRequestHeader") {
			receiver.headers = {};
			receiver.headers[args[0].toLowerCase()] = args[1];
		}
	}

	const getterFactory: ProxyHandler<XMLHttpRequest>["get"] = (
		target: ProxyConfig,
		p: keyof XMLHttpRequest,
		receiver: ProxyConfig
	): any => {
		const value = target[p];
		const hook = proxy[p];
		const type = typeof instance[p];

		if (type === "function") {
			return (...args: any[]) => {
				const next = () => value.call(target, ...args);

				setConfig(receiver, p, args);

				return (hook as ProxyXHRFunc)?.call(receiver, target, args) || next();
			};
		} else {
			const v = target?.cache?.[`_${p}`] || value;
			const attrGetterProxy = (hook as SetGetFn)?.["getter"]?.call(receiver, target, value);
			return attrGetterProxy || v;
		}
	};

	const setterFactory: ProxyHandler<XMLHttpRequest>["set"] = (
		target: ProxyConfig,
		p: keyof XMLHttpRequest,
		value: any,
		receiver: ProxyConfig
	) => {
		const hook = proxy[p];

		if (typeof instance[p] === "function") return true;

		if (typeof hook === "function") {
			setValue(target, p, (e: ProgressEvent<EventTarget>) => {
				const event = { ...e };
				event.target = event.currentTarget = receiver;

				(hook as ProxyRequestEventFunc).call(receiver, target, event) || value.call(receiver, event);
			});
		} else {
			const attrSetterProxy = (hook as SetGetFn)?.["setter"]?.call(receiver, target, value);
			const attrValue = typeof value === "function" ? value.bind(receiver) : value;

			try {
				setValue(target, p, attrSetterProxy || attrValue);
			} catch {
				// 缓存只读属性
				if (!target.cache) target.cache = {};
				target.cache[`_${p}`] = value;
			}
		}

		return true;
	};
}

export function unProxy(win: ProxyWin): void {
	win = win || window;
	if (win[realXHR]) win.XMLHttpRequest = win[realXHR];
	win[realXHR] = undefined;
}
