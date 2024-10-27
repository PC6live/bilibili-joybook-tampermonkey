// ==UserScript==
// @name         bilibili-joybook
// @namespace    https://github.com/PC6live/bilibili-joybook-tampermonkey
// @version      0.0.14
// @author       PC6live
// @description  共享大会员
// @license      MIT
// @homepage     https://github.com/PC6live/bilibili-joybook-tampermonkey
// @supportURL   https://github.com/PC6live/bilibili-joybook-tampermonkey/issues
// @match        *://*.bilibili.com/*
// @exclude      *://passport.bilibili.com/*
// @connect      bilibili.com
// @grant        GM_addStyle
// @grant        GM_cookie
// @grant        GM_deleteValue
// @grant        GM_getTab
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_saveTab
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @noframes
// ==/UserScript==

(o=>{if(typeof GM_addStyle=="function"){GM_addStyle(o);return}const t=document.createElement("style");t.textContent=o,document.head.append(t)})(" .d-none{display:none}.button{display:flex;min-width:32px;min-height:32px;border-radius:50%;overflow:hidden;border:2px solid rgb(138,138,138);cursor:pointer}#joybook-container{z-index:99;width:48px;height:48px;position:fixed;bottom:30px;left:-30px;transition:.3s ease-in-out}#joybook-settings{position:relative;display:flex;flex-direction:column;justify-content:center;align-items:center}.joybook-avatar{box-sizing:border-box;position:relative;cursor:pointer;overflow:hidden;border-radius:50%;background-color:#888;border:4px solid #fb7299;opacity:1;width:100%;height:100%}.joybook-avatar>img{width:100%;height:100%}.joybook-avatar.user{border:4px solid #47b5ff}#settings-options-container{position:relative}#settings-options-container>*{margin:6px 0} ");

