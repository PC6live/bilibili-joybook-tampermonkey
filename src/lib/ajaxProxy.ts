import { ProxyConfig, ProxyOptions, ProxyWin, ProxyRequestEventFunc, SetGetFn, ProxyXHRFunc } from "./ajaxProxy.types";

const REAL_XHR = "_xhr";

function setValue<K extends keyof XMLHttpRequest>(arg: XMLHttpRequest, key: K, value: any): void {
	arg[key] = value;
}

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

export function proxy(proxy: ProxyOptions, win: ProxyWin = unsafeWindow): void {
  // 保存真实 XMLHttpRequest
	win[REAL_XHR] = win[REAL_XHR] || win.XMLHttpRequest;

	const instance = new win[REAL_XHR]();

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
		}

		const v = target?.cache?.[`_${p}`] || value;
		const attrGetterProxy = (hook as SetGetFn)?.["getter"]?.call(receiver, target, value);
		return attrGetterProxy || v;
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

export function unProxy(win: ProxyWin = unsafeWindow): void {
	win = win || window;
	if (win[REAL_XHR]) win.XMLHttpRequest = win[REAL_XHR];
	win[REAL_XHR] = undefined;
}
