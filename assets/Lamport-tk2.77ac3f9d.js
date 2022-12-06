(function(){"use strict";const D={deserialize(e){return Object.assign(Error(e.message),{name:e.name,stack:e.stack})},serialize(e){return{__error_marker:"$$error",message:e.message,name:e.name,stack:e.stack}}},Fe=e=>e&&typeof e=="object"&&"__error_marker"in e&&e.__error_marker==="$$error";let U={deserialize(e){return Fe(e)?D.deserialize(e):e},serialize(e){return e instanceof Error?D.serialize(e):e}};function ee(e){return U.deserialize(e)}function x(e){return U.serialize(e)}function Se(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function Me(e){var t=e.default;if(typeof t=="function"){var n=function(){return t.apply(this,arguments)};n.prototype=t.prototype}else n={};return Object.defineProperty(n,"__esModule",{value:!0}),Object.keys(e).forEach(function(r){var o=Object.getOwnPropertyDescriptor(e,r);Object.defineProperty(n,r,o.get?o:{enumerable:!0,get:function(){return e[r]}})}),n}var te={exports:{}},B,ne;function xe(){if(ne)return B;ne=1;var e=1e3,t=e*60,n=t*60,r=n*24,o=r*7,s=r*365.25;B=function(i,u){u=u||{};var d=typeof i;if(d==="string"&&i.length>0)return c(i);if(d==="number"&&isFinite(i))return u.long?f(i):a(i);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(i))};function c(i){if(i=String(i),!(i.length>100)){var u=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(i);if(!!u){var d=parseFloat(u[1]),w=(u[2]||"ms").toLowerCase();switch(w){case"years":case"year":case"yrs":case"yr":case"y":return d*s;case"weeks":case"week":case"w":return d*o;case"days":case"day":case"d":return d*r;case"hours":case"hour":case"hrs":case"hr":case"h":return d*n;case"minutes":case"minute":case"mins":case"min":case"m":return d*t;case"seconds":case"second":case"secs":case"sec":case"s":return d*e;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return d;default:return}}}}function a(i){var u=Math.abs(i);return u>=r?Math.round(i/r)+"d":u>=n?Math.round(i/n)+"h":u>=t?Math.round(i/t)+"m":u>=e?Math.round(i/e)+"s":i+"ms"}function f(i){var u=Math.abs(i);return u>=r?l(i,u,r,"day"):u>=n?l(i,u,n,"hour"):u>=t?l(i,u,t,"minute"):u>=e?l(i,u,e,"second"):i+" ms"}function l(i,u,d,w){var j=u>=d*1.5;return Math.round(i/d)+" "+w+(j?"s":"")}return B}function Ee(e){n.debug=n,n.default=n,n.coerce=f,n.disable=s,n.enable=o,n.enabled=c,n.humanize=xe(),n.destroy=l,Object.keys(e).forEach(i=>{n[i]=e[i]}),n.names=[],n.skips=[],n.formatters={};function t(i){let u=0;for(let d=0;d<i.length;d++)u=(u<<5)-u+i.charCodeAt(d),u|=0;return n.colors[Math.abs(u)%n.colors.length]}n.selectColor=t;function n(i){let u,d=null,w,j;function m(...p){if(!m.enabled)return;const v=m,y=Number(new Date),O=y-(u||y);v.diff=O,v.prev=u,v.curr=y,u=y,p[0]=n.coerce(p[0]),typeof p[0]!="string"&&p.unshift("%O");let F=0;p[0]=p[0].replace(/%([a-zA-Z%])/g,(g,S)=>{if(g==="%%")return"%";F++;const V=n.formatters[S];if(typeof V=="function"){const Qt=p[F];g=V.call(v,Qt),p.splice(F,1),F--}return g}),n.formatArgs.call(v,p),(v.log||n.log).apply(v,p)}return m.namespace=i,m.useColors=n.useColors(),m.color=n.selectColor(i),m.extend=r,m.destroy=n.destroy,Object.defineProperty(m,"enabled",{enumerable:!0,configurable:!1,get:()=>d!==null?d:(w!==n.namespaces&&(w=n.namespaces,j=n.enabled(i)),j),set:p=>{d=p}}),typeof n.init=="function"&&n.init(m),m}function r(i,u){const d=n(this.namespace+(typeof u>"u"?":":u)+i);return d.log=this.log,d}function o(i){n.save(i),n.namespaces=i,n.names=[],n.skips=[];let u;const d=(typeof i=="string"?i:"").split(/[\s,]+/),w=d.length;for(u=0;u<w;u++)!d[u]||(i=d[u].replace(/\*/g,".*?"),i[0]==="-"?n.skips.push(new RegExp("^"+i.slice(1)+"$")):n.names.push(new RegExp("^"+i+"$")))}function s(){const i=[...n.names.map(a),...n.skips.map(a).map(u=>"-"+u)].join(",");return n.enable(""),i}function c(i){if(i[i.length-1]==="*")return!0;let u,d;for(u=0,d=n.skips.length;u<d;u++)if(n.skips[u].test(i))return!1;for(u=0,d=n.names.length;u<d;u++)if(n.names[u].test(i))return!0;return!1}function a(i){return i.toString().substring(2,i.toString().length-2).replace(/\.\*\?$/,"*")}function f(i){return i instanceof Error?i.stack||i.message:i}function l(){console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.")}return n.enable(n.load()),n}var Te=Ee;(function(e,t){t.formatArgs=r,t.save=o,t.load=s,t.useColors=n,t.storage=c(),t.destroy=(()=>{let f=!1;return()=>{f||(f=!0,console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."))}})(),t.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"];function n(){return typeof window<"u"&&window.process&&(window.process.type==="renderer"||window.process.__nwjs)?!0:typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)?!1:typeof document<"u"&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||typeof window<"u"&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)}function r(f){if(f[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+f[0]+(this.useColors?"%c ":" ")+"+"+e.exports.humanize(this.diff),!this.useColors)return;const l="color: "+this.color;f.splice(1,0,l,"color: inherit");let i=0,u=0;f[0].replace(/%[a-zA-Z%]/g,d=>{d!=="%%"&&(i++,d==="%c"&&(u=i))}),f.splice(u,0,l)}t.log=console.debug||console.log||(()=>{});function o(f){try{f?t.storage.setItem("debug",f):t.storage.removeItem("debug")}catch{}}function s(){let f;try{f=t.storage.getItem("debug")}catch{}return!f&&typeof process<"u"&&"env"in process&&(f=process.env.DEBUG),f}function c(){try{return localStorage}catch{}}e.exports=Te(t);const{formatters:a}=e.exports;a.j=function(f){try{return JSON.stringify(f)}catch(l){return"[UnexpectedJSONParseError]: "+l.message}}})(te,te.exports);var je=function(e,t,n,r){function o(s){return s instanceof n?s:new n(function(c){c(s)})}return new(n||(n=Promise))(function(s,c){function a(i){try{l(r.next(i))}catch(u){c(u)}}function f(i){try{l(r.throw(i))}catch(u){c(u)}}function l(i){i.done?s(i.value):o(i.value).then(a,f)}l((r=r.apply(e,t||[])).next())})};class z{constructor(t){this._baseObserver=t,this._pendingPromises=new Set}complete(){Promise.all(this._pendingPromises).then(()=>this._baseObserver.complete()).catch(t=>this._baseObserver.error(t))}error(t){this._baseObserver.error(t)}schedule(t){const n=Promise.all(this._pendingPromises),r=[],o=c=>r.push(c),s=Promise.resolve().then(()=>je(this,void 0,void 0,function*(){yield n,yield t(o),this._pendingPromises.delete(s);for(const c of r)this._baseObserver.next(c)})).catch(c=>{this._pendingPromises.delete(s),this._baseObserver.error(c)});this._pendingPromises.add(s)}}const re=()=>typeof Symbol=="function",k=e=>re()&&Boolean(Symbol[e]),Z=e=>k(e)?Symbol[e]:"@@"+e;k("asyncIterator")||(Symbol.asyncIterator=Symbol.asyncIterator||Symbol.for("Symbol.asyncIterator"));const Oe=Z("iterator"),H=Z("observable"),oe=Z("species");function I(e,t){const n=e[t];if(n!=null){if(typeof n!="function")throw new TypeError(n+" is not a function");return n}}function $(e){let t=e.constructor;return t!==void 0&&(t=t[oe],t===null&&(t=void 0)),t!==void 0?t:b}function ke(e){return e instanceof b}function E(e){E.log?E.log(e):setTimeout(()=>{throw e},0)}function R(e){Promise.resolve().then(()=>{try{e()}catch(t){E(t)}})}function se(e){const t=e._cleanup;if(t!==void 0&&(e._cleanup=void 0,!!t))try{if(typeof t=="function")t();else{const n=I(t,"unsubscribe");n&&n.call(t)}}catch(n){E(n)}}function K(e){e._observer=void 0,e._queue=void 0,e._state="closed"}function $e(e){const t=e._queue;if(!!t){e._queue=void 0,e._state="ready";for(const n of t)if(ie(e,n.type,n.value),e._state==="closed")break}}function ie(e,t,n){e._state="running";const r=e._observer;try{const o=r?I(r,t):void 0;switch(t){case"next":o&&o.call(r,n);break;case"error":if(K(e),o)o.call(r,n);else throw n;break;case"complete":K(e),o&&o.call(r);break}}catch(o){E(o)}e._state==="closed"?se(e):e._state==="running"&&(e._state="ready")}function Y(e,t,n){if(e._state!=="closed"){if(e._state==="buffering"){e._queue=e._queue||[],e._queue.push({type:t,value:n});return}if(e._state!=="ready"){e._state="buffering",e._queue=[{type:t,value:n}],R(()=>$e(e));return}ie(e,t,n)}}class Pe{constructor(t,n){this._cleanup=void 0,this._observer=t,this._queue=void 0,this._state="initializing";const r=new Ae(this);try{this._cleanup=n.call(void 0,r)}catch(o){r.error(o)}this._state==="initializing"&&(this._state="ready")}get closed(){return this._state==="closed"}unsubscribe(){this._state!=="closed"&&(K(this),se(this))}}class Ae{constructor(t){this._subscription=t}get closed(){return this._subscription._state==="closed"}next(t){Y(this._subscription,"next",t)}error(t){Y(this._subscription,"error",t)}complete(){Y(this._subscription,"complete")}}class b{constructor(t){if(!(this instanceof b))throw new TypeError("Observable cannot be called as a function");if(typeof t!="function")throw new TypeError("Observable initializer must be a function");this._subscriber=t}subscribe(t,n,r){return(typeof t!="object"||t===null)&&(t={next:t,error:n,complete:r}),new Pe(t,this._subscriber)}pipe(t,...n){let r=this;for(const o of[t,...n])r=o(r);return r}tap(t,n,r){const o=typeof t!="object"||t===null?{next:t,error:n,complete:r}:t;return new b(s=>this.subscribe({next(c){o.next&&o.next(c),s.next(c)},error(c){o.error&&o.error(c),s.error(c)},complete(){o.complete&&o.complete(),s.complete()},start(c){o.start&&o.start(c)}}))}forEach(t){return new Promise((n,r)=>{if(typeof t!="function"){r(new TypeError(t+" is not a function"));return}function o(){s.unsubscribe(),n(void 0)}const s=this.subscribe({next(c){try{t(c,o)}catch(a){r(a),s.unsubscribe()}},error(c){r(c)},complete(){n(void 0)}})})}map(t){if(typeof t!="function")throw new TypeError(t+" is not a function");const n=$(this);return new n(r=>this.subscribe({next(o){let s=o;try{s=t(o)}catch(c){return r.error(c)}r.next(s)},error(o){r.error(o)},complete(){r.complete()}}))}filter(t){if(typeof t!="function")throw new TypeError(t+" is not a function");const n=$(this);return new n(r=>this.subscribe({next(o){try{if(!t(o))return}catch(s){return r.error(s)}r.next(o)},error(o){r.error(o)},complete(){r.complete()}}))}reduce(t,n){if(typeof t!="function")throw new TypeError(t+" is not a function");const r=$(this),o=arguments.length>1;let s=!1,c=n;return new r(a=>this.subscribe({next(f){const l=!s;if(s=!0,!l||o)try{c=t(c,f)}catch(i){return a.error(i)}else c=f},error(f){a.error(f)},complete(){if(!s&&!o)return a.error(new TypeError("Cannot reduce an empty sequence"));a.next(c),a.complete()}}))}concat(...t){const n=$(this);return new n(r=>{let o,s=0;function c(a){o=a.subscribe({next(f){r.next(f)},error(f){r.error(f)},complete(){s===t.length?(o=void 0,r.complete()):c(n.from(t[s++]))}})}return c(this),()=>{o&&(o.unsubscribe(),o=void 0)}})}flatMap(t){if(typeof t!="function")throw new TypeError(t+" is not a function");const n=$(this);return new n(r=>{const o=[],s=this.subscribe({next(a){let f;if(t)try{f=t(a)}catch(i){return r.error(i)}else f=a;const l=n.from(f).subscribe({next(i){r.next(i)},error(i){r.error(i)},complete(){const i=o.indexOf(l);i>=0&&o.splice(i,1),c()}});o.push(l)},error(a){r.error(a)},complete(){c()}});function c(){s.closed&&o.length===0&&r.complete()}return()=>{o.forEach(a=>a.unsubscribe()),s.unsubscribe()}})}[H](){return this}static from(t){const n=typeof this=="function"?this:b;if(t==null)throw new TypeError(t+" is not an object");const r=I(t,H);if(r){const o=r.call(t);if(Object(o)!==o)throw new TypeError(o+" is not an object");return ke(o)&&o.constructor===n?o:new n(s=>o.subscribe(s))}if(k("iterator")){const o=I(t,Oe);if(o)return new n(s=>{R(()=>{if(!s.closed){for(const c of o.call(t))if(s.next(c),s.closed)return;s.complete()}})})}if(Array.isArray(t))return new n(o=>{R(()=>{if(!o.closed){for(const s of t)if(o.next(s),o.closed)return;o.complete()}})});throw new TypeError(t+" is not observable")}static of(...t){const n=typeof this=="function"?this:b;return new n(r=>{R(()=>{if(!r.closed){for(const o of t)if(r.next(o),r.closed)return;r.complete()}})})}static get[oe](){return this}}re()&&Object.defineProperty(b,Symbol("extensions"),{value:{symbol:H,hostReportError:E},configurable:!0});function M(e){typeof e=="function"?e():e&&typeof e.unsubscribe=="function"&&e.unsubscribe()}var ze=function(e,t,n,r){function o(s){return s instanceof n?s:new n(function(c){c(s)})}return new(n||(n=Promise))(function(s,c){function a(i){try{l(r.next(i))}catch(u){c(u)}}function f(i){try{l(r.throw(i))}catch(u){c(u)}}function l(i){i.done?s(i.value):o(i.value).then(a,f)}l((r=r.apply(e,t||[])).next())})};function Ie(e){return t=>new b(n=>{const r=new z(n),o=t.subscribe({complete(){r.complete()},error(s){r.error(s)},next(s){r.schedule(c=>ze(this,void 0,void 0,function*(){(yield e(s))&&c(s)}))}});return()=>M(o)})}function Re(e){return e&&k("asyncIterator")&&e[Symbol.asyncIterator]}function qe(e){return e&&k("iterator")&&e[Symbol.iterator]}var Ne=function(e,t,n,r){function o(s){return s instanceof n?s:new n(function(c){c(s)})}return new(n||(n=Promise))(function(s,c){function a(i){try{l(r.next(i))}catch(u){c(u)}}function f(i){try{l(r.throw(i))}catch(u){c(u)}}function l(i){i.done?s(i.value):o(i.value).then(a,f)}l((r=r.apply(e,t||[])).next())})},Le=function(e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var t=e[Symbol.asyncIterator],n;return t?t.call(e):(e=typeof __values=="function"?__values(e):e[Symbol.iterator](),n={},r("next"),r("throw"),r("return"),n[Symbol.asyncIterator]=function(){return this},n);function r(s){n[s]=e[s]&&function(c){return new Promise(function(a,f){c=e[s](c),o(a,f,c.done,c.value)})}}function o(s,c,a,f){Promise.resolve(f).then(function(l){s({value:l,done:a})},c)}};function Je(e){return t=>new b(n=>{const r=new z(n),o=t.subscribe({complete(){r.complete()},error(s){r.error(s)},next(s){r.schedule(c=>Ne(this,void 0,void 0,function*(){var a,f;const l=yield e(s);if(qe(l)||Re(l))try{for(var i=Le(l),u;u=yield i.next(),!u.done;){const d=u.value;c(d)}}catch(d){a={error:d}}finally{try{u&&!u.done&&(f=i.return)&&(yield f.call(i))}finally{if(a)throw a.error}}else l.map(d=>c(d))}))}});return()=>M(o)})}function We(e){return new b(t=>{let n=0;const r=setInterval(()=>{t.next(n++)},e);return()=>clearInterval(r)})}var Ge=function(e,t,n,r){function o(s){return s instanceof n?s:new n(function(c){c(s)})}return new(n||(n=Promise))(function(s,c){function a(i){try{l(r.next(i))}catch(u){c(u)}}function f(i){try{l(r.throw(i))}catch(u){c(u)}}function l(i){i.done?s(i.value):o(i.value).then(a,f)}l((r=r.apply(e,t||[])).next())})};function Ve(e){return t=>new b(n=>{const r=new z(n),o=t.subscribe({complete(){r.complete()},error(s){r.error(s)},next(s){r.schedule(c=>Ge(this,void 0,void 0,function*(){const a=yield e(s);c(a)}))}});return()=>M(o)})}function ce(...e){return e.length===0?b.from([]):new b(t=>{let n=0;const r=e.map(s=>s.subscribe({error(c){t.error(c),o()},next(c){t.next(c)},complete(){++n===e.length&&(t.complete(),o())}})),o=()=>{r.forEach(s=>M(s))};return o})}class Be extends b{constructor(){super(t=>(this._observers.add(t),()=>this._observers.delete(t))),this._observers=new Set}next(t){for(const n of this._observers)n.next(t)}error(t){for(const n of this._observers)n.error(t)}complete(){for(const t of this._observers)t.complete()}}var ue=Be;function Ze(e){const t=new ue;let n,r=0;return new b(o=>{n||(n=e.subscribe(t));const s=t.subscribe(o);return r++,()=>{r--,s.unsubscribe(),r===0&&(M(n),n=void 0)}})}var He=function(e,t,n,r){function o(s){return s instanceof n?s:new n(function(c){c(s)})}return new(n||(n=Promise))(function(s,c){function a(i){try{l(r.next(i))}catch(u){c(u)}}function f(i){try{l(r.throw(i))}catch(u){c(u)}}function l(i){i.done?s(i.value):o(i.value).then(a,f)}l((r=r.apply(e,t||[])).next())})};function Ke(e,t){return n=>new b(r=>{let o,s=0;const c=new z(r),a=n.subscribe({complete(){c.complete()},error(f){c.error(f)},next(f){c.schedule(l=>He(this,void 0,void 0,function*(){o=yield e(s===0?typeof t>"u"?f:t:o,f,s++),l(o)}))}});return()=>M(a)})}var Ye=Object.freeze({__proto__:null,filter:Ie,flatMap:Je,interval:We,map:Ve,merge:ce,multicast:Ze,Observable:b,scan:Ke,Subject:ue,unsubscribe:M});const Qe=Symbol("thread.transferable");function Xe(e){return e&&typeof e=="object"&&e[Qe]}var q;(function(e){e.cancel="cancel",e.run="run"})(q||(q={}));var _;(function(e){e.error="error",e.init="init",e.result="result",e.running="running",e.uncaughtError="uncaughtError"})(_||(_={}));var De=e=>e?typeof Symbol.observable=="symbol"&&typeof e[Symbol.observable]=="function"?e===e[Symbol.observable]():typeof e["@@observable"]=="function"?e===e["@@observable"]():!1:!1,h={isWorkerRuntime:function(){const t=typeof self<"u"&&typeof Window<"u"&&self instanceof Window;return!!(typeof self<"u"&&self.postMessage&&!t)},postMessageToMaster:function(t,n){self.postMessage(t,n)},subscribeToMasterMessages:function(t){const n=o=>{t(o.data)},r=()=>{self.removeEventListener("message",n)};return self.addEventListener("message",n),r}},Ue=function(e,t,n,r){function o(s){return s instanceof n?s:new n(function(c){c(s)})}return new(n||(n=Promise))(function(s,c){function a(i){try{l(r.next(i))}catch(u){c(u)}}function f(i){try{l(r.throw(i))}catch(u){c(u)}}function l(i){i.done?s(i.value):o(i.value).then(a,f)}l((r=r.apply(e,t||[])).next())})};let ae=!1;const P=new Map,et=e=>e&&e.type===q.cancel,fe=e=>e&&e.type===q.run,le=e=>De(e)||tt(e);function tt(e){return e&&typeof e=="object"&&typeof e.subscribe=="function"}function de(e){return Xe(e)?{payload:e.send,transferables:e.transferables}:{payload:e,transferables:void 0}}function nt(){const e={type:_.init,exposed:{type:"function"}};h.postMessageToMaster(e)}function rt(e){const t={type:_.init,exposed:{type:"module",methods:e}};h.postMessageToMaster(t)}function Q(e,t){const{payload:n,transferables:r}=de(t),o={type:_.error,uid:e,error:x(n)};h.postMessageToMaster(o,r)}function X(e,t,n){const{payload:r,transferables:o}=de(n),s={type:_.result,uid:e,complete:t?!0:void 0,payload:r};h.postMessageToMaster(s,o)}function ot(e,t){const n={type:_.running,uid:e,resultType:t};h.postMessageToMaster(n)}function N(e){try{const t={type:_.uncaughtError,error:x(e)};h.postMessageToMaster(t)}catch(t){console.error(`Not reporting uncaught error back to master thread as it occured while reporting an uncaught error already.
Latest error:`,t,`
Original error:`,e)}}function be(e,t,n){return Ue(this,void 0,void 0,function*(){let r;try{r=t(...n)}catch(s){return Q(e,s)}const o=le(r)?"observable":"promise";if(ot(e,o),le(r)){const s=r.subscribe(c=>X(e,!1,x(c)),c=>{Q(e,x(c)),P.delete(e)},()=>{X(e,!0),P.delete(e)});P.set(e,s)}else try{const s=yield r;X(e,!0,x(s))}catch(s){Q(e,x(s))}})}function st(e){if(!h.isWorkerRuntime())throw Error("expose() called in the master thread.");if(ae)throw Error("expose() called more than once. This is not possible. Pass an object to expose() if you want to expose multiple functions.");if(ae=!0,typeof e=="function")h.subscribeToMasterMessages(t=>{fe(t)&&!t.method&&be(t.uid,e,t.args.map(ee))}),nt();else if(typeof e=="object"&&e){h.subscribeToMasterMessages(n=>{fe(n)&&n.method&&be(n.uid,e[n.method],n.args.map(ee))});const t=Object.keys(e).filter(n=>typeof e[n]=="function");rt(t)}else throw Error(`Invalid argument passed to expose(). Expected a function or an object, got: ${e}`);h.subscribeToMasterMessages(t=>{if(et(t)){const n=t.uid,r=P.get(n);r&&(r.unsubscribe(),P.delete(n))}})}typeof self<"u"&&typeof self.addEventListener=="function"&&h.isWorkerRuntime()&&(self.addEventListener("error",e=>{setTimeout(()=>N(e.error||e),250)}),self.addEventListener("unhandledrejection",e=>{const t=e.reason;t&&typeof t.message=="string"&&setTimeout(()=>N(t),250)})),typeof process<"u"&&typeof process.on=="function"&&h.isWorkerRuntime()&&(process.on("uncaughtException",e=>{setTimeout(()=>N(e),250)}),process.on("unhandledRejection",e=>{e&&typeof e.message=="string"&&setTimeout(()=>N(e),250)}));var it=typeof global=="object"&&global&&global.Object===Object&&global,ct=it,ut=typeof self=="object"&&self&&self.Object===Object&&self,at=ct||ut||Function("return this")(),ft=at,lt=ft.Symbol,L=lt,pe=Object.prototype,dt=pe.hasOwnProperty,bt=pe.toString,A=L?L.toStringTag:void 0;function pt(e){var t=dt.call(e,A),n=e[A];try{e[A]=void 0;var r=!0}catch{}var o=bt.call(e);return r&&(t?e[A]=n:delete e[A]),o}var yt=Object.prototype,mt=yt.toString;function ht(e){return mt.call(e)}var gt="[object Null]",wt="[object Undefined]",ye=L?L.toStringTag:void 0;function me(e){return e==null?e===void 0?wt:gt:ye&&ye in Object(e)?pt(e):ht(e)}function Ct(e){return e!=null&&typeof e=="object"}var _t="[object Symbol]";function vt(e){return typeof e=="symbol"||Ct(e)&&me(e)==_t}function Ft(e){var t=typeof e;return e!=null&&(t=="object"||t=="function")}function St(e){return e}var Mt="[object AsyncFunction]",xt="[object Function]",Et="[object GeneratorFunction]",Tt="[object Proxy]";function jt(e){if(!Ft(e))return!1;var t=me(e);return t==xt||t==Et||t==Mt||t==Tt}function Ot(e,t){return e>t}function kt(e){return e===void 0}function $t(e,t,n){for(var r=-1,o=e.length;++r<o;){var s=e[r],c=t(s);if(c!=null&&(a===void 0?c===c&&!vt(c):n(c,a)))var a=c,f=s}return f}function Pt(e){return e&&e.length?$t(e,St,Ot):void 0}var he={},At=Me(Ye);(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.Subject=e.Observable=void 0;const t=At;Object.defineProperty(e,"Observable",{enumerable:!0,get:function(){return t.Observable}});const n=Symbol("observers");class r extends t.Observable{constructor(){super(s=>(this[n]=[...this[n]||[],s],()=>{this[n]=this[n].filter(a=>a!==s)})),this[n]=[]}complete(){this[n].forEach(s=>s.complete())}error(s){this[n].forEach(c=>c.error(s))}next(s){this[n].forEach(c=>c.next(s))}}e.Subject=r})(he);var ge=Se(he);const J=ge.Observable,W=ge.Subject,zt=()=>({type:"pre"}),It=()=>({type:"post"}),Rt=e=>({type:"lineno",payload:e}),qt=()=>({type:"ready"}),we=()=>({type:"running"}),Nt=()=>({type:"paused"}),Lt=()=>({type:"completed"}),Jt=async(e=1e3)=>{await new Promise(t=>setTimeout(t,e))},Wt=()=>Jt(1),G=async(e=2)=>{for(let t=0;t<.23*e*1e3;t++)await Wt()};var Gt=()=>{let e=!1,t=!1,n,r,o=0;const s=new W,c=new W,a=new W,f=new W,l=y=>f.next(y);function i(){e=!0,r=new Promise(y=>{n=()=>(e=!1,y(null))})}function u(){return[f,c,s]}function d(y,O,F){return a.next(qt()),async(C,g,...S)=>{a.next(we()),await G(.2),await y(C,g,...S),c.next(zt()),await F(),c.next(It()),await O(C,g,...S),c.next(Lt())}}async function w(){return e&&(l(`${o} is paused`),a.next(Nt()),await r),a.next(we()),null}async function j(y,O){a.next(Rt(y)),t&&i(),await w()}function m(){t=!1}let p={};return{Demo:(y,O,F)=>({update(C){const[g,S,V]=C;p[g][S]=V},memory_msg(){return J.from(s)},core_msg(){return ce(J.from(c),J.from(a))},debug_msg(){return J.from(f)},resume(){if(e&&!kt(n))return l(`resume ${o}`),n(null);l("this cpu is not paused")},request_pause(){e?l("already paused"):(l("request_pause"),i())},enable_breakpoints(){t=!0},disable_breakpoints:m,async run(C,...g){l(`${C} starts running with args ${JSON.stringify(g)}`),o=C,p={...g.pop()};const S=await d(y,O,F)(u,C,...g,p);return l(`${C} completed`),m(),[S,C]}}),pause_stub:w,break_point:j}};const Ce=99,Vt=-99,Bt=0;Promise.resolve();function _e(e,t){function n(o){return{set(s,c,a){return s[Number(c)]=a,e.next([o,Number(c),a]),!0},get(s,c){const a=s[c];return jt(a)?a.bind(s):a}}}const r={};for(const o in t)r[o]=new Proxy(t[o],n(o)),e.next([o,Array.from(t[o])]);return r}const{Demo:Zt,break_point:T,pause_stub:ve}=Gt();function Ht(e,...t){const[n,r]=t;return Array.from(n).map((o,s)=>[o,s]).filter(([,o])=>o!==e).filter(([o,s])=>o!=Bt).filter(([,o])=>r[o]===Ce).map(([o,s])=>o===n[e]?s<e:o<n[e]).some(o=>o)}async function Kt(e,t,n){const[r,,o]=e();r.next("lock received args: ",n);const{flag:s,label:c}=_e(o,n);r.next("memory",s,c),await G(.1*Math.random()),s[t]=Ce,await T(1),c[t]=Pt(c)+1,await T(2),await T(3);do await T(51),await G(.1);while(Ht(t,c,s));await T(4)}async function Yt(e,t,n){const[r,,o]=e();await ve();const{flag:s}=_e(o,n);await T(5),s[t]=Vt,r.next("unlock"),await ve()}st(Zt(Kt,Yt,G))})();