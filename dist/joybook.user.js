// ==UserScript==
// @name          bilibili-joybook
// @version       0.0.8
// @description   共享大会员
// @author        PC6live
// @namespace     https://github.com/PC6live/bilibili-joybook-tampermonkey
// @match         *://*.bilibili.com/*
// @exclude       *://passport.bilibili.com/*
// @homepage      https://github.com/PC6live/bilibili-joybook-tampermonkey
// @supportURL    https://github.com/PC6live/bilibili-joybook-tampermonkey/issues
// @license       MIT
// @grant         GM_cookie
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_addStyle
// @grant         GM_deleteValue
// @grant         GM_getTab
// @grant         GM_getTabs
// @grant         GM_listValues
// @grant         GM_saveTab
// @grant         GM_xmlhttpRequest
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
    const getCookie = (key) => {
        return new Promise((resolve) => {
            GM_cookie.list({}, (cookies) => resolve(cookies.find((c) => c.name === key)));
        });
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
    function cookieToString(cookies) {
        return cookies.map(v => `${v.name}=${v.value}`).join("; ");
    }

    /** 获取用户数据 */
    const userInfoURL$1 = "//api.bilibili.com/x/web-interface/nav";
    // TODO: 检测会员Cookie 是否失效
    const getUserType = () => __awaiter(void 0, void 0, void 0, function* () {
        const resp = yield fetch(userInfoURL$1, { method: "get", credentials: "include" });
        const result = yield resp.json();
        return result.data;
    });
    const cookiesReady = () => {
        const { userCookie, vipCookie } = getStoreCookies();
        return !!userCookie && !!vipCookie;
    };
    function handleLogin(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const storeKey = ["SESSDATA", "DedeUserID", "DedeUserID__ckMd5"];
            store.remove(key);
            yield storeCookies(key, storeKey);
            store.set("cookiesReady", cookiesReady());
            const ready = store.get("cookiesReady");
            const { userCookie } = getStoreCookies();
            if (!ready) {
                removeCookies();
            }
            else {
                setCookies(userCookie);
            }
            window.location.reload();
        });
    }
    const initialize = () => __awaiter(void 0, void 0, void 0, function* () {
        // 获取登录状态
        const { isLogin, vipStatus } = yield getUserType();
        if (!isLogin || store.get("cookiesReady"))
            return;
        console.log(vipStatus);
        if (vipStatus) {
            // vip用户
            handleLogin("vipCookie");
        }
        else {
            // 普通用户
            handleLogin("userCookie");
        }
    });

    const sleep = (time = 1) => new Promise((resolve) => setTimeout(resolve, 1000 * time));
    const createElement = (str) => {
        const el = document.createElement("div");
        el.innerHTML = str;
        return el.firstElementChild;
    };
    const deleteAllValue = () => GM_listValues().forEach((v) => GM_deleteValue(v));

    const realXHR = "_xhr";
    function setValue(arg, key, value) {
        arg[key] = value;
    }
    function proxy(proxy, win) {
        win = win || window;
        win[realXHR] = win[realXHR] || win.XMLHttpRequest;
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
        function setConfig(receiver, p, args) {
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
        const getterFactory = (target, p, receiver) => {
            var _a, _b;
            const value = target[p];
            const hook = proxy[p];
            const type = typeof value;
            if (type === "function") {
                return (...args) => {
                    const next = () => value.call(target, ...args);
                    setConfig(receiver, p, args);
                    return (hook === null || hook === void 0 ? void 0 : hook.call(receiver, target, args)) || next();
                };
            }
            else {
                const v = ((_a = target === null || target === void 0 ? void 0 : target.cache) === null || _a === void 0 ? void 0 : _a[`_${p}`]) || value;
                const attrGetterProxy = (_b = hook === null || hook === void 0 ? void 0 : hook["getter"]) === null || _b === void 0 ? void 0 : _b.call(receiver, target, value);
                return attrGetterProxy || v;
            }
        };
        const setterFactory = (target, p, value, receiver) => {
            var _a;
            const hook = proxy[p];
            if (typeof target[p] === "function")
                return true;
            if (typeof hook === "function") {
                setValue(target, p, (e) => {
                    const event = Object.assign({}, e);
                    event.target = event.currentTarget = receiver;
                    hook.call(receiver, target, event) || value.call(receiver, event);
                });
            }
            else {
                const attrSetterProxy = (_a = hook === null || hook === void 0 ? void 0 : hook["setter"]) === null || _a === void 0 ? void 0 : _a.call(receiver, target, value);
                const attrValue = typeof value === "function" ? value.bind(receiver) : value;
                try {
                    setValue(target, p, attrSetterProxy || attrValue);
                }
                catch (_b) {
                    // 缓存只读属性
                    if (!target.cache)
                        target.cache = {};
                    target.cache[`_${p}`] = value;
                }
            }
            return true;
        };
    }
    function unProxy(win) {
        win = win || window;
        if (win[realXHR])
            win.XMLHttpRequest = win[realXHR];
        win[realXHR] = undefined;
    }

    let next = true;
    // // 监听登录&reload
    const reloadByLogin = (url) => {
        if (url.includes("/passport-login/web/login")) {
            console.log("login reload");
            sleep(1).then(() => window.location.reload());
        }
    };
    // // 监听登出&reload
    const listenLogout = (url) => {
        if (url.includes("/login/exit/")) {
            store.remove("userCookie");
            console.log("logout reload");
            removeCookies().then(() => window.location.reload());
        }
    };
    // // 判断主要链接
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
    function changeResponse(xhr) {
        const { vipCookie } = getStoreCookies();
        GM_xmlhttpRequest({
            method: xhr.method,
            url: xhr.url,
            anonymous: true,
            cookie: cookieToString(vipCookie),
            headers: {
                referer: window.location.href
            },
            onreadystatechange: (resp) => {
                if (resp.readyState === 4) {
                    xhr.open(xhr.method, xhr.url, xhr.async !== false, xhr.user, xhr.password);
                    xhr.send(xhr.body);
                    this.response = resp.response;
                    this.responseText = resp.responseText;
                    next = false;
                }
            },
        });
    }
    const listenerAjax = () => __awaiter(void 0, void 0, void 0, function* () {
        const config = {
            open(xhr) {
                const ready = store.get("cookiesReady");
                reloadByLogin(xhr.url);
                listenLogout(xhr.url);
                if (handleUrl(xhr.url) && ready) {
                    next = true;
                    changeResponse.call(this, xhr);
                }
                else {
                    next = false;
                }
                return next;
            },
            send() {
                return next;
            },
            setRequestHeader() {
                return next;
            },
        };
        proxy(config, unsafeWindow);
    });

    const lockQuality = (quality) => __awaiter(void 0, void 0, void 0, function* () {
        const bilibili_player_settings = localStorage.getItem("bilibili_player_settings");
        const bpx_player_profile = localStorage.getItem("bpx_player_profile");
        if (bilibili_player_settings) {
            const parse = JSON.parse(bilibili_player_settings);
            parse.setting_config.defquality = quality;
            localStorage.setItem("bilibili_player_settings", JSON.stringify(parse));
        }
        if (bpx_player_profile) {
            const parse = JSON.parse(bpx_player_profile);
            parse.media.quality = quality;
            localStorage.setItem("bpx_player_profile", JSON.stringify(parse));
        }
        let qualityCookie = yield getCookie("CURRENT_QUALITY");
        const date = new Date();
        if (!qualityCookie) {
            qualityCookie = {
                domain: ".bilibili.com",
                expirationDate: new Date(date.getFullYear() + 1, date.getMonth(), date.getDate()).getTime(),
                hostOnly: false,
                httpOnly: false,
                name: "CURRENT_QUALITY",
                path: "/",
                sameSite: "unspecified",
                secure: false,
                session: false,
                value: quality.toString(),
            };
        }
        GM_cookie.set(qualityCookie);
    });

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
                const highQuality = (_a = (value.result || value.data)) === null || _a === void 0 ? void 0 : _a.accept_quality[0];
                if (highQuality)
                    lockQuality(highQuality);
            },
            get() {
                return {};
            },
        });
    };

    /** 头像容器 */
    const container = document.createElement("div");
    /** 获取用户数据 */
    const userInfoURL = "//api.bilibili.com/x/web-interface/nav";
    // TODO: 切换用户
    function avatar() {
        const { userCookie, vipCookie } = getStoreCookies();
        const cookie = vipCookie || userCookie;
        if (!cookie)
            return;
        GM_xmlhttpRequest({
            url: userInfoURL,
            cookie: cookieToString(cookie),
            anonymous: true,
            onload(resp) {
                const result = JSON.parse(resp.response);
                const { face, vipStatus } = result.data;
                const avatarClass = vipStatus ? "joybook-avatar" : "joybook-avatar user";
                const html = createElement(`<div class="${avatarClass}">
        <img src=${face}></img>
        </div>`);
                if (html)
                    container.appendChild(html);
            },
        });
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
            unProxy(unsafeWindow);
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

    var css_248z = ".d-none {\n  display: none;\n}\n\n.button {\n  display: flex;\n  min-width: 32px;\n  min-height: 32px;\n  border-radius: 50%;\n  overflow: hidden;\n  border: 2px solid rgb(138, 138, 138);\n  cursor: pointer;\n}\n\n#joybook-container {\n  z-index: 99;\n  width: 48px;\n  height: 48px;\n  position: fixed;\n  bottom: 30px;\n  left: -30px;\n  transition: 0.3s ease-in-out;\n}\n\n#joybook-settings {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n}\n\n.joybook-avatar {\n  box-sizing: border-box;\n  position: relative;\n  cursor: pointer;\n  overflow: hidden;\n  border-radius: 50%;\n  background-color: rgb(136, 136, 136);\n  border: 4px solid #fb7299;\n  opacity: 1;\n  width: 100%;\n  height: 100%;\n}\n.joybook-avatar > img {\n  width: 100%;\n  height: 100%;\n}\n.joybook-avatar.user {\n  border: 4px solid #47b5ff;\n}\n\n#settings-options-container {\n  position: relative;\n}\n#settings-options-container > * {\n  margin: 6px 0;\n}";
    var stylesheet=".d-none {\n  display: none;\n}\n\n.button {\n  display: flex;\n  min-width: 32px;\n  min-height: 32px;\n  border-radius: 50%;\n  overflow: hidden;\n  border: 2px solid rgb(138, 138, 138);\n  cursor: pointer;\n}\n\n#joybook-container {\n  z-index: 99;\n  width: 48px;\n  height: 48px;\n  position: fixed;\n  bottom: 30px;\n  left: -30px;\n  transition: 0.3s ease-in-out;\n}\n\n#joybook-settings {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n}\n\n.joybook-avatar {\n  box-sizing: border-box;\n  position: relative;\n  cursor: pointer;\n  overflow: hidden;\n  border-radius: 50%;\n  background-color: rgb(136, 136, 136);\n  border: 4px solid #fb7299;\n  opacity: 1;\n  width: 100%;\n  height: 100%;\n}\n.joybook-avatar > img {\n  width: 100%;\n  height: 100%;\n}\n.joybook-avatar.user {\n  border: 4px solid #47b5ff;\n}\n\n#settings-options-container {\n  position: relative;\n}\n#settings-options-container > * {\n  margin: 6px 0;\n}";
    styleInject(css_248z);

    var global = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': css_248z,
        stylesheet: stylesheet
    });

})();
//# sourceMappingURL=joybook.user.js.map
