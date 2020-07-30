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
 */!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t,n){"use strict";GM_addStyle("\n#bili-menu {\n  position: fixed;\n  left: 0;\n  top: 8vh;\n  z-index: 9999;\n}\n\n#bili-avatar {\n  width: 36px;\n  height: 36px;\n  border-radius: 50%;\n  position: relative;\n}\n\n#bili-avatar img {\n  position: absolute;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  border-radius: 50%;\n  -webkit-transition: .2s;\n  transition: .2s;\n}\n")},function(e,t,n){"use strict";function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}n.r(t);function o(e,t){var n={};for(var r in e)n[r]=e[r];return n.target=n.currentTarget=t,n}var i,a=["load","loadend","timeout","error","readystatechange","abort"],s=a[0],u=a[1],c=a[2],l=a[3],d=a[4],f=a[5];function h(e){return e.watcher||(e.watcher=document.createElement("a"))}function p(e,t){var n=e.getProxy(),r="on"+t+"_",i=o({type:t},n);n[r]&&n[r](i),h(e).dispatchEvent(new Event(t,{bubbles:!1}))}function v(e){this.xhr=e,this.xhrProxy=e.getProxy()}function y(e){function t(e){v.call(this,e)}return t.prototype=Object.create(v.prototype),t.prototype.next=e,t}v.prototype=Object.create({resolve:function(e){var t=this.xhrProxy,n=this.xhr;t.readyState=4,n.resHeader=e.headers,t.response=t.responseText=e.response,t.statusText=e.statusText,t.status=e.status,p(n,d),p(n,s),p(n,u)},reject:function(e){this.xhrProxy.status=0,p(this.xhr,e.type),p(this.xhr,u)}});var m=y((function(e){var t=this.xhr;for(var n in e=e||t.config,t.withCredentials=e.withCredentials,t.open(e.method,e.url,!1!==e.async,e.user,e.password),e.headers)t.setRequestHeader(n,e.headers[n]);t.send(e.body)})),g=y((function(e){this.resolve(e)})),x=y((function(e){this.reject(e)}));function w(e){var t=e.onRequest,n=e.onResponse,i=e.onError;function s(e,t,n){var r=new x(e),o={config:e.config,error:n};i?i(o,r):r.next(o)}function u(){return!0}function v(e,t){return s(e,0,t),!0}function y(e,t){return 4===e.readyState&&0!==e.status?function(e,t){var r=new g(e);if(!n)return r.resolve();var o={response:t.response,status:t.status,statusText:t.statusText,config:e.config,headers:e.resHeader||e.getAllResponseHeaders().split("\r\n").reduce((function(e,t){if(""===t)return e;var n=t.split(":");return e[n.shift()]=function(e){return e.replace(/^\s+|\s+$/g,"")}(n.join(":")),e}),{})};n(o,r)}(e,t):4!==e.readyState&&p(e,d),!0}return function(e){function t(t){return function(){var n=this.hasOwnProperty(t+"_")?this[t+"_"]:this.xhr[t],r=(e[t]||{}).getter;return r&&r(n,this)||n}}function n(t){return function(n){var r=this.xhr,i=this,a=e[t];if("on"===t.substring(0,2))i[t+"_"]=n,r[t]=function(a){a=o(a,i),e[t]&&e[t].call(i,r,a)||n.call(i,a)};else{var s=(a||{}).setter;n=s&&s(n,i)||n,this[t+"_"]=n;try{r[t]=n}catch(e){}}}}function i(t){return function(){var n=[].slice.call(arguments);if(e[t]){var r=e[t].call(this,n,this.xhr);if(r)return r}return this.xhr[t].apply(this.xhr,n)}}return window._rxhr=window._rxhr||XMLHttpRequest,unsafeWindow.XMLHttpRequest=function(){var e=new window._rxhr;for(var o in e){var a="";try{a=r(e[o])}catch(e){}"function"===a?this[o]=i(o):Object.defineProperty(this,o,{get:t(o),set:n(o),enumerable:!0})}var s=this;e.getProxy=function(){return s},this.xhr=e},window._rxhr}({onload:u,onloadend:u,onerror:v,ontimeout:v,onabort:v,onreadystatechange:function(e){return y(e,this)},open:function(e,n){var r=this,i=n.config={headers:{}};i.method=e[0],i.url=e[1],i.async=e[2],i.user=e[3],i.password=e[4],i.xhr=n;var a="on"+d;n[a]||(n[a]=function(){return y(n,r)});var u=function(e){s(n,0,o(e,r))};if([l,c,f].forEach((function(e){var t="on"+e;n[t]||(n[t]=u)})),t)return!0},send:function(e,n){var r=n.config;if(r.withCredentials=n.withCredentials,r.body=e[0],t){var o=function(){t(r,new m(n))};return!1===r.async?o():setTimeout(o),!0}},setRequestHeader:function(e,t){return t.config.headers[e[0].toLowerCase()]=e[1],!0},addEventListener:function(e,t){var n=this;if(-1!==a.indexOf(e[0])){var r=e[1];return h(t).addEventListener(e[0],(function(t){var i=o(t,n);i.type=e[0],i.isTrusted=!0,r.call(n,i)})),!0}},getAllResponseHeaders:function(e,t){var n=t.resHeader;if(n){var r="";for(var o in n)r+=o+": "+n[o]+"\r\n";return r}},getResponseHeader:function(e,t){var n=t.resHeader;if(n)return n[(e[0]||"").toLowerCase()]}})}const b=GM_getValue("userCookie"),_=GM_getValue("vipCookie"),S=GM_getValue("userCookie")&&GM_getValue("vipCookie"),E=()=>new Promise(e=>{const t=window.location.hostname;GM_cookie.list({url:t},t=>e(t))}),M=(e,t)=>new Promise(n=>{E().then(r=>{const o=[];r.forEach(e=>{e.name&&t.includes(e.name)&&o.push({domain:e.domain,storeId:e.storeId,expirationDate:e.expirationDate,httpOnly:e.httpOnly,name:e.name,path:e.path,sameSite:e.sameSite,secure:e.secure,value:e.value})}),GM_setValue(e,o),n()})}),P=e=>new Promise(t=>{e.forEach(e=>{GM_cookie.set(e)}),t()}),j=/(bangumi\/play\/ss\d+)|(bangumi\/play\/ep\d+)|(video\/bv\d+)/gi.test(window.location.href),k=()=>unsafeWindow.UserStatus.userInfo.face,C=()=>1===unsafeWindow.UserStatus.userInfo.vipStatus;var O=e=>new Promise(t=>{const{url:n,xhr:r}=e;return j&&(e=>{for(let t=0;t<e.length;t+=1)if(n.includes(e[t]))return r.onloadstart=()=>{P(_)},void(r.onloadend=()=>{P(b)})})(["playurl?cid","data?"]),t()});const T=()=>{C()?(GM_setValue("face",k()),M("vipCookie",["SESSDATA","DedeUserID","DedeUserID__ckMd5"]).then(()=>new Promise(e=>{const t=window.location.hostname;E().then(e=>{e.forEach(e=>{GM_cookie.delete({name:e.name,url:t})})}).then(e)})).then(()=>location.reload(!1))):alert("此账号不是大会员账号")},G=e=>{console.log("gen avatar");const t=document.getElementById("bili-avatar"),n=(e=>{const t=document.createElement("div");return t.innerHTML=e,t.firstElementChild})(`<div id="bili-avatar">\n\t\t<img src=${GM_getValue("face","//static.hdslb.com/images/akari.jpg")} />\n\t</div>`);e&&!t&&(e.style.display="flex",null==e||e.appendChild(n),_||n.addEventListener("click",T))};var D=()=>{const e=()=>{var t;const n=null===(t=document.querySelector(".mini-avatar"))||void 0===t?void 0:t.parentElement,r=document.querySelector(".user-con.logout");if(n)G(n),(()=>{const e=document.querySelector(".logout");e&&e.addEventListener("click",()=>{console.log("change user"),GM_deleteValue("userCookie")})})();else{if(r)return void console.log("logout");window.requestAnimationFrame(e)}};window.requestAnimationFrame(e)};var H=()=>{console.log("listening"),(()=>{if(S&&j){let e;Object.defineProperty(unsafeWindow,"__PGC_USERSTATE__",{set(t){e={...t,vip_info:{status:1,type:2,due_date:16146144e5},pay:1},delete e.dialog},get:()=>e})}})(),D(),fetch("https://api.bilibili.com/x/web-interface/nav",{credentials:"include"}).then(e=>e.json()).then(e=>{var t;t=e.data,!b&&t.isLogin&&1!==t.vipStatus&&M("userCookie",["SESSDATA","DedeUserID","DedeUserID__ckMd5"])}),S&&P(b),function(e){if(i)throw"Proxy already exists";i=new w(e)}({onRequest:(e,t)=>{S&&O(e).then(()=>{t.next(e)})},onResponse:(e,t)=>{t.next(e)},onError:(e,t)=>{t.next(e)}})};n(0);console.log("run main"),H()}]);