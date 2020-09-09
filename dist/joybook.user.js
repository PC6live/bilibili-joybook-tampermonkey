/*!
 * 
 * // ==UserScript==
 * // @name         bilibili-joybook
 * // @version      0.0.5
 * // @description  共享大会员
 * // @author       PC6live
 * // @license      MIT
 * // @include      *://*.bilibili.com/*
 * // @exclude      *://passport.bilibili.com/*
 * // @homepage     https://github.com/PC6live/joybook-tampermonkey
 * // @supportURL   https://github.com/PC6live/joybook-tampermonkey/issues
 * // @grant        GM_cookie
 * // @grant        GM_setValue
 * // @grant        GM_getValue
 * // @grant        GM_deleteValue
 * // @grant        GM_addStyle
 * // @grant        unsafeWindow
 * // @run-at       document-start
 * // @noframes
 * // ==/UserScript==
 * 
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

GM_addStyle(`
#bili-menu {
  position: fixed;
  left: 0;
  top: 8vh;
  z-index: 9999;
}

#bili-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  position: relative;
}

#bili-avatar img {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  -webkit-transition: .2s;
  transition: .2s;
}
`);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/lib/ajax-hook/xhr-hook.js
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*
 * author: wendux
 * email: 824783146@qq.com
 * source code: https://github.com/wendux/Ajax-hook
 */
// Save original XMLHttpRequest as _rxhr

/* eslint-disable */
var realXhr = "_rxhr";
function configEvent(event, xhrProxy) {
  var e = {};

  for (var attr in event) {
    e[attr] = event[attr];
  } // xhrProxy instead


  e.target = e.currentTarget = xhrProxy;
  return e;
}
function hook(proxy) {
  // Avoid double hookAjax
  window[realXhr] = window[realXhr] || XMLHttpRequest;

  unsafeWindow.XMLHttpRequest = function () {
    var xhr = new window[realXhr](); // We shouldn't hookAjax XMLHttpRequest.prototype because we can't
    // guarantee that all attributes are on the prototype。
    // Instead, hooking XMLHttpRequest instance can avoid this problem.

    for (var attr in xhr) {
      var type = "";

      try {
        type = _typeof(xhr[attr]); // May cause exception on some browser
      } catch (e) {}

      if (type === "function") {
        // hookAjax methods of xhr, such as `open`、`send` ...
        this[attr] = hookFunction(attr);
      } else {
        Object.defineProperty(this, attr, {
          get: getterFactory(attr),
          set: setterFactory(attr),
          enumerable: true
        });
      }
    }

    var that = this;

    xhr.getProxy = function () {
      return that;
    };

    this.xhr = xhr;
  }; // Generate getter for attributes of xhr


  function getterFactory(attr) {
    return function () {
      var v = this.hasOwnProperty(attr + "_") ? this[attr + "_"] : this.xhr[attr];
      var attrGetterHook = (proxy[attr] || {})["getter"];
      return attrGetterHook && attrGetterHook(v, this) || v;
    };
  } // Generate setter for attributes of xhr; by this we have an opportunity
  // to hookAjax event callbacks （eg: `onload`） of xhr;


  function setterFactory(attr) {
    return function (v) {
      var xhr = this.xhr;
      var that = this;
      var hook = proxy[attr]; // hookAjax  event callbacks such as `onload`、`onreadystatechange`...

      if (attr.substring(0, 2) === 'on') {
        that[attr + "_"] = v;

        xhr[attr] = function (e) {
          e = configEvent(e, that);
          var ret = proxy[attr] && proxy[attr].call(that, xhr, e);
          ret || v.call(that, e);
        };
      } else {
        //If the attribute isn't writable, generate proxy attribute
        var attrSetterHook = (hook || {})["setter"];
        v = attrSetterHook && attrSetterHook(v, that) || v;
        this[attr + "_"] = v;

        try {
          // Not all attributes of xhr are writable(setter may undefined).
          xhr[attr] = v;
        } catch (e) {}
      }
    };
  } // Hook methods of xhr.


  function hookFunction(fun) {
    return function () {
      var args = [].slice.call(arguments);

      if (proxy[fun]) {
        var ret = proxy[fun].call(this, args, this.xhr); // If the proxy return value exists, return it directly,
        // otherwise call the function of xhr.

        if (ret) return ret;
      }

      return this.xhr[fun].apply(this.xhr, args);
    };
  } // Return the real XMLHttpRequest


  return window[realXhr];
}
function unHook() {
  if (window[realXhr]) XMLHttpRequest = window[realXhr];
  window[realXhr] = undefined;
}
// CONCATENATED MODULE: ./src/lib/ajax-hook/xhr-proxy.js
/*
 * author: wendux
 * email: 824783146@qq.com
 * source code: https://github.com/wendux/Ajax-hook
 */

