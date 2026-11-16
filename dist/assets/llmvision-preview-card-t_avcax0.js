import{C as e,S as t,T as n,_ as r,b as i,c as a,d as o,f as s,g as c,h as l,i as u,l as d,m as f,n as p,o as m,p as h,t as g,u as _,v,x as y,y as b}from"./shared-BbZ-2XLY.js";var x,S=n((()=>{x=`1.7.2`}));function C(e){return e&&Number.isFinite(Number(e.frame))&&Array.isArray(e.box_2d)&&e.box_2d.length===4&&e.box_2d.every(e=>Number.isFinite(Number(e)))}function w(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}function T(e,t=()=>null){let n=[];if(!w(e))return{rate:1,tracks:n};let r=Number(e.frame_rate)>0?Number(e.frame_rate):1;for(let[i,a,o]of F)for(let s of Array.isArray(e[i])?e[i]:[]){if(!w(s)||!Array.isArray(s.boxes))continue;let e=s.boxes.filter(C).map(e=>({t:(Number(e.frame)-1)/r,box:e.box_2d.map(Number)})).sort((e,t)=>e.t-t.t);if(!e.length)continue;let i=a(s),c=Number(s.count)>1?` ×${Number(s.count)}`:``,{color:l,text:u}=t(i,o)||N;n.push({label:`${i}${c}`,color:l,text:u,boxes:e})}return{rate:r,tracks:n}}function E(e){if(!w(e))return e;let t={...e};delete t.frame_rate;for(let[e]of F)Array.isArray(t[e])&&(t[e]=t[e].map(e=>{if(!w(e))return e;let{boxes:t,...n}=e;return n}));return t}function D(e,t,n){let r=(n-e.t)/(t.t-e.t),[i,a,o,s]=e.box.map((e,n)=>Math.min(1e3,Math.max(0,e+(t.box[n]-e)*r)));return o>i&&s>a?[i,a,o,s]:null}function O(e,t,n){let r=e.boxes,i=I*n+1e-6,a=r.findIndex(e=>e.t>t);a===-1&&(a=r.length);let o=r[a-1],s=r[a];if(o&&s&&s.t-o.t<=i)return D(o,s,t);if(o&&t-o.t<=n/2){let e=r[a-2];return e&&o.t-e.t<=i?D(e,o,t):o.box}if(s&&s.t-t<=n/2){let e=r[a+1];return e&&e.t-s.t<=i?D(s,e,t):s.box}return null}function k(){try{return localStorage.getItem(P)!==`off`}catch{return!0}}function A(e){try{localStorage.setItem(P,e?`on`:`off`)}catch{}}function j(){return document.fullscreenElement||document.webkitFullscreenElement||null}function M(e){let t=Number.isFinite(e)?Math.max(0,Math.floor(e)):0;return`${Math.floor(t/60)}:${String(t%60).padStart(2,`0`)}`}function ee(e,t,{rate:n,tracks:r}){if(!e||!t||!r.length)return null;let i=1/n,a=document.createElement(`div`);a.className=`llmvision-boxes-layer`;let o=r.map(e=>{let t=document.createElement(`div`);t.className=`llmvision-box`,t.style.setProperty(`--box-color`,e.color),t.style.setProperty(`--box-text`,e.text),t.hidden=!0;let n=document.createElement(`span`);return n.textContent=e.label,t.appendChild(n),a.appendChild(t),t});t.controls=!1,t.removeAttribute(`controls`),t.disablePictureInPicture=!0,t.setAttribute(`disablepictureinpicture`,``),t.setAttribute(`disableremoteplayback`,``);let s=(e,t)=>{let n=document.createElement(`button`);return n.type=`button`,n.className=e,t&&(n.innerHTML=R(t)),n},c=(e,t)=>{e.title=t,e.setAttribute(`aria-label`,t)},l=document.createElement(`div`);l.className=`llmvision-boxes-controls`;let u=s(`llmvision-boxes-play`),d=document.createElement(`span`);d.className=`llmvision-boxes-time`;let f=document.createElement(`input`);f.type=`range`,f.className=`llmvision-boxes-seek`,f.min=`0`,f.max=`0`,f.step=`any`,f.value=`0`,f.setAttribute(`aria-label`,`Seek`);let p=s(`llmvision-boxes-mute`),m=s(`llmvision-boxes-toggle`,`mdi:vector-square`),h=s(`llmvision-boxes-fullscreen`),g=s(`llmvision-boxes-zoom`);g.hidden=!0,l.append(u,d,f,g,p,m,h);let _=document.createElement(`div`);_.className=`llmvision-boxes-stage`,t.before(_),_.append(t),e.append(a,l),[`click`,`dblclick`,`pointerdown`].forEach(e=>l.addEventListener(e,e=>e.stopPropagation()));let v=k(),y=e=>{v=e,a.hidden=!v,m.setAttribute(`aria-pressed`,String(v)),c(m,v?`Hide boxes`:`Show boxes`),P()};m.addEventListener(`click`,()=>{y(!v),A(v)});let b=!1,x=()=>{let e=t.paused||t.ended;u.innerHTML=R(e?`mdi:play`:`mdi:pause`),c(u,e?`Play`:`Pause`)},S=()=>{Number.isFinite(t.duration)&&(f.max=String(t.duration)),b||(f.value=String(t.currentTime)),d.textContent=`${M(t.currentTime)} / ${M(t.duration)}`},C=()=>{p.innerHTML=R(t.muted?`mdi:volume-off`:`mdi:volume-high`),c(p,t.muted?`Unmute`:`Mute`)},w=()=>{if(t.paused||t.ended){let e=t.play();e&&e.catch&&e.catch(()=>{})}else t.pause()};u.addEventListener(`click`,w),p.addEventListener(`click`,()=>{t.muted=!t.muted,C()}),f.addEventListener(`input`,()=>{b=!0,t.currentTime=Number(f.value),S(),P()}),f.addEventListener(`change`,()=>{b=!1}),[`play`,`pause`,`ended`].forEach(e=>t.addEventListener(e,()=>{x(),E()})),[`timeupdate`,`durationchange`,`loadedmetadata`].forEach(e=>t.addEventListener(e,S)),t.addEventListener(`volumechange`,C);let T=null,E=()=>{e.classList.remove(`llmvision-boxes-idle`),clearTimeout(T),!t.paused&&!t.ended&&(T=setTimeout(()=>e.classList.add(`llmvision-boxes-idle`),2500))};[`pointermove`,`pointerdown`,`keydown`].forEach(t=>e.addEventListener(t,E));let D=`mouse`,ee=!1,N=null;t.addEventListener(`pointerdown`,t=>{D=t.pointerType||`mouse`,ee=e.classList.contains(`llmvision-boxes-idle`)}),t.addEventListener(`click`,e=>{if(e.preventDefault(),z){z=!1;return}ee&&D===`touch`||(clearTimeout(N),N=setTimeout(w,250))});function P(){if(!v||!t.videoWidth)return;Object.assign(a.style,{left:`${_.offsetLeft}px`,top:`${_.offsetTop}px`,width:`${_.offsetWidth}px`,height:`${_.offsetHeight}px`});let e=t.clientWidth,n=t.clientHeight,s=Math.min(e/t.videoWidth,n/t.videoHeight),c=t.videoWidth*s,l=t.videoHeight*s,u=t.offsetLeft+(e-c)/2,d=t.offsetTop+(n-l)/2,f=e=>I+(u+e/1e3*c)*F,p=e=>L+(d+e/1e3*l)*F;r.forEach((e,n)=>{let r=O(e,t.currentTime,i),a=o[n];if(a.hidden=!r,!r)return;let[s,c,l,u]=r;Object.assign(a.style,{left:`${f(c)}px`,top:`${p(s)}px`,width:`${f(u)-f(c)}px`,height:`${p(l)-p(s)}px`}),a.classList.toggle(`below`,p(s)<18)})}let F=1,I=0,L=0,z=!1,B=()=>{let t=_.offsetWidth,n=_.offsetHeight;F=Math.min(8,Math.max(1,F)),F<1.02&&(F=1,I=0,L=0),I=Math.min(0,Math.max(t*(1-F),I)),L=Math.min(0,Math.max(n*(1-F),L)),_.style.transform=F===1?``:`translate(${I}px, ${L}px) scale(${F})`,e.classList.toggle(`llmvision-boxes-zoomed`,F>1),g.hidden=F===1,g.textContent=`${F<10?F.toFixed(1):Math.round(F)}×`,c(g,`Reset zoom`),P()},V=()=>{F=1,B()};g.addEventListener(`click`,V);let H=()=>{let t=e.getBoundingClientRect();return[t.left+e.clientLeft+_.offsetLeft,t.top+e.clientTop+_.offsetTop]},U=(e,t,n,r)=>{let[i,a]=r.origin,o=(t[0]-i-r.tx)/r.zoom,s=(t[1]-a-r.ty)/r.zoom;F=Math.min(8,Math.max(1,e)),I=n[0]-i-o*F,L=n[1]-a-s*F,B()},W=new Map,G=null,K=()=>{let e=[...W.values()],t={origin:H(),zoom:F,tx:I,ty:L};if(e.length>=2){let[n,r]=e;G={...t,kind:`pinch`,distance:Math.hypot(n[0]-r[0],n[1]-r[1]),mid:[(n[0]+r[0])/2,(n[1]+r[1])/2]}}else G=e.length===1&&F>1?{...t,kind:`pan`,point:e[0]}:e.length===1?{...t,kind:`none`,point:e[0]}:null};_.addEventListener(`pointerdown`,e=>{if(W.size===0&&(z=!1),W.set(e.pointerId,[e.clientX,e.clientY]),W.size>=2||F>1)for(let e of W.keys())try{_.setPointerCapture(e)}catch{}K()}),_.addEventListener(`pointermove`,e=>{if(!W.has(e.pointerId)||!G)return;W.set(e.pointerId,[e.clientX,e.clientY]);let t=[...W.values()];if(G.kind===`pinch`&&t.length>=2){let[n,r]=t,i=Math.hypot(n[0]-r[0],n[1]-r[1]),a=[(n[0]+r[0])/2,(n[1]+r[1])/2];U(G.zoom*(i/(G.distance||1)),G.mid,a,G),z=!0,e.preventDefault()}else if(G.kind===`pan`){let t=e.clientX-G.point[0],n=e.clientY-G.point[1];Math.hypot(t,n)>6&&(z=!0),I=G.tx+t,L=G.ty+n,B(),e.preventDefault()}else G.kind===`none`&&Math.hypot(e.clientX-G.point[0],e.clientY-G.point[1])>10&&(z=!0)});let q=e=>{W.delete(e.pointerId)&&K()};[`pointerup`,`pointercancel`,`lostpointercapture`].forEach(e=>_.addEventListener(e,q)),_.addEventListener(`wheel`,e=>{if(!e.ctrlKey&&!X())return;e.preventDefault();let t=[e.clientX,e.clientY];U(F*Math.exp(-e.deltaY*(e.ctrlKey?.01:.002)),t,t,{origin:H(),zoom:F,tx:I,ty:L})},{passive:!1}),_.addEventListener(`gesturestart`,e=>e.preventDefault());let J=!1,Y=null,X=()=>J||j()===e,Z=()=>{let e=X();h.innerHTML=R(e?`mdi:fullscreen-exit`:`mdi:fullscreen`),c(h,e?`Exit full screen`:`Full screen`)},Q=t=>{t!==J&&(J=t,J?(Y=document.createElement(`div`),Y.style.height=`${e.offsetHeight}px`,Y.style.marginTop=getComputedStyle(e).marginTop,e.before(Y),document.body.append(e)):Y&&=(Y.isConnected?Y.replaceWith(e):e.remove(),null),e.classList.toggle(`llmvision-boxes-expanded`,J),V(),Z(),P())},te=async()=>{let t=e.requestFullscreen||e.webkitRequestFullscreen;if(t){try{await(t.call(e)||new Promise(e=>setTimeout(e,300)))}catch{}if(j()===e)return}Q(!0)},ne=()=>{j()===e&&(document.exitFullscreen||document.webkitExitFullscreen)?.call(document),Q(!1)},re=()=>X()?ne():te();h.addEventListener(`click`,re),t.addEventListener(`dblclick`,e=>{e.preventDefault(),clearTimeout(N),re()}),t.addEventListener(`webkitbeginfullscreen`,()=>{setTimeout(()=>{try{t.webkitExitFullscreen()}catch{}Q(!0)},0)});let ie=()=>{if(!e.isConnected&&!(Y&&Y.isConnected)){[`fullscreenchange`,`webkitfullscreenchange`].forEach(e=>document.removeEventListener(e,ie)),document.removeEventListener(`keydown`,ae,!0);return}j()===t&&((document.exitFullscreen||document.webkitExitFullscreen)?.call(document),Q(!0)),V(),Z(),P()},ae=e=>{J&&e.key===`Escape`&&(e.stopPropagation(),e.preventDefault(),Q(!1))};[`fullscreenchange`,`webkitfullscreenchange`].forEach(e=>document.addEventListener(e,ie)),document.addEventListener(`keydown`,ae,!0);let $=()=>{t.isConnected&&(P(),S(),t.requestVideoFrameCallback?t.requestVideoFrameCallback($):t.paused||requestAnimationFrame($))};if(t.requestVideoFrameCallback?t.requestVideoFrameCallback($):t.addEventListener(`play`,()=>requestAnimationFrame($)),[`loadedmetadata`,`seeked`,`timeupdate`].forEach(e=>t.addEventListener(e,P)),typeof ResizeObserver<`u`){let e=new ResizeObserver(()=>{if(!t.isConnected)return e.disconnect();B(),P()});e.observe(t)}return x(),S(),C(),Z(),y(v),{close(){t.pause(),j()===e&&(document.exitFullscreen||document.webkitExitFullscreen)?.call(document),Q(!1)}}}var N,P,F,I,L,R,z=n((()=>{N={color:`#ffd600`,text:`#1f1f1f`},P=`llmvision-card-show-boxes`,F=[[`animals`,e=>String(e.species||`animal`).trim().toLowerCase(),`animal`],[`people`,e=>e.age===`child`?`child`:`person`,`person`]],I=2,L=`
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
    .llmvision-boxes-controls .llmvision-boxes-zoom[hidden] { display: none; }
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
`,R=e=>`<ha-icon icon="${e}"></ha-icon>`}));function B(e){window.__LLMVISION_BADGE_LOGGED||(console.log(`%cLLM Vision Card%c v${x}`,`background:#0071FF;color:#fff;padding:2px 6px 2px 8px;border-radius:4px 0 0 4px;font-weight:600;`,`background:#0058c7;color:#fff;padding:2px 4px;font-weight:500;`,`background:#0058c7;color:#fff;padding:2px 8px 2px 6px;border-radius:0 4px 4px 0;font-weight:600;`),window.__LLMVISION_BADGE_LOGGED=!0)}function V(e,t){if(!t)return``;let n=e.states[t],r=n?.attributes?.friendly_name||t,i=e.entities?.[t]?.device_id,a=i?e.devices?.[i]:void 0,o=a?a.name_by_user||a.name:``;return o&&Object.values(e.entities||{}).filter(e=>e.device_id===i&&e.entity_id.startsWith(`camera.`)).length===1?o:n?r:``}var H,U,W,G=n((()=>{S(),f(),z(),H=3600*3,U=600,W=class extends HTMLElement{imageCache=new Map;_lastEventHash=null;_lastFetch=0;_fetchPromise=null;_cachedEvents=null;connectedCallback(){this._badgeLogged||=(B(this.badgeContext||`Card`),!0)}setCommonConfig(e,{requireEventLimits:t=!1}={}){if(this.config=e,this.category_filters=e.category_filters||[],this.camera_filters=e.camera_filters||[],this.language=e.language,this.number_of_events=e.number_of_events,this.number_of_days=e.number_of_days,this.custom_colors=e.custom_colors||{},this.label_styles=v(e.label_styles),this.default_icon=e.default_icon||`mdi:motion-sensor`,this.default_color=e.default_color||`#929292`,this.time_format=e.time_format||`24h`,this.filter_false_positives=e.filter_false_positives!==!1,this.refresh_interval=Math.max(1,Number(e.refresh_interval||15)),t){if(!this.number_of_events&&!this.number_of_days)throw Error(`Either number_of_events or number_of_days needs to be set.`);if(this.number_of_events&&this.number_of_events<1)throw Error(`number_of_events must be greater than 0.`)}}async fetchEvents(e,{limit:t=10,days:n=null,hours:r=null,cameras:i=[],categories:a=[],includeNoActivity:o=!1}={}){let s=Date.now(),c=(this.refresh_interval||15)*1e3;if(this._fetchPromise)return this._fetchPromise;if(this._cachedEvents&&s-this._lastFetch<c)return this._cachedEvents;this._lastFetch=s,this._fetchPromise=this._fetchEvents(e,{limit:t,days:n,hours:r,cameras:i,categories:a,includeNoActivity:o});try{return this._cachedEvents=await this._fetchPromise,this._cachedEvents}finally{this._fetchPromise=null}}async _fetchEvents(e,{limit:t=10,days:n=null,hours:r=null,cameras:i=[],categories:a=[],includeNoActivity:o=!1}={}){try{let s=new URLSearchParams;t&&s.set(`limit`,t),i?.length&&s.set(`cameras`,i.join(`,`)),n&&s.set(`days`,n),r&&s.set(`hours`,r),a?.length&&s.set(`categories`,a.join(`,`)),s.set(`include_no_activity`,o?`true`:`false`);let c=`llmvision/timeline/events${s.toString()?`?`+s.toString():``}`,l=await e.callApi(`GET`,c);return(Array.isArray(l?.events)?l.events:[]).map(t=>{let n=V(e,t.camera_name||``),r=d(t);return{title:t.title||``,description:t.description||``,category:t.category||``,label:r[0]||``,labels:r,keyFrame:t.key_frame||``,clip:t.clip||``,details:t.details??null,cameraName:n,startTime:t.start||null,endTime:t.end||null,id:t.uid||``}})}catch(e){return console.error(`Error fetching events from API:`,e),null}}async deleteEvent(e,t){try{return await e.callApi(`DELETE`,`llmvision/timeline/event/${encodeURIComponent(t)}`),!0}catch(e){return console.error(`Error deleting event from API:`,e),!1}}_hashState(e){return JSON.stringify(e)}_sort(e){return e.sort((e,t)=>new Date(t.startTime)-new Date(e.startTime))}_limit(e){return this.number_of_days,this.number_of_events?e.slice(0,this.number_of_events):e}formatDateLabel(e){let t=new Date,n=new Date(t);return n.setDate(t.getDate()-1),e.toDateString()===t.toDateString()?y(`today`,this.language)||`Today`:e.toDateString()===n.toDateString()?y(`yesterday`,this.language)||`Yesterday`:e.toLocaleDateString(`en`,{month:`short`,day:`numeric`})}formatTime(e){let t=this.time_format||`24h`,n=e.getMinutes().toString().padStart(2,`0`);if(t===`12h`){let t=e.getHours(),r=t%12||12,i=t>=12?`PM`:`AM`;return`${r.toString().padStart(2,`0`)}:${n} ${i}`}return`${e.getHours().toString().padStart(2,`0`)}:${n}`}formatDateTimeShort(e){let t=new Date(e),n=new Date,r=new Date;return r.setDate(n.getDate()-1),t.toDateString()===n.toDateString()?y(`today`,this.language)||`Today`:t.toDateString()===r.toDateString()?y(`yesterday`,this.language)||`Yesterday`:t.toLocaleDateString(`en-US`,{month:`short`,day:`numeric`})}formatDateTimeFull(e){let t=new Date(e);return`${t.toLocaleDateString(`en-US`,{month:`short`,day:`numeric`})}, ${this.formatTime(t)}`}resolveMedia(e,t,{fallback:n=t}={}){if(!t)return Promise.resolve(``);if(/^https?:\/\//i.test(t))return Promise.resolve(t);let r=t.replace(`/media/`,`media-source://media_source/local/`),i=this.imageCache.get(r);return i&&i.renewAt>Date.now()?Promise.resolve(i.url):e.callWS({type:`media_source/resolve_media`,media_content_id:r,expires:H}).then(e=>{let t=e.url;return this.imageCache.set(r,{url:t,renewAt:Date.now()+(H-U)*1e3}),t}).catch(e=>(console.error(`Error resolving media content ID:`,e),n))}resolveKeyFrame(e,t){return this.resolveMedia(e,t)}showImageWhenLoaded(e,t,n=``,r=0){if(!e||!t)return;let i=new Image;i.src=t,(typeof i.decode==`function`?i.decode():new Promise((e,t)=>{i.onload=e,i.onerror=t})).then(()=>{e.isConnected&&(e.src=t,e.style.display=n)}).catch(()=>{r<1&&setTimeout(()=>this.showImageWhenLoaded(e,t,n,r+1),1e3)})}resolveClip(e,t){return this.resolveMedia(e,t,{fallback:``})}openEventPopup(e,t,n){return Promise.all([this.resolveKeyFrame(e,t.keyFrame),this.resolveClip(e,t.clip)]).then(([r,i])=>{this.showPopup({event:t.title,summary:t.description,startTime:t.startTime,keyFrame:r,clip:i,cameraName:t.cameraName,category:t.category,label:t.label,labels:t.labels,details:t.details,icon:n,prefix:`popup`,eventId:t.id},e)})}computeColors(e,t){let n=this.custom_colors||{},r;r=e==null?this.default_color===void 0?t:this.default_color:n[e]===void 0?t:n[e];let i,a;return Array.isArray(r)&&r.length===3?(i=`rgba(${r[0]},${r[1]},${r[2]},0.2)`,a=`rgba(${r[0]},${r[1]},${r[2]},1)`):(i=h(r,.2),a=h(r,1)),{bgColorRgba:i,iconColorRgba:a}}labelColor(e,t){let n=r(this.label_styles,e);if(n)return i(n.solid);let a=l(e,t);return i(this.computeColors(a,_(a,``).color).iconColorRgba)}labelBadgesHtml(e,t,n){let i=e=>typeof e==`string`?e.trim().toLowerCase():e,s=Array.isArray(t)?t:[],u=!!(e&&!s.some(t=>i(t)===i(e))),{icon:d,color:f}=_(e,``),{bgColorRgba:p,iconColorRgba:m}=this.computeColors(e,f),h=(e,t,r,i=``)=>`<span class="${n}" style="${r}"><ha-icon icon="${a(e)}"${i?` style="color:${i};"`:``}></ha-icon><span class="text">${a(t)}</span></span>`,g=(e,t)=>h(e,t,c(null,p),m);return(u?g(d,e):``)+s.map(t=>{let n=r(this.label_styles,t),i=n?.icon||o(t,e);if(n)return h(i,t,c(n));let a=l(t,e);if(a===e)return g(i,t);let s=this.computeColors(a,_(a,``).color);return h(i,t,c(null,s.bgColorRgba),s.iconColorRgba)}).join(``)}showPopup({event:e,summary:t,startTime:n,keyFrame:r,clip:i,cameraName:o,category:c,label:l,labels:u,details:d,icon:f,prefix:p,eventId:m},h){let g=h||this.hass,_=this.formatDateTimeFull(n),v=o?`${_} • ${o}`:_,x=`${p}-overlay`,S=`${p}-content`,C=`close-${p}`,w=`${p}-header-row`,D=`${p}-title-row`,O=`${p}-menu`,k=`${p}-menu-btn`,A=`${p}-menu-list`,j=`${p}-menu-item`,M=`${p}-menu-item-delete`,N=`${p}-menu-item-thumbs-up`,P=`${p}-menu-item-thumbs-down`,F=Array.isArray(u)?u:l?[l]:[],I=typeof r==`string`?r.trim().length>0:!!r,R=i?T(d,(e,t)=>this.labelColor(e,t)):{rate:1,tracks:[]},z=i?`<div class="llmvision-boxes-media"><video controls playsinline webkit-playsinline preload="metadata"${I?` poster="${a(r)}"`:``} src="${a(i)}"></video></div>`:`<img src="${a(r)}" alt="Event Snapshot" onerror="this.style.display='none'">`,B=`
                <div>
                    <div class="${w}">
                        <button class="${C}" title="Close" style="font-size:30px">
                            <ha-icon icon="mdi:close"></ha-icon>
                        </button>
                        <div class="${p}-title-main">
                            <h2>${a(e)}</h2>
                        </div>
                        ${m?`
                            <div class="${O}">
                            <button class="${k}" title="Menu" style="font-size:26px">
                                <ha-icon icon="mdi:dots-vertical"></ha-icon>
                            </button>
                            <div class="${A}" hidden>
                                ${I?`
                                <div class="${p}-menu-rate-row">
                                    <button class="${j} ${N}" title="Good response">
                                        <ha-icon icon="mdi:thumb-up-outline"></ha-icon>
                                    </button>
                                    <button class="${j} ${P}" title="Bad response">
                                        <ha-icon icon="mdi:thumb-down-outline"></ha-icon>
                                    </button>
                                </div>`:``}
                                <button class="${j} ${M}" title="Delete event">
                                    <ha-icon icon="mdi:trash-can-outline"></ha-icon>
                                    <span>${y(`delete`,this.language)||`Delete`}</span>
                                </button>
                            </div>
                        </div>`:`<div class="${p}-menu-placeholder"></div>`}
                    </div>
                    <div class="${D}">
                        <div class="${p}-title-secondary">
                            <p class="secondary"><span>${a(v)}</span></p>
                        </div>
                        <div class="${p}-title-tertiary">
                            <div class="${p}-badges-row">
                                ${this.labelBadgesHtml(c,F,`${p}-badge`)}
                            </div>
                        </div>
                    </div>
                    ${z}
                    <p class="summary">${a(t)}</p>
                    ${s(E(d))?`
                    <details class="${p}-details">
                        <summary>${a(y(`additional_details`,this.language)||`Additional details`)}</summary>
                        <div class="${p}-details-body">${b(E(d))}</div>
                    </details>`:``}
                </div>
            `,V=document.createElement(`div`);V.innerHTML=`
                <div class="${x}">
                    <div class="${S}">
                        ${B}
                    </div>
                </div>
                <style>
                    .${x} {
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
                    .${x}.show { opacity: 1; }
                    .${S} {
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
                    .${x}.show .${S} { transform: scale(1); }
    
                    .${w} {
                        display: flex;
                        /* Buttons line up with the title's first line */
                        align-items: flex-start;
                        gap: 8px;
                        margin-bottom: 4px;
                    }
                    /* Same width on both sides of the title keeps it centered.
                       All three are centered as boxes: the menu button is
                       centered in its wrapper rather than set on a text line. */
                    .${w} > .${C},
                    .${w} > .${O},
                    .${w} > .${p}-menu-placeholder {
                        flex: 0 0 40px;
                        height: 40px;
                    }
                    .${w} > .${O} {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .${w} .${C},
                    .${w} .${k} {
                        width: 40px;
                        height: 40px;
                        padding: 0;
                        margin: 0;
                        line-height: 0;
                    }
    
                    /* Title row: icon + title */
                    .${D} {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 6px;
                        margin-bottom: 6px;
                    }
                    /* Title, between the close and menu buttons */
                    .${p}-title-main {
                        flex: 1 1 auto;
                        min-width: 0;
                        display: flex;
                        justify-content: center;
                    }
                    .${p}-title-main h2 {
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
                    .${p}-title-secondary {
                        width: 100%;
                        text-align: center;
                    }
                    .${p}-title-secondary .secondary {
                        font-weight: var(--ha-font-weight-medium, 500);
                        margin-top: 4px;
                        color: var(--primary-text-color);
                        font-family: var(--ha-font-family-body, "Roboto");
                    }
                    .${p}-title-tertiary {
                        width: 100%;
                        display: flex;
                        justify-content: center;
                    }
                    .${p}-badges-row {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-wrap: wrap;
                        gap: 8px;
                        width: 100%;
                    }
                    .${p}-badge {
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
                    .${p}-badge .text {
                        text-transform: capitalize;
                    }
                    .${p}-badge ha-icon {
                        --mdc-icon-size: 18px;
                    }
    
                    ${L}

                    /* Image or clip, and text */
                    .${S} img, .${S} video {
                        width: 100%;
                        height: auto;
                        border-radius: calc(var(--ha-card-border-radius, 25px) - 10px);
                        margin-top: 10px;
                    }
                    .${S} video {
                        display: block;
                        max-height: 60vh;
                        background: #000;
                    }
                    .${S} .summary {
                        color: var(--secondary-text-color);
                        font-size: var(--ha-font-size-l, 16px);
                        line-height: 22px;
                        font-family: var(--ha-font-family-body, "Roboto");
                    }
    
                    /* Additional details, collapsed until opened */
                    .${p}-details {
                        margin-top: 4px;
                        border-top: 1px solid var(--divider-color, rgba(0,0,0,0.12));
                        font-family: var(--ha-font-family-body, "Roboto");
                    }
                    .${p}-details > summary {
                        cursor: pointer;
                        padding: 10px 0;
                        font-weight: var(--ha-font-weight-medium, 500);
                        color: var(--primary-text-color);
                        list-style: none;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                    }
                    .${p}-details > summary::-webkit-details-marker { display: none; }
                    .${p}-details > summary::before {
                        content: '';
                        border-style: solid;
                        border-width: 0.35em 0.35em 0 0.35em;
                        border-color: currentColor transparent transparent transparent;
                        transform: rotate(-90deg);
                        transition: transform 0.2s;
                    }
                    .${p}-details[open] > summary::before { transform: rotate(0); }
                    .${p}-details-body {
                        color: var(--secondary-text-color);
                        font-size: var(--ha-font-size-m, 14px);
                        line-height: 1.4;
                        padding-bottom: 8px;
                        overflow-wrap: anywhere;
                    }
                    .${p}-details-body .details-table-wrap {
                        overflow-x: auto;
                    }
                    .${p}-details-body .details-table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: inherit;
                        overflow-wrap: normal;
                    }
                    .${p}-details-body .details-table th,
                    .${p}-details-body .details-table td {
                        text-align: left;
                        vertical-align: top;
                        padding: 6px 10px;
                        border-bottom: 1px solid var(--divider-color, rgba(0,0,0,0.12));
                    }
                    .${p}-details-body .details-table td {
                        color: var(--primary-text-color);
                    }
                    .${p}-details-body .details-table thead th {
                        font-weight: var(--ha-font-weight-medium, 500);
                        font-size: 0.9em;
                        color: var(--secondary-text-color);
                        white-space: nowrap;
                    }
                    .${p}-details-body .details-table thead tr {
                        background: var(--table-header-background-color, rgba(127,127,127,0.08));
                    }
                    .${p}-details-body .details-table tbody th {
                        font-weight: var(--ha-font-weight-medium, 500);
                        color: var(--primary-text-color);
                        white-space: nowrap;
                        width: 1%;
                    }
                    .${p}-details-body .details-table tbody tr:last-child > * {
                        border-bottom: none;
                    }
                    .${p}-details-body .details-table .details-table-wrap {
                        margin: -2px 0;
                    }
                    .${p}-details-body .details-list {
                        margin: 0;
                        padding-left: 1.2em;
                    }
                    .${p}-details-body .details-list > li + li { margin-top: 6px; }
                    .${p}-details-body .details-empty { opacity: 0.6; }
                    .${p}-details-body .details-section + .details-section { margin-top: 12px; }
                    .${p}-details-body h4 {
                        margin: 0 0 4px;
                        font-size: inherit;
                        font-weight: var(--ha-font-weight-bold, 600);
                        color: var(--primary-text-color);
                    }

                    /* Buttons */
                    .${C}, .${k} {
                        background: none;
                        border: none;
                        cursor: pointer;
                        color: var(--primary-text-color);
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                    }
    
                    /* Menu */
                    .${O} {
                        position: relative;
                    }
                    .${A} {
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
                    .${p}-menu-rate-row {
                        display: flex;
                        gap: 8px;
                        align-items: center;
                        margin-bottom: 6px;
                        width: 100%;
                    }
                    .${j}.${N}, .${j}.${P} {
                        flex: 1 1 0;
                        min-width: 0;
                        padding: 8px 12px;
                        justify-content: center;
                        box-sizing: border-box;
                    }
                    .${j} {
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
                    .${j}:hover {
                        background: rgba(0,0,0,0.06);
                    }
                    .${M} {
                        color: var(--error-color, #d32f2f);
                    }
                    .${N} {
                        padding: 6px !important;
                    }
                    .${P} {
                        padding: 6px !important;
                    }
    
                    @media (max-width: 768px) {
                        .${S} {
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
                        .${w} {
                            padding-top: 10px;
                        }
                    }
                </style>
            `,(!history.state||!history.state.popupOpen)&&history.pushState({popupOpen:!0},``);let H=V.querySelector(`.${x}`),U=()=>this.closePopup(V,x,U);window.addEventListener(`popstate`,U),V.querySelector(`.${C}`).addEventListener(`click`,()=>this.closePopup(V,x,U)),H.addEventListener(`click`,e=>{e.target===H&&this.closePopup(V,x,U)});let W=e=>{e.key===`Escape`&&this.closePopup(V,x,U,W)};document.addEventListener(`keydown`,W),V._escHandler=W;let G=V.querySelector(`.${k}`),K=V.querySelector(`.${A}`);G&&K&&(G.addEventListener(`click`,e=>{e.stopPropagation(),K.hidden=!K.hidden}),V.addEventListener(`click`,e=>{!K.hidden&&!e.target.closest(`.${O}`)&&(K.hidden=!0)}));let q=V.querySelector(`.${M}`);q&&m&&q.addEventListener(`click`,async e=>{if(e.stopPropagation(),q.disabled)return;let t=y(`confirm_delete_event`,this.language)||`Are you sure you want to delete this event?`;if(!confirm(t)){K&&(K.hidden=!0);return}q.disabled=!0,await this.deleteEvent(g,m)?this.closePopup(V,x,U,W):(alert(y(`error_delete_event`,this.language)||`Failed to delete the event. Please try again.`),q.disabled=!1,K&&(K.hidden=!0))});let J=V.querySelector(`.${N}`),Y=V.querySelector(`.${P}`),X=async(i,a,o,s,l=``,u=``,d=``,p=``)=>{if(a.disabled)return;a.disabled=!0;let h={eventId:m,feedback:i};this.dispatchEvent(new CustomEvent(`llmvision-feedback`,{detail:h,bubbles:!0,composed:!0}));let g={title:e||``,description:t||``,label:F.join(`, `),category:c||``,icon:f||this.default_icon||``,eventId:m||``,startTime:n||``};try{let n=null,a=``;if(r)try{n=await(r.startsWith(`data:`)?await fetch(r):await fetch(r,{mode:`cors`})).blob();let e=(n.type||`image/jpeg`).split(`/`)[1]||`jpg`;a=`event_${m||Date.now()}.${e}`}catch(e){console.warn(`Unable to fetch key frame for feedback upload; submitting feedback without image.`,e)}try{let r=new FormData;n&&r.append(`image`,n,a||`event_${m||Date.now()}.jpg`),r.append(`isTitle`,g.title||``),r.append(`shouldBeTitle`,l||e||``),r.append(`isDescription`,g.description||``),r.append(`shouldBeDescription`,u||t||``),r.append(`isLabel`,g.label||``),r.append(`shouldBeLabel`,d||g.label||``),r.append(`isCategory`,g.category||``),r.append(`shouldBeCategory`,p||c||``),r.append(`isIcon`,g.icon||``),r.append(`shouldBeIcon`,f||``),r.append(`upDown`,i||``),r.append(`reason`,o||``),r.append(`feedback`,s||``);let h=await fetch(`https://feedback.llmvision.org/`,{method:`POST`,headers:{"X-App-Key":`e2d892b226e34339940079041ebc65fed345a5cdbd888b6f042ec2c44e0f9a2a`},body:r,mode:`cors`});if(h.ok)console.log(`Feedback uploaded successfully`);else{let e=await h.text().catch(()=>``);console.error(`Feedback upload failed:`,h.status,e)}}catch(e){console.error(`Error uploading snapshot to feedback API:`,e)}}catch(e){console.error(`Error uploading snapshot to feedback API:`,e)}finally{this.closePopup(V,x,U,W)}},Z=(t,n)=>{if(n.disabled)return;let r=`${p}-feedback-detail-overlay`,i=`${p}-feedback-detail-content`,a=document.createElement(`div`),o=[{value:`event_not_no_activity`,label:`Event is not 'no activity'`},{value:`event_is_no_activity`,label:`Event should be 'no activity'`},{value:`incorrect_title_description`,label:`Incorrect title/descriptions`},{value:`incorrect_label`,label:`Incorrect label`},{value:`other`,label:`Other`}],s=(e||``).trim().toLowerCase(),c=o.filter(e=>s.includes(`no activity`)?e.value!==`event_is_no_activity`:e.value!==`event_not_no_activity`);a.innerHTML=`
                <div class="${r}">
                    <div class="${i}">
                        <button class="${p}-fd-close" title="Close" aria-label="Close" style="font-size:20px">✕</button>
                            <div class="${p}-fd-page ${p}-fd-page-1">
                                <h2>${y(`feedback_reason`,this.language)||`Select a reason`}</h2>
                                <div class="${p}-fd-reason-list">
                                    ${c.map(e=>`
                                        <button type="button" class="${p}-fd-reason-btn" data-value="${e.value}">${e.label}</button>
                                    `).join(``)}
                                </div>
                            </div>

                        <div class="${p}-fd-page ${p}-fd-page-2" hidden>
                            <!-- dynamic second page: for event_not_no_activity show title+description, otherwise show a short note -->
                            <div class="${p}-fd-page-2-content" style="margin-top:24px"></div>
                            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px">
                                <button class="${p}-fd-next-2">${y(`next`,this.language)||`Next`}</button>
                            </div>
                        </div>

                        <div class="${p}-fd-page ${p}-fd-page-3" hidden>
                            <h2>${y(`additional_details`,this.language)||`Additional details`}</h2>
                            <textarea class="${p}-fd-final-details" rows="6" style="width:100%;padding:8px;border-radius:6px;border:1px solid rgba(0,0,0,0.12)"></textarea>
                            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px">
                                <button class="${p}-fd-send">${y(`send`,this.language)||`Send`}</button>
                            </div>
                        </div>
                    </div>
                </div>
                <style>
                    .${r} { position: fixed; inset: 0; display:flex;align-items:center;justify-content:center;z-index:1100;background:rgba(0,0,0,0.45); }
                    .${i} { position:relative; background: var(--ha-card-background, var(--card-background-color, #fff)); color: var(--primary-text-color); padding: 18px; border-radius:12px; width: 520px; max-width: calc(100% - 40px); max-height: calc(100vh - 40px); overflow-y: auto; }
                    .${i} h2 { margin:0 0 8px 0; text-align:center }
                    .${p}-fd-close { position:absolute; left:12px; top:12px; background:none; border:none; cursor:pointer; color:var(--primary-text-color); }
                    .${p}-fd-reason-list { }
                    .${p}-fd-reason-btn {
                        cursor: pointer;
                        display: block;
                        width: 100%;
                        text-align: left;
                        padding: 10px;
                        margin: 6px 0;
                        border-radius: 8px;
                        border: none;
                        transition: background 120ms ease, transform 60ms ease;
                        background: transparent;
                    }
                    .${p}-fd-reason-btn:hover {
                        background: rgba(0,0,0,0.04);
                    }
                    .${p}-fd-reason-btn.selected {
                        background: rgba(0,0,0,0.06);
                    }
                </style>
            `;let l=a.querySelector(`.${r}`),u=a.querySelector(`.${p}-fd-close`),d=a.querySelector(`.${p}-fd-page-1`),f=a.querySelector(`.${p}-fd-page-2`),m=a.querySelector(`.${p}-fd-page-3`),h=a.querySelector(`.${p}-fd-cancel`),g=a.querySelector(`.${p}-fd-next`),_=a.querySelector(`.${p}-fd-next-2`),v=a.querySelector(`.${p}-fd-send`),b=a.querySelector(`.${p}-fd-page-2-content`),x=a.querySelector(`.${p}-fd-final-details`),S=()=>{a._escHandler&&document.removeEventListener(`keydown`,a._escHandler),a.parentElement&&document.body.removeChild(a)};h&&h.addEventListener(`click`,e=>{e.stopPropagation(),S()}),u&&u.addEventListener(`click`,e=>{if(e.stopPropagation(),!f.hidden&&m.hidden)f.hidden=!0,d.hidden=!1,u.textContent=`✕`,u.title=`Close`,u.setAttribute(`aria-label`,`Close`);else if(m.hidden)S();else{let e=f.dataset.reason||``;if(m.hidden=!0,e===`other`){f.hidden=!0,d.hidden=!1,u.textContent=`✕`,u.title=`Close`,u.setAttribute(`aria-label`,`Close`);return}f.hidden=!1,u.innerHTML=`
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m313-440 196 196q12 12 11.5 28T508-188q-12 11-28 11.5T452-188L188-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l264-264q11-11 27.5-11t28.5 11q12 12 12 28.5T508-715L313-520h447q17 0 28.5 11.5T800-480q0 17-11.5 28.5T760-440H313Z"/></svg>
                        `,u.title=`Back`,u.setAttribute(`aria-label`,`Back`)}}),l.addEventListener(`click`,e=>{e.target===l&&S()}),a._escHandler=e=>{e.key===`Escape`&&S()},document.addEventListener(`keydown`,a._escHandler);let C=a.querySelectorAll(`.${p}-fd-reason-btn`);C.forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation(),C.forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`);let n=e.dataset.value;b.innerHTML=``,n===`event_not_no_activity`||n===`incorrect_title_description`?b.innerHTML=`
                            <label style="display:block;margin:8px 0;font-weight:600">${y(`correct_title`,this.language)||`Correct title`}</label>
                            <input class="${p}-fd-correct-title" type="text" style="width:100%;padding:8px;border-radius:6px;border:1px solid rgba(0,0,0,0.12)">
                            <label style="display:block;margin:8px 0;font-weight:600">${y(`correct_description`,this.language)||`Correct description`}</label>
                            <textarea class="${p}-fd-correct-description" rows="4" style="width:100%;padding:8px;border-radius:6px;border:1px solid rgba(0,0,0,0.12)"></textarea>
                        `:n===`incorrect_label`?b.innerHTML=`
                            <label style="display:block;margin:8px 0;font-weight:600">${y(`correct_label`,this.language)||`Pick the correct label`}</label>
                            <select class="${p}-fd-correct-label" style="width:100%;padding:8px;border-radius:6px;border:1px solid rgba(0,0,0,0.12)">
                                <option value="Alarm">Alarm</option>
                                <option value="Bicycle">Bicycle</option>
                                <option value="Bird">Bird</option>
                                <option value="Bus">Bus</option>
                                <option value="Camera">Camera</option>
                                <option value="Car">Car</option>
                                <option value="Cat">Cat</option>
                                <option value="Dog">Dog</option>
                                <option value="Door">Door</option>
                                <option value="Key">Key</option>
                                <option value="Light">Light</option>
                                <option value="Lock">Lock</option>
                                <option value="Motorcycle">Motorcycle</option>
                                <option value="Delivery">Delivery</option>
                                <option value="Person">Person</option>
                                <option value="Plant">Plant</option>
                                <option value="Sensor">Sensor</option>
                                <option value="Tree">Tree</option>
                                <option value="Truck">Truck</option>
                                <option value="Van">Van</option>
                            </select>
                        `:b.innerHTML=`
                            <p style="margin:6px 0">${y(`please_provide_details`,this.language)||`Please provide more details on the next page.`}</p>
                        `,f.dataset.reason=n,d.hidden=!0,n===`other`?(f.hidden=!0,m.hidden=!1):(f.hidden=!1,m.hidden=!0),u&&(u.innerHTML=`
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m313-440 196 196q12 12 11.5 28T508-188q-12 11-28 11.5T452-188L188-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l264-264q11-11 27.5-11t28.5 11q12 12 12 28.5T508-715L313-520h447q17 0 28.5 11.5T800-480q0 17-11.5 28.5T760-440H313Z"/></svg>
                        `,u.title=`Back`,u.setAttribute(`aria-label`,`Back`))})}),g&&g.addEventListener(`click`,e=>{e.stopPropagation();let t=a.querySelector(`.${p}-fd-reason-btn.selected`);t&&t.click()}),_.addEventListener(`click`,e=>{e.stopPropagation(),f.hidden=!0,m.hidden=!1,u&&(u.innerHTML=`
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m313-440 196 196q12 12 11.5 28T508-188q-12 11-28 11.5T452-188L188-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l264-264q11-11 27.5-11t28.5 11q12 12 12 28.5T508-715L313-520h447q17 0 28.5 11.5T800-480q0 17-11.5 28.5T760-440H313Z"/></svg>
                    `,u.title=`Back`,u.setAttribute(`aria-label`,`Back`))}),v.addEventListener(`click`,async e=>{e.stopPropagation(),v.disabled=!0;let r=f.dataset.reason||``,i=``;if(r===`event_not_no_activity`){let e=a.querySelector(`.${p}-fd-correct-title`),t=a.querySelector(`.${p}-fd-correct-description`),n=e?(e.value||``).trim():``,r=t?(t.value||``).trim():``;n&&(i+=`Title: ${n}`),r&&(i+=(i?`
`:``)+`Description: ${r}`)}let o=(x.value||``).trim(),s=``,c=``,l=``,u=``;if(r===`event_not_no_activity`){let e=a.querySelector(`.${p}-fd-correct-title`),t=a.querySelector(`.${p}-fd-correct-description`);s=e?(e.value||``).trim():``,c=t?(t.value||``).trim():``}else if(r===`incorrect_title_description`){let e=a.querySelector(`.${p}-fd-correct-title`),t=a.querySelector(`.${p}-fd-correct-description`);s=e?(e.value||``).trim():``,c=t?(t.value||``).trim():``}else if(r===`incorrect_label`){let e=a.querySelector(`.${p}-fd-correct-label`);l=e?(e.value||``).trim():``}else if(r===`incorrect_category`){let e=a.querySelector(`.${p}-fd-correct-title`);u=e?(e.value||``).trim():``}await X(t,n,r,o,s,c,l,u),S(),Q(y(`thanks_for_feedback`,this.language)||`Thanks for your feedback!`)}),document.body.appendChild(a)},Q=e=>{this.closePopup(V,x,U,W),this.dispatchEvent(new CustomEvent(`hass-notification`,{bubbles:!0,composed:!0,detail:{message:e,duration:4e3}}))};J&&m&&J.addEventListener(`click`,e=>{e.stopPropagation(),K&&(K.hidden=!0),X(`up`,J,`good_response`,``,``,``,``,``),Q(y(`thanks_for_feedback`,this.language)||`Thanks for your feedback!`)}),Y&&m&&Y.addEventListener(`click`,e=>{e.stopPropagation(),K&&(K.hidden=!0),Z(`down`,Y)}),document.body.appendChild(V),this.lockPageScroll(V),R.tracks.length&&(V._boxOverlay=ee(V.querySelector(`.llmvision-boxes-media`),V.querySelector(`.llmvision-boxes-media video`),R)),requestAnimationFrame(()=>H.classList.add(`show`))}lockPageScroll(e){if(e._scrollLocked)return;e._scrollLocked=!0;let t=document.documentElement;window.__llmvisionScrollLocks=(window.__llmvisionScrollLocks||0)+1,window.__llmvisionScrollLocks===1&&(window.__llmvisionScrollRestore=[t.style.overflow,document.body.style.overflow],t.style.overflow=`hidden`,document.body.style.overflow=`hidden`)}unlockPageScroll(e){e._scrollLocked&&(e._scrollLocked=!1,window.__llmvisionScrollLocks=Math.max(0,(window.__llmvisionScrollLocks||1)-1),window.__llmvisionScrollLocks===0&&window.__llmvisionScrollRestore&&([document.documentElement.style.overflow,document.body.style.overflow]=window.__llmvisionScrollRestore,window.__llmvisionScrollRestore=null))}closePopup(e,t,n,r){e._boxOverlay?.close(),e.querySelectorAll(`video`).forEach(e=>e.pause()),this.unlockPageScroll(e);let i=e.querySelector(`.${t}`);i.classList.remove(`show`),i.addEventListener(`transitionend`,()=>{e._escHandler&&document.removeEventListener(`keydown`,e._escHandler);try{document.body.removeChild(e)}catch{}},{once:!0}),history.state&&history.state.popupOpen&&history.replaceState(null,``),window.removeEventListener(`popstate`,n)}}})),K,q,J=n((()=>{f(),t(),g(),G(),K=class extends p{static get properties(){return{_config:{type:Object}}}setConfig(e){this._config=e||{}}render(){if(!this._config)return u`<div>Please configure the card.</div>`;let e=this._getSchema(),t=e.slice(0,3),n=e.slice(3,5),r=e.slice(5);return u`
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
        `}_getSchema(){let t=[{name:`category_filters`,description:`Filter events by category (title). Only events matching selected categories will be shown.`,selector:{select:{multiple:!0,options:Object.keys(e).map(e=>({value:e,label:e.charAt(0).toUpperCase()+e.slice(1)}))}}},{name:`camera_filters`,description:`Filter events by camera entity. Only events from selected cameras will be shown.`,selector:{select:{multiple:!0,options:Object.keys(this.hass.states).filter(e=>e.startsWith(`camera.`)).map(e=>({value:e,label:this.hass.states[e].attributes.friendly_name||e}))}}},{name:`filter_false_positives`,description:`Hide events titled 'No activity observed'.`,selector:{boolean:{default:!0}}}],n=[{name:`language`,description:`Language for the card. This will be used to generate icons and translations.`,selector:{select:{options:[{value:`bg`,label:`Bulgarian`},{value:`ca`,label:`Catalan`},{value:`cz`,label:`Czech`},{value:`da`,label:`Danish`},{value:`nl`,label:`Dutch`},{value:`en`,label:`English`},{value:`fr`,label:`French`},{value:`de`,label:`German`},{value:`hu`,label:`Hungarian`},{value:`it`,label:`Italian`},{value:`pl`,label:`Polish`},{value:`pt`,label:`Portuguese`},{value:`sk`,label:`Slovak`},{value:`es`,label:`Spanish`},{value:`sv`,label:`Swedish`}]}}},{name:`time_format`,description:`Choose between 12-hour and 24-hour time display.`,selector:{select:{options:[{value:`24h`,label:`24-hour`},{value:`12h`,label:`12-hour`}]}}}],r=[{name:`default_icon`,description:`Icon when no category keyword matches.`,selector:{icon:{}}}];return[...t,...n,...r]}_computeLabel(e){return{entity:`Calendar Entity`,category_filters:`Category Filters`,camera_filters:`Camera Filters`,filter_false_positives:`Filter False Positives`,language:`Language`,time_format:`Time Format`}[e.name]||e.name}_computeHelper=e=>e.description||``;_valueChanged(e){this.dispatchEvent(new CustomEvent(`config-changed`,{detail:{config:e.detail.value}}))}static get styles(){return m`ha-card{padding:16px;}`}},customElements.define(`timeline-preview-card-editor`,K),q=class extends W{setConfig(e){this.setCommonConfig(e,{requireEventLimits:!1})}static getConfigElement(){return document.createElement(`timeline-preview-card-editor`)}static getStubConfig(){return{entity:`calendar.llm_vision_timeline`,language:`en`,time_format:`24h`,filter_false_positives:!0}}getCardSize(){return 3}getGridOptions(){return{rows:2,columns:6,min_rows:2,max_rows:8,min_columns:6,max_columns:24}}set hass(e){this.content||=(this.style.display=`block`,this.style.height=`100%`,this.innerHTML=`
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
            `,this.querySelector(`.preview-card-content`)),this._loadAndRender(e)}async _loadAndRender(e){let t=await this.fetchEvents(e,{limit:1,days:this.number_of_days,cameras:this.camera_filters,categories:this.category_filters,includeNoActivity:!this.filter_false_positives});if(!t)return;let n=this._hashState({...t,category_filters:this.category_filters,camera_filters:this.camera_filters,number_of_events:this.number_of_events,number_of_days:this.number_of_days,time_format:this.time_format,filter_false_positives:this.filter_false_positives});if(n!==this._lastEventHash){if(this._lastEventHash=n,!t.length){this.content.innerHTML=``;let e;e=this.category_filters.length?`noEventsCategory`:this.camera_filters.length?`noEventsCamera`:this.number_of_days?`noEventsHours`:`noEvents`;let t=y(e,this.language)||`No events found.`;e===`noEventsHours`&&(t=t.replace(`{hours}`,this.number_of_days)),this.content.innerHTML=`<div class="event-container preview-empty-state"><h3>${t}</h3></div>`;return}this._render(t,e)}}_render(e,t){let n=e[0],r=document.createElement(`div`);r.classList.add(`preview-event-container`);let i=_(n.category,n.label),{icon:o,color:s}=i;console.log(`icon result`,i,n.title),(n.category===void 0||n.category===``)&&this.default_icon&&(o=this.default_icon),console.log(`icon`,o,n.title,i);let c=n.cameraName,l=new Date(n.startTime),u=this.formatDateLabel(l),d=this.formatTime(l);r.innerHTML=`
                <img class="preview-event-image" src="" alt="Key frame" onerror="this.style.display='none'">
                <div class="preview-event-vignette"></div>
                <div class="preview-icon-container">
                    <ha-icon icon="${o}" style="color:white;font-size:24px;"></ha-icon>
                </div>
                <div class="preview-event-details">${a(`${c} • ${u}, ${d}`)}</div>
                <div class="preview-event-title">${a(n.title)}</div>
            `,r.addEventListener(`click`,()=>this.openEventPopup(t,n,o)),this.content.innerHTML=``,this.content.appendChild(r),this.resolveKeyFrame(t,n.keyFrame).then(e=>{this.showImageWhenLoaded(r.querySelector(`img`),e,`block`)})}static getStubConfig(){return{language:`en`,time_format:`24h`,filter_false_positives:!0}}},customElements.define(`llmvision-preview-card`,q)}));J();export{q as LLMVisionPreviewCard,W as n,G as r,J as t};