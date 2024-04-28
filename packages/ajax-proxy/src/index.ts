import type { ProxyXHR, ProxyOptions, ProxyWin } from "./index.types";

const REAL_XHR = "_xhr";

function extendXHR(target: ProxyXHR, p: keyof XMLHttpRequest, args: any): void {
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

// TODO: 设计只读属性写入
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

	const getterFactory: ProxyHandler<XMLHttpRequest>["get"] = (target: ProxyXHR, p, receiver) => {
		const key = p.toString()
		const value = Reflect.get(target, `_${key}`) || Reflect.get(target, key);
		const hook = Reflect.get(options, key);

		if (hook) {
			// 拦截函数
			if (typeof hook === "function") {
				return (...args: any[]) => {
					extendXHR(target, key as keyof XMLHttpRequest, args);

					return hook(target, value, receiver) || value.call(target, ...args);
				};
			}

			// getter
			// return hook.getter(target, value, receiver);
		}

		if (typeof value === "function") {
			return value.bind(target);
		} else {
			return value;
		}
	};

	const setterFactory: ProxyHandler<XMLHttpRequest>["set"] = (target: ProxyXHR, p, value, receiver) => {
		const key = p.toString()
		const hook = Reflect.get(options, key);

		if (hook) {
			if (typeof hook === "function") {
				return Reflect.set(target, key, () => {
					// 这里没有绑定 event 不知道有没有问题
					hook(target, value, receiver) || value(target);
				});
			}

			// return Reflect.set(target, p, hook.setter(target, value) || value);
		}

		return Reflect.set(target, key, typeof value === "function" ? value.bind(target) : value);
	};
}

export function unProxy(win: ProxyWin): void {
	win = win || window;
	if (win[REAL_XHR]) win.XMLHttpRequest = win[REAL_XHR];
	win[REAL_XHR] = undefined;
}

export * from "./index.types"