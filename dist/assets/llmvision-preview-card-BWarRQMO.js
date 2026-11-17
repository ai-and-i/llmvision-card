import{C as e,E as t,S as n,_ as r,b as i,c as a,d as o,f as s,g as c,h as l,i as u,l as d,m as f,n as p,o as m,p as h,t as g,u as _,v,w as y,x as b,y as x}from"./shared-Ci7UNCsJ.js";var S,C=t((()=>{S=`1.7.2`}));function w(e){return e&&Number.isFinite(Number(e.frame))&&Array.isArray(e.box_2d)&&e.box_2d.length===4&&e.box_2d.every(e=>Number.isFinite(Number(e)))}function T(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}function E(e,t=()=>null){let n=[];if(!T(e))return{rate:1,tracks:n};let r=Number(e.frame_rate)>0?Number(e.frame_rate):1;for(let[i,a,o]of L)for(let s of Array.isArray(e[i])?e[i]:[]){if(!T(s)||!Array.isArray(s.boxes))continue;let e=s.boxes.filter(w).map(e=>({t:(Number(e.frame)-1)/r,box:e.box_2d.map(Number)})).sort((e,t)=>e.t-t.t);if(!e.length)continue;let i=a(s),c=Number(s.count)>1?` ×${Number(s.count)}`:``,{color:l,text:u}=t(i,o)||F;n.push({label:`${i}${c}`,color:l,text:u,boxes:e})}return{rate:r,tracks:n}}function D(e){if(!T(e))return e;let t={...e};delete t.frame_rate;for(let[e]of L)Array.isArray(t[e])&&(t[e]=t[e].map(e=>{if(!T(e))return e;let{boxes:t,...n}=e;return n}));return t}function O(e,t,n){let r=(n-e.t)/(t.t-e.t),[i,a,o,s]=e.box.map((e,n)=>Math.min(1e3,Math.max(0,e+(t.box[n]-e)*r)));return o>i&&s>a?[i,a,o,s]:null}function ee(e,t,n){let r=e.boxes,i=R*n+1e-6,a=r.findIndex(e=>e.t>t);a===-1&&(a=r.length);let o=r[a-1],s=r[a];if(o&&s&&s.t-o.t<=i)return O(o,s,t);if(o&&t-o.t<=n/2){let e=r[a-2];return e&&o.t-e.t<=i?O(e,o,t):o.box}if(s&&s.t-t<=n/2){let e=r[a+1];return e&&e.t-s.t<=i?O(s,e,t):s.box}return null}function k(){try{return localStorage.getItem(I)!==`off`}catch{return!0}}function A(e){try{localStorage.setItem(I,e?`on`:`off`)}catch{}window.dispatchEvent(new CustomEvent(z,{detail:{shown:e}}))}function j(e){let t=/-(\d+)\.jpe?g(?:$|[?#])/i.exec(String(e||``));return t?Number(t[1]):null}function M(e,t,n,r,i){if(!n||!(r>0)||!(i>0))return``;let a=(n-1)/t,o=[];for(let t of e)for(let e of t.boxes){if(Math.abs(e.t-a)>1e-6)continue;let[n,s,c,l]=e.box.map(e=>Math.min(1e3,Math.max(0,e)));if(c<=n||l<=s)continue;let u=s/1e3*r,d=n/1e3*i,f=(l-s)/1e3*r,p=(c-n)/1e3*i,m=String(t.color).replace(/[^#\w(),.%\s-]/g,``);o.push(`<rect x="${u.toFixed(1)}" y="${d.toFixed(1)}" width="${f.toFixed(1)}" height="${p.toFixed(1)}" stroke="${m}"/>`)}return o.length?`<svg class="llmvision-thumb-boxes" viewBox="0 0 ${r} ${i}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${o.join(``)}</svg>`:``}function N(){return document.fullscreenElement||document.webkitFullscreenElement||null}function te(e){let t=Number.isFinite(e)?Math.max(0,Math.floor(e)):0;return`${Math.floor(t/60)}:${String(t%60).padStart(2,`0`)}`}function P(e,t,{rate:n,tracks:r}){if(!e||!t)return null;let i=1/n,a=document.createElement(`div`);a.className=`llmvision-boxes-layer`;let o=r.map(e=>{let t=document.createElement(`div`);t.className=`llmvision-box`,t.style.setProperty(`--box-color`,e.color),t.style.setProperty(`--box-text`,e.text),t.hidden=!0;let n=document.createElement(`span`);return n.textContent=e.label,t.appendChild(n),a.appendChild(t),t});t.controls=!1,t.removeAttribute(`controls`),t.disablePictureInPicture=!0,t.setAttribute(`disablepictureinpicture`,``),t.setAttribute(`disableremoteplayback`,``);let s=(e,t)=>{let n=document.createElement(`button`);return n.type=`button`,n.className=e,t&&(n.innerHTML=U(t)),n},c=(e,t)=>{e.title=t,e.setAttribute(`aria-label`,t)},l=document.createElement(`div`);l.className=`llmvision-boxes-controls`;let u=s(`llmvision-boxes-play`),d=document.createElement(`span`);d.className=`llmvision-boxes-time`;let f=document.createElement(`input`);f.type=`range`,f.className=`llmvision-boxes-seek`,f.min=`0`,f.max=`0`,f.step=`any`,f.value=`0`,f.setAttribute(`aria-label`,`Seek`);let p=s(`llmvision-boxes-mute`),m=s(`llmvision-boxes-toggle`,`mdi:vector-square`),h=s(`llmvision-boxes-fullscreen`),g=s(`llmvision-boxes-zoom`);g.hidden=!0,l.append(u,d,f,g,p,m,h),m.hidden=!r.length;let _=document.createElement(`div`);_.className=`llmvision-boxes-stage`,t.before(_),_.append(t),e.append(a,l),[`click`,`dblclick`,`pointerdown`].forEach(e=>l.addEventListener(e,e=>e.stopPropagation()));let v=k(),y=e=>{v=e,a.hidden=!v,m.setAttribute(`aria-pressed`,String(v)),c(m,v?`Hide boxes`:`Show boxes`),M()};m.addEventListener(`click`,()=>{y(!v),A(v)});let b=!1,x=()=>{let e=t.paused||t.ended;u.innerHTML=U(e?`mdi:play`:`mdi:pause`),c(u,e?`Play`:`Pause`)},S=()=>{Number.isFinite(t.duration)&&(f.max=String(t.duration)),b||(f.value=String(t.currentTime)),d.textContent=`${te(t.currentTime)} / ${te(t.duration)}`},C=()=>{p.innerHTML=U(t.muted?`mdi:volume-off`:`mdi:volume-high`),c(p,t.muted?`Unmute`:`Mute`)},w=()=>{if(t.paused||t.ended){let e=t.play();e&&e.catch&&e.catch(()=>{})}else t.pause()};u.addEventListener(`click`,w),p.addEventListener(`click`,()=>{t.muted=!t.muted,C()}),f.addEventListener(`input`,()=>{b=!0,t.currentTime=Number(f.value),S(),M()}),f.addEventListener(`change`,()=>{b=!1}),[`play`,`pause`,`ended`].forEach(e=>t.addEventListener(e,()=>{x(),E()})),[`timeupdate`,`durationchange`,`loadedmetadata`].forEach(e=>t.addEventListener(e,S)),t.addEventListener(`volumechange`,C);let T=null,E=()=>{e.classList.remove(`llmvision-boxes-idle`),clearTimeout(T),!t.paused&&!t.ended&&(T=setTimeout(()=>e.classList.add(`llmvision-boxes-idle`),2500))};[`pointermove`,`pointerdown`,`keydown`].forEach(t=>e.addEventListener(t,E));let D=`mouse`,O=!1,j=null;t.addEventListener(`pointerdown`,t=>{D=t.pointerType||`mouse`,O=e.classList.contains(`llmvision-boxes-idle`)}),t.addEventListener(`click`,e=>{if(e.preventDefault(),L){L=!1;return}O&&D===`touch`||(clearTimeout(j),j=setTimeout(w,250))});function M(){if(!v||!t.videoWidth)return;Object.assign(a.style,{left:`${_.offsetLeft}px`,top:`${_.offsetTop}px`,width:`${_.offsetWidth}px`,height:`${_.offsetHeight}px`});let e=t.clientWidth,n=t.clientHeight,s=Math.min(e/t.videoWidth,n/t.videoHeight),c=t.videoWidth*s,l=t.videoHeight*s,u=t.offsetLeft+(e-c)/2,d=t.offsetTop+(n-l)/2,f=e=>F+(u+e/1e3*c)*P,p=e=>I+(d+e/1e3*l)*P;r.forEach((e,n)=>{let r=ee(e,t.currentTime,i),a=o[n];if(a.hidden=!r,!r)return;let[s,c,l,u]=r;Object.assign(a.style,{left:`${f(c)}px`,top:`${p(s)}px`,width:`${f(u)-f(c)}px`,height:`${p(l)-p(s)}px`}),a.classList.toggle(`below`,p(s)<18)})}let P=1,F=0,I=0,L=!1,R=()=>{let t=_.offsetWidth,n=_.offsetHeight;P=Math.min(8,Math.max(1,P)),P<1.02&&(P=1,F=0,I=0),F=Math.min(0,Math.max(t*(1-P),F)),I=Math.min(0,Math.max(n*(1-P),I)),_.style.transform=P===1?``:`translate(${F}px, ${I}px) scale(${P})`,e.classList.toggle(`llmvision-boxes-zoomed`,P>1),g.hidden=P===1,g.textContent=`${P<10?P.toFixed(1):Math.round(P)}×`,c(g,`Reset zoom`),M()},z=()=>{P=1,R()};g.addEventListener(`click`,z);let B=()=>{let t=e.getBoundingClientRect();return[t.left+e.clientLeft+_.offsetLeft,t.top+e.clientTop+_.offsetTop]},V=(e,t,n,r)=>{let[i,a]=r.origin,o=(t[0]-i-r.tx)/r.zoom,s=(t[1]-a-r.ty)/r.zoom;P=Math.min(8,Math.max(1,e)),F=n[0]-i-o*P,I=n[1]-a-s*P,R()},H=new Map,W=null,ne=()=>{let e=[...H.values()],t={origin:B(),zoom:P,tx:F,ty:I};if(e.length>=2){let[n,r]=e;W={...t,kind:`pinch`,distance:Math.hypot(n[0]-r[0],n[1]-r[1]),mid:[(n[0]+r[0])/2,(n[1]+r[1])/2]}}else W=e.length===1&&P>1?{...t,kind:`pan`,point:e[0]}:e.length===1?{...t,kind:`none`,point:e[0]}:null};_.addEventListener(`pointerdown`,e=>{if(H.size===0&&(L=!1),H.set(e.pointerId,[e.clientX,e.clientY]),H.size>=2||P>1)for(let e of H.keys())try{_.setPointerCapture(e)}catch{}ne()}),_.addEventListener(`pointermove`,e=>{if(!H.has(e.pointerId)||!W)return;H.set(e.pointerId,[e.clientX,e.clientY]);let t=[...H.values()];if(W.kind===`pinch`&&t.length>=2){let[n,r]=t,i=Math.hypot(n[0]-r[0],n[1]-r[1]),a=[(n[0]+r[0])/2,(n[1]+r[1])/2];V(W.zoom*(i/(W.distance||1)),W.mid,a,W),L=!0,e.preventDefault()}else if(W.kind===`pan`){let t=e.clientX-W.point[0],n=e.clientY-W.point[1];Math.hypot(t,n)>6&&(L=!0),F=W.tx+t,I=W.ty+n,R(),e.preventDefault()}else W.kind===`none`&&Math.hypot(e.clientX-W.point[0],e.clientY-W.point[1])>10&&(L=!0)});let re=e=>{H.delete(e.pointerId)&&ne()};[`pointerup`,`pointercancel`,`lostpointercapture`].forEach(e=>_.addEventListener(e,re)),_.addEventListener(`wheel`,e=>{if(!e.ctrlKey&&!q())return;e.preventDefault();let t=[e.clientX,e.clientY];V(P*Math.exp(-e.deltaY*(e.ctrlKey?.01:.002)),t,t,{origin:B(),zoom:P,tx:F,ty:I})},{passive:!1}),_.addEventListener(`gesturestart`,e=>e.preventDefault());let G=!1,K=null,q=()=>G||N()===e,J=()=>{let e=q();h.innerHTML=U(e?`mdi:fullscreen-exit`:`mdi:fullscreen`),c(h,e?`Exit full screen`:`Full screen`)},Y=t=>{t!==G&&(G=t,G?(K=document.createElement(`div`),K.style.height=`${e.offsetHeight}px`,K.style.marginTop=getComputedStyle(e).marginTop,e.before(K),document.body.append(e)):K&&=(K.isConnected?K.replaceWith(e):e.remove(),null),e.classList.toggle(`llmvision-boxes-expanded`,G),z(),J(),M())},ie=async()=>{let t=e.requestFullscreen||e.webkitRequestFullscreen;if(t){try{await(t.call(e)||new Promise(e=>setTimeout(e,300)))}catch{}if(N()===e)return}Y(!0)},X=()=>{N()===e&&(document.exitFullscreen||document.webkitExitFullscreen)?.call(document),Y(!1)},Z=()=>q()?X():ie();h.addEventListener(`click`,Z),t.addEventListener(`dblclick`,e=>{e.preventDefault(),clearTimeout(j),Z()}),t.addEventListener(`webkitbeginfullscreen`,()=>{setTimeout(()=>{try{t.webkitExitFullscreen()}catch{}Y(!0)},0)});let Q=()=>{if(!e.isConnected&&!(K&&K.isConnected)){[`fullscreenchange`,`webkitfullscreenchange`].forEach(e=>document.removeEventListener(e,Q)),document.removeEventListener(`keydown`,ae,!0);return}N()===t&&((document.exitFullscreen||document.webkitExitFullscreen)?.call(document),Y(!0)),z(),J(),M()},ae=e=>{G&&e.key===`Escape`&&(e.stopPropagation(),e.preventDefault(),Y(!1))};[`fullscreenchange`,`webkitfullscreenchange`].forEach(e=>document.addEventListener(e,Q)),document.addEventListener(`keydown`,ae,!0);let $=()=>{t.isConnected&&(M(),S(),t.requestVideoFrameCallback?t.requestVideoFrameCallback($):t.paused||requestAnimationFrame($))};if(t.requestVideoFrameCallback?t.requestVideoFrameCallback($):t.addEventListener(`play`,()=>requestAnimationFrame($)),[`loadedmetadata`,`seeked`,`timeupdate`].forEach(e=>t.addEventListener(e,M)),typeof ResizeObserver<`u`){let e=new ResizeObserver(()=>{if(!t.isConnected)return e.disconnect();R(),M()});e.observe(t)}return x(),S(),C(),J(),y(v),{close(){t.pause(),N()===e&&(document.exitFullscreen||document.webkitExitFullscreen)?.call(document),Y(!1)}}}var F,I,L,R,z,B,V,H,U,W=t((()=>{F={color:`#ffd600`,text:`#1f1f1f`},I=`llmvision-card-show-boxes`,L=[[`animals`,e=>String(e.species||`animal`).trim().toLowerCase(),`animal`],[`people`,e=>e.age===`child`?`child`:`person`,`person`]],R=2,z=`llmvision-card-boxes-toggled`,B=k,V=`
    .llmvision-thumb-boxes {
        position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none;
    }
    .llmvision-thumb-boxes rect {
        fill: none; stroke-width: 1.5px; vector-effect: non-scaling-stroke;
    }
    .llmvision-thumb-boxes[hidden] { display: none; }
`,H=`
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
`,U=e=>`<ha-icon icon="${e}"></ha-icon>`}));function ne(e){return`
    .${e}-feedback {
        margin: 4px 0 8px; font-family: var(--ha-font-family-body, Roboto, sans-serif);
    }
    .${e}-feedback-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
    .${e}-feedback-question { color: var(--secondary-text-color); margin-right: 4px; }
    .${e}-feedback-row button {
        display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 18px;
        border: 1px solid var(--divider-color, rgba(0,0,0,0.2)); background: transparent;
        color: var(--primary-text-color); font: inherit; cursor: pointer; --mdc-icon-size: 18px;
    }
    .${e}-feedback-row button[aria-pressed="true"].correct {
        background: rgba(22,163,74,0.15); border-color: #16A34A; color: var(--primary-text-color);
    }
    .${e}-feedback-row button[aria-pressed="true"].incorrect {
        background: rgba(220,38,38,0.12); border-color: #DC2626; color: var(--primary-text-color);
    }
    .${e}-feedback-row button.correct ha-icon { color: #16A34A; }
    .${e}-feedback-row button.incorrect ha-icon { color: #DC2626; }
    .${e}-feedback-comment { margin-top: 8px; }
    .${e}-feedback-comment[hidden] { display: none; }
    .${e}-feedback-comment textarea {
        box-sizing: border-box; width: 100%; min-height: 72px; resize: vertical; padding: 8px 10px;
        border-radius: 8px; border: 1px solid var(--divider-color, rgba(0,0,0,0.2));
        background: var(--card-background-color, transparent); color: var(--primary-text-color);
        /* 16px keeps iOS from zooming in on focus */
        font: 16px/1.4 var(--ha-font-family-body, Roboto, sans-serif);
    }
    .${e}-feedback-actions { display: flex; align-items: center; gap: 10px; margin-top: 6px; }
    .${e}-feedback-actions button {
        padding: 6px 14px; border-radius: 16px; border: none; cursor: pointer; font: inherit;
        background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #fff);
    }
    .${e}-feedback-status { color: var(--secondary-text-color); font-size: 0.9em; }
    .${e}-feedback-status.error { color: var(--error-color, #DC2626); }
    `}function re(e){return`
    <div class="${e}-feedback">
        <div class="${e}-feedback-row">
            <span class="${e}-feedback-question">Is this right?</span>
            <button type="button" class="correct" aria-pressed="false"><ha-icon icon="mdi:check-circle-outline"></ha-icon><span>Everything correct</span></button>
            <button type="button" class="incorrect" aria-pressed="false"><ha-icon icon="mdi:close-circle-outline"></ha-icon><span>Something's wrong</span></button>
            <span class="${e}-feedback-status" role="status"></span>
        </div>
        <div class="${e}-feedback-comment" hidden>
            <textarea maxlength="${q}" placeholder="What's wrong? For example: it's a raccoon, not a cat; the box misses the animal; there is nothing there."></textarea>
            <div class="${e}-feedback-actions">
                <button type="button" class="save">Save</button>
            </div>
        </div>
    </div>`}function G(e,t,{feedback:n,save:r,formatTime:i,onSaved:a}){let o=e.querySelector(`.${t}-feedback`);if(!o)return;let s=o.querySelector(`button.correct`),c=o.querySelector(`button.incorrect`),l=o.querySelector(`.${t}-feedback-comment`),u=l.querySelector(`textarea`),d=l.querySelector(`button.save`),f=o.querySelector(`.${t}-feedback-status`),p=n&&n.verdict?n:null,m=p?.comment||``,h=null,g=Promise.resolve();u.value=m;let _=(e,t=!1)=>{f.textContent=e,f.classList.toggle(`error`,t)},v=()=>{if(!p)return``;let e=p.updated?i(p.updated):``;return`Saved${e?` · ${e}`:``}`},y=()=>{let e=p?.verdict||``;s.setAttribute(`aria-pressed`,String(e===`correct`)),c.setAttribute(`aria-pressed`,String(e===`incorrect`)),l.hidden=e!==`incorrect`},b=(e,t)=>(clearTimeout(h),_(`Saving…`),g=g.then(async()=>{try{p=await r(e,t),m=p?.comment??t,_(p?v():`Feedback cleared`),a&&a(p)}catch(e){_(`Couldn't save: ${e?.body?.message||e?.message||e}`,!0)}y()}),g),x=e=>{let t=p?.verdict===e?null:e;b(t,u.value.trim()),p=t?{...p||{},verdict:t}:null,y(),t===`incorrect`&&!u.value&&u.focus()};s.addEventListener(`click`,()=>x(`correct`)),c.addEventListener(`click`,()=>x(`incorrect`)),u.addEventListener(`input`,()=>{if(clearTimeout(h),u.value.trim()===m){_(v());return}_(`Not saved yet`),h=setTimeout(()=>b(`incorrect`,u.value.trim()),K)});let S=()=>{(u.value.trim()!==m||p?.verdict!==`incorrect`)&&b(`incorrect`,u.value.trim())};d.addEventListener(`click`,S),u.addEventListener(`blur`,()=>{u.value.trim()!==m&&S()}),u.addEventListener(`keydown`,e=>{e.key===`Escape`&&u.value.trim()!==m&&S(),e.key===`Enter`&&(e.metaKey||e.ctrlKey)&&(e.preventDefault(),S())}),y(),_(v())}var K,q,J=t((()=>{K=800,q=4e3}));function Y(e){window.__LLMVISION_BADGE_LOGGED||(console.log(`%cLLM Vision Card%c v${S}`,`background:#0071FF;color:#fff;padding:2px 6px 2px 8px;border-radius:4px 0 0 4px;font-weight:600;`,`background:#0058c7;color:#fff;padding:2px 4px;font-weight:500;`,`background:#0058c7;color:#fff;padding:2px 8px 2px 6px;border-radius:0 4px 4px 0;font-weight:600;`),window.__LLMVISION_BADGE_LOGGED=!0)}function ie(e,t){if(!t)return``;let n=e.states[t],r=n?.attributes?.friendly_name||t,i=e.entities?.[t]?.device_id,a=i?e.devices?.[i]:void 0,o=a?a.name_by_user||a.name:``;return o&&Object.values(e.entities||{}).filter(e=>e.device_id===i&&e.entity_id.startsWith(`camera.`)).length===1?o:n?r:``}var X,Z,Q,ae=t((()=>{C(),f(),W(),J(),X=3600*3,Z=600,Q=class extends HTMLElement{imageCache=new Map;_lastEventHash=null;_lastFetch=0;_fetchPromise=null;_cachedEvents=null;connectedCallback(){this._badgeLogged||=(Y(this.badgeContext||`Card`),!0)}setCommonConfig(e,{requireEventLimits:t=!1}={}){if(this.config=e,this.category_filters=e.category_filters||[],this.camera_filters=e.camera_filters||[],this.language=e.language,this.number_of_events=e.number_of_events,this.number_of_days=e.number_of_days,this.custom_colors=e.custom_colors||{},this.label_styles=x(e.label_styles),this.default_icon=e.default_icon||`mdi:motion-sensor`,this.default_color=e.default_color||`#929292`,this.time_format=e.time_format||`24h`,this.filter_false_positives=e.filter_false_positives!==!1,this.refresh_interval=Math.max(1,Number(e.refresh_interval||15)),t){if(!this.number_of_events&&!this.number_of_days)throw Error(`Either number_of_events or number_of_days needs to be set.`);if(this.number_of_events&&this.number_of_events<1)throw Error(`number_of_events must be greater than 0.`)}}async fetchEvents(e,{limit:t=10,days:n=null,hours:r=null,cameras:i=[],categories:a=[],includeNoActivity:o=!1}={}){let s=Date.now(),c=(this.refresh_interval||15)*1e3;if(this._fetchPromise)return this._fetchPromise;if(this._cachedEvents&&s-this._lastFetch<c)return this._cachedEvents;this._lastFetch=s,this._fetchPromise=this._fetchEvents(e,{limit:t,days:n,hours:r,cameras:i,categories:a,includeNoActivity:o});try{return this._cachedEvents=await this._fetchPromise,this._cachedEvents}finally{this._fetchPromise=null}}async _fetchEvents(e,{limit:t=10,days:n=null,hours:r=null,cameras:i=[],categories:a=[],includeNoActivity:o=!1}={}){try{let s=new URLSearchParams;t&&s.set(`limit`,t),i?.length&&s.set(`cameras`,i.join(`,`)),n&&s.set(`days`,n),r&&s.set(`hours`,r),a?.length&&s.set(`categories`,a.join(`,`)),s.set(`include_no_activity`,o?`true`:`false`);let c=`llmvision/timeline/events${s.toString()?`?`+s.toString():``}`,l=await e.callApi(`GET`,c);return(Array.isArray(l?.events)?l.events:[]).map(t=>{let n=ie(e,t.camera_name||``),r=d(t);return{title:t.title||``,description:t.description||``,category:t.category||``,label:r[0]||``,labels:r,keyFrame:t.key_frame||``,clip:t.clip||``,details:t.details??null,feedback:t.feedback??null,cameraName:n,startTime:t.start||null,endTime:t.end||null,id:t.uid||``}})}catch(e){return console.error(`Error fetching events from API:`,e),null}}async deleteEvent(e,t){try{return await e.callApi(`DELETE`,`llmvision/timeline/event/${encodeURIComponent(t)}`),!0}catch(e){return console.error(`Error deleting event from API:`,e),!1}}_hashState(e){return JSON.stringify(e)}_sort(e){return e.sort((e,t)=>new Date(t.startTime)-new Date(e.startTime))}_limit(e){return this.number_of_days,this.number_of_events?e.slice(0,this.number_of_events):e}formatDateLabel(e){let t=new Date,r=new Date(t);return r.setDate(t.getDate()-1),e.toDateString()===t.toDateString()?n(`today`,this.language)||`Today`:e.toDateString()===r.toDateString()?n(`yesterday`,this.language)||`Yesterday`:e.toLocaleDateString(`en`,{month:`short`,day:`numeric`})}formatTime(e){let t=this.time_format||`24h`,n=e.getMinutes().toString().padStart(2,`0`);if(t===`12h`){let t=e.getHours(),r=t%12||12,i=t>=12?`PM`:`AM`;return`${r.toString().padStart(2,`0`)}:${n} ${i}`}return`${e.getHours().toString().padStart(2,`0`)}:${n}`}formatDateTimeShort(e){let t=new Date(e),r=new Date,i=new Date;return i.setDate(r.getDate()-1),t.toDateString()===r.toDateString()?n(`today`,this.language)||`Today`:t.toDateString()===i.toDateString()?n(`yesterday`,this.language)||`Yesterday`:t.toLocaleDateString(`en-US`,{month:`short`,day:`numeric`})}formatDateTimeFull(e){let t=new Date(e);return`${t.toLocaleDateString(`en-US`,{month:`short`,day:`numeric`})}, ${this.formatTime(t)}`}resolveMedia(e,t,{fallback:n=t}={}){if(!t||!l(t))return Promise.resolve(``);if(/^data:/i.test(t.trim()))return Promise.resolve(t.trim());let r=t.replace(`/media/`,`media-source://media_source/local/`),i=this.imageCache.get(r);return i&&i.renewAt>Date.now()?Promise.resolve(i.url):e.callWS({type:`media_source/resolve_media`,media_content_id:r,expires:X}).then(e=>{let t=e.url;return this.imageCache.set(r,{url:t,renewAt:Date.now()+(X-Z)*1e3}),t}).catch(e=>(console.error(`Error resolving media content ID:`,e),n))}resolveKeyFrame(e,t){return this.resolveMedia(e,t)}showImageWhenLoaded(e,t,n=``,r=0){if(!e||!t)return;let i=new Image;i.src=t,(typeof i.decode==`function`?i.decode():new Promise((e,t)=>{i.onload=e,i.onerror=t})).then(()=>{e.isConnected&&(e.src=t,e.style.display=n)}).catch(()=>{r<1&&setTimeout(()=>this.showImageWhenLoaded(e,t,n,r+1),1e3)})}resolveClip(e,t){return this.resolveMedia(e,t,{fallback:``})}openEventPopup(e,t,n){return Promise.all([this.resolveKeyFrame(e,t.keyFrame),this.resolveClip(e,t.clip)]).then(([r,i])=>{this.showPopup({event:t.title,summary:t.description,startTime:t.startTime,keyFrame:r,clip:i,cameraName:t.cameraName,category:t.category,label:t.label,labels:t.labels,details:t.details,feedback:t.feedback,onFeedback:e=>{t.feedback=e},icon:n,prefix:`popup`,eventId:t.id},e)})}computeColors(e,t){let n=this.custom_colors||{},r;r=e==null?this.default_color===void 0?t:this.default_color:n[e]===void 0?t:n[e];let i,a;return Array.isArray(r)&&r.length===3?(i=`rgba(${r[0]},${r[1]},${r[2]},0.2)`,a=`rgba(${r[0]},${r[1]},${r[2]},1)`):(i=h(r,.2),a=h(r,1)),{bgColorRgba:i,iconColorRgba:a}}labelColor(e,t){let n=v(this.label_styles,e);if(n)return b(n.solid);let r=c(e,t);return b(this.computeColors(r,_(r,``).color).iconColorRgba)}labelBadgesHtml(e,t,n){let i=e=>typeof e==`string`?e.trim().toLowerCase():e,s=Array.isArray(t)?t:[],l=!!(e&&!s.some(t=>i(t)===i(e))),{icon:u,color:d}=_(e,``),{bgColorRgba:f,iconColorRgba:p}=this.computeColors(e,d),m=(e,t,r,i=``)=>`<span class="${n}" style="${r}"><ha-icon icon="${a(e)}"${i?` style="color:${i};"`:``}></ha-icon><span class="text">${a(t)}</span></span>`,h=(e,t)=>m(e,t,r(null,f),p);return(l?h(u,e):``)+s.map(t=>{let n=v(this.label_styles,t),i=n?.icon||o(t,e);if(n)return m(i,t,r(n));let a=c(t,e);if(a===e)return h(i,t);let s=this.computeColors(a,_(a,``).color);return m(i,t,r(null,s.bgColorRgba),s.iconColorRgba)}).join(``)}showPopup({event:e,summary:t,startTime:r,keyFrame:o,clip:c,cameraName:l,category:u,label:d,labels:f,details:p,feedback:m,onFeedback:h,icon:g,prefix:_,eventId:v},y){let b=y||this.hass,x=this.formatDateTimeFull(r),S=l?`${x} • ${l}`:x,C=`${_}-overlay`,w=`${_}-content`,T=`close-${_}`,O=`${_}-header-row`,ee=`${_}-title-row`,k=`${_}-menu`,A=`${_}-menu-btn`,j=`${_}-menu-list`,M=`${_}-menu-item`,N=`${_}-menu-item-delete`,te=Array.isArray(f)?f:d?[d]:[],F=typeof o==`string`?o.trim().length>0:!!o,I=c?E(p,(e,t)=>this.labelColor(e,t)):{rate:1,tracks:[]},L=c?`<div class="llmvision-boxes-media"><video controls playsinline webkit-playsinline preload="metadata"${F?` poster="${a(o)}"`:``} src="${a(c)}"></video></div>`:`<img src="${a(o)}" alt="Event Snapshot" onerror="this.style.display='none'">`,R=`
                <div>
                    <div class="${O}">
                        <button class="${T}" title="Close" style="font-size:30px">
                            <ha-icon icon="mdi:close"></ha-icon>
                        </button>
                        <div class="${_}-title-main">
                            <h2>${a(e)}</h2>
                        </div>
                        ${v?`
                            <div class="${k}">
                            <button class="${A}" title="Menu" style="font-size:26px">
                                <ha-icon icon="mdi:dots-vertical"></ha-icon>
                            </button>
                            <div class="${j}" hidden>
                                <button class="${M} ${N}" title="Delete event">
                                    <ha-icon icon="mdi:trash-can-outline"></ha-icon>
                                    <span>${n(`delete`,this.language)||`Delete`}</span>
                                </button>
                            </div>
                        </div>`:`<div class="${_}-menu-placeholder"></div>`}
                    </div>
                    <div class="${ee}">
                        <div class="${_}-title-secondary">
                            <p class="secondary"><span>${a(S)}</span></p>
                        </div>
                        <div class="${_}-title-tertiary">
                            <div class="${_}-badges-row">
                                ${this.labelBadgesHtml(u,te,`${_}-badge`)}
                            </div>
                        </div>
                    </div>
                    ${L}
                    <p class="summary">${a(t)}</p>
                    ${v||s(D(p))?`
                    <details class="${_}-details">
                        <summary>${a(n(`additional_details`,this.language)||`Additional details`)}</summary>
                        <div class="${_}-details-body">${v?re(_):``}${s(D(p))?i(D(p)):``}</div>
                    </details>`:``}
                </div>
            `,z=document.createElement(`div`);z.innerHTML=`
                <div class="${C}">
                    <div class="${w}">
                        ${R}
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
    
                    .${O} {
                        display: flex;
                        /* Buttons line up with the title's first line */
                        align-items: flex-start;
                        gap: 8px;
                        margin-bottom: 4px;
                    }
                    /* Same width on both sides of the title keeps it centered.
                       All three are centered as boxes: the menu button is
                       centered in its wrapper rather than set on a text line. */
                    .${O} > .${T},
                    .${O} > .${k},
                    .${O} > .${_}-menu-placeholder {
                        flex: 0 0 40px;
                        height: 40px;
                    }
                    .${O} > .${k} {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .${O} .${T},
                    .${O} .${A} {
                        width: 40px;
                        height: 40px;
                        padding: 0;
                        margin: 0;
                        line-height: 0;
                    }
    
                    /* Title row: icon + title */
                    .${ee} {
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
    
                    ${H}
                    ${ne(_)}

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
                    .${T}, .${A} {
                        background: none;
                        border: none;
                        cursor: pointer;
                        color: var(--primary-text-color);
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                    }
    
                    /* Menu */
                    .${k} {
                        position: relative;
                    }
                    .${j} {
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
                    .${M} {
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
                    .${M}:hover {
                        background: rgba(0,0,0,0.06);
                    }
                    .${N} {
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
                        .${O} {
                            padding-top: 10px;
                        }
                    }
                </style>
            `,(!history.state||!history.state.popupOpen)&&history.pushState({popupOpen:!0},``);let B=z.querySelector(`.${C}`),V=()=>this.closePopup(z,C,V);window.addEventListener(`popstate`,V),z.querySelector(`.${T}`).addEventListener(`click`,()=>this.closePopup(z,C,V)),B.addEventListener(`click`,e=>{e.target===B&&this.closePopup(z,C,V)});let U=e=>{e.key===`Escape`&&this.closePopup(z,C,V,U)};document.addEventListener(`keydown`,U),z._escHandler=U;let W=z.querySelector(`.${A}`),K=z.querySelector(`.${j}`);W&&K&&(W.addEventListener(`click`,e=>{e.stopPropagation(),K.hidden=!K.hidden}),z.addEventListener(`click`,e=>{!K.hidden&&!e.target.closest(`.${k}`)&&(K.hidden=!0)}));let q=z.querySelector(`.${N}`);q&&v&&q.addEventListener(`click`,async e=>{if(e.stopPropagation(),q.disabled)return;let t=n(`confirm_delete_event`,this.language)||`Are you sure you want to delete this event?`;if(!confirm(t)){K&&(K.hidden=!0);return}q.disabled=!0,await this.deleteEvent(b,v)?this.closePopup(z,C,V,U):(alert(n(`error_delete_event`,this.language)||`Failed to delete the event. Please try again.`),q.disabled=!1,K&&(K.hidden=!0))}),document.body.appendChild(z),this.lockPageScroll(z),v&&G(z,_,{feedback:m,save:async(e,t)=>(await b.callApi(`POST`,`llmvision/timeline/event/${encodeURIComponent(v)}/feedback`,{verdict:e,comment:t}))?.event?.feedback??null,formatTime:e=>this.formatDateTimeFull(e),onSaved:e=>h?.(e)}),c&&(z._boxOverlay=P(z.querySelector(`.llmvision-boxes-media`),z.querySelector(`.llmvision-boxes-media video`),I)),requestAnimationFrame(()=>B.classList.add(`show`))}lockPageScroll(e){if(e._scrollLocked)return;e._scrollLocked=!0;let t=document.documentElement;window.__llmvisionScrollLocks=(window.__llmvisionScrollLocks||0)+1,window.__llmvisionScrollLocks===1&&(window.__llmvisionScrollRestore=[t.style.overflow,document.body.style.overflow],t.style.overflow=`hidden`,document.body.style.overflow=`hidden`)}unlockPageScroll(e){e._scrollLocked&&(e._scrollLocked=!1,window.__llmvisionScrollLocks=Math.max(0,(window.__llmvisionScrollLocks||1)-1),window.__llmvisionScrollLocks===0&&window.__llmvisionScrollRestore&&([document.documentElement.style.overflow,document.body.style.overflow]=window.__llmvisionScrollRestore,window.__llmvisionScrollRestore=null))}closePopup(e,t,n,r){e._boxOverlay?.close(),e.querySelectorAll(`video`).forEach(e=>e.pause()),this.unlockPageScroll(e);let i=e.querySelector(`.${t}`);i.classList.remove(`show`),i.addEventListener(`transitionend`,()=>{e._escHandler&&document.removeEventListener(`keydown`,e._escHandler);try{document.body.removeChild(e)}catch{}},{once:!0}),history.state&&history.state.popupOpen&&history.replaceState(null,``),window.removeEventListener(`popstate`,n)}}})),$,oe,se=t((()=>{f(),e(),g(),ae(),$=class extends p{static get properties(){return{_config:{type:Object}}}setConfig(e){this._config=e||{}}render(){if(!this._config)return u`<div>Please configure the card.</div>`;let e=this._getSchema(),t=e.slice(0,3),n=e.slice(3,5),r=e.slice(5);return u`
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
        `}_getSchema(){let e=[{name:`category_filters`,description:`Filter events by category (title). Only events matching selected categories will be shown.`,selector:{select:{multiple:!0,options:Object.keys(y).map(e=>({value:e,label:e.charAt(0).toUpperCase()+e.slice(1)}))}}},{name:`camera_filters`,description:`Filter events by camera entity. Only events from selected cameras will be shown.`,selector:{select:{multiple:!0,options:Object.keys(this.hass.states).filter(e=>e.startsWith(`camera.`)).map(e=>({value:e,label:this.hass.states[e].attributes.friendly_name||e}))}}},{name:`filter_false_positives`,description:`Hide events titled 'No activity observed'.`,selector:{boolean:{default:!0}}}],t=[{name:`language`,description:`Language for the card. This will be used to generate icons and translations.`,selector:{select:{options:[{value:`bg`,label:`Bulgarian`},{value:`ca`,label:`Catalan`},{value:`cz`,label:`Czech`},{value:`da`,label:`Danish`},{value:`nl`,label:`Dutch`},{value:`en`,label:`English`},{value:`fr`,label:`French`},{value:`de`,label:`German`},{value:`hu`,label:`Hungarian`},{value:`it`,label:`Italian`},{value:`pl`,label:`Polish`},{value:`pt`,label:`Portuguese`},{value:`sk`,label:`Slovak`},{value:`es`,label:`Spanish`},{value:`sv`,label:`Swedish`}]}}},{name:`time_format`,description:`Choose between 12-hour and 24-hour time display.`,selector:{select:{options:[{value:`24h`,label:`24-hour`},{value:`12h`,label:`12-hour`}]}}}],n=[{name:`default_icon`,description:`Icon when no category keyword matches.`,selector:{icon:{}}}];return[...e,...t,...n]}_computeLabel(e){return{entity:`Calendar Entity`,category_filters:`Category Filters`,camera_filters:`Camera Filters`,filter_false_positives:`Filter False Positives`,language:`Language`,time_format:`Time Format`}[e.name]||e.name}_computeHelper=e=>e.description||``;_valueChanged(e){this.dispatchEvent(new CustomEvent(`config-changed`,{detail:{config:e.detail.value}}))}static get styles(){return m`ha-card{padding:16px;}`}},customElements.define(`timeline-preview-card-editor`,$),oe=class extends Q{setConfig(e){this.setCommonConfig(e,{requireEventLimits:!1})}static getConfigElement(){return document.createElement(`timeline-preview-card-editor`)}static getStubConfig(){return{entity:`calendar.llm_vision_timeline`,language:`en`,time_format:`24h`,filter_false_positives:!0}}getCardSize(){return 3}getGridOptions(){return{rows:2,columns:6,min_rows:2,max_rows:8,min_columns:6,max_columns:24}}set hass(e){this.content||=(this.style.display=`block`,this.style.height=`100%`,this.innerHTML=`
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
            `,r.addEventListener(`click`,()=>this.openEventPopup(t,n,o)),this.content.innerHTML=``,this.content.appendChild(r),this.resolveKeyFrame(t,n.keyFrame).then(e=>{this.showImageWhenLoaded(r.querySelector(`img`),e,`block`)})}static getStubConfig(){return{language:`en`,time_format:`24h`,filter_false_positives:!0}}},customElements.define(`llmvision-preview-card`,oe)}));se();export{oe as LLMVisionPreviewCard,E as a,W as c,z as i,j as l,Q as n,B as o,ae as r,M as s,se as t,V as u};