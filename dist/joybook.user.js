// ==UserScript==
// @name        bilibili-joybook
// @version     0.0.7
// @author      PC6live
// @description 共享大会员
// @homepage    https://github.com/PC6live/joybook-tampermonkey
// @supportURL  https://github.com/PC6live/joybook-tampermonkey/issue
// @include     *://*.bilibili.com/*
// @exclude     *://passport.bilibili.com/*
// @grant       GM_cookie
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @grant       GM_deleteValue
// @grant       GM_getTab
// @grant       GM_getTabs
// @grant       GM_listValues
// @grant       GM_saveTab
// @grant       unsafeWindow
// @run-at      document-start
// @noframes    
// ==/UserScript==

(()=>{"use strict";var e={452:(e,t,n)=>{n.d(t,{Z:()=>r});var o=n(645),i=n.n(o)()((function(e){return e[1]}));i.push([e.id,".d-none{display:none}.button{display:flex;min-width:32px;min-height:32px;border-radius:50%;overflow:hidden;border:2px solid #8a8a8a;cursor:pointer}#joybook-container{position:fixed;bottom:30px;left:-30px;transition:.3s ease-in-out}#joybook-settings{position:relative;display:flex;flex-direction:column;justify-content:center;align-items:center}#joybook-avatar{position:relative;cursor:pointer;overflow:hidden;border-radius:50%;background-color:#888;border:4px solid #fb7299;opacity:1}#joybook-avatar>img{width:48px;height:48px}#settings-options-container{position:relative}#settings-options-container>*{margin:6px 0}",""]);const r=i},645:e=>{e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=e(t);return t[2]?"@media ".concat(t[2]," {").concat(n,"}"):n})).join("")},t.i=function(e,n,o){"string"==typeof e&&(e=[[null,e,""]]);var i={};if(o)for(var r=0;r<this.length;r++){var a=this[r][0];null!=a&&(i[a]=!0)}for(var s=0;s<e.length;s++){var l=[].concat(e[s]);o&&i[l[0]]||(n&&(l[2]?l[2]="".concat(n," and ").concat(l[2]):l[2]=n),t.push(l))}},t}},468:(e,t,n)=>{n.r(t),n.d(t,{default:()=>a});var o=n(379),i=n.n(o),r=n(452);i()(r.Z,{insert:"head",singleton:!1});const a=r.Z.locals||{}},379:(e,t,n)=>{var o,i=function(){var e={};return function(t){if(void 0===e[t]){var n=document.querySelector(t);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}e[t]=n}return e[t]}}(),r=[];function a(e){for(var t=-1,n=0;n<r.length;n++)if(r[n].identifier===e){t=n;break}return t}function s(e,t){for(var n={},o=[],i=0;i<e.length;i++){var s=e[i],l=t.base?s[0]+t.base:s[0],c=n[l]||0,u="".concat(l," ").concat(c);n[l]=c+1;var d=a(u),f={css:s[1],media:s[2],sourceMap:s[3]};-1!==d?(r[d].references++,r[d].updater(f)):r.push({identifier:u,updater:h(f,t),references:1}),o.push(u)}return o}function l(e){var t=document.createElement("style"),o=e.attributes||{};if(void 0===o.nonce){var r=n.nc;r&&(o.nonce=r)}if(Object.keys(o).forEach((function(e){t.setAttribute(e,o[e])})),"function"==typeof e.insert)e.insert(t);else{var a=i(e.insert||"head");if(!a)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");a.appendChild(t)}return t}var c,u=(c=[],function(e,t){return c[e]=t,c.filter(Boolean).join("\n")});function d(e,t,n,o){var i=n?"":o.media?"@media ".concat(o.media," {").concat(o.css,"}"):o.css;if(e.styleSheet)e.styleSheet.cssText=u(t,i);else{var r=document.createTextNode(i),a=e.childNodes;a[t]&&e.removeChild(a[t]),a.length?e.insertBefore(r,a[t]):e.appendChild(r)}}function f(e,t,n){var o=n.css,i=n.media,r=n.sourceMap;if(i?e.setAttribute("media",i):e.removeAttribute("media"),r&&"undefined"!=typeof btoa&&(o+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(r))))," */")),e.styleSheet)e.styleSheet.cssText=o;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(o))}}var p=null,v=0;function h(e,t){var n,o,i;if(t.singleton){var r=v++;n=p||(p=l(t)),o=d.bind(null,n,r,!1),i=d.bind(null,n,r,!0)}else n=l(t),o=f.bind(null,n,t),i=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(n)};return o(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;o(e=t)}else i()}}e.exports=function(e,t){(t=t||{}).singleton||"boolean"==typeof t.singleton||(t.singleton=(void 0===o&&(o=Boolean(window&&document&&document.all&&!window.atob)),o));var n=s(e=e||[],t);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var o=0;o<n.length;o++){var i=a(n[o]);r[i].references--}for(var l=s(e,t),c=0;c<n.length;c++){var u=a(n[c]);0===r[u].references&&(r[u].updater(),r.splice(u,1))}n=l}}}},879:function(e,t,n){var o=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))((function(i,r){function a(e){try{l(o.next(e))}catch(e){r(e)}}function s(e){try{l(o.throw(e))}catch(e){r(e)}}function l(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,s)}l((o=o.apply(e,t||[])).next())}))},i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.listener=void 0;const r=n(603),a=n(33),s=n(606),l=i(n(180)),c=n(145),u=n(382);t.listener=(e,t)=>o(void 0,void 0,void 0,(function*(){a.printMessage("listening-start");const n={open:n=>(u.state.highQuality&&c.lockQuality(u.state.highQuality),r.setCookies(e),s.vipUrlHandle(n,t),!1)};l.default.proxyAjax(n),a.printMessage("listening-end")}))},145:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.lockQuality=void 0,t.lockQuality=e=>{const t=localStorage.getItem("bilibili_player_settings");if(t){const n=JSON.parse(t);n.setting_config.defquality=e,localStorage.setItem("bilibili_player_settings",JSON.stringify(n))}}},683:function(e,t,n){var o=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))((function(i,r){function a(e){try{l(o.next(e))}catch(e){r(e)}}function s(e){try{l(o.throw(e))}catch(e){r(e)}}function l(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,s)}l((o=o.apply(e,t||[])).next())}))},i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const r=i(n(180)),a=n(923),s=n(603),l=n(33),c=document.createElement("div");t.default=()=>{l.printMessage("settings-start"),c.id="joybook-container",document.body.appendChild(c),function(){const e=a.store.get("face");if(!e)return;const t=l.createElement(`<div id="joybook-avatar">\n\t<img src=${e}></img>\n\t</div>`);t&&c.appendChild(t)}(),function(){let e;c.addEventListener("mouseenter",(()=>{e&&window.clearTimeout(e),c.style.transform="translateX(50px)"})),c.addEventListener("mouseleave",(()=>{e=window.setTimeout((()=>{c.style.transform="translateX(0px)"}),1500)})),c.addEventListener("click",(()=>o(this,void 0,void 0,(function*(){window.confirm("确定要删除脚本数据吗？")&&(r.default.unProxyAjax(),l.deleteAllValue(),yield s.removeCookies(),window.location.reload())}))))}(),l.printMessage("settings-end")}},382:function(e,t,n){var o=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))((function(i,r){function a(e){try{l(o.next(e))}catch(e){r(e)}}function s(e){try{l(o.throw(e))}catch(e){r(e)}}function l(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,s)}l((o=o.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0}),t.initState=t.state=void 0;const i=n(923),r=n(603),a=n(33);function s(){var e;const t=document.querySelector(".logout");if(t&&document.body.contains(t)&&"true"!==t.getAttribute("flag")){const n=t.cloneNode(!0);n instanceof HTMLElement&&(n.setAttribute("flag","true"),n.addEventListener("click",(()=>{i.store.remove("userCookie"),r.removeCookies().then((()=>{window.location.reload()}))})),null===(e=t.parentNode)||void 0===e||e.replaceChild(n,t))}else setTimeout((()=>{s()}),1e3)}t.state={isLogin:!1,vipStatus:0,face:"",highQuality:""},t.initState=()=>o(void 0,void 0,void 0,(function*(){a.printMessage("initState-start"),yield o(void 0,void 0,void 0,(function*(){const e=yield fetch("https://api.bilibili.com/x/web-interface/nav",{method:"Get",credentials:"include"});if(!e)return;const n=(yield e.json()).data;t.state.isLogin=n.isLogin,t.state.vipStatus=n.vipStatus,t.state.face=n.face}));const e=["SESSDATA","DedeUserID","DedeUserID__ckMd5"],{isLogin:n,vipStatus:l,face:c}=t.state,{vipCookie:u,userCookie:d}=r.getStoreCookies();n&&(s(),!u&&l&&(i.store.set("face",c),r.storeCookies("vipCookie",e).then((()=>{r.removeCookies().then((()=>{window.location.reload()}))}))),l||(u?d||r.storeCookies("userCookie",e).then((()=>{window.location.reload()})):r.storeCookies("userCookie",e).then((()=>{r.removeCookies().then((()=>{window.location.reload()}))}))),a.printMessage("initState-end"))}))},529:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0});const o=n(33),i=n(145),r=n(382);t.default=()=>{let e;o.printMessage("unlockVideo-start"),Object.defineProperty(unsafeWindow,"__PGC_USERSTATE__",{set(t){e=Object.assign(Object.assign({},t),{area_limit:0,ban_area_show:1,follow:1,follow_status:2,login:1,pay:1,pay_pack_paid:0,sponsor:0,vip_info:{due_date:0,status:1,type:2}}),delete e.dialog},get:()=>e}),Object.defineProperty(unsafeWindow,"__playinfo__",{configurable:!0,set(e){const{result:t,data:n}=e;if(t){const e=t.accept_quality[0].toString();r.state.highQuality=e,i.lockQuality(e)}else if(n){const e=n.accept_quality[0].toString();r.state.highQuality=e,i.lockQuality(e)}},get:()=>({})}),o.printMessage("unlockVideo-end")}},606:function(e,t,n){var o=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))((function(i,r){function a(e){try{l(o.next(e))}catch(e){r(e)}}function s(e){try{l(o.throw(e))}catch(e){r(e)}}function l(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,s)}l((o=o.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0}),t.vipUrlHandle=void 0;const i=n(603);t.vipUrlHandle=(e,t)=>o(void 0,void 0,void 0,(function*(){const n=e[1],o=["/player/"];for(let e=0;e<o.length;e+=1)if(n.includes(o[e]))return void(t&&i.setCookies(t))}))},607:function(e,t,n){var o=this&&this.__createBinding||(Object.create?function(e,t,n,o){void 0===o&&(o=n),Object.defineProperty(e,o,{enumerable:!0,get:function(){return t[n]}})}:function(e,t,n,o){void 0===o&&(o=n),e[o]=t[n]}),i=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),r=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&o(t,e,n);return i(t,e),t},a=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const s=n(879),l=a(n(529)),c=n(382),u=a(n(683)),d=n(33),f=n(603),{userCookie:p,vipCookie:v}=f.getStoreCookies();l.default(),p&&v&&(d.isVideo()?s.listener(p,v):f.setCookies(p)),c.initState(),window.addEventListener("load",(()=>{Promise.resolve().then((()=>r(n(468)))),u.default()}))},180:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0});const n=new class{constructor(){this.proxyAjax=e=>{if(null==e)throw new TypeError("proxyMap can not be undefined or null");this.RealXMLHttpRequest=this.RealXMLHttpRequest||unsafeWindow.XMLHttpRequest,this.realXMLHttpRequest=this.realXMLHttpRequest||new unsafeWindow.XMLHttpRequest;const t=this,n=new Proxy(this.RealXMLHttpRequest,{construct(n){const o=new n;return new Proxy(o,{get(n,o,i){let r="";try{r=typeof t.realXMLHttpRequest[o]}catch(e){return console.error(e),n[o]}if("function"!==r){const r=t.hasOwnProperty(`_${o.toString()}`)?t[`_${o.toString()}`]:n[o],a=(e[o]||{}).getter;return"function"==typeof a&&a.call(n,r,i)||r}return(...t)=>{let r=t;if(e[o]){const a=e[o].call(n,t,i);if(!0===a)return;a&&(r="function"==typeof a?a.call(n,...t):a)}return n[o].call(n,...r)}},set(n,o,i,r){let a="";try{a=typeof t.realXMLHttpRequest[o]}catch(e){console.error(e)}if("function"===a)return!0;if("function"==typeof e[o])n[o]=()=>{e[o].call(n,r)||i.call(r)};else{const a=(e[o]||{}).setter;try{n[o]="function"==typeof a&&a.call(n,i,r)||("function"==typeof i?i.bind(r):i)}catch(e){if(!0!==a)throw e;t[`_${o.toString()}`]=i}}return!0}})}});return unsafeWindow.XMLHttpRequest=n,this.RealXMLHttpRequest},this.unProxyAjax=()=>{this.RealXMLHttpRequest&&(unsafeWindow.XMLHttpRequest=this.RealXMLHttpRequest),this.RealXMLHttpRequest=void 0}}};t.default=n},923:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.store=void 0,t.store={set:(e,t)=>{GM_setValue(e,t)},get:(e,t)=>GM_getValue(e,t),remove:e=>{GM_deleteValue(e)}}},603:function(e,t,n){var o=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))((function(i,r){function a(e){try{l(o.next(e))}catch(e){r(e)}}function s(e){try{l(o.throw(e))}catch(e){r(e)}}function l(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,s)}l((o=o.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0}),t.getStoreCookies=t.setCookies=t.storeCookies=t.removeCookies=t.getCookies=void 0;const i=n(923);t.getStoreCookies=()=>({userCookie:i.store.get("userCookie"),vipCookie:i.store.get("vipCookie")});const r=()=>new Promise((e=>{GM_cookie.list({},(t=>e(t)))}));t.getCookies=r,t.removeCookies=()=>o(void 0,void 0,void 0,(function*(){(yield r()).forEach((e=>{GM_cookie.delete({name:e.name})}))})),t.storeCookies=(e,t)=>o(void 0,void 0,void 0,(function*(){const n=(yield r()).filter((e=>e.name&&t.includes(e.name)));i.store.set(e,n)})),t.setCookies=e=>{e.map((e=>({domain:e.domain,expirationDate:e.expirationDate,hostOnly:e.hostOnly,httpOnly:e.httpOnly,name:e.name,path:e.path,sameSite:e.sameSite,secure:e.secure,value:e.value}))).forEach((e=>{GM_cookie.set(e)}))}},33:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.printMessage=t.deleteAllValue=t.isVideo=t.createElement=t.sleep=void 0,t.sleep=(e=1)=>new Promise((t=>setTimeout(t,1e3*e))),t.createElement=e=>{const t=document.createElement("div");return t.innerHTML=e,t.firstElementChild},t.isVideo=()=>/(bangumi\/play\/*)|(video\/*)/gi.test(window.location.pathname),t.deleteAllValue=()=>GM_listValues().forEach((e=>GM_deleteValue(e))),t.printMessage=e=>{}}},t={};function n(o){if(t[o])return t[o].exports;var i=t[o]={id:o,exports:{}};return e[o].call(i.exports,i,i.exports,n),i.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n(607)})();