/* eslint-disable */

var events = ['load', 'loadend', 'timeout', 'error', 'readystatechange', 'abort'];
var eventLoad = events[0],
    eventLoadEnd = events[1],
    eventTimeout = events[2],
    eventError = events[3],
    eventReadyStateChange = events[4],
    eventAbort = events[5];
var singleton,
    xhr_proxy_prototype = 'prototype';
function xhr_proxy_proxy(proxy) {
  if (singleton) throw "Proxy already exists";
  return singleton = new Proxy(proxy);
}
function unProxy() {
  singleton = null;
  unHook();
}

function trim(str) {
  return str.replace(/^\s+|\s+$/g, '');
}

function getEventTarget(xhr) {
  return xhr.watcher || (xhr.watcher = document.createElement('a'));
}

function triggerListener(xhr, name) {
  var xhrProxy = xhr.getProxy();
  var callback = 'on' + name + '_';
  var event = configEvent({
    type: name
  }, xhrProxy);
  xhrProxy[callback] && xhrProxy[callback](event);
  getEventTarget(xhr).dispatchEvent(new Event(name, {
    bubbles: false
  }));
}

function Handler(xhr) {
  this.xhr = xhr;
  this.xhrProxy = xhr.getProxy();
}

Handler[xhr_proxy_prototype] = Object.create({
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

  sub[xhr_proxy_prototype] = Object.create(Handler[xhr_proxy_prototype]);
  sub[xhr_proxy_prototype].next = next;
  return sub;
}

var RequestHandler = makeHandler(function (rq) {
  var xhr = this.xhr;
  rq = rq || xhr.config;
  xhr.withCredentials = rq.withCredentials;
  xhr.open(rq.method, rq.url, rq.async !== false, rq.user, rq.password);

  for (var key in rq.headers) {
    xhr.setRequestHeader(key, rq.headers[key]);
  }

  xhr.send(rq.body);
});
var ResponseHandler = makeHandler(function (response) {
  this.resolve(response);
});
var ErrorHandler = makeHandler(function (error) {
  this.reject(error);
});

function Proxy(proxy) {
  var onRequest = proxy.onRequest,
      onResponse = proxy.onResponse,
      onError = proxy.onError;

  function handleResponse(xhr, xhrProxy) {
    var handler = new ResponseHandler(xhr);
    if (!onResponse) return handler.resolve();
    var ret = {
      response: xhrProxy.response,
      status: xhrProxy.status,
      statusText: xhrProxy.statusText,
      config: xhr.config,
      headers: xhr.resHeader || xhr.getAllResponseHeaders().split('\r\n').reduce(function (ob, str) {
        if (str === "") return ob;
        var m = str.split(":");
        ob[m.shift()] = trim(m.join(':'));
        return ob;
      }, {})
    };
    onResponse(ret, handler);
  }

  function onerror(xhr, xhrProxy, e) {
    var handler = new ErrorHandler(xhr);
    var error = {
      config: xhr.config,
      error: e
    };

    if (onError) {
      onError(error, handler);
    } else {
      handler.next(error);
    }
  }

  function preventXhrProxyCallback() {
    return true;
  }

  function errorCallback(xhr, e) {
    onerror(xhr, this, e);
    return true;
  }

  function stateChangeCallback(xhr, xhrProxy) {
    if (xhr.readyState === 4 && xhr.status !== 0) {
      handleResponse(xhr, xhrProxy);
    } else if (xhr.readyState !== 4) {
      triggerListener(xhr, eventReadyStateChange);
    }

    return true;
  }

  return hook({
    onload: preventXhrProxyCallback,
    onloadend: preventXhrProxyCallback,
    onerror: errorCallback,
    ontimeout: errorCallback,
    onabort: errorCallback,
    onreadystatechange: function onreadystatechange(xhr) {
      return stateChangeCallback(xhr, this);
    },
    open: function open(args, xhr) {
      var _this = this;

      var config = xhr.config = {
        headers: {}
      };
      config.method = args[0];
      config.url = args[1];
      config.async = args[2];
      config.user = args[3];
      config.password = args[4];
      config.xhr = xhr;
      var evName = 'on' + eventReadyStateChange;

      if (!xhr[evName]) {
        xhr[evName] = function () {
          return stateChangeCallback(xhr, _this);
        };
      }

      var defaultErrorHandler = function defaultErrorHandler(e) {
        onerror(xhr, _this, configEvent(e, _this));
      };

      [eventError, eventTimeout, eventAbort].forEach(function (e) {
        var event = 'on' + e;
        if (!xhr[event]) xhr[event] = defaultErrorHandler;
      }); // 如果有请求拦截器，则在调用onRequest后再打开链接。因为onRequest最佳调用时机是在send前，
      // 所以我们在send拦截函数中再手动调用open，因此返回true阻止xhr.open调用。
      //
      // 如果没有请求拦截器，则不用阻断xhr.open调用

      if (onRequest) return true;
    },
    send: function send(args, xhr) {
      var config = xhr.config;
      config.withCredentials = xhr.withCredentials;
      config.body = args[0];

      if (onRequest) {
        // In 'onRequest', we may call XHR's event handler, such as `xhr.onload`.
        // However, XHR's event handler may not be set until xhr.send is called in
        // the user's code, so we use `setTimeout` to avoid this situation
        var req = function req() {
          onRequest(config, new RequestHandler(xhr));
        };

        config.async === false ? req() : setTimeout(req);
        return true;
      }
    },
    setRequestHeader: function setRequestHeader(args, xhr) {
      // Collect request headers
      xhr.config.headers[args[0].toLowerCase()] = args[1];
      return true;
    },
    addEventListener: function addEventListener(args, xhr) {
      var _this = this;

      if (events.indexOf(args[0]) !== -1) {
        var handler = args[1];
        getEventTarget(xhr).addEventListener(args[0], function (e) {
          var event = configEvent(e, _this);
          event.type = args[0];
          event.isTrusted = true;
          handler.call(_this, event);
        });
        return true;
      }
    },
    getAllResponseHeaders: function getAllResponseHeaders(_, xhr) {
      var headers = xhr.resHeader;

      if (headers) {
        var header = "";

        for (var key in headers) {
          header += key + ': ' + headers[key] + '\r\n';
        }

        return header;
      }
    },
    getResponseHeader: function getResponseHeader(args, xhr) {
      var headers = xhr.resHeader;

      if (headers) {
        return headers[(args[0] || '').toLowerCase()];
      }
    }
  });
}
// CONCATENATED MODULE: ./src/lib/ajax-hook/index.js


// CONCATENATED MODULE: ./src/utils/biliCookie.ts
const userCookie = GM_getValue("userCookie");
const vipCookie = GM_getValue("vipCookie");
const checkCookieReady = () => {
    if (userCookie && vipCookie) {
        return true;
    }
    return false;
};
const getCookies = () => {
    return new Promise((resolve) => {
        const hostname = window.location.hostname;
        GM_cookie.list({ url: hostname }, (cookies) => resolve(cookies));
    });
};
const removeCookies = () => {
    return new Promise((resolve) => {
        const hostname = window.location.hostname;
        getCookies()
            .then((cookies) => {
            cookies.forEach((cookie) => {
                GM_cookie.delete({ name: cookie.name, url: hostname });
            });
        })
            .then(resolve);
    });
};
const storeCookies = (name, queryName) => {
    return new Promise((resolve) => {
        getCookies().then((result) => {
            const cookies = [];
            result.forEach((cookie) => {
                if (cookie.name && queryName.includes(cookie.name)) {
                    cookies.push({
                        domain: cookie.domain,
                        storeId: cookie.storeId,
                        expirationDate: cookie.expirationDate,
                        httpOnly: cookie.httpOnly,
                        name: cookie.name,
                        path: cookie.path,
                        sameSite: cookie.sameSite,
                        secure: cookie.secure,
                        value: cookie.value,
                    });
                }
            });
            GM_setValue(name, cookies);
            resolve();
        });
    });
};
const setCookies = (cookies) => {
    return new Promise((resolve) => {
        cookies.forEach((cookie) => {
            GM_cookie.set(cookie);
        });
        resolve();
    });
};


// CONCATENATED MODULE: ./src/utils/helper.ts
const sleep = (time = 1) => {
    return new Promise((resolve) => setTimeout(resolve, 1000 * time));
};
const createElement = (str) => {
    const el = document.createElement("div");
    el.innerHTML = str;
    return el.firstElementChild;
};
const isVideo = /(bangumi\/play\/ss\d+)|(bangumi\/play\/ep\d+)|(video\/bv\d+)/gi.test(window.location.href);
const user = {
    face: () => unsafeWindow.UserStatus.userInfo.face,
    isVip: () => unsafeWindow.UserStatus.userInfo.vipStatus === 1,
};


// CONCATENATED MODULE: ./src/components/videoDetect.ts


const Main = (config) => {
    const { url, xhr } = config;
    const urls = ["playurl?cid", "data?"];
    const detectUrl = (strs) => {
        for (let count = 0; count < strs.length; count += 1) {
            if (url.includes(strs[count])) {
                xhr.onloadstart = () => {
                    setCookies(vipCookie);
                };
                xhr.onloadend = () => {
                    setCookies(userCookie);
                };
                return;
            }
        }
    };
    const video = () => {
        // todo: 重置按钮
        // if (url.includes("playurl?cid")) {
        // 	console.log("video working");
        // 	xhr.onloadend = (): void => {
        // 		let resp;
        // 		xhr.responseType === "json" ? (resp = xhr.response) : (resp = JSON.parse(xhr.responseText));
        // 		if (resp.code !== 0) {
        // 			removeCookies()
        // 				.then(() => {
        // 					GM_deleteValue("vipCookie");
        // 					GM_deleteValue("face");
        // 				})
        // 				.then(() => location.reload(false));
        // 		}
        // 	};
        // }
        detectUrl(urls);
    };
    if (isVideo)
        video();
};
/* harmony default export */ var videoDetect = (Main);

// CONCATENATED MODULE: ./src/components/listener.ts




const checkUserCookie = (data) => {
    if (data.isLogin && data.vipStatus === 0) {
        storeCookies("userCookie", ["SESSDATA", "DedeUserID", "DedeUserID__ckMd5"]);
    }
};
const unlockVideo = () => {
    if (checkCookieReady() && isVideo) {
        let PGC;
        Object.defineProperty(unsafeWindow, "__PGC_USERSTATE__", {
            set(value) {
                PGC = {
                    ...value,
                    vip_info: {
                        status: 1,
                        type: 2,
                        due_date: 1614614400000,
                    },
                    pay: 1,
                };
                delete PGC.dialog;
            },
            get() {
                return PGC;
            },
        });
    }
};
const listener_Main = () => {
    console.log("listening");
    const cookieReady = checkCookieReady();
    unlockVideo();
    xhr_proxy_proxy({
        onRequest: (config, handler) => {
            const { url, xhr } = config;
            xhr.onloadend = () => {
                if (url.includes("nav") && !userCookie) {
                    const result = JSON.parse(xhr.response);
                    checkUserCookie(result.data);
                }
            };
            if (cookieReady) {
                xhr.onloadstart = () => {
                    setCookies(userCookie);
                };
                videoDetect(config);
            }
            handler.next(config);
        },
        onResponse: (response, handler) => {
            handler.next(response);
        },
        onError: (err, handler) => {
            handler.next(err);
        },
    });
};
/* harmony default export */ var listener = (listener_Main);

// CONCATENATED MODULE: ./src/components/avator.ts


const storeVipInfo = () => {
    const handlerClick = () => {
        GM_setValue("face", user.face());
        storeCookies("vipCookie", ["SESSDATA", "DedeUserID", "DedeUserID__ckMd5"])
            .then(() => removeCookies())
            .then(() => location.reload(false));
    };
    user.isVip() ? handlerClick() : alert("此账号不是大会员账号");
};
const genVipAvatar = (container) => {
    console.log("gen avatar");
    const avatar = document.getElementById("bili-avatar");
    const face = GM_getValue("face", "//static.hdslb.com/images/akari.jpg");
    const html = `<div id="bili-avatar">
		<img src=${face} />
	</div>`;
    const vipAvatar = createElement(html);
    if (container && !avatar) {
        container.style.display = "flex";
        container === null || container === void 0 ? void 0 : container.appendChild(vipAvatar);
        if (!vipCookie)
            vipAvatar.addEventListener("click", storeVipInfo);
    }
};
const logout = () => {
    const btn = document.querySelector(".logout");
    if (btn) {
        btn.addEventListener("click", () => {
            console.log("change user");
            GM_deleteValue("userCookie");
        });
    }
};
const avator_Main = () => {
    const findElem = () => {
        var _a;
        const container = (_a = document.querySelector(".mini-avatar")) === null || _a === void 0 ? void 0 : _a.parentElement;
        const logoutElem = document.querySelector(".user-con.logout");
        if (container) {
            genVipAvatar(container);
            logout();
        }
        else if (logoutElem) {
            console.log("logout");
            return;
        }
        else {
            window.requestAnimationFrame(findElem);
        }
    };
    window.requestAnimationFrame(findElem);
};
/* harmony default export */ var avator = (avator_Main);

// EXTERNAL MODULE: ./src/styles/global.ts
var global = __webpack_require__(0);

// CONCATENATED MODULE: ./src/index.ts



const src_Main = () => {
    console.log("run main");
    avator();
    listener();
};
src_Main();


/***/ })
/******/ ]);