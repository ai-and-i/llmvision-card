import{C as e,E as t,S as n,_ as r,b as i,c as a,d as o,f as s,g as c,h as l,i as u,l as d,m as f,n as p,o as m,p as h,t as g,u as _,v,w as y,x as b,y as x}from"./shared-D-sC6KNL.js";var S,C=t((()=>{S=`1.7.2`}));function w(e){return e&&Number.isFinite(Number(e.frame))&&Array.isArray(e.box_2d)&&e.box_2d.length===4&&e.box_2d.every(e=>Number.isFinite(Number(e)))}function T(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}function E(e,t=()=>null){let n=[];if(!T(e))return{rate:1,tracks:n};let r=Number(e.frame_rate)>0?Number(e.frame_rate):1;for(let[i,a,o]of B)for(let s of Array.isArray(e[i])?e[i]:[]){if(!T(s)||!Array.isArray(s.boxes))continue;let e=s.boxes.filter(w).map(e=>({t:(Number(e.frame)-1)/r,box:e.box_2d.map(Number)})).sort((e,t)=>e.t-t.t);if(!e.length)continue;let i=a(s),c=Number(s.count)>1?` ×${Number(s.count)}`:``,{color:l,text:u}=t(i,o)||R;n.push({label:`${i}${c}`,color:l,text:u,boxes:e})}return{rate:r,tracks:n}}function D(e){let t=[...new Set(e.filter(w).map(e=>Number(e.frame)))].sort((e,t)=>e-t);if(!t.length)return``;let n=[];for(let e of t){let t=n[n.length-1];t&&e===t[1]+1?t[1]=e:n.push([e,e])}let r=n.map(([e,t])=>e===t?`${e}`:`${e}–${t}`).join(`, `);return`${t.length===1?`frame`:`frames`} ${r}`}function O(e){if(!T(e))return e;let t={...e};delete t.frame_rate;for(let[e]of B)Array.isArray(t[e])&&(t[e]=t[e].map(e=>{if(!T(e))return e;let{boxes:t,...n}=e;return Array.isArray(t)?{...n,boxes:D(t)}:n}));return t}function k(e,t,n){let r=(n-e.t)/(t.t-e.t),[i,a,o,s]=e.box.map((e,n)=>Math.min(1e3,Math.max(0,e+(t.box[n]-e)*r)));return o>i&&s>a?[i,a,o,s]:null}function A(e,t,n){let r=e.boxes,i=V*n+1e-6,a=r.findIndex(e=>e.t>t);a===-1&&(a=r.length);let o=r[a-1],s=r[a];if(o&&s&&s.t-o.t<=i)return k(o,s,t);if(o&&t-o.t<=n/2){let e=r[a-2];return e&&o.t-e.t<=i?k(e,o,t):o.box}if(s&&s.t-t<=n/2){let e=r[a+1];return e&&e.t-s.t<=i?k(s,e,t):s.box}return null}function j(){try{return localStorage.getItem(z)!==`off`}catch{return!0}}function M(e){try{localStorage.setItem(z,e?`on`:`off`)}catch{}window.dispatchEvent(new CustomEvent(H,{detail:{shown:e}}))}function N(e){let t=/-(\d+)\.jpe?g(?:$|[?#])/i.exec(String(e||``));return t?Number(t[1]):null}function P(e,t,n,r,i){if(!n||!(r>0)||!(i>0))return``;let a=(n-1)/t,o=[];for(let t of e)for(let e of t.boxes){if(Math.abs(e.t-a)>1e-6)continue;let[n,s,c,l]=e.box.map(e=>Math.min(1e3,Math.max(0,e)));if(c<=n||l<=s)continue;let u=s/1e3*r,d=n/1e3*i,f=(l-s)/1e3*r,p=(c-n)/1e3*i,m=String(t.color).replace(/[^#\w(),.%\s-]/g,``);o.push(`<rect x="${u.toFixed(1)}" y="${d.toFixed(1)}" width="${f.toFixed(1)}" height="${p.toFixed(1)}" stroke="${m}"/>`)}return o.length?`<svg class="llmvision-thumb-boxes" viewBox="0 0 ${r} ${i}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${o.join(``)}</svg>`:``}function F(){return document.fullscreenElement||document.webkitFullscreenElement||null}function I(e){let t=Number.isFinite(e)?Math.max(0,Math.floor(e)):0;return`${Math.floor(t/60)}:${String(t%60).padStart(2,`0`)}`}function L(e,t,{rate:n,tracks:r},{posterFrame:i=null}={}){if(!e||!t)return null;let a=1/n,o=!!(i&&t.getAttribute(`poster`)),s=new Image;o&&(s.addEventListener(`load`,()=>z()),s.src=t.getAttribute(`poster`));let c=()=>{o&&(o=!1,z())};t.addEventListener(`play`,c),t.addEventListener(`seeking`,c);let l=document.createElement(`div`);l.className=`llmvision-boxes-layer`;let u=r.map(e=>{let t=document.createElement(`div`);t.className=`llmvision-box`,t.style.setProperty(`--box-color`,e.color),t.style.setProperty(`--box-text`,e.text),t.hidden=!0;let n=document.createElement(`span`);return n.textContent=e.label,t.appendChild(n),l.appendChild(t),t});t.controls=!1,t.removeAttribute(`controls`),t.disablePictureInPicture=!0,t.setAttribute(`disablepictureinpicture`,``),t.setAttribute(`disableremoteplayback`,``);let d=(e,t)=>{let n=document.createElement(`button`);return n.type=`button`,n.className=e,t&&(n.innerHTML=G(t)),n},f=(e,t)=>{e.title=t,e.setAttribute(`aria-label`,t)},p=document.createElement(`div`);p.className=`llmvision-boxes-controls`;let m=d(`llmvision-boxes-play`),h=document.createElement(`span`);h.className=`llmvision-boxes-time`;let g=document.createElement(`input`);g.type=`range`,g.className=`llmvision-boxes-seek`,g.min=`0`,g.max=`0`,g.step=`any`,g.value=`0`,g.setAttribute(`aria-label`,`Seek`);let _=d(`llmvision-boxes-mute`),v=d(`llmvision-boxes-toggle`,`mdi:vector-square`),y=d(`llmvision-boxes-fullscreen`),b=d(`llmvision-boxes-zoom`);b.hidden=!0,p.append(m,h,g,b,_,v,y),v.hidden=!r.length;let x=document.createElement(`div`);x.className=`llmvision-boxes-stage`,t.before(x),x.append(t),e.append(l,p),[`click`,`dblclick`,`pointerdown`].forEach(e=>p.addEventListener(e,e=>e.stopPropagation()));let S=j(),C=e=>{S=e,l.hidden=!S,v.setAttribute(`aria-pressed`,String(S)),f(v,S?`Hide boxes`:`Show boxes`),z()};v.addEventListener(`click`,()=>{C(!S),M(S)});let w=!1,T=()=>{let e=t.paused||t.ended;m.innerHTML=G(e?`mdi:play`:`mdi:pause`),f(m,e?`Play`:`Pause`)},E=()=>{Number.isFinite(t.duration)&&(g.max=String(t.duration)),w||(g.value=String(t.currentTime)),h.textContent=`${I(t.currentTime)} / ${I(t.duration)}`},D=()=>{_.innerHTML=G(t.muted?`mdi:volume-off`:`mdi:volume-high`),f(_,t.muted?`Unmute`:`Mute`)},O=()=>{if(t.paused||t.ended){let e=t.play();e&&e.catch&&e.catch(()=>{})}else t.pause()};m.addEventListener(`click`,O),_.addEventListener(`click`,()=>{t.muted=!t.muted,D()}),g.addEventListener(`input`,()=>{w=!0,t.currentTime=Number(g.value),E(),z()}),g.addEventListener(`change`,()=>{w=!1}),[`play`,`pause`,`ended`].forEach(e=>t.addEventListener(e,()=>{T(),N()})),[`timeupdate`,`durationchange`,`loadedmetadata`].forEach(e=>t.addEventListener(e,E)),t.addEventListener(`volumechange`,D);let k=null,N=()=>{e.classList.remove(`llmvision-boxes-idle`),clearTimeout(k),!t.paused&&!t.ended&&(k=setTimeout(()=>e.classList.add(`llmvision-boxes-idle`),2500))};[`pointermove`,`pointerdown`,`keydown`].forEach(t=>e.addEventListener(t,N));let P=`mouse`,L=!1,R=null;t.addEventListener(`pointerdown`,t=>{P=t.pointerType||`mouse`,L=e.classList.contains(`llmvision-boxes-idle`)}),t.addEventListener(`click`,e=>{if(e.preventDefault(),U){U=!1;return}L&&P===`touch`||(clearTimeout(R),R=setTimeout(O,250))});function z(){let e=t.videoWidth||(o?s.naturalWidth:0),c=t.videoHeight||(o?s.naturalHeight:0);if(!S||!e||!c)return;let d=o?(i-1)/n:t.currentTime;Object.assign(l.style,{left:`${x.offsetLeft}px`,top:`${x.offsetTop}px`,width:`${x.offsetWidth}px`,height:`${x.offsetHeight}px`});let f=t.clientWidth,p=t.clientHeight,m=Math.min(f/e,p/c),h=e*m,g=c*m,_=t.offsetLeft+(f-h)/2,v=t.offsetTop+(p-g)/2,y=e=>V+(_+e/1e3*h)*B,b=e=>H+(v+e/1e3*g)*B;r.forEach((e,t)=>{let n=A(e,d,a),r=u[t];if(r.hidden=!n,!n)return;let[i,o,s,c]=n;Object.assign(r.style,{left:`${y(o)}px`,top:`${b(i)}px`,width:`${y(c)-y(o)}px`,height:`${b(s)-b(i)}px`}),r.classList.toggle(`below`,b(i)<18)})}let B=1,V=0,H=0,U=!1,W=()=>{let t=x.offsetWidth,n=x.offsetHeight;B=Math.min(8,Math.max(1,B)),B<1.02&&(B=1,V=0,H=0),V=Math.min(0,Math.max(t*(1-B),V)),H=Math.min(0,Math.max(n*(1-B),H)),x.style.transform=B===1?``:`translate(${V}px, ${H}px) scale(${B})`,e.classList.toggle(`llmvision-boxes-zoomed`,B>1),b.hidden=B===1,b.textContent=`${B<10?B.toFixed(1):Math.round(B)}×`,f(b,`Reset zoom`),z()},ee=()=>{B=1,W()};b.addEventListener(`click`,ee);let K=()=>{let t=e.getBoundingClientRect();return[t.left+e.clientLeft+x.offsetLeft,t.top+e.clientTop+x.offsetTop]},q=(e,t,n,r)=>{let[i,a]=r.origin,o=(t[0]-i-r.tx)/r.zoom,s=(t[1]-a-r.ty)/r.zoom;B=Math.min(8,Math.max(1,e)),V=n[0]-i-o*B,H=n[1]-a-s*B,W()},J=new Map,Y=null,te=()=>{let e=[...J.values()],t={origin:K(),zoom:B,tx:V,ty:H};if(e.length>=2){let[n,r]=e;Y={...t,kind:`pinch`,distance:Math.hypot(n[0]-r[0],n[1]-r[1]),mid:[(n[0]+r[0])/2,(n[1]+r[1])/2]}}else Y=e.length===1&&B>1?{...t,kind:`pan`,point:e[0]}:e.length===1?{...t,kind:`none`,point:e[0]}:null};x.addEventListener(`pointerdown`,e=>{if(J.size===0&&(U=!1),J.set(e.pointerId,[e.clientX,e.clientY]),J.size>=2||B>1)for(let e of J.keys())try{x.setPointerCapture(e)}catch{}te()}),x.addEventListener(`pointermove`,e=>{if(!J.has(e.pointerId)||!Y)return;J.set(e.pointerId,[e.clientX,e.clientY]);let t=[...J.values()];if(Y.kind===`pinch`&&t.length>=2){let[n,r]=t,i=Math.hypot(n[0]-r[0],n[1]-r[1]),a=[(n[0]+r[0])/2,(n[1]+r[1])/2];q(Y.zoom*(i/(Y.distance||1)),Y.mid,a,Y),U=!0,e.preventDefault()}else if(Y.kind===`pan`){let t=e.clientX-Y.point[0],n=e.clientY-Y.point[1];Math.hypot(t,n)>6&&(U=!0),V=Y.tx+t,H=Y.ty+n,W(),e.preventDefault()}else Y.kind===`none`&&Math.hypot(e.clientX-Y.point[0],e.clientY-Y.point[1])>10&&(U=!0)});let ne=e=>{J.delete(e.pointerId)&&te()};[`pointerup`,`pointercancel`,`lostpointercapture`].forEach(e=>x.addEventListener(e,ne)),x.addEventListener(`wheel`,e=>{if(!e.ctrlKey&&!re())return;e.preventDefault();let t=[e.clientX,e.clientY];q(B*Math.exp(-e.deltaY*(e.ctrlKey?.01:.002)),t,t,{origin:K(),zoom:B,tx:V,ty:H})},{passive:!1}),x.addEventListener(`gesturestart`,e=>e.preventDefault());let X=!1,Z=null,re=()=>X||F()===e,ie=()=>{let e=re();y.innerHTML=G(e?`mdi:fullscreen-exit`:`mdi:fullscreen`),f(y,e?`Exit full screen`:`Full screen`)},Q=t=>{t!==X&&(X=t,X?(Z=document.createElement(`div`),Z.style.height=`${e.offsetHeight}px`,Z.style.marginTop=getComputedStyle(e).marginTop,e.before(Z),document.body.append(e)):Z&&=(Z.isConnected?Z.replaceWith(e):e.remove(),null),e.classList.toggle(`llmvision-boxes-expanded`,X),ee(),ie(),z())},ae=async()=>{let t=e.requestFullscreen||e.webkitRequestFullscreen;if(t){try{await(t.call(e)||new Promise(e=>setTimeout(e,300)))}catch{}if(F()===e)return}Q(!0)},oe=()=>{F()===e&&(document.exitFullscreen||document.webkitExitFullscreen)?.call(document),Q(!1)},se=()=>re()?oe():ae();y.addEventListener(`click`,se),t.addEventListener(`dblclick`,e=>{e.preventDefault(),clearTimeout(R),se()}),t.addEventListener(`webkitbeginfullscreen`,()=>{setTimeout(()=>{try{t.webkitExitFullscreen()}catch{}Q(!0)},0)});let ce=()=>{if(!e.isConnected&&!(Z&&Z.isConnected)){[`fullscreenchange`,`webkitfullscreenchange`].forEach(e=>document.removeEventListener(e,ce)),document.removeEventListener(`keydown`,le,!0);return}F()===t&&((document.exitFullscreen||document.webkitExitFullscreen)?.call(document),Q(!0)),ee(),ie(),z()},le=e=>{X&&e.key===`Escape`&&(e.stopPropagation(),e.preventDefault(),Q(!1))};[`fullscreenchange`,`webkitfullscreenchange`].forEach(e=>document.addEventListener(e,ce)),document.addEventListener(`keydown`,le,!0);let $=()=>{t.isConnected&&(z(),E(),t.requestVideoFrameCallback?t.requestVideoFrameCallback($):t.paused||requestAnimationFrame($))};if(t.requestVideoFrameCallback?t.requestVideoFrameCallback($):t.addEventListener(`play`,()=>requestAnimationFrame($)),[`loadedmetadata`,`seeked`,`timeupdate`].forEach(e=>t.addEventListener(e,z)),typeof ResizeObserver<`u`){let e=new ResizeObserver(()=>{if(!t.isConnected)return e.disconnect();W(),z()});e.observe(t)}return T(),E(),D(),ie(),C(S),{close(){t.pause(),F()===e&&(document.exitFullscreen||document.webkitExitFullscreen)?.call(document),Q(!1)}}}var R,z,B,V,H,U,W,ee,G,K=t((()=>{R={color:`#ffd600`,text:`#1f1f1f`},z=`llmvision-card-show-boxes`,B=[[`animals`,e=>String(e.species||`animal`).trim().toLowerCase(),`animal`],[`people`,e=>e.age===`child`?`child`:`person`,`person`]],V=2,H=`llmvision-card-boxes-toggled`,U=j,W=`
    .llmvision-thumb-boxes {
        position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none;
    }
    .llmvision-thumb-boxes rect {
        fill: none; stroke-width: 1.5px; vector-effect: non-scaling-stroke;
    }
    .llmvision-thumb-boxes[hidden] { display: none; }
`,ee=`
    /* media clips the stage (the clip), which zooms and pans. The boxes are
       drawn unzoomed on top at the zoomed positions, so lines and names stay
       sharp and keep their size. */
    .llmvision-boxes-media {
        position: relative; overflow: hidden; margin-top: 10px;
        --llmvision-video-radius: calc(var(--ha-card-border-radius, 25px) - 10px);
        border-radius: var(--llmvision-video-radius);
    }
    /* Touches on the clip are ours (pinch, pan): with pan-x pan-y a browser
       may take a two-finger move for a scroll and cancel the pinch */
    .llmvision-boxes-stage { position: relative; transform-origin: 0 0; touch-action: none; }
    .llmvision-boxes-media .llmvision-boxes-stage > video { display: block; margin: 0; border-radius: 0; cursor: pointer; }
    .llmvision-boxes-zoomed .llmvision-boxes-stage { touch-action: none; }
    .llmvision-boxes-zoomed .llmvision-boxes-stage > video { cursor: grab; }
    .llmvision-boxes-layer { position: absolute; pointer-events: none; overflow: hidden; }
    .llmvision-boxes-layer[hidden] { display: none; }
    .llmvision-box {
        position: absolute; box-sizing: border-box; border: 1px solid var(--box-color);
        border-radius: 2px;
    }
    .llmvision-box > span {
        position: absolute; left: -1px; bottom: 100%; padding: 1px 6px; border-radius: 3px 3px 3px 0;
        background: var(--box-color); color: var(--box-text, #1f1f1f); font: 600 12px/16px var(--ha-font-family-body, Roboto, sans-serif);
        white-space: nowrap; text-transform: capitalize;
    }
    .llmvision-box.below > span { bottom: auto; top: 100%; border-radius: 0 3px 3px 3px; }

    /* Our controls, along the bottom of the clip. They fade while it plays
       and nothing moves over it. */
    .llmvision-boxes-controls {
        position: absolute; left: 0; right: 0; bottom: 0; box-sizing: border-box;
        display: flex; align-items: center; gap: 2px; padding: 6px 8px;
        /* No tint over the clip: a shadow keeps icons and text readable on
           bright footage */
        color: #fff; font: 500 13px/1 var(--ha-font-family-body, Roboto, sans-serif);
        text-shadow: 0 0 3px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,0.8);
        filter: drop-shadow(0 0 2px rgba(0,0,0,0.75));
        transition: opacity 0.25s;
    }
    .llmvision-boxes-idle > .llmvision-boxes-controls { opacity: 0; pointer-events: none; }
    .llmvision-boxes-idle, .llmvision-boxes-idle > video { cursor: none; }
    .llmvision-boxes-controls button {
        flex: none; width: 40px; height: 40px; padding: 0; display: flex; align-items: center; justify-content: center;
        border: none; border-radius: 50%; background: transparent; color: #fff; cursor: pointer; --mdc-icon-size: 22px;
    }
    .llmvision-boxes-controls button:hover { background: rgba(255,255,255,0.15); }
    .llmvision-boxes-controls button[aria-pressed="false"] { color: rgba(255,255,255,0.55); }
    .llmvision-boxes-controls .llmvision-boxes-zoom {
        width: auto; min-width: 40px; padding: 0 8px; border-radius: 20px; font: inherit; font-weight: 600;
        background: rgba(255,255,255,0.18);
    }
    .llmvision-boxes-controls button[hidden] { display: none; }
    .llmvision-boxes-seek {
        flex: 1; min-width: 40px; margin: 0 8px; cursor: pointer; accent-color: var(--primary-color, #03a9f4);
    }
    .llmvision-boxes-time { flex: none; padding: 0 4px; white-space: nowrap; font-variant-numeric: tabular-nums; }

    /* Full screen with the boxes: the Fullscreen API on the clip and its
       boxes where the browser has it for any element, else (iPhone) the
       clip and boxes fixed over the whole page. The clip is centered on the
       whole screen; the controls keep clear of the notch, the status bar
       and the home indicator (safe areas). The rules
       are separate because a browser drops a whole rule with a selector it
       doesn't know. */
    .llmvision-boxes-media.llmvision-boxes-expanded {
        position: fixed; inset: 0; z-index: 10000; margin: 0; border-radius: 0; background: #000;
        overscroll-behavior: contain;
    }
    .llmvision-boxes-media:fullscreen { background: #000; border-radius: 0; }
    .llmvision-boxes-media:-webkit-full-screen { background: #000; border-radius: 0; }
    .llmvision-boxes-expanded > .llmvision-boxes-stage { width: 100%; height: 100%; touch-action: none; }
    .llmvision-boxes-media:fullscreen > .llmvision-boxes-stage { width: 100%; height: 100%; touch-action: none; }
    .llmvision-boxes-media:-webkit-full-screen > .llmvision-boxes-stage { width: 100%; height: 100%; touch-action: none; }
    .llmvision-boxes-expanded .llmvision-boxes-stage > video { width: 100%; height: 100%; max-height: none; object-fit: contain; }
    .llmvision-boxes-media:fullscreen .llmvision-boxes-stage > video { width: 100%; height: 100%; max-height: none; object-fit: contain; }
    .llmvision-boxes-media:-webkit-full-screen .llmvision-boxes-stage > video { width: 100%; height: 100%; max-height: none; object-fit: contain; }
    .llmvision-boxes-expanded > .llmvision-boxes-controls {
        border-radius: 0; left: env(safe-area-inset-left, 0px); right: env(safe-area-inset-right, 0px);
        bottom: env(safe-area-inset-bottom, 0px); padding-bottom: 10px;
    }
    .llmvision-boxes-media:fullscreen > .llmvision-boxes-controls { border-radius: 0; padding-bottom: 12px; }
    .llmvision-boxes-media:-webkit-full-screen > .llmvision-boxes-controls { border-radius: 0; padding-bottom: 12px; }
    /* Touch screens: also keep off the bottom edge when the page reports no
       safe area, where a swipe is a system gesture */
    @media (pointer: coarse) {
        .llmvision-boxes-expanded > .llmvision-boxes-controls { bottom: max(env(safe-area-inset-bottom, 0px), 24px); }
    }
`,G=e=>`<ha-icon icon="${e}"></ha-icon>`}));function q(e,t){let[n,r,i]=e.split(`.`);return t?n===`ratings`&&ue[r]?{type:`choice`,choices:ue[r]}:null:i===`species`?{type:`text`,placeholder:`species`}:i===`count`?{type:`number`,placeholder:`count`}:i===`age`&&$[n]?{type:`choice`,choices:$[n]}:null}function J(e,t,n,r){let i;return e.type===`choice`?(i=document.createElement(`select`),i.innerHTML=`<option value="">should be…</option>${e.choices.map(e=>`<option value="${e}">${e}</option>`).join(``)}`,i.value=e.choices.includes(t)?t:``,i.addEventListener(`change`,()=>n(i.value,!1))):(i=document.createElement(`input`),i.type=e.type===`number`?`number`:`text`,e.type===`number`&&(i.min=`1`,i.step=`1`,i.inputMode=`numeric`),i.placeholder=e.placeholder||`should be…`,i.value=t??``,i.addEventListener(`input`,()=>{let t=i.value.trim();n(e.type===`number`?t&&Math.max(1,Math.round(Number(t)))||``:t,!0)})),i.className=`fb-fix-input`,i.setAttribute(`aria-label`,r),i.addEventListener(`click`,e=>e.stopPropagation()),i}function Y(e,t){let n=de[e?.verdict];if(!n)return``;let[r,i,a,o]=n;return`<span class="${t}" data-feedback-badge style="background-color:${o};" title="Your feedback: ${i}"><ha-icon icon="${r}" style="color:${a};"></ha-icon><span class="text" style="text-transform:none;">${i}</span></span>`}function te(e){let t=`.${e}`;return`
    ${t}-feedback {
        margin: 4px 0 8px; font-family: var(--ha-font-family-body, Roboto, sans-serif);
    }
    ${t}-feedback-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
    ${t}-feedback-question { color: var(--secondary-text-color); margin-right: 4px; }
    ${t}-feedback-row button, ${t}-feedback-add {
        display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 18px;
        border: 1px solid var(--divider-color, rgba(0,0,0,0.2)); background: transparent;
        color: var(--primary-text-color); font: inherit; cursor: pointer; --mdc-icon-size: 18px;
    }
    ${t}-feedback-row button[aria-pressed="true"].correct {
        background: rgba(22,163,74,0.15); border-color: #16A34A;
    }
    ${t}-feedback-row button[aria-pressed="true"].incorrect {
        background: rgba(220,38,38,0.12); border-color: #DC2626;
    }
    ${t}-feedback-row button.correct ha-icon { color: #16A34A; }
    ${t}-feedback-row button.incorrect ha-icon { color: #DC2626; }
    ${t}-feedback-marking { margin-top: 8px; }
    ${t}-feedback-marking[hidden] { display: none; }
    ${t}-feedback-hint { margin: 0 0 6px; color: var(--secondary-text-color); font-size: 0.9em; line-height: 1.4; }
    ${t}-feedback-grade { font-weight: 500; }
    ${t}-feedback-grade.minor { color: #B45309; }
    ${t}-feedback-grade.wrong { color: #DC2626; }
    ${t}-feedback-other { display: flex; align-items: center; gap: 8px; margin: 8px 0; }
    ${t}-feedback-marking textarea {
        box-sizing: border-box; width: 100%; min-height: 64px; resize: vertical; padding: 8px 10px;
        border-radius: 8px; border: 1px solid var(--divider-color, rgba(0,0,0,0.2));
        background: var(--card-background-color, transparent); color: var(--primary-text-color);
        /* 16px keeps iOS from zooming in on focus */
        font: 16px/1.4 var(--ha-font-family-body, Roboto, sans-serif);
    }
    ${t}-feedback-actions { display: flex; align-items: center; gap: 10px; margin-top: 6px; }
    ${t}-feedback-actions button {
        padding: 6px 14px; border-radius: 16px; border: none; cursor: pointer; font: inherit;
        background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #fff);
    }
    ${t}-feedback-status { color: var(--secondary-text-color); font-size: 0.9em; }
    ${t}-feedback-status.error { color: var(--error-color, #DC2626); }

    /* Mark buttons, shown only while marking */
    .fb-mark {
        display: none; vertical-align: middle; margin-left: 6px; padding: 0 7px; height: 22px;
        min-width: 26px; box-sizing: border-box; align-items: center; justify-content: center; gap: 3px;
        border-radius: 11px; border: 1px dashed var(--secondary-text-color, #888); background: transparent;
        color: var(--secondary-text-color); cursor: pointer; white-space: nowrap;
        font: 500 12px/1 var(--ha-font-family-body, Roboto, sans-serif); --mdc-icon-size: 14px;
    }
    .fb-marking .fb-mark { display: inline-flex; }
    .fb-mark.minor { border: 1px solid #D97706; background: #F59E0B; color: #1f1f1f; }
    .fb-mark.wrong { border: 1px solid #B91C1C; background: #DC2626; color: #fff; }
    .fb-mark-cell { display: none; width: 1px; padding-right: 0 !important; }
    .fb-marking .fb-mark-cell { display: table-cell; }
    .fb-mark-cell .fb-mark { margin-left: 0; }
    .fb-marking [data-fb="minor"]:not(tr), .fb-marking tr[data-fb="minor"] > * { background: rgba(245,158,11,0.16); }
    .fb-marking [data-fb="wrong"]:not(tr), .fb-marking tr[data-fb="wrong"] > * { background: rgba(220,38,38,0.13); }
    .fb-marking tr[data-row="item"][data-fb] > :not(.fb-mark-cell) { text-decoration: line-through; }
    .fb-fix { display: none; align-items: center; gap: 4px; margin: 4px 0 0 6px; font-size: 12px; color: var(--secondary-text-color); text-decoration: none; }
    .fb-marking .fb-fix.on { display: inline-flex; }
    .fb-fix-input {
        box-sizing: border-box; height: 26px; padding: 0 6px; border-radius: 6px; max-width: 160px;
        border: 1px solid var(--divider-color, rgba(0,0,0,0.25)); background: var(--card-background-color, #fff);
        color: var(--primary-text-color); font: 14px var(--ha-font-family-body, Roboto, sans-serif);
    }
    input.fb-fix-input[type="number"] { width: 64px; }
    .fb-missed { display: none; margin-top: 6px; }
    .fb-marking .fb-missed { display: block; }
    .fb-missed-item { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin: 4px 0; }
    .fb-missed-item .fb-mark { margin-left: 0; }
    .fb-missed-remove {
        border: none; background: transparent; color: var(--secondary-text-color); cursor: pointer;
        padding: 2px; --mdc-icon-size: 16px; display: inline-flex;
    }
    ${t}-feedback-add { padding: 3px 10px; font-size: 0.9em; --mdc-icon-size: 16px; }
    `}function ne(e){return`
    <div class="${e}-feedback">
        <div class="${e}-feedback-row">
            <span class="${e}-feedback-question">Is this right?</span>
            <button type="button" class="correct" aria-pressed="false"><ha-icon icon="mdi:check-circle-outline"></ha-icon><span>Everything correct</span></button>
            <button type="button" class="incorrect" aria-pressed="false"><ha-icon icon="mdi:close-circle-outline"></ha-icon><span>Something's wrong</span></button>
            <span class="${e}-feedback-status" role="status"></span>
        </div>
        <div class="${e}-feedback-marking" hidden>
            <p class="${e}-feedback-hint">Tap <ha-icon icon="mdi:flag-outline" style="--mdc-icon-size:14px"></ha-icon> next to anything wrong: once for a minor issue, twice for wrong. The button at the start of a row means it isn't really there. Everything left unmarked counts as correct. Where you can, say what it should be: that lets future versions be checked against your answer.</p>
            <div><span class="${e}-feedback-grade" role="status"></span></div>
            <div class="${e}-feedback-other"><span>Something else</span></div>
            <textarea maxlength="${oe}" placeholder="Anything to add? (optional)"></textarea>
            <div class="${e}-feedback-actions">
                <button type="button" class="save">Save</button>
            </div>
        </div>
    </div>`}function X(e){let t=document.createElement(`button`);return t.type=`button`,t.className=`fb-mark`,t.dataset.title=e,t}function Z(e,t){e.classList.toggle(`minor`,t===`minor`),e.classList.toggle(`wrong`,t===`wrong`),e.innerHTML=t?`<span>${t===`minor`?`Minor`:`Wrong`}</span>`:`<ha-icon icon="mdi:flag-outline"></ha-icon>`;let n=e.dataset.title;e.title=t?`${n}: marked ${t} (tap to change)`:`Mark: ${n}`,e.setAttribute(`aria-label`,e.title)}function re(e){let t=[...e.values()];return t.includes(`wrong`)?`wrong`:t.length?`minor`:``}function ie(e,t,{feedback:n,save:r,formatTime:i,onSaved:a}){let o=e.querySelector(`.${t}-feedback`);if(!o)return;let s=o.querySelector(`button.correct`),c=o.querySelector(`button.incorrect`),l=o.querySelector(`.${t}-feedback-marking`),u=o.querySelector(`.${t}-feedback-grade`),d=l.querySelector(`textarea`),f=l.querySelector(`button.save`),p=o.querySelector(`.${t}-feedback-status`),m=o.closest(`details`),h=n&&n.verdict?n:null,g=h?.comment||``,_=(Array.isArray(h?.marks)?h.marks:[]).filter(e=>e&&e.part&&(e.severity===`minor`||e.severity===`wrong`)),v=new Map(_.map(e=>[e.part,e.severity])),y=new Map(_.filter(e=>e.value!==void 0).map(e=>[e.part,e.value])),b=new Map,x=null,S=Promise.resolve();d.value=g;let C=(e,t=!1)=>{p.textContent=e,p.classList.toggle(`error`,t)},w=()=>{if(!h)return``;let e=h.updated?i(h.updated):``;return`Saved${e?` · ${e}`:``}`},T=()=>!!(h&&h.verdict!==`correct`),E=new Map,D=t=>{let n=E.get(t);n&&Z(n,v.get(t)||``),b.get(t)?.classList.toggle(`on`,v.has(t)),e.querySelectorAll(`[data-part="${t}"]`).forEach(e=>{v.has(t)?e.dataset.fb=v.get(t):delete e.dataset.fb})},O=(e,t,n)=>{let r=X(t);r.addEventListener(`click`,t=>{t.stopPropagation(),L(e,se[v.get(e)||``])}),E.set(e,r),n(r),D(e)},k=(e,t,n)=>{t===``||t==null?y.delete(e):y.set(e,t),I(n?ae:Q)},A=(e,t,n)=>{let r=q(e,t);if(!r)return;let i=document.createElement(`span`);i.className=`fb-fix`,i.innerHTML=`<span>→</span>`,i.appendChild(J(r,y.get(e),(t,n)=>k(e,t,n),`${e} should be`)),n(i),b.set(e,i),i.classList.toggle(`on`,v.has(e))};for(let t of e.querySelectorAll(`[data-part]`)){let e=t.dataset.part;if(t.tagName===`TR`){let n=t.dataset.row===`item`?`not really there`:`${t.querySelector(`th`)?.textContent||e} is off`,r=document.createElement(`td`);r.className=`fb-mark-cell`,t.insertBefore(r,t.firstChild),O(e,n,e=>r.appendChild(e)),A(e,!0,e=>(t.querySelector(`td[data-column="Level"]`)||t.lastElementChild).appendChild(e));let i=t.closest(`table`);i&&!i.dataset.fbCells&&(i.dataset.fbCells=`1`,i.querySelectorAll(`thead tr`).forEach(e=>{let t=document.createElement(`td`);t.className=`fb-mark-cell`,e.insertBefore(t,e.firstChild)}))}else O(e,t.dataset.column?`${t.dataset.column.toLowerCase()} is wrong`:`${e} is wrong`,e=>t.appendChild(e)),A(e,!1,e=>t.appendChild(e))}let j=l.querySelector(`.${t}-feedback-other`);O(`other`,`something else`,e=>j.appendChild(e));let M=new Map,N=e=>{let t=M.get(e);if(!t)return;let n=t.querySelector(`.fb-missed-items`);n.innerHTML=``;let r=le[e]||`item`,i=[...v.keys()].filter(t=>t.startsWith(`${e}.missed.`));i.forEach((t,a)=>{let o=document.createElement(`div`);o.className=`fb-missed-item`,o.innerHTML=`<span>Missed ${r}${i.length>1?` ${a+1}`:``}</span>`;let s=X(`missed ${r}`);s.style.display=`inline-flex`,Z(s,v.get(t)),s.addEventListener(`click`,()=>L(t,ce[v.get(t)]||`wrong`));let c=document.createElement(`button`);c.type=`button`,c.className=`fb-missed-remove`,c.title=`Remove`,c.setAttribute(`aria-label`,`Remove missed ${r}`),c.innerHTML=`<ha-icon icon="mdi:close"></ha-icon>`,c.addEventListener(`click`,()=>{y.delete(t),L(t,``)});let l=e===`people`?[[`count`,{type:`number`,placeholder:`count`}],[`age`,{type:`choice`,choices:$.people}]]:[[`species`,{type:`text`,placeholder:`species`}],[`count`,{type:`number`,placeholder:`count`}]],u={...y.get(t)||{}},d=l.map(([e,n])=>J(n,u[e],(n,r)=>{n===``?delete u[e]:u[e]=n,k(t,Object.keys(u).length?{...u}:``,r)},`missed ${r} ${e}`));o.append(s,...d,c),n.appendChild(o)})};for(let n of e.querySelectorAll(`[data-section][data-kind="list"]`)){let e=n.dataset.section,r=le[e]||`item`,i=document.createElement(`div`);i.className=`fb-missed`,i.innerHTML=`<div class="fb-missed-items"></div><button type="button" class="${t}-feedback-add"><ha-icon icon="mdi:plus"></ha-icon><span>Missed ${r}</span></button>`,i.querySelector(`button`).addEventListener(`click`,()=>{let t=[...v.keys()].filter(t=>t.startsWith(`${e}.missed.`)).map(e=>Number(e.split(`.`).pop()));L(`${e}.missed.${t.length?Math.max(...t)+1:1}`,`wrong`)}),n.appendChild(i),M.set(e,i),N(e)}let P=()=>{let n=T();s.setAttribute(`aria-pressed`,String(h?.verdict===`correct`)),c.setAttribute(`aria-pressed`,String(n)),l.hidden=!n,e.classList.toggle(`fb-marking`,n);let r=re(v);u.className=`${t}-feedback-grade ${r}`;let i=[`wrong`,`minor`].map(e=>[e,[...v.values()].filter(t=>t===e).length]).filter(([,e])=>e).map(([e,t])=>`${t} ${e}`).join(`, `);u.textContent=r?`${r===`wrong`?`Wrong`:`Minor issues`} (${i})`:`Nothing marked yet`},F=e=>{clearTimeout(x),C(`Saving…`);let t=d.value.trim(),n=e&&e!==`correct`?[...v].map(([e,t])=>y.has(e)?{part:e,severity:t,value:y.get(e)}:{part:e,severity:t}):[];return S=S.then(async()=>{try{let i=await r({verdict:e,comment:t,marks:n});h=i,g=i?.comment??t,C(i?w():`Feedback cleared`),a&&a(i)}catch(e){C(`Couldn't save: ${e?.body?.message||e?.message||e}`,!0)}P()}),S},I=e=>{clearTimeout(x),C(`Not saved yet`),x=setTimeout(()=>F(`incorrect`),e)};function L(e,t){t?v.set(e,t):v.delete(e),D(e);let n=e.split(`.`)[0];e.startsWith(`${n}.missed.`)&&N(n),P(),I(Q)}let R=()=>{let e=[...v.keys()];v.clear(),y.clear(),b.forEach(e=>e.querySelectorAll(`input, select`).forEach(e=>{e.value=``})),e.forEach(D),M.forEach((e,t)=>N(t))},z=()=>v.size>0||d.value.trim()!==``;s.addEventListener(`click`,()=>{if(h?.verdict===`correct`)h=null,F(null);else{if(v.size&&!confirm(`Discard your marks and say everything is correct?`))return;R(),h={...h||{},verdict:`correct`},F(`correct`)}P()}),c.addEventListener(`click`,()=>{if(T()){if(z()&&!confirm(`Clear your feedback on this event?`))return;R(),d.value=``,h=null,F(null)}else h={...h||{},verdict:`incorrect`},F(`incorrect`),m&&(m.open=!0);P()}),d.addEventListener(`input`,()=>{if(clearTimeout(x),d.value.trim()===g){C(w());return}I(ae)});let B=()=>F(`incorrect`);f.addEventListener(`click`,B),d.addEventListener(`blur`,()=>{d.value.trim()!==g&&B()}),d.addEventListener(`keydown`,e=>{e.key===`Escape`&&d.value.trim()!==g&&B(),e.key===`Enter`&&(e.metaKey||e.ctrlKey)&&(e.preventDefault(),B())}),P(),C(w())}var Q,ae,oe,se,ce,le,$,ue,de,fe=t((()=>{Q=500,ae=800,oe=4e3,se={"":`minor`,minor:`wrong`,wrong:``},ce={minor:`wrong`,wrong:`minor`},le={animals:`animal`,people:`person`},$={animals:[`adult`,`young`],people:[`adult`,`child`]},ue={funny:[`ordinary`,`slightly funny`,`funny`,`hilarious`],cute:[`ordinary`,`slightly cute`,`cute`,`adorable`],unusual:[`ordinary`,`notable`,`unusual`,`extraordinary`],trouble:[`none`,`close call or rescued`,`needs help`,`hurt`]},de={correct:[`mdi:check-circle`,`Correct`,`#16A34A`,`rgba(22,163,74,0.15)`],minor:[`mdi:alert-circle`,`Minor issues`,`#D97706`,`rgba(245,158,11,0.18)`],wrong:[`mdi:close-circle`,`Wrong`,`#DC2626`,`rgba(220,38,38,0.14)`],incorrect:[`mdi:close-circle-outline`,`Something's wrong`,`#DC2626`,`rgba(220,38,38,0.14)`]}}));function pe(e){window.__LLMVISION_BADGE_LOGGED||(console.log(`%cLLM Vision Card%c v${S}`,`background:#0071FF;color:#fff;padding:2px 6px 2px 8px;border-radius:4px 0 0 4px;font-weight:600;`,`background:#0058c7;color:#fff;padding:2px 4px;font-weight:500;`,`background:#0058c7;color:#fff;padding:2px 8px 2px 6px;border-radius:0 4px 4px 0;font-weight:600;`),window.__LLMVISION_BADGE_LOGGED=!0)}function me(e,t){if(!t)return``;let n=e.states[t],r=n?.attributes?.friendly_name||t,i=e.entities?.[t]?.device_id,a=i?e.devices?.[i]:void 0,o=a?a.name_by_user||a.name:``;return o&&Object.values(e.entities||{}).filter(e=>e.device_id===i&&e.entity_id.startsWith(`camera.`)).length===1?o:n?r:``}var he,ge,_e,ve=t((()=>{C(),f(),K(),fe(),he=3600*3,ge=600,_e=class extends HTMLElement{imageCache=new Map;_lastEventHash=null;_lastFetch=0;_fetchPromise=null;_cachedEvents=null;connectedCallback(){this._badgeLogged||=(pe(this.badgeContext||`Card`),!0)}setCommonConfig(e,{requireEventLimits:t=!1}={}){if(this.config=e,this.category_filters=e.category_filters||[],this.camera_filters=e.camera_filters||[],this.language=e.language,this.number_of_events=e.number_of_events,this.number_of_days=e.number_of_days,this.custom_colors=e.custom_colors||{},this.label_styles=x(e.label_styles),this.default_icon=e.default_icon||`mdi:motion-sensor`,this.default_color=e.default_color||`#929292`,this.time_format=e.time_format||`24h`,this.filter_false_positives=e.filter_false_positives!==!1,this.refresh_interval=Math.max(1,Number(e.refresh_interval||15)),t){if(!this.number_of_events&&!this.number_of_days)throw Error(`Either number_of_events or number_of_days needs to be set.`);if(this.number_of_events&&this.number_of_events<1)throw Error(`number_of_events must be greater than 0.`)}}async fetchEvents(e,{limit:t=10,days:n=null,hours:r=null,cameras:i=[],categories:a=[],includeNoActivity:o=!1}={}){let s=Date.now(),c=(this.refresh_interval||15)*1e3;if(this._fetchPromise)return this._fetchPromise;if(this._cachedEvents&&s-this._lastFetch<c)return this._cachedEvents;this._lastFetch=s,this._fetchPromise=this._fetchEvents(e,{limit:t,days:n,hours:r,cameras:i,categories:a,includeNoActivity:o});try{return this._cachedEvents=await this._fetchPromise,this._cachedEvents}finally{this._fetchPromise=null}}async _fetchEvents(e,{limit:t=10,days:n=null,hours:r=null,cameras:i=[],categories:a=[],includeNoActivity:o=!1}={}){try{let s=new URLSearchParams;t&&s.set(`limit`,t),i?.length&&s.set(`cameras`,i.join(`,`)),n&&s.set(`days`,n),r&&s.set(`hours`,r),a?.length&&s.set(`categories`,a.join(`,`)),s.set(`include_no_activity`,o?`true`:`false`);let c=`llmvision/timeline/events${s.toString()?`?`+s.toString():``}`,l=await e.callApi(`GET`,c);return(Array.isArray(l?.events)?l.events:[]).map(t=>{let n=me(e,t.camera_name||``),r=d(t);return{title:t.title||``,description:t.description||``,category:t.category||``,label:r[0]||``,labels:r,keyFrame:t.key_frame||``,clip:t.clip||``,details:t.details??null,feedback:t.feedback??null,cameraName:n,startTime:t.start||null,endTime:t.end||null,id:t.uid||``}})}catch(e){return console.error(`Error fetching events from API:`,e),null}}async deleteEvent(e,t){try{return await e.callApi(`DELETE`,`llmvision/timeline/event/${encodeURIComponent(t)}`),!0}catch(e){return console.error(`Error deleting event from API:`,e),!1}}_hashState(e){return JSON.stringify(e)}_sort(e){return e.sort((e,t)=>new Date(t.startTime)-new Date(e.startTime))}_limit(e){return this.number_of_days,this.number_of_events?e.slice(0,this.number_of_events):e}formatDateLabel(e){let t=new Date,r=new Date(t);return r.setDate(t.getDate()-1),e.toDateString()===t.toDateString()?n(`today`,this.language)||`Today`:e.toDateString()===r.toDateString()?n(`yesterday`,this.language)||`Yesterday`:e.toLocaleDateString(`en`,{month:`short`,day:`numeric`})}formatTime(e){let t=this.time_format||`24h`,n=e.getMinutes().toString().padStart(2,`0`);if(t===`12h`){let t=e.getHours(),r=t%12||12,i=t>=12?`PM`:`AM`;return`${r.toString().padStart(2,`0`)}:${n} ${i}`}return`${e.getHours().toString().padStart(2,`0`)}:${n}`}formatDateTimeShort(e){let t=new Date(e),r=new Date,i=new Date;return i.setDate(r.getDate()-1),t.toDateString()===r.toDateString()?n(`today`,this.language)||`Today`:t.toDateString()===i.toDateString()?n(`yesterday`,this.language)||`Yesterday`:t.toLocaleDateString(`en-US`,{month:`short`,day:`numeric`})}formatDateTimeFull(e){let t=new Date(e);return`${t.toLocaleDateString(`en-US`,{month:`short`,day:`numeric`})}, ${this.formatTime(t)}`}resolveMedia(e,t,{fallback:n=t}={}){if(!t||!l(t))return Promise.resolve(``);if(/^data:/i.test(t.trim()))return Promise.resolve(t.trim());let r=t.replace(`/media/`,`media-source://media_source/local/`),i=this.imageCache.get(r);return i&&i.renewAt>Date.now()?Promise.resolve(i.url):e.callWS({type:`media_source/resolve_media`,media_content_id:r,expires:he}).then(e=>{let t=e.url;return this.imageCache.set(r,{url:t,renewAt:Date.now()+(he-ge)*1e3}),t}).catch(e=>(console.error(`Error resolving media content ID:`,e),n))}resolveKeyFrame(e,t){return this.resolveMedia(e,t)}showImageWhenLoaded(e,t,n=``,r=0){if(!e||!t)return;let i=new Image;i.src=t,(typeof i.decode==`function`?i.decode():new Promise((e,t)=>{i.onload=e,i.onerror=t})).then(()=>{e.isConnected&&(e.src=t,e.style.display=n)}).catch(()=>{r<1&&setTimeout(()=>this.showImageWhenLoaded(e,t,n,r+1),1e3)})}resolveClip(e,t){return this.resolveMedia(e,t,{fallback:``})}openEventPopup(e,t,n){return Promise.all([this.resolveKeyFrame(e,t.keyFrame),this.resolveClip(e,t.clip)]).then(([r,i])=>{this.showPopup({event:t.title,summary:t.description,startTime:t.startTime,keyFrame:r,clip:i,cameraName:t.cameraName,category:t.category,label:t.label,labels:t.labels,details:t.details,feedback:t.feedback,onFeedback:e=>{t.feedback=e,this.feedbackChanged?.(t)},icon:n,prefix:`popup`,eventId:t.id},e)})}computeColors(e,t){let n=this.custom_colors||{},r;r=e==null?this.default_color===void 0?t:this.default_color:n[e]===void 0?t:n[e];let i,a;return Array.isArray(r)&&r.length===3?(i=`rgba(${r[0]},${r[1]},${r[2]},0.2)`,a=`rgba(${r[0]},${r[1]},${r[2]},1)`):(i=h(r,.2),a=h(r,1)),{bgColorRgba:i,iconColorRgba:a}}labelColor(e,t){let n=v(this.label_styles,e);if(n)return b(n.solid);let r=c(e,t);return b(this.computeColors(r,_(r,``).color).iconColorRgba)}labelBadgesHtml(e,t,n){let i=e=>typeof e==`string`?e.trim().toLowerCase():e,s=Array.isArray(t)?t:[],l=!!(e&&!s.some(t=>i(t)===i(e))),{icon:u,color:d}=_(e,``),{bgColorRgba:f,iconColorRgba:p}=this.computeColors(e,d),m=(e,t,r,i=``)=>`<span class="${n}" style="${r}"><ha-icon icon="${a(e)}"${i?` style="color:${i};"`:``}></ha-icon><span class="text">${a(t)}</span></span>`,h=(e,t)=>m(e,t,r(null,f),p);return(l?h(u,e):``)+s.map(t=>{let n=v(this.label_styles,t),i=n?.icon||o(t,e);if(n)return m(i,t,r(n));let a=c(t,e);if(a===e)return h(i,t);let s=this.computeColors(a,_(a,``).color);return m(i,t,r(null,s.bgColorRgba),s.iconColorRgba)}).join(``)}showPopup({event:e,summary:t,startTime:r,keyFrame:o,clip:c,cameraName:l,category:u,label:d,labels:f,details:p,feedback:m,onFeedback:h,icon:g,prefix:_,eventId:v},y){let b=y||this.hass,x=this.formatDateTimeFull(r),S=l?`${x} • ${l}`:x,C=`${_}-overlay`,w=`${_}-content`,T=`close-${_}`,D=`${_}-header-row`,k=`${_}-title-row`,A=`${_}-menu`,j=`${_}-menu-btn`,M=`${_}-menu-list`,P=`${_}-menu-item`,F=`${_}-menu-item-delete`,I=Array.isArray(f)?f:d?[d]:[],R=typeof o==`string`?o.trim().length>0:!!o,z=c?E(p,(e,t)=>this.labelColor(e,t)):{rate:1,tracks:[]},B=c?`<div class="llmvision-boxes-media"><video controls playsinline webkit-playsinline preload="metadata"${R?` poster="${a(o)}"`:``} src="${a(c)}"></video></div>`:`<img src="${a(o)}" alt="Event Snapshot" onerror="this.style.display='none'">`,V=`
                <div>
                    <div class="${D}">
                        <button class="${T}" title="Close" style="font-size:30px">
                            <ha-icon icon="mdi:close"></ha-icon>
                        </button>
                        <div class="${_}-title-main">
                            <h2 data-part="title">${a(e)}</h2>
                        </div>
                        ${v?`
                            <div class="${A}">
                            <button class="${j}" title="Menu" style="font-size:26px">
                                <ha-icon icon="mdi:dots-vertical"></ha-icon>
                            </button>
                            <div class="${M}" hidden>
                                <button class="${P} ${F}" title="Delete event">
                                    <ha-icon icon="mdi:trash-can-outline"></ha-icon>
                                    <span>${n(`delete`,this.language)||`Delete`}</span>
                                </button>
                            </div>
                        </div>`:`<div class="${_}-menu-placeholder"></div>`}
                    </div>
                    <div class="${k}">
                        <div class="${_}-title-secondary">
                            <p class="secondary"><span>${a(S)}</span></p>
                        </div>
                        <div class="${_}-title-tertiary">
                            <div class="${_}-badges-row">
                                ${this.labelBadgesHtml(u,I,`${_}-badge`)}
                            </div>
                        </div>
                    </div>
                    ${B}
                    <p class="summary" data-part="description">${a(t)}</p>
                    ${v||s(O(p))?`
                    <details class="${_}-details">
                        <summary>${a(n(`additional_details`,this.language)||`Additional details`)}</summary>
                        <div class="${_}-details-body">${v?ne(_):``}${s(O(p))?i(O(p)):``}</div>
                    </details>`:``}
                </div>
            `,H=document.createElement(`div`);H.innerHTML=`
                <div class="${C}">
                    <div class="${w}">
                        ${V}
                    </div>
                </div>
                <style>
                    .${C} {
                        position: fixed;
                        inset: 0;
                        background: rgba(0,0,0,0.5);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 1000;
                        opacity: 0;
                        transition: opacity 0.2s ease;
                    }
                    .${C}.show { opacity: 1; }
                    .${w} {
                        position: relative;
                        background: var(--ha-card-background, var(--card-background-color, #f3f3f3));
                        color: var(--primary-text-color);
                        padding: 20px;
                        border-radius: var(--ha-card-border-radius, 25px);
                        max-width: 900px;
                        width: calc(100vw - 48px);
                        box-sizing: border-box;
                        max-height: 90vh;
                        overflow-y: auto;
                        overscroll-behavior: contain;
                        transform: scale(0.9);
                        transition: transform 0.2s ease;
                    }
                    .${C}.show .${w} { transform: scale(1); }
    
                    .${D} {
                        display: flex;
                        /* Buttons line up with the title's first line */
                        align-items: flex-start;
                        gap: 8px;
                        margin-bottom: 4px;
                    }
                    /* Same width on both sides of the title keeps it centered.
                       All three are centered as boxes: the menu button is
                       centered in its wrapper rather than set on a text line. */
                    .${D} > .${T},
                    .${D} > .${A},
                    .${D} > .${_}-menu-placeholder {
                        flex: 0 0 40px;
                        height: 40px;
                    }
                    .${D} > .${A} {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .${D} .${T},
                    .${D} .${j} {
                        width: 40px;
                        height: 40px;
                        padding: 0;
                        margin: 0;
                        line-height: 0;
                    }
    
                    /* Title row: icon + title */
                    .${k} {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 6px;
                        margin-bottom: 6px;
                    }
                    /* Title, between the close and menu buttons */
                    .${_}-title-main {
                        flex: 1 1 auto;
                        min-width: 0;
                        display: flex;
                        justify-content: center;
                    }
                    .${_}-title-main h2 {
                        flex: 1 1 auto;
                        min-width: 0;
                        max-width: 100%;
                        overflow: visible;
                        white-space: normal;
                        word-break: break-word;
                        margin: 0;
                        line-height: 1.25;
                        /* Centers the first line on the 40px buttons */
                        padding-top: calc((40px - 1.25em) / 2);
                        font-family: var(--ha-font-family-heading, "Roboto");
                        text-align: center;
                    }
                    .${_}-title-secondary {
                        width: 100%;
                        text-align: center;
                    }
                    .${_}-title-secondary .secondary {
                        font-weight: var(--ha-font-weight-medium, 500);
                        margin-top: 4px;
                        color: var(--primary-text-color);
                        font-family: var(--ha-font-family-body, "Roboto");
                    }
                    .${_}-title-tertiary {
                        width: 100%;
                        display: flex;
                        justify-content: center;
                    }
                    .${_}-badges-row {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-wrap: wrap;
                        gap: 8px;
                        width: 100%;
                    }
                    .${_}-badge {
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                        padding: 4px 10px;
                        border-radius: 9px;
                        background: var(--table-header-background-color, rgba(0,0,0,0.08));
                        color: var(--primary-text-color);
                        font-size: 0.9em;
                        line-height: 1;
                    }
                    .${_}-badge .text {
                        text-transform: capitalize;
                    }
                    .${_}-badge ha-icon {
                        --mdc-icon-size: 18px;
                    }
    
                    ${ee}
                    ${te(_)}

                    /* Image or clip, and text */
                    .${w} img, .${w} video {
                        width: 100%;
                        height: auto;
                        border-radius: calc(var(--ha-card-border-radius, 25px) - 10px);
                        margin-top: 10px;
                    }
                    .${w} video {
                        display: block;
                        max-height: 60vh;
                        background: #000;
                    }
                    .${w} .summary {
                        color: var(--secondary-text-color);
                        font-size: var(--ha-font-size-l, 16px);
                        line-height: 22px;
                        font-family: var(--ha-font-family-body, "Roboto");
                    }
    
                    /* Additional details, collapsed until opened */
                    .${_}-details {
                        margin-top: 4px;
                        border-top: 1px solid var(--divider-color, rgba(0,0,0,0.12));
                        font-family: var(--ha-font-family-body, "Roboto");
                    }
                    .${_}-details > summary {
                        cursor: pointer;
                        padding: 10px 0;
                        font-weight: var(--ha-font-weight-medium, 500);
                        color: var(--primary-text-color);
                        list-style: none;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                    }
                    .${_}-details > summary::-webkit-details-marker { display: none; }
                    .${_}-details > summary::before {
                        content: '';
                        border-style: solid;
                        border-width: 0.35em 0.35em 0 0.35em;
                        border-color: currentColor transparent transparent transparent;
                        transform: rotate(-90deg);
                        transition: transform 0.2s;
                    }
                    .${_}-details[open] > summary::before { transform: rotate(0); }
                    .${_}-details-body {
                        color: var(--secondary-text-color);
                        font-size: var(--ha-font-size-m, 14px);
                        line-height: 1.4;
                        padding-bottom: 8px;
                        overflow-wrap: anywhere;
                    }
                    .${_}-details-body .details-table-wrap {
                        overflow-x: auto;
                    }
                    .${_}-details-body .details-table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: inherit;
                        overflow-wrap: normal;
                    }
                    .${_}-details-body .details-table th,
                    .${_}-details-body .details-table td {
                        text-align: left;
                        vertical-align: top;
                        padding: 6px 10px;
                        border-bottom: 1px solid var(--divider-color, rgba(0,0,0,0.12));
                    }
                    .${_}-details-body .details-table td {
                        color: var(--primary-text-color);
                    }
                    .${_}-details-body .details-table thead th {
                        font-weight: var(--ha-font-weight-medium, 500);
                        font-size: 0.9em;
                        color: var(--secondary-text-color);
                        white-space: nowrap;
                    }
                    .${_}-details-body .details-table thead tr {
                        background: var(--table-header-background-color, rgba(127,127,127,0.08));
                    }
                    .${_}-details-body .details-table tbody th {
                        font-weight: var(--ha-font-weight-medium, 500);
                        color: var(--primary-text-color);
                        white-space: nowrap;
                        width: 1%;
                    }
                    .${_}-details-body .details-table tbody tr:last-child > * {
                        border-bottom: none;
                    }
                    .${_}-details-body .details-table .details-table-wrap {
                        margin: -2px 0;
                    }
                    .${_}-details-body .details-list {
                        margin: 0;
                        padding-left: 1.2em;
                    }
                    .${_}-details-body .details-list > li + li { margin-top: 6px; }
                    .${_}-details-body .details-empty { opacity: 0.6; }
                    .${_}-details-body .details-section + .details-section { margin-top: 12px; }
                    .${_}-details-body h4 {
                        margin: 0 0 4px;
                        font-size: inherit;
                        font-weight: var(--ha-font-weight-bold, 600);
                        color: var(--primary-text-color);
                    }

                    /* Buttons */
                    .${T}, .${j} {
                        background: none;
                        border: none;
                        cursor: pointer;
                        color: var(--primary-text-color);
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                    }
    
                    /* Menu */
                    .${A} {
                        position: relative;
                    }
                    .${M} {
                        position: absolute;
                        right: 0;
                        top: calc(100% + 6px);
                        background: var(--ha-card-background, var(--card-background-color, #f3f3f3));
                        color: var(--primary-text-color);
                        border-radius: 10px;
                        box-shadow: 0 6px 18px rgba(0,0,0,0.2);
                        padding: 6px;
                        min-width: 160px;
                        z-index: 10;
                    }
                    .${P} {
                        width: 100%;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        background: none;
                        border: none;
                        color: inherit;
                        cursor: pointer;
                        padding: 8px 10px;
                        border-radius: 8px;
                    }
                    .${P}:hover {
                        background: rgba(0,0,0,0.06);
                    }
                    .${F} {
                        color: var(--error-color, #d32f2f);
                    }
    
                    @media (max-width: 768px) {
                        .${w} {
                            max-width: 100%;
                            width: 100%;
                            max-height: 100%;
                            box-sizing: border-box;
                            /* Full screen: keep clear of the notch, status bar
                               and home indicator */
                            padding: max(15px, env(safe-area-inset-top))
                                max(15px, env(safe-area-inset-right))
                                max(15px, env(safe-area-inset-bottom))
                                max(15px, env(safe-area-inset-left));
                            border-radius: 0;
                            height: 100%;
                        }
                        .${D} {
                            padding-top: 10px;
                        }
                    }
                </style>
            `,(!history.state||!history.state.popupOpen)&&history.pushState({popupOpen:!0},``);let U=H.querySelector(`.${C}`),W=()=>this.closePopup(H,C,W);window.addEventListener(`popstate`,W),H.querySelector(`.${T}`).addEventListener(`click`,()=>this.closePopup(H,C,W)),U.addEventListener(`click`,e=>{e.target===U&&this.closePopup(H,C,W)});let G=e=>{e.key===`Escape`&&this.closePopup(H,C,W,G)};document.addEventListener(`keydown`,G),H._escHandler=G;let K=H.querySelector(`.${j}`),q=H.querySelector(`.${M}`);K&&q&&(K.addEventListener(`click`,e=>{e.stopPropagation(),q.hidden=!q.hidden}),H.addEventListener(`click`,e=>{!q.hidden&&!e.target.closest(`.${A}`)&&(q.hidden=!0)}));let J=H.querySelector(`.${F}`);J&&v&&J.addEventListener(`click`,async e=>{if(e.stopPropagation(),J.disabled)return;let t=n(`confirm_delete_event`,this.language)||`Are you sure you want to delete this event?`;if(!confirm(t)){q&&(q.hidden=!0);return}J.disabled=!0,await this.deleteEvent(b,v)?this.closePopup(H,C,W,G):(alert(n(`error_delete_event`,this.language)||`Failed to delete the event. Please try again.`),J.disabled=!1,q&&(q.hidden=!0))}),document.body.appendChild(H),this.lockPageScroll(H),v&&ie(H,_,{feedback:m,save:async({verdict:e,comment:t,marks:n})=>(await b.callApi(`POST`,`llmvision/timeline/event/${encodeURIComponent(v)}/feedback`,{verdict:e,comment:t,marks:n}))?.event?.feedback??null,formatTime:e=>this.formatDateTimeFull(e),onSaved:e=>h?.(e)}),c&&(H._boxOverlay=L(H.querySelector(`.llmvision-boxes-media`),H.querySelector(`.llmvision-boxes-media video`),z,{posterFrame:R?N(o):null})),requestAnimationFrame(()=>U.classList.add(`show`))}lockPageScroll(e){if(!e._scrollLocked&&(e._scrollLocked=!0,window.__llmvisionScrollLocks=(window.__llmvisionScrollLocks||0)+1,window.__llmvisionScrollLocks===1)){let e=document.documentElement;window.__llmvisionScrollRestore={overflow:e.style.overflow,x:window.scrollX,y:window.scrollY},e.style.overflow=`hidden`}}unlockPageScroll(e){if(!e._scrollLocked)return;e._scrollLocked=!1,window.__llmvisionScrollLocks=Math.max(0,(window.__llmvisionScrollLocks||1)-1);let t=window.__llmvisionScrollRestore;window.__llmvisionScrollLocks===0&&t&&(document.documentElement.style.overflow=t.overflow,window.__llmvisionScrollRestore=null,(window.scrollX!==t.x||window.scrollY!==t.y)&&window.scrollTo({left:t.x,top:t.y,behavior:`instant`}))}closePopup(e,t,n,r){e._boxOverlay?.close(),e.querySelectorAll(`video`).forEach(e=>e.pause()),this.unlockPageScroll(e);let i=e.querySelector(`.${t}`);i.classList.remove(`show`),i.addEventListener(`transitionend`,()=>{e._escHandler&&document.removeEventListener(`keydown`,e._escHandler);try{document.body.removeChild(e)}catch{}},{once:!0}),history.state&&history.state.popupOpen&&history.replaceState(null,``),window.removeEventListener(`popstate`,n)}}})),ye,be,xe=t((()=>{f(),e(),g(),ve(),ye=class extends p{static get properties(){return{_config:{type:Object}}}setConfig(e){this._config=e||{}}render(){if(!this._config)return u`<div>Please configure the card.</div>`;let e=this._getSchema(),t=e.slice(0,3),n=e.slice(3,5),r=e.slice(5);return u`
            <style>
                .preview-card-content { display:flex; flex-direction:column; gap:16px; }
                details { border:1px solid var(--divider-color,#eeeeee); border-radius:var(--ha-card-border-radius,20px); overflow:hidden; }
                summary { font-weight:500; font-size:1rem; padding:12px 16px; cursor:pointer; display:flex; align-items:center; }
                summary::-webkit-details-marker{display:none;}
                summary:before{content:'';display:inline-block;margin-right:8px;border-style:solid;border-width:0.35em 0.35em 0 0.35em;border-color:var(--primary-text-color) transparent transparent transparent;transform:rotate(-90deg);transition:transform .2s;}
                details[open] summary:before{transform:rotate(0);}
                .section-content{padding:16px;}
                .section-icon{margin-right:8px;color:var(--primary-text-color);font-size:20px;}
            </style>
            <ha-card>
                <div class="preview-card-content">
                    <details>
                        <summary><ha-icon class="section-icon" icon="mdi:filter-variant"></ha-icon>Filters</summary>
                        <div class="section-content">
                            <ha-form .data=${this._config} .schema=${t}
                                .computeLabel=${this._computeLabel} .computeHelper=${this._computeHelper}
                                @value-changed=${this._valueChanged}></ha-form>
                        </div>
                    </details>
                    <details>
                        <summary><ha-icon class="section-icon" icon="mdi:translate"></ha-icon>Locale</summary>
                        <div class="section-content">
                            <ha-form .data=${this._config} .schema=${n}
                                .computeLabel=${this._computeLabel} .computeHelper=${this._computeHelper}
                                @value-changed=${this._valueChanged}></ha-form>
                        </div>
                    </details>
                    <details>
                        <summary><ha-icon class="section-icon" icon="mdi:palette"></ha-icon>Customization</summary>
                        <div class="section-content">
                            <ha-form .data=${this._config} .schema=${r}
                                .computeLabel=${this._computeLabel} .computeHelper=${this._computeHelper}
                                @value-changed=${this._valueChanged}></ha-form>
                        </div>
                    </details>
                </div>
            </ha-card>
        `}_getSchema(){let e=[{name:`category_filters`,description:`Filter events by category (title). Only events matching selected categories will be shown.`,selector:{select:{multiple:!0,options:Object.keys(y).map(e=>({value:e,label:e.charAt(0).toUpperCase()+e.slice(1)}))}}},{name:`camera_filters`,description:`Filter events by camera entity. Only events from selected cameras will be shown.`,selector:{select:{multiple:!0,options:Object.keys(this.hass.states).filter(e=>e.startsWith(`camera.`)).map(e=>({value:e,label:this.hass.states[e].attributes.friendly_name||e}))}}},{name:`filter_false_positives`,description:`Hide events titled 'No activity observed'.`,selector:{boolean:{default:!0}}}],t=[{name:`language`,description:`Language for the card. This will be used to generate icons and translations.`,selector:{select:{options:[{value:`bg`,label:`Bulgarian`},{value:`ca`,label:`Catalan`},{value:`cz`,label:`Czech`},{value:`da`,label:`Danish`},{value:`nl`,label:`Dutch`},{value:`en`,label:`English`},{value:`fr`,label:`French`},{value:`de`,label:`German`},{value:`hu`,label:`Hungarian`},{value:`it`,label:`Italian`},{value:`pl`,label:`Polish`},{value:`pt`,label:`Portuguese`},{value:`sk`,label:`Slovak`},{value:`es`,label:`Spanish`},{value:`sv`,label:`Swedish`}]}}},{name:`time_format`,description:`Choose between 12-hour and 24-hour time display.`,selector:{select:{options:[{value:`24h`,label:`24-hour`},{value:`12h`,label:`12-hour`}]}}}],n=[{name:`default_icon`,description:`Icon when no category keyword matches.`,selector:{icon:{}}}];return[...e,...t,...n]}_computeLabel(e){return{entity:`Calendar Entity`,category_filters:`Category Filters`,camera_filters:`Camera Filters`,filter_false_positives:`Filter False Positives`,language:`Language`,time_format:`Time Format`}[e.name]||e.name}_computeHelper=e=>e.description||``;_valueChanged(e){this.dispatchEvent(new CustomEvent(`config-changed`,{detail:{config:e.detail.value}}))}static get styles(){return m`ha-card{padding:16px;}`}},customElements.define(`timeline-preview-card-editor`,ye),be=class extends _e{setConfig(e){this.setCommonConfig(e,{requireEventLimits:!1})}static getConfigElement(){return document.createElement(`timeline-preview-card-editor`)}static getStubConfig(){return{entity:`calendar.llm_vision_timeline`,language:`en`,time_format:`24h`,filter_false_positives:!0}}getCardSize(){return 3}getGridOptions(){return{rows:2,columns:6,min_rows:2,max_rows:8,min_columns:6,max_columns:24}}set hass(e){this.content||=(this.style.display=`block`,this.style.height=`100%`,this.innerHTML=`
                <ha-card class="llm-preview-card"><div class="preview-card-content"></div></ha-card>
                <style>
                .llm-preview-card{height:100%;display:flex;overflow:hidden;border-radius:var(--ha-card-border-radius,12px);}
                .llm-preview-card .preview-card-content{flex:1;display:flex;flex-direction:column;min-height:250px;}
                .preview-event-container{position:relative;flex:1 1 auto;width:100%;height:100%;min-height:0;overflow:hidden;border-radius:inherit;background:var(--ha-card-background,var(--card-background-color,#f3f3f3));cursor:pointer;}
                .preview-event-image{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;display:block;}
                .preview-event-vignette{position:absolute;inset:0;pointer-events:none;z-index:1;background:linear-gradient(to bottom,rgba(0,0,0,0.55)0%,rgba(0,0,0,0)30%,rgba(0,0,0,0)70%,rgba(0,0,0,0.55)100%);}
                .preview-icon-container{position:absolute;top:3px;left:3px;width:40px;height:40px;border-radius:var(--ha-card-border-radius,25px);display:flex;align-items:center;justify-content:center;background:none;z-index:2;}
                .preview-event-title{position:absolute;left:44px;top:14px;color:#fff;font-size:var(--ha-font-size-l,16px);font-weight:var(--ha-font-weight-medium,500);z-index:2;max-width:80%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}
                .preview-event-details{position:absolute;left:12px;bottom:12px;color:rgba(255,255,255,0.9);font-size:var(--ha-font-size-m,14px);font-weight:var(--ha-font-weight-medium,500);z-index:2;max-width:80%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}
                .preview-empty-state{flex:1 1 auto;height:100%;display:flex;align-items:center;justify-content:center;text-align:center;}
                </style>
            `,this.querySelector(`.preview-card-content`)),this._loadAndRender(e)}async _loadAndRender(e){let t=await this.fetchEvents(e,{limit:1,days:this.number_of_days,cameras:this.camera_filters,categories:this.category_filters,includeNoActivity:!this.filter_false_positives});if(!t)return;let r=this._hashState({...t,category_filters:this.category_filters,camera_filters:this.camera_filters,number_of_events:this.number_of_events,number_of_days:this.number_of_days,time_format:this.time_format,filter_false_positives:this.filter_false_positives});if(r!==this._lastEventHash){if(this._lastEventHash=r,!t.length){this.content.innerHTML=``;let e;e=this.category_filters.length?`noEventsCategory`:this.camera_filters.length?`noEventsCamera`:this.number_of_days?`noEventsHours`:`noEvents`;let t=n(e,this.language)||`No events found.`;e===`noEventsHours`&&(t=t.replace(`{hours}`,this.number_of_days)),this.content.innerHTML=`<div class="event-container preview-empty-state"><h3>${t}</h3></div>`;return}this._render(t,e)}}_render(e,t){let n=e[0],r=document.createElement(`div`);r.classList.add(`preview-event-container`);let i=_(n.category,n.label),{icon:o,color:s}=i;console.log(`icon result`,i,n.title),(n.category===void 0||n.category===``)&&this.default_icon&&(o=this.default_icon),console.log(`icon`,o,n.title,i);let c=n.cameraName,l=new Date(n.startTime),u=this.formatDateLabel(l),d=this.formatTime(l);r.innerHTML=`
                <img class="preview-event-image" src="" alt="Key frame" onerror="this.style.display='none'">
                <div class="preview-event-vignette"></div>
                <div class="preview-icon-container">
                    <ha-icon icon="${o}" style="color:white;font-size:24px;"></ha-icon>
                </div>
                <div class="preview-event-details">${a(`${c} • ${u}, ${d}`)}</div>
                <div class="preview-event-title">${a(n.title)}</div>
            `,r.addEventListener(`click`,()=>this.openEventPopup(t,n,o)),this.content.innerHTML=``,this.content.appendChild(r),this.resolveKeyFrame(t,n.keyFrame).then(e=>{this.showImageWhenLoaded(r.querySelector(`img`),e,`block`)})}static getStubConfig(){return{language:`en`,time_format:`24h`,filter_false_positives:!0}}},customElements.define(`llmvision-preview-card`,be)}));xe();export{be as LLMVisionPreviewCard,fe as a,U as c,N as d,W as f,Y as i,P as l,_e as n,H as o,ve as r,E as s,xe as t,K as u};