(function () {
  'use strict';

  var _GM_cookie = /* @__PURE__ */ (() => typeof GM_cookie != "undefined" ? GM_cookie : void 0)();
  var _GM_deleteValue = /* @__PURE__ */ (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
  var _GM_getTab = /* @__PURE__ */ (() => typeof GM_getTab != "undefined" ? GM_getTab : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_listValues = /* @__PURE__ */ (() => typeof GM_listValues != "undefined" ? GM_listValues : void 0)();
  var _GM_saveTab = /* @__PURE__ */ (() => typeof GM_saveTab != "undefined" ? GM_saveTab : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  const USER_INFO_URL = "https://api.bilibili.com/x/web-interface/nav";
  const get = (key, defaultValue) => {
    return _GM_getValue(key, defaultValue);
  };
  const set = (key, value) => {
    _GM_setValue(key, value);
  };
  const del = (key) => {
    _GM_deleteValue(key);
  };
  const store = {
    get,
    set,
    del,
    getAll: () => {
      const key = _GM_listValues();
      const obj = {};
      key.forEach((v) => {
        obj[v] = _GM_getValue(v);
      });
      return obj;
    }
  };
  const cookie = {
    get: (details = {}) => new Promise(
      (resolve2) => _GM_cookie.list(details, (cookies) => resolve2(cookies))
    ),
    set: async (cookies) => Promise.all(
      cookies.map(
        (v) => new Promise((resolve2) => _GM_cookie.set(v, (error) => resolve2(error)))
      )
    ),
    delete: async (cookies) => Promise.all(
      cookies.map(
        (v) => new Promise(
          (resolve2) => _GM_cookie.delete(v, (error) => resolve2(error))
        )
      )
    ),
    deleteAll: async () => cookie.delete(await cookie.get())
  };
  const sleep = (time = 1) => new Promise((resolve2) => setTimeout(resolve2, 1e3 * time));
  const createElement = (str) => {
    const el = document.createElement("div");
    el.innerHTML = str;
    return el.firstElementChild;
  };
  const deleteAllValue = () => _GM_listValues().forEach((v) => _GM_deleteValue(v));
  const message = (message2) => {
    console.log(`bili-joybook: ${message2}`);
  };
  function cookiesReady() {
    const { userCookie, vipCookie } = store.getAll();
    return !!userCookie && !!vipCookie;
  }
  function cookieToString(cookies) {
    return cookies.map((v) => `${v.name}=${v.value}`).join("; ");
  }
  const container = document.createElement("div");
  function avatar() {
    const { userCookie, vipCookie } = store.getAll();
    const cookie2 = vipCookie || userCookie;
    _GM_xmlhttpRequest({
      url: USER_INFO_URL,
      cookie: cookie2 && cookieToString(cookie2),
      anonymous: true,
      headers: {
        referer: window.location.href
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
        if (html) container.appendChild(html);
      }
    });
  }
  function handleEvent() {
    const delay = 1500;
    let timeout;
    const onMouseEnter = () => {
      if (timeout) window.clearTimeout(timeout);
      container.style.transform = "translateX(50px)";
    };
    const onMouseLeave = () => {
      timeout = window.setTimeout(() => {
        container.style.transform = "translateX(0px)";
      }, delay);
    };
    const onDeleteClick = async () => {
      const result = window.confirm("确定要删除脚本数据吗？");
      if (!result) return;
      deleteAllValue();
      await cookie.deleteAll();
      window.location.reload();
    };
    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mouseleave", onMouseLeave);
    container.addEventListener("click", onDeleteClick);
  }
  const __vite_glob_0_0 = () => {
    window.addEventListener("load", () => {
      container.id = "joybook-container";
      document.body.appendChild(container);
      avatar();
      handleEvent();
    });
  };
  const getUserType = async () => {
    const resp = await fetch(USER_INFO_URL, {
      method: "get",
      credentials: "include"
    });
    const result = await resp.json();
    return result.data;
  };
  async function handleLogin(key) {
    const storeKey = ["SESSDATA", "DedeUserID", "DedeUserID__ckMd5", "bili_jct"];
    const cookies = await cookie.get({ domain: ".bilibili.com" });
    store.set(
      key,
      cookies.filter((v) => storeKey.includes(v.name))
    );
    await cookie.deleteAll();
    const { userCookie, vipCookie } = store.getAll();
    if (userCookie && vipCookie) {
      await cookie.set(userCookie);
    }
    window.location.reload();
  }
  const __vite_glob_0_1 = async () => {
    const { isLogin, vipStatus } = await getUserType();
    if (!isLogin || cookiesReady()) return;
    const user = vipStatus ? "vipCookie" : "userCookie";
    await handleLogin(user);
  };
  var events = ["load", "loadend", "timeout", "error", "readystatechange", "abort"];
  var OriginXhr = "__origin_xhr";
  function configEvent(event, xhrProxy) {
    var e = {};
    for (var attr in event) e[attr] = event[attr];
    e.target = e.currentTarget = xhrProxy;
    return e;
  }
  function hook(proxy2, win) {
    win = win || window;
    var originXhr = win.XMLHttpRequest;
    var hooking = true;
    var HookXMLHttpRequest = function() {
      var xhr = new originXhr();
      for (var i = 0; i < events.length; ++i) {
        var key = "on" + events[i];
        if (xhr[key] === void 0) xhr[key] = null;
      }
      for (var attr in xhr) {
        var type = "";
        try {
          type = typeof xhr[attr];
        } catch (e) {
        }
        if (type === "function") {
          this[attr] = hookFunction(attr);
        } else if (attr !== OriginXhr) {
          Object.defineProperty(this, attr, {
            get: getterFactory(attr),
            set: setterFactory(attr),
            enumerable: true
          });
        }
      }
      var that = this;
      xhr.getProxy = function() {
        return that;
      };
      this[OriginXhr] = xhr;
    };
    HookXMLHttpRequest.prototype = originXhr.prototype;
    HookXMLHttpRequest.prototype.constructor = HookXMLHttpRequest;
    win.XMLHttpRequest = HookXMLHttpRequest;
    Object.assign(win.XMLHttpRequest, { UNSENT: 0, OPENED: 1, HEADERS_RECEIVED: 2, LOADING: 3, DONE: 4 });
    function getterFactory(attr) {
      return function() {
        var originValue = this[OriginXhr][attr];
        if (hooking) {
          var v = this.hasOwnProperty(attr + "_") ? this[attr + "_"] : originValue;
          var attrGetterHook = (proxy2[attr] || {})["getter"];
          return attrGetterHook && attrGetterHook(v, this) || v;
        } else {
          return originValue;
        }
      };
    }
    function setterFactory(attr) {
      return function(v) {
        var xhr = this[OriginXhr];
        if (hooking) {
          var that = this;
          var hook2 = proxy2[attr];
          if (attr.substring(0, 2) === "on") {
            that[attr + "_"] = v;
            xhr[attr] = function(e) {
              e = configEvent(e, that);
              var ret = proxy2[attr] && proxy2[attr].call(that, xhr, e);
              ret || v.call(that, e);
            };
          } else {
            var attrSetterHook = (hook2 || {})["setter"];
            v = attrSetterHook && attrSetterHook(v, that) || v;
            this[attr + "_"] = v;
            try {
              xhr[attr] = v;
            } catch (e) {
            }
          }
        } else {
          xhr[attr] = v;
        }
      };
    }
    function hookFunction(fun) {
      return function() {
        var args = [].slice.call(arguments);
        if (proxy2[fun] && hooking) {
          var ret = proxy2[fun].call(this, args, this[OriginXhr]);
          if (ret) return ret;
        }
        return this[OriginXhr][fun].apply(this[OriginXhr], args);
      };
    }
    function unHook() {
      hooking = false;
      if (win.XMLHttpRequest === HookXMLHttpRequest) {
        win.XMLHttpRequest = originXhr;
        HookXMLHttpRequest.prototype.constructor = originXhr;
        originXhr = void 0;
      }
    }
    return { originXhr, unHook };
  }
  var eventLoad = events[0], eventLoadEnd = events[1], eventTimeout = events[2], eventError = events[3], eventReadyStateChange = events[4], eventAbort = events[5];
  var prototype = "prototype";
  function proxy(proxy2, win) {
    win = win || window;
    return proxyAjax(proxy2, win);
  }
  function trim(str) {
    return str.replace(/^\s+|\s+$/g, "");
  }
  function getEventTarget(xhr) {
    return xhr.watcher || (xhr.watcher = document.createElement("a"));
  }
  function triggerListener(xhr, name) {
    var xhrProxy = xhr.getProxy();
    var callback = "on" + name + "_";
    var event = configEvent({ type: name }, xhrProxy);
    xhrProxy[callback] && xhrProxy[callback](event);
    var evt;
    if (typeof Event === "function") {
      evt = new Event(name, { bubbles: false });
    } else {
      evt = document.createEvent("Event");
      evt.initEvent(name, false, true);
    }
    getEventTarget(xhr).dispatchEvent(evt);
  }
  function Handler(xhr) {
    this.xhr = xhr;
    this.xhrProxy = xhr.getProxy();
  }
  Handler[prototype] = /* @__PURE__ */ Object.create({
    resolve: function resolve(response) {
      var xhrProxy = this.xhrProxy;
      var xhr = this.xhr;
      xhrProxy.readyState = 4;
      xhr.resHeader = response.headers;
      xhrProxy.response = xhrProxy.responseText = response.response;
      xhrProxy.statusText = response.statusText;
      xhrProxy.status = response.status;
      triggerListener(xhr, eventReadyStateChange);
      triggerListener(xhr, eventLoad);
      triggerListener(xhr, eventLoadEnd);
    },
    reject: function reject(error) {
      this.xhrProxy.status = 0;
      triggerListener(this.xhr, error.type);
      triggerListener(this.xhr, eventLoadEnd);
    }
  });
  function makeHandler(next) {
    function sub(xhr) {
      Handler.call(this, xhr);
    }
    sub[prototype] = Object.create(Handler[prototype]);
    sub[prototype].next = next;
    return sub;
  }
  var RequestHandler = makeHandler(function(rq) {
    var xhr = this.xhr;
    rq = rq || xhr.config;
    xhr.withCredentials = rq.withCredentials;
    xhr.open(rq.method, rq.url, rq.async !== false, rq.user, rq.password);
    for (var key in rq.headers) {
      xhr.setRequestHeader(key, rq.headers[key]);
    }
    xhr.send(rq.body);
  });
  var ResponseHandler = makeHandler(function(response) {
    this.resolve(response);
  });
  var ErrorHandler = makeHandler(function(error) {
    this.reject(error);
  });
  function proxyAjax(proxy2, win) {
    var onRequest = proxy2.onRequest, onResponse = proxy2.onResponse, onError = proxy2.onError;
    function getResponseData(xhrProxy) {
      var responseType = xhrProxy.responseType;
      if (!responseType || responseType === "text") {
        return xhrProxy.responseText;
      }
      var response = xhrProxy.response;
      if (responseType === "json" && !response) {
        try {
          return JSON.parse(xhrProxy.responseText);
        } catch (e) {
          console.warn(e);
        }
      }
      return response;
    }
    function handleResponse(xhr, xhrProxy) {
      var handler = new ResponseHandler(xhr);
      var ret = {
        response: getResponseData(xhrProxy),
        status: xhrProxy.status,
        statusText: xhrProxy.statusText,
        config: xhr.config,
        headers: xhr.resHeader || xhr.getAllResponseHeaders().split("\r\n").reduce(function(ob, str) {
          if (str === "") return ob;
          var m = str.split(":");
          ob[m.shift()] = trim(m.join(":"));
          return ob;
        }, {})
      };
      if (!onResponse) return handler.resolve(ret);
      onResponse(ret, handler);
    }
    function onerror(xhr, xhrProxy, error, errorType) {
      var handler = new ErrorHandler(xhr);
      error = { config: xhr.config, error, type: errorType };
      if (onError) {
        onError(error, handler);
      } else {
        handler.next(error);
      }
    }
    function preventXhrProxyCallback() {
      return true;
    }
    function errorCallback(errorType) {
      return function(xhr, e) {
        onerror(xhr, this, e, errorType);
        return true;
      };
    }
    function stateChangeCallback(xhr, xhrProxy) {
      if (xhr.readyState === 4 && xhr.status !== 0) {
        handleResponse(xhr, xhrProxy);
      } else if (xhr.readyState !== 4) {
        triggerListener(xhr, eventReadyStateChange);
      }
      return true;
    }
    var { originXhr, unHook } = hook({
      onload: preventXhrProxyCallback,
      onloadend: preventXhrProxyCallback,
      onerror: errorCallback(eventError),
      ontimeout: errorCallback(eventTimeout),
      onabort: errorCallback(eventAbort),
      onreadystatechange: function(xhr) {
        return stateChangeCallback(xhr, this);
      },
      open: function open(args, xhr) {
        var _this = this;
        var config = xhr.config = { headers: {} };
        config.method = args[0];
        config.url = args[1];
        config.async = args[2];
        config.user = args[3];
        config.password = args[4];
        config.xhr = xhr;
        var evName = "on" + eventReadyStateChange;
        if (!xhr[evName]) {
          xhr[evName] = function() {
            return stateChangeCallback(xhr, _this);
          };
        }
        if (onRequest) return true;
      },
      send: function(args, xhr) {
        var config = xhr.config;
        config.withCredentials = xhr.withCredentials;
        config.body = args[0];
        if (onRequest) {
          var req = function() {
            onRequest(config, new RequestHandler(xhr));
          };
          config.async === false ? req() : setTimeout(req);
          return true;
        }
      },
      setRequestHeader: function(args, xhr) {
        xhr.config.headers[args[0].toLowerCase()] = args[1];
        if (onRequest) return true;
      },
      addEventListener: function(args, xhr) {
        var _this = this;
        if (events.indexOf(args[0]) !== -1) {
          var handler = args[1];
          getEventTarget(xhr).addEventListener(args[0], function(e) {
            var event = configEvent(e, _this);
            event.type = args[0];
            event.isTrusted = true;
            handler.call(_this, event);
          });
          return true;
        }
      },
      getAllResponseHeaders: function(_, xhr) {
        var headers = xhr.resHeader;
        if (headers) {
          var header = "";
          for (var key in headers) {
            header += key + ": " + headers[key] + "\r\n";
          }
          return header;
        }
      },
      getResponseHeader: function(args, xhr) {
        var headers = xhr.resHeader;
        if (headers) {
          return headers[(args[0] || "").toLowerCase()];
        }
      }
    }, win);
    return {
      originXhr,
      unProxy: unHook
    };
  }
  const reloadByLogin = (url) => {
    if (url.includes("/passport-login/web/login")) {
      message("login reload");
      sleep(1).then(() => window.location.reload());
    }
  };
  const listenLogout = async (url) => {
    if (url.includes("/login/exit")) {
      store.del("userCookie");
      await cookie.deleteAll();
      window.location.reload();
    }
  };
  const request = (config) => {
    return new Promise((resolve2) => {
      const { vipCookie } = store.getAll();
      if (!vipCookie) return;
      const url = new URL(config.url, window.location.href);
      _GM_xmlhttpRequest({
        method: config.method,
        url: url.href,
        anonymous: true,
        cookie: cookieToString(vipCookie),
        headers: {
          referer: window.location.href
        },
        responseType: "json",
        onload(event) {
          return resolve2(event.response);
        },
        onabort() {
          return resolve2();
        },
        onerror() {
          return resolve2();
        }
      });
    });
  };
  const handlers = [
    {
      // 视频信息
      url: "api.bilibili.com/x/player/wbi/playurl",
      on: (userResponse, vipResponse) => {
        delete vipResponse.data.last_play_cid;
        delete vipResponse.data.last_play_time;
        userResponse.data = {
          ...userResponse.data,
          ...vipResponse.data
        };
        return userResponse;
      }
    },
    {
      // 用户信息
      url: "api.bilibili.com/x/player/wbi/v2",
      on: (userResponse, vipResponse) => {
        userResponse.data.vip = vipResponse.data.vip;
        return userResponse;
      }
    },
    {
      // bangumi 信息
      url: "api.bilibili.com/pgc/player/web/v2/playurl",
      on: (userResponse, vipResponse) => {
        userResponse.result = vipResponse.result;
        return userResponse;
      }
    }
  ];
  const __vite_glob_0_2 = () => {
    proxy(
      {
        //请求发起前进入
        onRequest: (config, handler) => {
          reloadByLogin(config.url);
          listenLogout(config.url);
          handler.next(config);
        },
        //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
        onError: (err, handler) => {
          handler.next(err);
        },
        //请求成功后进入
        onResponse: async (response, handler) => {
          const requestUrl = response.config.url;
          for (const { url, on } of handlers) {
            if (requestUrl.includes(url)) {
              const vipResponse = await request(response.config);
              const userResponse = JSON.parse(response.response);
              if (vipResponse) {
                response.response = on(
                  structuredClone(userResponse),
                  structuredClone(vipResponse)
                );
                return handler.resolve(response);
              }
            }
          }
          handler.next(response);
        }
      },
      _unsafeWindow
    );
  };
  const __vite_glob_0_3 = async () => {
    let qualityCookie = (await cookie.get({ name: "CURRENT_QUALITY" }))[0];
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
        value: "120"
      };
    } else {
      qualityCookie.value = "120";
    }
    _GM_cookie.set(qualityCookie);
    Object.defineProperty(_unsafeWindow, "__playinfo__", {
      configurable: true,
      set() {
      },
      get() {
      }
    });
  };
  const __vite_glob_0_4 = () => {
    window.addEventListener("DOMContentLoaded", () => {
      var _a;
      const tips = document.querySelector(".adblock-tips");
      (_a = tips == null ? void 0 : tips.parentElement) == null ? void 0 : _a.removeChild(tips);
    });
  };
  const __vite_glob_0_5 = () => {
    const { vipCookie, userCookie } = store.getAll();
    if (!vipCookie || !userCookie) return;
    if (window.location.pathname.includes("bangumi")) {
      _GM_getTab(async (tab) => {
        if (tab.dirty) {
          await cookie.set(userCookie);
          tab.dirty = false;
          _GM_saveTab(tab);
        } else {
          await cookie.set(vipCookie);
          tab.dirty = true;
          _GM_saveTab(tab);
          window.location.reload();
        }
      });
    }
  };
  async function main() {
    const components = /* @__PURE__ */ Object.assign({
      "./components/avatar.ts": __vite_glob_0_0,
      "./components/initialize.ts": __vite_glob_0_1,
      "./components/listenerAjax.ts": __vite_glob_0_2,
      "./components/quality.ts": __vite_glob_0_3,
      "./components/removeTips.ts": __vite_glob_0_4,
      "./components/unlockVideo.ts": __vite_glob_0_5
    });
    for (const script of Object.values(components)) {
      script();
    }
    message("所有组件加载完成");
  }
  main();

})();