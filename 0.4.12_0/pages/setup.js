(()=>{var g=chrome;var l="https://api.nopecha.com",n="https://www.nopecha.com",h="https://developers.nopecha.com",T={doc:{url:h,automation:{url:`${h}/guides/extension_advanced/#automation-build`}},api:{url:l,recognition:{url:`${l}/recognition`},status:{url:`${l}/status`}},www:{url:n,annoucement:{url:`${n}/json/announcement.json`},demo:{url:`${n}/demo`,hcaptcha:{url:`${n}/demo/hcaptcha`},recaptcha:{url:`${n}/demo/recaptcha`},funcaptcha:{url:`${n}/demo/funcaptcha`},awscaptcha:{url:`${n}/demo/awscaptcha`},textcaptcha:{url:`${n}/demo/textcaptcha`},turnstile:{url:`${n}/demo/turnstile`},perimeterx:{url:`${n}/demo/perimeterx`},geetest:{url:`${n}/demo/geetest`},lemincaptcha:{url:`${n}/demo/lemincaptcha`}},manage:{url:`${n}/manage`},pricing:{url:`${n}/pricing`},setup:{url:`${n}/setup`}},discord:{url:`${n}/discord`},github:{url:`${n}/github`,release:{url:`${n}/github/release`}}};function f(e){let t=("bac8fe67f7824ec3da5dcab01c212ec3d24f95547e178b14236f731b54791ebc"+e).split("").map(o=>o.charCodeAt(0));return y(t)}var b=new Uint32Array(256);for(let e=256;e--;){let t=e;for(let o=8;o--;)t=t&1?3988292384^t>>>1:t>>>1;b[e]=t}function y(e){let t=-1;for(let o of e)t=t>>>8^b[t&255^o];return(t^-1)>>>0}async function x(e,t){let o=""+[+new Date,performance.now(),Math.random()],[s,r]=await new Promise(c=>{g.runtime.sendMessage([o,e,...t],c)});if(s===f(o))return r}function m(e){if(document.readyState!=="loading")setTimeout(e,0);else{let t;t=()=>{removeEventListener("DOMContentLoaded",t),e()},addEventListener("DOMContentLoaded",t)}}[...document.body.children].forEach(e=>e.remove());function a(e,t,o={}){let s=document.createElement(e);return o&&Object.entries(o).forEach(([r,c])=>s[r]=c),t.appendChild(s),s}function $(){a("h1",document.body,{innerText:"Invalid URL."}),a("h2",document.body,{innerText:"Please set the URL hash and reload the page."}),a("p",document.body,{innerText:"Example: https://nopecha.com/setup#TESTKEY123"})}function w(e){return/^(true|false)$/.test(e)?e==="true":/^\d+$/.test(e)?+e:e}function _(){let e="NopeCHA Settings Import",t=document.querySelector("title");document.title!==e&&t&&(t.innerText=e);let o=document.location.hash.substring(1);if(!o)return $();let s=o.split("|"),r=Object.fromEntries(s.map(i=>i.includes("=")?i.split("="):["key",i]).map(([i,d])=>[i,w(d)]));if("disabled_hosts"in r){let i=""+r.disabled_hosts;i===""?r.disabled_hosts=[]:decodeURIComponent(i).startsWith("[")?r.disabled_hosts=JSON.parse(decodeURIComponent(i)):r.disabled_hosts=i.split(",")}"key"in r&&r.key.includes(",")&&(r.keys=r.key.split(","),delete r.key),console.log(r),a("h2",document.body,{innerText:"Imported following settings:"});let c=a("table",document.body),u=a("tr",c);a("th",u,{innerText:"Name"}),a("th",u,{innerText:"Value"}),Object.entries(r).forEach(([i,d])=>{let p=a("tr",c);a("td",p,{innerText:i}),a("td",p,{innerText:JSON.stringify(d)})}),a("h2",document.body,{innerText:"Import URL:"}),a("a",document.body,{innerText:location.href,href:location.href,style:"word-wrap: break-word"}),x("settings::update",[r])}m(_);})();
