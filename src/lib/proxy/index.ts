/**
 * @description Ajax hook refactor by es6 proxy.
 * @author Lazy Duke
 * @email weiguocai.fzu@gmail.com
 * @class AjaxProxy
 */

// @ts-nocheck
class AjaxProxy {
	// 缓存原生的 XMLHttpRequest 对象
	private RealXMLHttpRequest: typeof XMLHttpRequest;
	// 缓存原生的 XMLHttpRequest 对象实例 用来后续的 setter 里的 type 检查
	private realXMLHttpRequest: XMLHttpRequest;

	/**
	 * @description 代理 Ajax 的方法，调用这个方法开始代理原生 XMLHttpRequest 对象
	 * @author Lazy Duke
	 * @date 2019-10-27
	 * @param {ProxyMap} proxyMap
	 * @returns
	 */
	public proxyAjax = (proxyMap: ProxyMap) => {
		// 参数校验
		if (proxyMap == null) {
			throw new TypeError("proxyMap can not be undefined or null");
		}

		// 缓存操作，并防止多重代理
		this.RealXMLHttpRequest = this.RealXMLHttpRequest || unsafeWindow["XMLHttpRequest"];
		this.realXMLHttpRequest = this.realXMLHttpRequest || new unsafeWindow["XMLHttpRequest"]();

		const that = this;

		// 代理 XMLHttpRequest 对象
		const proxy = new Proxy(this.RealXMLHttpRequest, {
			// 代理 new 操作符
			construct(Target) {
				const xhr = new Target();
				// 代理 XMLHttpRequest 对象实例
				const xhrProxy = new Proxy(xhr, {
					// 代理 读取属性 操作
					get(target, p, receiver) {
						let type = "";
						try {
							type = typeof that.realXMLHttpRequest[p]; // 在某些浏览器可能会抛出错误
						} catch (error) {
							console.error(error);
							return target[p];
						}

						// 代理一些属性诸如 response, responseText...
						if (type !== "function") {
							// 通过缓存属性值进 _xxx，代理一些 只读属性
							const v = that.hasOwnProperty(`_${p.toString()}`) ? that[`_${p.toString()}`] : target[p];
							const attrGetterProxy = (proxyMap[p] || {})["getter"];
							return (
								(typeof attrGetterProxy === "function" && attrGetterProxy.call(target, v, receiver)) ||
								v
							);
						}

						// 代理一些属性诸如 open, send...
						return (...args) => {
							let newArgs = args;
							if (proxyMap[p]) {
								const result = proxyMap[p].call(target, args, receiver);
								// 返回值为 true，终止方法
								if (result === true) {
									return;
								}
								// 返回其他 truthy 值，当做新参数传入
								if (result) {
									newArgs = typeof result === "function" ? result.call(target, ...args) : result;
								}
							}
							return target[p].call(target, ...newArgs);
						};
					},
					// 代理 设置属性值 操作
					set(target, p, value, receiver) {
						let type = "";
						try {
							type = typeof that.realXMLHttpRequest[p]; // 在某些浏览器可能会抛出错误
						} catch (error) {
							console.error(error);
						}

						// 禁止修改一些原生方法如 open,send...
						if (type === "function") return true;

						// 代理一些事件属性诸如 onreadystatechange,onload...
						if (typeof proxyMap[p] === "function") {
							target[p] = () => {
								proxyMap[p].call(target, receiver) || value.call(receiver);
							};
						} else {
							// 代理一些属性如 response, responseText
							const attrSetterProxy = (proxyMap[p] || {})["setter"];
							try {
								target[p] =
									(typeof attrSetterProxy === "function" &&
										attrSetterProxy.call(target, value, receiver)) ||
									(typeof value === "function" ? value.bind(receiver) : value);
							} catch (error) {
								// 代理只读属性是会抛出错误
								if (attrSetterProxy === true) {
									// 如果该 只读属性 的 代理setter 为 true
									// 将 value 缓存进 _xxx
									that[`_${p.toString()}`] = value;
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

		unsafeWindow["XMLHttpRequest"] = proxy;
		return this.RealXMLHttpRequest;
	};

	/**
	 * @description 取消代理 Ajax 的方法，调用这个方法取消代理原生 XMLHttpRequest 对象
	 * @author Lazy Duke
	 * @date 2019-10-27
	 * @returns
	 */
	public unProxyAjax = () => {
		if (this.RealXMLHttpRequest) {
			unsafeWindow["XMLHttpRequest"] = this.RealXMLHttpRequest;
		}
		this.RealXMLHttpRequest = undefined;
	};
}

const ajaxProxy = new AjaxProxy();

export default ajaxProxy;

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

	open?: (args: any[], xhr: FullWritableXMLHTTPRequest) => boolean | void | any;
	abort?: (args: any[], xhr: FullWritableXMLHTTPRequest) => boolean | void | any;
	getAllResponseHeaders?: (args: any[], xhr: FullWritableXMLHTTPRequest) => boolean | void | any;
	getResponseHeader?: (args: any[], xhr: FullWritableXMLHTTPRequest) => boolean | void | any;
	overrideMimeType?: (args: any[], xhr: FullWritableXMLHTTPRequest) => boolean | void | any;
	send?: (args: any[], xhr: FullWritableXMLHTTPRequest) => boolean | void | any;
	setRequestHeader?: (args: any[], xhr: FullWritableXMLHTTPRequest) => boolean | void | any;
	addEventListener?: (args: any[], xhr: FullWritableXMLHTTPRequest) => boolean | void | any;
	removeEventListener?: (args: any[], xhr: FullWritableXMLHTTPRequest) => boolean | void | any;
}

export interface AttrProxy<T> {
	setter?: boolean | SetGetFn<T>;
	getter?: boolean | SetGetFn<T>;
}

export interface SetGetFn<T> {
	(this: XMLHttpRequest, value: T, xhr: XMLHttpRequest): T;
}

export type FullWritableXMLHTTPRequest = XMLHttpRequestUpload & WtritableAttrs;
export interface WtritableAttrs {
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
