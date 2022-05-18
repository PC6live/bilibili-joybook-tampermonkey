// ==UserScript==
// @name          bilibili-joybook
// @version       0.0.7
// @description   共享大会员
// @author        PC6live
// @match         *://*.bilibili.com/*
// @exclude       *://passport.bilibili.com/*
// @homepage      https://github.com/PC6live/bilibili-joybook-tampermonkey
// @supportURL    https://github.com/PC6live/bilibili-joybook-tampermonkey/issues
// @grant         GM_cookie
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_addStyle
// @grant         GM_deleteValue
// @grant         GM_getTab
// @grant         GM_getTabs
// @grant         GM_listValues
// @grant         GM_saveTab
// @grant         unsafeWindow
// @run-at        document-start
// @noframes      true
// ==/UserScript==
(function () {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    const obj = {
        face: "",
        cookiesReady: false,
        init: false,
    };
    const set = (key, value) => {
        GM_setValue(key, value);
    };
    const get = (key, defaultValue) => {
        return GM_getValue(key, defaultValue);
    };
    const remove = (key) => {
        GM_deleteValue(key);
    };
    const initStore = () => {
        if (get("init"))
            return;
        Object.keys(obj).forEach(v => {
            const key = v;
            set(key, obj[key]);
        });
        set("init", true);
    };
    const getAll = () => {
        const result = {};
        Object.keys(obj).forEach(v => {
            const key = v;
            result[key] = get(key);
        });
        return result;
    };
    const store = { set, get, remove, initStore, getAll };

    const getStoreCookies = () => {
        const userCookie = store.get("userCookie");
        const vipCookie = store.get("vipCookie");
        return {
            userCookie,
            vipCookie,
        };
    };
    const getCookies = () => {
        return new Promise((resolve) => {
            GM_cookie.list({}, (cookies) => resolve(cookies));
        });
    };
    const removeCookies = () => __awaiter(void 0, void 0, void 0, function* () {
        const cookies = yield getCookies();
        cookies.forEach((cookie) => {
            GM_cookie.delete({ name: cookie.name });
        });
    });
    const storeCookies = (name, queryName) => __awaiter(void 0, void 0, void 0, function* () {
        const cookies = (yield getCookies()).filter((cookie) => {
            return cookie.name && queryName.includes(cookie.name);
        });
        store.set(name, cookies);
    });
    const setCookies = (cookies) => {
        const formatCookies = cookies.map((cookie) => {
            return {
                domain: cookie.domain,
                expirationDate: cookie.expirationDate,
                hostOnly: cookie.hostOnly,
                httpOnly: cookie.httpOnly,
                name: cookie.name,
                path: cookie.path,
                sameSite: cookie.sameSite,
                secure: cookie.secure,
                value: cookie.value,
            };
        });
        formatCookies.forEach((cookie) => {
            GM_cookie.set(cookie);
        });
    };

    const getUserType = () => __awaiter(void 0, void 0, void 0, function* () {
        const resp = yield fetch("//api.bilibili.com/x/web-interface/nav", { method: "Get", credentials: "include" });
        const result = yield resp.json();
        return result.data;
    });
    const cookiesReady = () => {
        const { userCookie, vipCookie } = getStoreCookies();
        return !!userCookie && !!vipCookie;
    };
    const initialize = () => __awaiter(void 0, void 0, void 0, function* () {
        // 初始化tampermonkey store & 状态
        store.initStore();
        // 获取登录状态
        const { face, isLogin, vipStatus } = yield getUserType();
        if (!isLogin)
            return;
        const storeKey = ["SESSDATA", "DedeUserID", "DedeUserID__ckMd5"];
        const { vipCookie, userCookie } = getStoreCookies();
        store.set("cookiesReady", cookiesReady());
        if (store.get("cookiesReady"))
            return setCookies(userCookie);
        console.log(store.get("cookiesReady"));
        const reload = () => window.location.reload();
        if (vipStatus) {
            // vip用户
            store.set("face", face);
            if (userCookie) {
                // 登录为vip用户并且储存了userCookie
                storeCookies("vipCookie", storeKey).then(() => {
                    reload();
                });
            }
            else {
                // 登录为vip用户且未储存userCookie
                storeCookies("vipCookie", storeKey).then(() => {
                    removeCookies().then(() => {
                        reload();
                    });
                });
            }
        }
        else {
            // 普通用户
            if (vipCookie) {
                // 登录为普通用户并且储存了vipCookie
                storeCookies("userCookie", storeKey).then(() => {
                    reload();
                });
            }
            else {
                // 登录为普通用户且未储存vipCookie
                storeCookies("userCookie", storeKey).then(() => {
                    removeCookies().then(() => {
                        reload();
                    });
                });
            }
        }
    });

    const sleep = (time = 1) => new Promise((resolve) => setTimeout(resolve, 1000 * time));
    const createElement = (str) => {
        const el = document.createElement("div");
        el.innerHTML = str;
        return el.firstElementChild;
    };
    const deleteAllValue = () => GM_listValues().forEach((v) => GM_deleteValue(v));

    const XHR = unsafeWindow.XMLHttpRequest;
    const xhrInstance = new unsafeWindow.XMLHttpRequest();
    const proxyAjax = (proxyMap) => {
        // 参数校验
        if (proxyMap == null) {
            throw new TypeError("proxyMap can not be undefined or null");
        }
        const xhrCache = {};
        // 代理 XMLHttpRequest 对象
        const proxy = new Proxy(unsafeWindow.XMLHttpRequest, {
            // 代理 new 操作符
            construct(Target) {
                const xhr = new Target();
                // 代理 XMLHttpRequest 对象实例
                const xhrProxy = new Proxy(xhr, {
                    // 代理 读取属性 操作
                    get(target, p, receiver) {
                        let type = "";
                        try {
                            type = typeof xhrInstance[p]; // 在某些浏览器可能会抛出错误
                        }
                        catch (error) {
                            console.error(error);
                            return target[p];
                        }
                        const value = target[p];
                        const proxyValue = proxyMap[p];
                        // 代理一些属性诸如 response, responseText...
                        if (type !== "function") {
                            // 通过缓存属性值进 _xxx，代理一些 只读属性
                            const v = xhrCache.hasOwnProperty(`_${p.toString()}`)
                                ? xhrCache[`_${p.toString()}`]
                                : target[p];
                            const attrGetterProxy = (proxyValue || {})["getter"];
                            if (typeof attrGetterProxy === "function") {
                                return attrGetterProxy.call(target, v, receiver);
                            }
                            else {
                                return v;
                            }
                        }
                        // 代理一些属性诸如 open, send...
                        return (...args) => {
                            var _a;
                            const next = () => value.call(target, ...args);
                            if (p === "open") {
                                receiver.method = args[0];
                                receiver.url = args[1];
                            }
                            if (proxyValue) {
                                if (p === "send") {
                                    return (_a = proxyValue) === null || _a === void 0 ? void 0 : _a.call(target, args, receiver, next);
                                }
                                else {
                                    proxyValue.call(target, args, receiver);
                                }
                            }
                            return next();
                        };
                    },
                    // 代理 设置属性值 操作
                    set(target, p, value, receiver) {
                        const type = typeof xhrInstance[p];
                        const proxyValue = proxyMap[p];
                        // 禁止修改一些原生方法如 open,send...
                        if (type === "function")
                            return true;
                        // 代理一些事件属性诸如 onreadystatechange,onload...
                        if (typeof proxyValue === "function") {
                            target[p] = () => {
                                proxyValue.call(target, receiver) || value.call(receiver);
                            };
                        }
                        else {
                            // 代理一些属性如 response, responseText
                            const attrSetterProxy = (proxyValue || {})["setter"];
                            try {
                                target[p] =
                                    (typeof attrSetterProxy === "function" &&
                                        attrSetterProxy.call(target, value, receiver)) ||
                                        (typeof value === "function" ? value.bind(receiver) : value);
                            }
                            catch (error) {
                                // 代理只读属性是会抛出错误
                                if (attrSetterProxy === true) {
                                    // 如果该 只读属性 的 代理setter 为 true
                                    // 将 value 缓存进 _xxx
                                    xhrCache[`_${p.toString()}`] = value;
                                }
                                else {
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
    };
    /**
     * @description 取消代理 Ajax 的方法，调用这个方法取消代理原生 XMLHttpRequest 对象
     * @author Lazy Duke
     * @date 2019-10-27
     * @returns
     */
    const unProxyAjax = () => {
        unsafeWindow["XMLHttpRequest"] = XHR;
    };

    // 监听登录&reload
    const reloadByLogin = (url) => {
        if (url.includes("/passport-login/web/")) {
            console.log("login reload");
            sleep(1).then(() => window.location.reload());
        }
    };
    // 监听登出&reload
    const listenLogout = (url) => {
        if (url.includes("/login/exit/")) {
            store.remove("userCookie");
            removeCookies().then(() => window.location.reload());
        }
    };
    // 判断主要链接
    const handleUrl = (url) => {
        const includes = [
            // bangumi
            "api.bilibili.com/pgc/player/web/playurl",
            // video
            "api.bilibili.com/x/player/playurl",
            "api.bilibili.com/x/player/v2",
        ];
        const excludes = ["data.bilibili.com"];
        for (let i = 0; i < excludes.length; ++i) {
            if (url.includes(excludes[i]))
                return false;
        }
        for (let i = 0; i < includes.length; ++i) {
            if (url.includes(includes[i]))
                return true;
        }
        return false;
    };
    const listenerAjax = () => __awaiter(void 0, void 0, void 0, function* () {
        const { vipCookie, userCookie } = getStoreCookies();
        const proxySettings = {
            open: (_args, xhr) => {
                reloadByLogin(xhr.url);
                listenLogout(xhr.url);
            },
            send: (_args, xhr, next) => {
                if (handleUrl(xhr.url) && store.get("cookiesReady"))
                    setCookies(vipCookie);
                next();
            },
            onloadend: () => {
                if (store.get("cookiesReady"))
                    setCookies(userCookie);
            }
        };
        proxyAjax(proxySettings);
    });

    const lockQuality = (quality) => {
        const bilibiliPlayerSettings = localStorage.getItem("bilibili_player_settings");
        if (bilibiliPlayerSettings) {
            const bilibiliPlayerSettingsParse = JSON.parse(bilibiliPlayerSettings);
            bilibiliPlayerSettingsParse.setting_config.defquality = Number(quality);
            localStorage.setItem("bilibili_player_settings", JSON.stringify(bilibiliPlayerSettingsParse));
        }
    };

    const unlockVideo = () => {
        let PGC;
        Object.defineProperty(unsafeWindow, "__PGC_USERSTATE__", {
            set(value) {
                PGC = Object.assign(Object.assign({}, value), { area_limit: 0, ban_area_show: 1, follow: 1, follow_status: 2, login: 1, pay: 1, pay_pack_paid: 0, sponsor: 0, vip_info: {
                        due_date: 0,
                        status: 1,
                        type: 2,
                    } });
                delete PGC.dialog;
            },
            get() {
                return PGC;
            },
        });
        Object.defineProperty(unsafeWindow, "__playinfo__", {
            configurable: true,
            set(value) {
                var _a;
                const highQuality = (_a = (value.result || value.data)) === null || _a === void 0 ? void 0 : _a.accept_quality[0].toString();
                if (highQuality) {
                    lockQuality(highQuality);
                }
            },
            get() {
                return {};
            },
        });
    };

    const container = document.createElement("div");
    function avatar() {
        const face = store.get("face");
        if (!face)
            return;
        const html = createElement(`<div id="joybook-avatar">
	<img src=${face}></img>
	</div>`);
        if (html)
            container.appendChild(html);
    }
    function handleEvent() {
        const delay = 1500;
        let timeout;
        const onMouseEnter = () => {
            if (timeout)
                window.clearTimeout(timeout);
            container.style.transform = "translateX(50px)";
        };
        const onMouseLeave = () => {
            timeout = window.setTimeout(() => {
                container.style.transform = "translateX(0px)";
            }, delay);
        };
        const onDeleteClick = () => __awaiter(this, void 0, void 0, function* () {
            const result = window.confirm("确定要删除脚本数据吗？");
            if (!result)
                return;
            unProxyAjax();
            deleteAllValue();
            yield removeCookies();
            window.location.reload();
        });
        container.addEventListener("mouseenter", onMouseEnter);
        container.addEventListener("mouseleave", onMouseLeave);
        container.addEventListener("click", onDeleteClick);
    }
    function createContainer() {
        container.id = "joybook-container";
        document.body.appendChild(container);
        avatar();
        handleEvent();
    }
    const settings = () => {
        createContainer();
    };

    // 解锁会员限制
    unlockVideo();
    // 初始化用户数据&储存cookies
    initialize();
    // 监听XHR
    listenerAjax();
    window.addEventListener("load", () => {
        Promise.resolve().then(function () { return global; });
        // 渲染设定
        settings();
    });

    function styleInject(css, ref) {
      if ( ref === void 0 ) ref = {};
      var insertAt = ref.insertAt;

      if (!css || typeof document === 'undefined') { return; }

      var head = document.head || document.getElementsByTagName('head')[0];
      var style = document.createElement('style');
      style.type = 'text/css';

      if (insertAt === 'top') {
        if (head.firstChild) {
          head.insertBefore(style, head.firstChild);
        } else {
          head.appendChild(style);
        }
      } else {
        head.appendChild(style);
      }

      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
    }

    var css_248z = ".d-none {\n  display: none;\n}\n\n.button {\n  display: flex;\n  min-width: 32px;\n  min-height: 32px;\n  border-radius: 50%;\n  overflow: hidden;\n  border: 2px solid #8a8a8a;\n  cursor: pointer;\n}\n\n#joybook-container {\n  z-index: 99;\n  width: 48px;\n  height: 48px;\n  position: fixed;\n  bottom: 30px;\n  left: -30px;\n  transition: 0.3s ease-in-out;\n}\n\n#joybook-settings {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n}\n\n#joybook-avatar {\n  position: relative;\n  cursor: pointer;\n  overflow: hidden;\n  border-radius: 50%;\n  background-color: #888888;\n  border: 4px solid #fb7299;\n  opacity: 1;\n  width: 100%;\n  height: 100%;\n}\n#joybook-avatar > img {\n  width: 100%;\n  height: 100%;\n}\n\n#settings-options-container {\n  position: relative;\n}\n#settings-options-container > * {\n  margin: 6px 0;\n}";
    var stylesheet=".d-none {\n  display: none;\n}\n\n.button {\n  display: flex;\n  min-width: 32px;\n  min-height: 32px;\n  border-radius: 50%;\n  overflow: hidden;\n  border: 2px solid #8a8a8a;\n  cursor: pointer;\n}\n\n#joybook-container {\n  z-index: 99;\n  width: 48px;\n  height: 48px;\n  position: fixed;\n  bottom: 30px;\n  left: -30px;\n  transition: 0.3s ease-in-out;\n}\n\n#joybook-settings {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n}\n\n#joybook-avatar {\n  position: relative;\n  cursor: pointer;\n  overflow: hidden;\n  border-radius: 50%;\n  background-color: #888888;\n  border: 4px solid #fb7299;\n  opacity: 1;\n  width: 100%;\n  height: 100%;\n}\n#joybook-avatar > img {\n  width: 100%;\n  height: 100%;\n}\n\n#settings-options-container {\n  position: relative;\n}\n#settings-options-container > * {\n  margin: 6px 0;\n}";
    styleInject(css_248z);

    var global = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': css_248z,
        stylesheet: stylesheet
    });

})();
//# sourceMappingURL=joybook.user.js.map
