// ==UserScript==
// @name          bilibili-joybook
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
// @connect       bilibili.com
// @version       0.0.12
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
    /* global Reflect, Promise */


    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    const set = (key, value) => {
        GM_setValue(key, value);
    };
    const get = (key, defaultValue) => {
        return GM_getValue(key, defaultValue);
    };
    const del = (key) => {
        GM_deleteValue(key);
    };

    const getStoreCookies = () => ({ userCookie: get("userCookie"), vipCookie: get("vipCookie") });
    function cookieList(detail = { domain: ".bilibili.com" }) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => GM_cookie.list(detail, (cookies) => resolve(cookies)));
        });
    }
    function cookieDelete(detail) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => GM_cookie.delete(detail, () => resolve()));
        });
    }
    function cookieSet(detail) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => GM_cookie.set(detail, () => resolve()));
        });
    }
    function removeCookies() {
        return __awaiter(this, void 0, void 0, function* () {
            const cookies = yield cookieList();
            for (const cookie of cookies) {
                yield cookieDelete({ name: cookie.name });
            }
        });
    }
    function storeCookies(storeName, keys) {
        return __awaiter(this, void 0, void 0, function* () {
            del(storeName);
            const cookies = (yield cookieList()).filter((cookie) => keys.includes(cookie.name));
            set(storeName, cookies);
        });
    }
    function setCookies(cookies) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const cookie of cookies) {
                yield cookieSet(cookie);
            }
        });
    }
    function cookieToString(cookies) {
        return cookies.map((v) => `${v.name}=${v.value}`).join("; ");
    }

    const sleep = (time = 1) => new Promise((resolve) => setTimeout(resolve, 1000 * time));
    const createElement = (str) => {
        const el = document.createElement("div");
        el.innerHTML = str;
        return el.firstElementChild;
    };
    const deleteAllValue = () => GM_listValues().forEach((v) => GM_deleteValue(v));
    const printMessage = (message) => {
        console.log(`Tampermonkey: ${message}`);
    };
    function cookiesReady() {
        const { userCookie, vipCookie } = getStoreCookies();
        return !!userCookie && !!vipCookie;
    }

    const USER_INFO_URL = "https://api.bilibili.com/x/web-interface/nav";

    const getUserType = () => __awaiter(void 0, void 0, void 0, function* () {
        const resp = yield fetch(USER_INFO_URL, { method: "get", credentials: "include" });
        const result = yield resp.json();
        return result.data;
    });
    function handleLogin(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const storeKey = ["SESSDATA", "DedeUserID", "DedeUserID__ckMd5", "bili_jct"];
            yield storeCookies(key, storeKey);
            const { userCookie } = getStoreCookies();
            yield removeCookies();
            if (cookiesReady())
                yield setCookies(userCookie);
            window.location.reload();
        });
    }
    function initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            // 获取登录状态
            const { isLogin, vipStatus } = yield getUserType();
            if (!isLogin || cookiesReady())
                return;
            const user = vipStatus ? "vipCookie" : "userCookie";
            yield handleLogin(user);
        });
    }

    const REAL_XHR = "_xhr";
    function setValue(arg, key, value) {
        arg[key] = value;
    }
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
    function proxy(proxy, win = unsafeWindow) {
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
        const getterFactory = (target, p, receiver) => {
            var _a, _b;
            const value = target[p];
            const hook = proxy[p];
            const type = typeof instance[p];
            if (type === "function") {
                return (...args) => {
                    const next = () => value.call(target, ...args);
                    setConfig(receiver, p, args);
                    return (hook === null || hook === void 0 ? void 0 : hook.call(receiver, target, args)) || next();
                };
            }
            const v = ((_a = target === null || target === void 0 ? void 0 : target.cache) === null || _a === void 0 ? void 0 : _a[`_${p}`]) || value;
            const attrGetterProxy = (_b = hook === null || hook === void 0 ? void 0 : hook["getter"]) === null || _b === void 0 ? void 0 : _b.call(receiver, target, value);
            return attrGetterProxy || v;
        };
        const setterFactory = (target, p, value, receiver) => {
            var _a;
            const hook = proxy[p];
            if (typeof instance[p] === "function")
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
    function unProxy(win = unsafeWindow) {
        win = win || window;
        if (win[REAL_XHR])
            win.XMLHttpRequest = win[REAL_XHR];
        win[REAL_XHR] = undefined;
    }

    // // 监听登录&reload
    const reloadByLogin = (url) => {
        if (url.includes("/passport-login/web/login")) {
            printMessage("login reload");
            sleep(1).then(() => window.location.reload());
        }
    };
    // // 监听登出&reload
    const listenLogout = (url) => {
        if (url.includes("/login/exit/")) {
            del("userCookie");
            printMessage("logout reload");
            removeCookies().then(() => window.location.reload());
        }
    };
    // // 判断主要链接
    const handleUrl = (url) => {
        const includes = [
            // bangumi
            "/pgc/player/web/v2/playurl",
            "/pgc/player/web/playurl",
            "/pgc/view/web/season",
            // video
            "/player/playurl",
            "/player/v2",
            // video wbi
            "/player/wbi/playurl",
            "/player/wbi/v2"
        ];
        const excludes = ["data.bilibili.com"];
        if (excludes.findIndex((v) => url.includes(v)) > -1) {
            return false;
        }
        if (includes.findIndex((v) => url.includes(v)) > -1) {
            return true;
        }
        return false;
    };
    function requestHandle(xhr) {
        xhr.open(xhr.method, xhr.url, xhr.async !== false, xhr.user, xhr.password);
        for (const key in xhr.headers) {
            xhr.setRequestHeader(key, xhr.headers[key]);
        }
        xhr.send(xhr.body);
    }
    function changeResponse(xhr) {
        const { vipCookie } = getStoreCookies();
        const url = new URL(xhr.url, window.location.href);
        xhr.url = url.href;
        GM_xmlhttpRequest({
            method: xhr.method,
            url: xhr.url,
            anonymous: true,
            cookie: cookieToString(vipCookie),
            headers: {
                referer: window.location.href,
            },
            onreadystatechange: (resp) => {
                if (resp.readyState === 4) {
                    requestHandle(xhr);
                    this.response = resp.response;
                    this.responseText = resp.responseText;
                }
            },
        });
    }
    function listenerAjax() {
        const ready = cookiesReady();
        const config = {
            open(xhr) {
                reloadByLogin(xhr.url);
                listenLogout(xhr.url);
                if (handleUrl(xhr.url) && ready) {
                    changeResponse.call(this, xhr);
                    return true;
                }
                return false;
            },
            send(xhr) {
                if (handleUrl(xhr.url) && ready) {
                    return true;
                }
                return false;
            },
            setRequestHeader(xhr) {
                if (handleUrl(xhr.url) && ready) {
                    return true;
                }
                return false;
            },
        };
        proxy(config, unsafeWindow);
    }

    // 解除非会员点击切换画质限制
    function unlockVideo() {
        document.addEventListener("readystatechange", () => {
            const vip_info_iterator = document.evaluate("//script[contains(., 'vip_info')]", document, null, XPathResult.ANY_TYPE, null);
            try {
                let node = vip_info_iterator.iterateNext();
                while (node) {
                    if (node && node.textContent) {
                        const vipStatusReg = new RegExp(/"vip_status.*?,/g);
                        const vipTypeReg = new RegExp(/"vip_type.*?,/g);
                        const vipInfoReg = new RegExp(/"vip_info.*?\}/g);
                        const vipInfo = `"vip_info":{"is_vip":true,"due_date":0,"status":1,"type":2}`;
                        const vipStatus = `"vip_status":1,`;
                        const vipType = `"vip_type":2,`;
                        node.textContent = node.textContent.replace(vipStatusReg, vipStatus);
                        node.textContent = node.textContent.replace(vipTypeReg, vipType);
                        node.textContent = node.textContent.replace(vipInfoReg, vipInfo);
                    }
                    node = vip_info_iterator.iterateNext();
                }
            }
            catch (e) {
                console.log("Error: Document tree modified during iteration " + e);
            }
        });
    }

    // TODO: 添加快速切换会员账户，用于脚本失效场景。
    /** 头像容器 */
    const container = document.createElement("div");
    function avatar() {
        const { userCookie, vipCookie } = getStoreCookies();
        const cookie = vipCookie || userCookie;
        GM_xmlhttpRequest({
            url: USER_INFO_URL,
            cookie: cookie && cookieToString(cookie),
            anonymous: true,
            headers: {
                referer: window.location.href,
            },
            onload(resp) {
                const { face, vipStatus } = JSON.parse(resp.response).data;
                const avatarClass = vipStatus ? "joybook-avatar" : "joybook-avatar user";
                const img = face ? `<img src=${face}></img>` : "";
                const html = createElement(`
          <div class="${avatarClass}">
            ${img}
          </div>
        `);
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
    function createAvatar() {
        window.addEventListener("load", () => {
            // 渲染设定
            container.id = "joybook-container";
            document.body.appendChild(container);
            avatar();
            handleEvent();
        });
    }

    function setQuality(quality) {
        return __awaiter(this, void 0, void 0, function* () {
            let qualityCookie = (yield cookieList({ name: "CURRENT_QUALITY" }))[0];
            if (!qualityCookie) {
                qualityCookie = {
                    domain: ".bilibili.com",
                    hostOnly: false,
                    httpOnly: false,
                    name: "CURRENT_QUALITY",
                    path: "/",
                    sameSite: "unspecified",
                    secure: false,
                    session: false,
                    value: quality,
                };
            }
            else {
                qualityCookie.value = quality;
            }
            GM_cookie.set(qualityCookie);
        });
    }
    function highQuality() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // 处理 video 画质
            Object.defineProperty(unsafeWindow, "__playinfo__", {
                configurable: true,
                set(value) {
                    var _a;
                    const quality = (_a = (value.result || value.data)) === null || _a === void 0 ? void 0 : _a.accept_quality[0];
                    if (quality)
                        setQuality(quality);
                },
                get() {
                    return {};
                },
            });
            // FIXME: 处理 bangumi 画质
            if (window.location.pathname.includes("bangumi")) {
                const search = new URLSearchParams(window.location.search);
                const url = `https://api.bilibili.com/pgc/player/web/playurl?fnver=0&fnval=4048&ep_id=${(_a = search.get("videoId")) === null || _a === void 0 ? void 0 : _a.slice(2)}`;
                const resp = yield (yield fetch(url)).json();
                const quality = resp.result.accept_quality[0];
                setQuality(quality);
            }
        });
    }

    function removeTips() {
        window.addEventListener("DOMContentLoaded", () => {
            var _a;
            const tips = document.querySelector(".adblock-tips");
            (_a = tips === null || tips === void 0 ? void 0 : tips.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(tips);
        });
    }

    Promise.resolve().then(function () { return global; });
    (() => {
        const ready = cookiesReady();
        if (ready) {
            printMessage("白嫖");
        }
        else {
            printMessage("请按照操作说明 https://github.com/PC6live/bilibili-joybook-tampermonkey#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9 登录账号");
        }
        // 解锁会员限制
        unlockVideo();
        // 自动设置最高画质
        highQuality();
        // 初始化用户数据&储存cookies
        initialize();
        // 监听XHR
        listenerAjax();
        // 创建头像
        createAvatar();
        // 移除提示
        removeTips();
    })();

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
    styleInject(css_248z);

    var global = /*#__PURE__*/Object.freeze({
        __proto__: null
    });

})();
//# sourceMappingURL=joybook.user.js.map
