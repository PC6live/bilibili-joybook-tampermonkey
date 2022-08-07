export interface ProxyMap {
	readyState?: AttrProxy<number>;
	response?: AttrProxy<any>;
	responseText?: AttrProxy<string>;
	responseType?: AttrProxy<XMLHttpRequestResponseType>;
	responseURL?: AttrProxy<string>;
	responseXML?: AttrProxy<Document | null>;
	status?: AttrProxy<number>;
	statusText?: AttrProxy<string>;
	timeout?: AttrProxy<number>;
	withCredentials?: AttrProxy<boolean>;
	upload?: AttrProxy<XMLHttpRequestUpload>;
	UNSENT?: AttrProxy<number>;
	OPENED?: AttrProxy<number>;
	HEADERS_RECEIVED?: AttrProxy<number>;
	LOADING?: AttrProxy<number>;
	DONE?: AttrProxy<number>;

	onreadystatechange?: (xhr: FullWritableXMLHTTPRequest) => void;
	onabort?: (xhr: FullWritableXMLHTTPRequest) => void;
	onerror?: (xhr: FullWritableXMLHTTPRequest) => void;
	onload?: (xhr: FullWritableXMLHTTPRequest) => void;
	onloadend?: (xhr: FullWritableXMLHTTPRequest) => void;
	onloadstart?: (xhr: FullWritableXMLHTTPRequest) => void;
	onprogress?: (xhr: FullWritableXMLHTTPRequest) => void;
	ontimeout?: (xhr: FullWritableXMLHTTPRequest) => void;

	open?: (args: any[], xhr: FullWritableXMLHTTPRequest) => void;
	abort?: (args: any[], xhr: FullWritableXMLHTTPRequest) => void;
	getAllResponseHeaders?: (args: any[], xhr: FullWritableXMLHTTPRequest) => void;
	getResponseHeader?: (args: any[], xhr: FullWritableXMLHTTPRequest) => void;
	overrideMimeType?: (args: any[], xhr: FullWritableXMLHTTPRequest) => void;
	send?: (args: any[], xhr: FullWritableXMLHTTPRequest, next: () => void) => void;
	setRequestHeader?: (args: any[], xhr: FullWritableXMLHTTPRequest) => void;
	addEventListener?: (args: any[], xhr: FullWritableXMLHTTPRequest) => void;
	removeEventListener?: (args: any[], xhr: FullWritableXMLHTTPRequest) => void;
}

export interface AttrProxy<T> {
	setter?: boolean | SetGetFn<T>;
	getter?: boolean | SetGetFn<T>;
}

export interface SetGetFn<T> {
	(this: FullWritableXMLHTTPRequest, value: T, xhr: FullWritableXMLHTTPRequest): T;
}

export type FullWritableXMLHTTPRequest = XMLHttpRequestUpload & WtritableAttrs;
export interface WtritableAttrs {
	method: "GET" | "HEAD" | "POST";
	url: string;
	cache: any;
	readyState: number;
	response: any;
	responseText: string;
	responseURL: string;
	responseXML: Document | null;
	status: number;
	statusText: string;
	upload: XMLHttpRequestUpload;
	DONE: number;
	HEADERS_RECEIVED: number;
	LOADING: number;
	OPENED: number;
	UNSENT: number;
}

const XHR = unsafeWindow.XMLHttpRequest;
const xhrInstance = new unsafeWindow.XMLHttpRequest();

const xhrCache = {} as Record<string, any>;

function proxyXHR(proxyMap: ProxyMap): typeof XMLHttpRequest {
	return new Proxy(unsafeWindow.XMLHttpRequest, {
		// 代理 new 操作符
		construct(Target) {
			const xhr = new Target();
			// 代理 XMLHttpRequest 对象实例
			const xhrProxy = new Proxy(xhr, {
				// 代理 读取属性 操作
				get(target, p: keyof XMLHttpRequest, receiver) {
					let type = "";
					try {
						type = typeof xhrInstance[p]; // 在某些浏览器可能会抛出错误
					} catch (error) {
						console.error(error);
						return target[p];
					}
					const value = target[p];
					const proxyValue = proxyMap[p as keyof ProxyMap] as any;

					// 代理一些属性诸如 response, responseText...
					if (type !== "function") {
						// 通过缓存属性值进 _xxx，代理一些 只读属性
						const v = xhrCache.hasOwnProperty(`_${p.toString()}`)
							? xhrCache[`_${p.toString()}`]
							: target[p];

						const attrGetterProxy = (proxyValue || {})["getter"];

						if (typeof attrGetterProxy === "function") {
							return attrGetterProxy.call(target, v, receiver);
						} else {
							return v;
						}
					}

					// 代理一些属性诸如 open, send...
					return (...args: any[]) => {
						const next = () => value.call(target, ...args);

						if (p === "open") {
							receiver.method = args[0];
							receiver.url = args[1];
						}

						if (proxyValue) {
							if (p === "send") {
								return (proxyValue as ProxyMap["send"])?.call(target, args, receiver, next);
							} else {
								proxyValue.call(target, args, receiver);
							}
						}

						return next();
					};
				},
				// 代理 设置属性值 操作
				set(target, p: keyof XMLHttpRequest, value, receiver) {
					const type = typeof xhrInstance[p];

					const proxyValue = proxyMap[p as keyof ProxyMap] as any;

					// 禁止修改一些原生方法如 open,send...
					if (type === "function") return true;

					// 代理一些事件属性诸如 onreadystatechange,onload...
					if (typeof proxyValue === "function") {
						(target[p] as any) = () => {
							proxyValue.call(target, receiver) || value.call(receiver);
						};
					} else {
						// 代理一些属性如 response, responseText
						const attrSetterProxy = (proxyValue || {})["setter"];
						try {
							(target[p] as any) =
								(typeof attrSetterProxy === "function" &&
									attrSetterProxy.call(target, value, receiver)) ||
								(typeof value === "function" ? value.bind(receiver) : value);
						} catch (error) {
							// 代理只读属性是会抛出错误
							if (attrSetterProxy === true) {
								// 如果该 只读属性 的 代理setter 为 true
								// 将 value 缓存进 _xxx
								xhrCache[`_${p.toString()}`] = value;
							} else {
								throw error;
							}
						}
					}
					return true;
				},
			});
			return xhrProxy;
		},
	});
}

export const proxyAjax = (proxyMap: ProxyMap): void => {
	unsafeWindow["XMLHttpRequest"] = proxyXHR(proxyMap);
};

export const unProxyAjax = () => {
	unsafeWindow["XMLHttpRequest"] = XHR;
};
