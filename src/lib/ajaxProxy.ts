import { ProxyConfig, ProxyOptions, ProxyWin, ProxyXHREventFunc, ProxyXHRFunc } from "./ajaxProxy.types";

const REAL_XHR = "_xhr";

function setConfig(target: ProxyConfig, p: keyof XMLHttpRequest, args: any) {
	if (p === "open") {
		target.method = args[0];
		target.url = args[1];
		target.async = args[2];
		target.user = args[3];
		target.password = args[4];
	}
	if (p === "send") {
		target.body = args[0];
	}
	if (p === "setRequestHeader") {
		target.headers = {};
		target.headers[args[0].toLowerCase()] = args[1];
	}
}

export function proxy(options: ProxyOptions, win: ProxyWin): void {
	// 保存真实 XMLHttpRequest
	win[REAL_XHR] = win[REAL_XHR] || win.XMLHttpRequest;

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

	const getterFactory: ProxyHandler<XMLHttpRequest>["get"] = (target: ProxyConfig, p, receiver) => {
		const value = Reflect.get(target, p);
		const hook = Reflect.get(options, p);

		if (hook) {
			// 拦截函数
			if (typeof hook === "function") {
				return (...args: any[]) => {
					setConfig(target, p.toString() as keyof XMLHttpRequest, args);

					return (hook as ProxyXHRFunc)(target, value, receiver) || value.call(target, ...args);
				};
			}

			// getter
			// return hook.getter(target, value, receiver);
		}

		if (typeof value === "function") {
			return value.bind(target);
		} else {
			// 使用缓存值
			return Reflect.get(target, `_${p.toString()}`) || value;
		}
	};

	const setterFactory: ProxyHandler<XMLHttpRequest>["set"] = (target: ProxyConfig, p, value, receiver) => {
		const hook = Reflect.get(options, p);

		if (hook) {
			if (typeof hook === "function") {
				return Reflect.set(target, p, () => {
					(hook as ProxyXHREventFunc)(target, value, receiver) || value(target);
				});
			}

			// return Reflect.set(target, p, hook.setter(target, value) || value);
		}

		return Reflect.set(target, p, typeof value === "function" ? value.bind(target) : value);
	};
}

export function unProxy(win: ProxyWin): void {
	win = win || window;
	if (win[REAL_XHR]) win.XMLHttpRequest = win[REAL_XHR];
	win[REAL_XHR] = undefined;
}
