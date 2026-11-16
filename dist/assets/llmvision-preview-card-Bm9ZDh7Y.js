import{C as e,_ as t,b as n,c as r,d as i,f as a,g as o,h as s,i as c,l,m as u,n as d,o as f,p,t as m,u as h,v as g,x as _,y as v}from"./lit-4b8tsVvE.js";var y,b=e((()=>{y=`1.7.2`}));function x(e){window.__LLMVISION_BADGE_LOGGED||(console.log(`%cLLM Vision Card%c v${y}`,`background:#0071FF;color:#fff;padding:2px 6px 2px 8px;border-radius:4px 0 0 4px;font-weight:600;`,`background:#0058c7;color:#fff;padding:2px 4px;font-weight:500;`,`background:#0058c7;color:#fff;padding:2px 8px 2px 6px;border-radius:0 4px 4px 0;font-weight:600;`),window.__LLMVISION_BADGE_LOGGED=!0)}function S(e,t){if(!t)return``;let n=e.states[t],r=n?.attributes?.friendly_name||t,i=e.entities?.[t]?.device_id,a=i?e.devices?.[i]:void 0,o=a?a.name_by_user||a.name:``;return o&&Object.values(e.entities||{}).filter(e=>e.device_id===i&&e.entity_id.startsWith(`camera.`)).length===1?o:n?r:``}var C,w,T,E=e((()=>{b(),u(),C=3600*3,w=600,T=class extends HTMLElement{imageCache=new Map;_lastEventHash=null;_lastFetch=0;_fetchPromise=null;_cachedEvents=null;connectedCallback(){this._badgeLogged||=(x(this.badgeContext||`Card`),!0)}setCommonConfig(e,{requireEventLimits:n=!1}={}){if(this.config=e,this.category_filters=e.category_filters||[],this.camera_filters=e.camera_filters||[],this.language=e.language,this.number_of_events=e.number_of_events,this.number_of_days=e.number_of_days,this.custom_colors=e.custom_colors||{},this.label_styles=t(e.label_styles),this.default_icon=e.default_icon||`mdi:motion-sensor`,this.default_color=e.default_color||`#929292`,this.time_format=e.time_format||`24h`,this.filter_false_positives=e.filter_false_positives!==!1,this.refresh_interval=Math.max(1,Number(e.refresh_interval||15)),n){if(!this.number_of_events&&!this.number_of_days)throw Error(`Either number_of_events or number_of_days needs to be set.`);if(this.number_of_events&&this.number_of_events<1)throw Error(`number_of_events must be greater than 0.`)}}async fetchEvents(e,{limit:t=10,days:n=null,hours:r=null,cameras:i=[],categories:a=[],includeNoActivity:o=!1}={}){let s=Date.now(),c=(this.refresh_interval||15)*1e3;if(this._fetchPromise)return this._fetchPromise;if(this._cachedEvents&&s-this._lastFetch<c)return this._cachedEvents;this._lastFetch=s,this._fetchPromise=this._fetchEvents(e,{limit:t,days:n,hours:r,cameras:i,categories:a,includeNoActivity:o});try{return this._cachedEvents=await this._fetchPromise,this._cachedEvents}finally{this._fetchPromise=null}}async _fetchEvents(e,{limit:t=10,days:n=null,hours:r=null,cameras:i=[],categories:a=[],includeNoActivity:o=!1}={}){try{let s=new URLSearchParams;t&&s.set(`limit`,t),i?.length&&s.set(`cameras`,i.join(`,`)),n&&s.set(`days`,n),r&&s.set(`hours`,r),a?.length&&s.set(`categories`,a.join(`,`)),s.set(`include_no_activity`,o?`true`:`false`);let c=`llmvision/timeline/events${s.toString()?`?`+s.toString():``}`,u=await e.callApi(`GET`,c);return(Array.isArray(u?.events)?u.events:[]).map(t=>{let n=S(e,t.camera_name||``),r=l(t);return{title:t.title||``,description:t.description||``,category:t.category||``,label:r[0]||``,labels:r,keyFrame:t.key_frame||``,clip:t.clip||``,details:t.details??null,cameraName:n,startTime:t.start||null,endTime:t.end||null,id:t.uid||``}})}catch(e){return console.error(`Error fetching events from API:`,e),null}}async deleteEvent(e,t){try{return await e.callApi(`DELETE`,`llmvision/timeline/event/${encodeURIComponent(t)}`),!0}catch(e){return console.error(`Error deleting event from API:`,e),!1}}_hashState(e){return JSON.stringify(e)}_sort(e){return e.sort((e,t)=>new Date(t.startTime)-new Date(e.startTime))}_limit(e){return this.number_of_days,this.number_of_events?e.slice(0,this.number_of_events):e}formatDateLabel(e){let t=new Date,n=new Date(t);return n.setDate(t.getDate()-1),e.toDateString()===t.toDateString()?v(`today`,this.language)||`Today`:e.toDateString()===n.toDateString()?v(`yesterday`,this.language)||`Yesterday`:e.toLocaleDateString(`en`,{month:`short`,day:`numeric`})}formatTime(e){let t=this.time_format||`24h`,n=e.getMinutes().toString().padStart(2,`0`);if(t===`12h`){let t=e.getHours(),r=t%12||12,i=t>=12?`PM`:`AM`;return`${r.toString().padStart(2,`0`)}:${n} ${i}`}return`${e.getHours().toString().padStart(2,`0`)}:${n}`}formatDateTimeShort(e){let t=new Date(e),n=new Date,r=new Date;return r.setDate(n.getDate()-1),t.toDateString()===n.toDateString()?v(`today`,this.language)||`Today`:t.toDateString()===r.toDateString()?v(`yesterday`,this.language)||`Yesterday`:t.toLocaleDateString(`en-US`,{month:`short`,day:`numeric`})}formatDateTimeFull(e){let t=new Date(e);return`${t.toLocaleDateString(`en-US`,{month:`short`,day:`numeric`})}, ${this.formatTime(t)}`}resolveMedia(e,t,{fallback:n=t}={}){if(!t)return Promise.resolve(``);if(/^https?:\/\//i.test(t))return Promise.resolve(t);let r=t.replace(`/media/`,`media-source://media_source/local/`),i=this.imageCache.get(r);return i&&i.renewAt>Date.now()?Promise.resolve(i.url):e.callWS({type:`media_source/resolve_media`,media_content_id:r,expires:C}).then(e=>{let t=e.url;return this.imageCache.set(r,{url:t,renewAt:Date.now()+(C-w)*1e3}),t}).catch(e=>(console.error(`Error resolving media content ID:`,e),n))}resolveKeyFrame(e,t){return this.resolveMedia(e,t)}showImageWhenLoaded(e,t,n=``,r=0){if(!e||!t)return;let i=new Image;i.src=t,(typeof i.decode==`function`?i.decode():new Promise((e,t)=>{i.onload=e,i.onerror=t})).then(()=>{e.isConnected&&(e.src=t,e.style.display=n)}).catch(()=>{r<1&&setTimeout(()=>this.showImageWhenLoaded(e,t,n,r+1),1e3)})}resolveClip(e,t){return this.resolveMedia(e,t,{fallback:``})}openEventPopup(e,t,n){return Promise.all([this.resolveKeyFrame(e,t.keyFrame),this.resolveClip(e,t.clip)]).then(([r,i])=>{this.showPopup({event:t.title,summary:t.description,startTime:t.startTime,keyFrame:r,clip:i,cameraName:t.cameraName,category:t.category,label:t.label,labels:t.labels,details:t.details,icon:n,prefix:`popup`,eventId:t.id},e)})}computeColors(e,t){let n=this.custom_colors||{},r;r=e==null?this.default_color===void 0?t:this.default_color:n[e]===void 0?t:n[e];let i,a;return Array.isArray(r)&&r.length===3?(i=`rgba(${r[0]},${r[1]},${r[2]},0.2)`,a=`rgba(${r[0]},${r[1]},${r[2]},1)`):(i=p(r,.2),a=p(r,1)),{bgColorRgba:i,iconColorRgba:a}}labelBadgesHtml(e,t,n){let a=e=>typeof e==`string`?e.trim().toLowerCase():e,c=Array.isArray(t)?t:[],l=!!(e&&!c.some(t=>a(t)===a(e))),{icon:u,color:d}=h(e,``),{bgColorRgba:f,iconColorRgba:p}=this.computeColors(e,d),m=(e,t,i,a=``)=>`<span class="${n}" style="${i}"><ha-icon icon="${r(e)}"${a?` style="color:${a};"`:``}></ha-icon><span class="text">${r(t)}</span></span>`,g=(e,t)=>m(e,t,s(null,f),p);return(l?g(u,e):``)+c.map(t=>{let n=o(this.label_styles,t),r=n?.icon||i(t,e);return n?m(r,t,s(n)):g(r,t)}).join(``)}showPopup({event:e,summary:t,startTime:n,keyFrame:i,clip:o,cameraName:s,category:c,label:l,labels:u,details:d,icon:f,prefix:p,eventId:m},h){let _=h||this.hass,y=this.formatDateTimeFull(n),b=s?`${y} • ${s}`:y,x=`${p}-overlay`,S=`${p}-content`,C=`close-${p}`,w=`${p}-header-row`,T=`${p}-title-row`,E=`${p}-menu`,D=`${p}-menu-btn`,O=`${p}-menu-list`,k=`${p}-menu-item`,A=`${p}-menu-item-delete`,j=`${p}-menu-item-thumbs-up`,M=`${p}-menu-item-thumbs-down`,N=Array.isArray(u)?u:l?[l]:[],P=typeof i==`string`?i.trim().length>0:!!i,F=o?`<video controls preload="metadata"${P?` poster="${r(i)}"`:``} src="${r(o)}"></video>`:`<img src="${r(i)}" alt="Event Snapshot" onerror="this.style.display='none'">`,I=`
                <div>
                    <div class="${w}">
                        <button class="${C}" title="Close" style="font-size:30px">
                            <ha-icon icon="mdi:close"></ha-icon>
                        </button>
                        <div class="${p}-title-main">
                            <h2>${r(e)}</h2>
                        </div>
                        ${m?`
                            <div class="${E}">
                            <button class="${D}" title="Menu" style="font-size:26px">
                                <ha-icon icon="mdi:dots-vertical"></ha-icon>
                            </button>
                            <div class="${O}" hidden>
                                ${P?`
                                <div class="${p}-menu-rate-row">
                                    <button class="${k} ${j}" title="Good response">
                                        <ha-icon icon="mdi:thumb-up-outline"></ha-icon>
                                    </button>
                                    <button class="${k} ${M}" title="Bad response">
                                        <ha-icon icon="mdi:thumb-down-outline"></ha-icon>
                                    </button>
                                </div>`:``}
                                <button class="${k} ${A}" title="Delete event">
                                    <ha-icon icon="mdi:trash-can-outline"></ha-icon>
                                    <span>${v(`delete`,this.language)||`Delete`}</span>
                                </button>
                            </div>
                        </div>`:`<div class="${p}-menu-placeholder"></div>`}
                    </div>
                    <div class="${T}">
                        <div class="${p}-title-secondary">
                            <p class="secondary"><span>${r(b)}</span></p>
                        </div>
                        <div class="${p}-title-tertiary">
                            <div class="${p}-badges-row">
                                ${this.labelBadgesHtml(c,N,`${p}-badge`)}
                            </div>
                        </div>
                    </div>
                    ${F}
                    <p class="summary">${r(t)}</p>
                    ${a(d)?`
                    <details class="${p}-details">
                        <summary>${r(v(`additional_details`,this.language)||`Additional details`)}</summary>
                        <div class="${p}-details-body">${g(d)}</div>
                    </details>`:``}
                </div>
            `,L=document.createElement(`div`);L.innerHTML=`
                <div class="${x}">
                    <div class="${S}">
                        ${I}
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
                    .${w} > .${E},
                    .${w} > .${p}-menu-placeholder {
                        flex: 0 0 40px;
                        height: 40px;
                    }
                    .${w} > .${E} {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .${w} .${C},
                    .${w} .${D} {
                        width: 40px;
                        height: 40px;
                        padding: 0;
                        margin: 0;
                        line-height: 0;
                    }
    
                    /* Title row: icon + title */
                    .${T} {
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
                    .${C}, .${D} {
                        background: none;
                        border: none;
                        cursor: pointer;
                        color: var(--primary-text-color);
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                    }
    
                    /* Menu */
                    .${E} {
                        position: relative;
                    }
                    .${O} {
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
                    .${k}.${j}, .${k}.${M} {
                        flex: 1 1 0;
                        min-width: 0;
                        padding: 8px 12px;
                        justify-content: center;
                        box-sizing: border-box;
                    }
                    .${k} {
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
                    .${k}:hover {
                        background: rgba(0,0,0,0.06);
                    }
                    .${A} {
                        color: var(--error-color, #d32f2f);
                    }
                    .${j} {
                        padding: 6px !important;
                    }
                    .${M} {
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
            `,(!history.state||!history.state.popupOpen)&&history.pushState({popupOpen:!0},``);let R=L.querySelector(`.${x}`),z=()=>this.closePopup(L,x,z);window.addEventListener(`popstate`,z),L.querySelector(`.${C}`).addEventListener(`click`,()=>this.closePopup(L,x,z)),R.addEventListener(`click`,e=>{e.target===R&&this.closePopup(L,x,z)});let B=e=>{e.key===`Escape`&&this.closePopup(L,x,z,B)};document.addEventListener(`keydown`,B),L._escHandler=B;let V=L.querySelector(`.${D}`),H=L.querySelector(`.${O}`);V&&H&&(V.addEventListener(`click`,e=>{e.stopPropagation(),H.hidden=!H.hidden}),L.addEventListener(`click`,e=>{!H.hidden&&!e.target.closest(`.${E}`)&&(H.hidden=!0)}));let U=L.querySelector(`.${A}`);U&&m&&U.addEventListener(`click`,async e=>{if(e.stopPropagation(),U.disabled)return;let t=v(`confirm_delete_event`,this.language)||`Are you sure you want to delete this event?`;if(!confirm(t)){H&&(H.hidden=!0);return}U.disabled=!0,await this.deleteEvent(_,m)?this.closePopup(L,x,z,B):(alert(v(`error_delete_event`,this.language)||`Failed to delete the event. Please try again.`),U.disabled=!1,H&&(H.hidden=!0))});let W=L.querySelector(`.${j}`),G=L.querySelector(`.${M}`),K=async(r,a,o,s,l=``,u=``,d=``,p=``)=>{if(a.disabled)return;a.disabled=!0;let h={eventId:m,feedback:r};this.dispatchEvent(new CustomEvent(`llmvision-feedback`,{detail:h,bubbles:!0,composed:!0}));let g={title:e||``,description:t||``,label:N.join(`, `),category:c||``,icon:f||this.default_icon||``,eventId:m||``,startTime:n||``};try{let n=null,a=``;if(i)try{n=await(i.startsWith(`data:`)?await fetch(i):await fetch(i,{mode:`cors`})).blob();let e=(n.type||`image/jpeg`).split(`/`)[1]||`jpg`;a=`event_${m||Date.now()}.${e}`}catch(e){console.warn(`Unable to fetch key frame for feedback upload; submitting feedback without image.`,e)}try{let i=new FormData;n&&i.append(`image`,n,a||`event_${m||Date.now()}.jpg`),i.append(`isTitle`,g.title||``),i.append(`shouldBeTitle`,l||e||``),i.append(`isDescription`,g.description||``),i.append(`shouldBeDescription`,u||t||``),i.append(`isLabel`,g.label||``),i.append(`shouldBeLabel`,d||g.label||``),i.append(`isCategory`,g.category||``),i.append(`shouldBeCategory`,p||c||``),i.append(`isIcon`,g.icon||``),i.append(`shouldBeIcon`,f||``),i.append(`upDown`,r||``),i.append(`reason`,o||``),i.append(`feedback`,s||``);let h=await fetch(`https://feedback.llmvision.org/`,{method:`POST`,headers:{"X-App-Key":`e2d892b226e34339940079041ebc65fed345a5cdbd888b6f042ec2c44e0f9a2a`},body:i,mode:`cors`});if(h.ok)console.log(`Feedback uploaded successfully`);else{let e=await h.text().catch(()=>``);console.error(`Feedback upload failed:`,h.status,e)}}catch(e){console.error(`Error uploading snapshot to feedback API:`,e)}}catch(e){console.error(`Error uploading snapshot to feedback API:`,e)}finally{this.closePopup(L,x,z,B)}},q=(t,n)=>{if(n.disabled)return;let r=`${p}-feedback-detail-overlay`,i=`${p}-feedback-detail-content`,a=document.createElement(`div`),o=[{value:`event_not_no_activity`,label:`Event is not 'no activity'`},{value:`event_is_no_activity`,label:`Event should be 'no activity'`},{value:`incorrect_title_description`,label:`Incorrect title/descriptions`},{value:`incorrect_label`,label:`Incorrect label`},{value:`other`,label:`Other`}],s=(e||``).trim().toLowerCase(),c=o.filter(e=>s.includes(`no activity`)?e.value!==`event_is_no_activity`:e.value!==`event_not_no_activity`);a.innerHTML=`
                <div class="${r}">
                    <div class="${i}">
                        <button class="${p}-fd-close" title="Close" aria-label="Close" style="font-size:20px">✕</button>
                            <div class="${p}-fd-page ${p}-fd-page-1">
                                <h2>${v(`feedback_reason`,this.language)||`Select a reason`}</h2>
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
                                <button class="${p}-fd-next-2">${v(`next`,this.language)||`Next`}</button>
                            </div>
                        </div>

                        <div class="${p}-fd-page ${p}-fd-page-3" hidden>
                            <h2>${v(`additional_details`,this.language)||`Additional details`}</h2>
                            <textarea class="${p}-fd-final-details" rows="6" style="width:100%;padding:8px;border-radius:6px;border:1px solid rgba(0,0,0,0.12)"></textarea>
                            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px">
                                <button class="${p}-fd-send">${v(`send`,this.language)||`Send`}</button>
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
            `;let l=a.querySelector(`.${r}`),u=a.querySelector(`.${p}-fd-close`),d=a.querySelector(`.${p}-fd-page-1`),f=a.querySelector(`.${p}-fd-page-2`),m=a.querySelector(`.${p}-fd-page-3`),h=a.querySelector(`.${p}-fd-cancel`),g=a.querySelector(`.${p}-fd-next`),_=a.querySelector(`.${p}-fd-next-2`),y=a.querySelector(`.${p}-fd-send`),b=a.querySelector(`.${p}-fd-page-2-content`),x=a.querySelector(`.${p}-fd-final-details`),S=()=>{a._escHandler&&document.removeEventListener(`keydown`,a._escHandler),a.parentElement&&document.body.removeChild(a)};h&&h.addEventListener(`click`,e=>{e.stopPropagation(),S()}),u&&u.addEventListener(`click`,e=>{if(e.stopPropagation(),!f.hidden&&m.hidden)f.hidden=!0,d.hidden=!1,u.textContent=`✕`,u.title=`Close`,u.setAttribute(`aria-label`,`Close`);else if(m.hidden)S();else{let e=f.dataset.reason||``;if(m.hidden=!0,e===`other`){f.hidden=!0,d.hidden=!1,u.textContent=`✕`,u.title=`Close`,u.setAttribute(`aria-label`,`Close`);return}f.hidden=!1,u.innerHTML=`
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m313-440 196 196q12 12 11.5 28T508-188q-12 11-28 11.5T452-188L188-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l264-264q11-11 27.5-11t28.5 11q12 12 12 28.5T508-715L313-520h447q17 0 28.5 11.5T800-480q0 17-11.5 28.5T760-440H313Z"/></svg>
                        `,u.title=`Back`,u.setAttribute(`aria-label`,`Back`)}}),l.addEventListener(`click`,e=>{e.target===l&&S()}),a._escHandler=e=>{e.key===`Escape`&&S()},document.addEventListener(`keydown`,a._escHandler);let C=a.querySelectorAll(`.${p}-fd-reason-btn`);C.forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation(),C.forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`);let n=e.dataset.value;b.innerHTML=``,n===`event_not_no_activity`||n===`incorrect_title_description`?b.innerHTML=`
                            <label style="display:block;margin:8px 0;font-weight:600">${v(`correct_title`,this.language)||`Correct title`}</label>
                            <input class="${p}-fd-correct-title" type="text" style="width:100%;padding:8px;border-radius:6px;border:1px solid rgba(0,0,0,0.12)">
                            <label style="display:block;margin:8px 0;font-weight:600">${v(`correct_description`,this.language)||`Correct description`}</label>
                            <textarea class="${p}-fd-correct-description" rows="4" style="width:100%;padding:8px;border-radius:6px;border:1px solid rgba(0,0,0,0.12)"></textarea>
                        `:n===`incorrect_label`?b.innerHTML=`
                            <label style="display:block;margin:8px 0;font-weight:600">${v(`correct_label`,this.language)||`Pick the correct label`}</label>
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
                            <p style="margin:6px 0">${v(`please_provide_details`,this.language)||`Please provide more details on the next page.`}</p>
                        `,f.dataset.reason=n,d.hidden=!0,n===`other`?(f.hidden=!0,m.hidden=!1):(f.hidden=!1,m.hidden=!0),u&&(u.innerHTML=`
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m313-440 196 196q12 12 11.5 28T508-188q-12 11-28 11.5T452-188L188-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l264-264q11-11 27.5-11t28.5 11q12 12 12 28.5T508-715L313-520h447q17 0 28.5 11.5T800-480q0 17-11.5 28.5T760-440H313Z"/></svg>
                        `,u.title=`Back`,u.setAttribute(`aria-label`,`Back`))})}),g&&g.addEventListener(`click`,e=>{e.stopPropagation();let t=a.querySelector(`.${p}-fd-reason-btn.selected`);t&&t.click()}),_.addEventListener(`click`,e=>{e.stopPropagation(),f.hidden=!0,m.hidden=!1,u&&(u.innerHTML=`
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m313-440 196 196q12 12 11.5 28T508-188q-12 11-28 11.5T452-188L188-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l264-264q11-11 27.5-11t28.5 11q12 12 12 28.5T508-715L313-520h447q17 0 28.5 11.5T800-480q0 17-11.5 28.5T760-440H313Z"/></svg>
                    `,u.title=`Back`,u.setAttribute(`aria-label`,`Back`))}),y.addEventListener(`click`,async e=>{e.stopPropagation(),y.disabled=!0;let r=f.dataset.reason||``,i=``;if(r===`event_not_no_activity`){let e=a.querySelector(`.${p}-fd-correct-title`),t=a.querySelector(`.${p}-fd-correct-description`),n=e?(e.value||``).trim():``,r=t?(t.value||``).trim():``;n&&(i+=`Title: ${n}`),r&&(i+=(i?`
`:``)+`Description: ${r}`)}let o=(x.value||``).trim(),s=``,c=``,l=``,u=``;if(r===`event_not_no_activity`){let e=a.querySelector(`.${p}-fd-correct-title`),t=a.querySelector(`.${p}-fd-correct-description`);s=e?(e.value||``).trim():``,c=t?(t.value||``).trim():``}else if(r===`incorrect_title_description`){let e=a.querySelector(`.${p}-fd-correct-title`),t=a.querySelector(`.${p}-fd-correct-description`);s=e?(e.value||``).trim():``,c=t?(t.value||``).trim():``}else if(r===`incorrect_label`){let e=a.querySelector(`.${p}-fd-correct-label`);l=e?(e.value||``).trim():``}else if(r===`incorrect_category`){let e=a.querySelector(`.${p}-fd-correct-title`);u=e?(e.value||``).trim():``}await K(t,n,r,o,s,c,l,u),S(),J(v(`thanks_for_feedback`,this.language)||`Thanks for your feedback!`)}),document.body.appendChild(a)},J=e=>{this.closePopup(L,x,z,B),this.dispatchEvent(new CustomEvent(`hass-notification`,{bubbles:!0,composed:!0,detail:{message:e,duration:4e3}}))};W&&m&&W.addEventListener(`click`,e=>{e.stopPropagation(),H&&(H.hidden=!0),K(`up`,W,`good_response`,``,``,``,``,``),J(v(`thanks_for_feedback`,this.language)||`Thanks for your feedback!`)}),G&&m&&G.addEventListener(`click`,e=>{e.stopPropagation(),H&&(H.hidden=!0),q(`down`,G)}),document.body.appendChild(L),requestAnimationFrame(()=>R.classList.add(`show`))}closePopup(e,t,n,r){e.querySelectorAll(`video`).forEach(e=>e.pause());let i=e.querySelector(`.${t}`);i.classList.remove(`show`),i.addEventListener(`transitionend`,()=>{e._escHandler&&document.removeEventListener(`keydown`,e._escHandler);try{document.body.removeChild(e)}catch{}},{once:!0}),history.state&&history.state.popupOpen&&history.replaceState(null,``),window.removeEventListener(`popstate`,n)}}})),D,O,k=e((()=>{u(),n(),m(),E(),D=class extends d{static get properties(){return{_config:{type:Object}}}setConfig(e){this._config=e||{}}render(){if(!this._config)return c`<div>Please configure the card.</div>`;let e=this._getSchema(),t=e.slice(0,3),n=e.slice(3,5),r=e.slice(5);return c`
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
        `}_getSchema(){let e=[{name:`category_filters`,description:`Filter events by category (title). Only events matching selected categories will be shown.`,selector:{select:{multiple:!0,options:Object.keys(_).map(e=>({value:e,label:e.charAt(0).toUpperCase()+e.slice(1)}))}}},{name:`camera_filters`,description:`Filter events by camera entity. Only events from selected cameras will be shown.`,selector:{select:{multiple:!0,options:Object.keys(this.hass.states).filter(e=>e.startsWith(`camera.`)).map(e=>({value:e,label:this.hass.states[e].attributes.friendly_name||e}))}}},{name:`filter_false_positives`,description:`Hide events titled 'No activity observed'.`,selector:{boolean:{default:!0}}}],t=[{name:`language`,description:`Language for the card. This will be used to generate icons and translations.`,selector:{select:{options:[{value:`bg`,label:`Bulgarian`},{value:`ca`,label:`Catalan`},{value:`cz`,label:`Czech`},{value:`da`,label:`Danish`},{value:`nl`,label:`Dutch`},{value:`en`,label:`English`},{value:`fr`,label:`French`},{value:`de`,label:`German`},{value:`hu`,label:`Hungarian`},{value:`it`,label:`Italian`},{value:`pl`,label:`Polish`},{value:`pt`,label:`Portuguese`},{value:`sk`,label:`Slovak`},{value:`es`,label:`Spanish`},{value:`sv`,label:`Swedish`}]}}},{name:`time_format`,description:`Choose between 12-hour and 24-hour time display.`,selector:{select:{options:[{value:`24h`,label:`24-hour`},{value:`12h`,label:`12-hour`}]}}}],n=[{name:`default_icon`,description:`Icon when no category keyword matches.`,selector:{icon:{}}}];return[...e,...t,...n]}_computeLabel(e){return{entity:`Calendar Entity`,category_filters:`Category Filters`,camera_filters:`Camera Filters`,filter_false_positives:`Filter False Positives`,language:`Language`,time_format:`Time Format`}[e.name]||e.name}_computeHelper=e=>e.description||``;_valueChanged(e){this.dispatchEvent(new CustomEvent(`config-changed`,{detail:{config:e.detail.value}}))}static get styles(){return f`ha-card{padding:16px;}`}},customElements.define(`timeline-preview-card-editor`,D),O=class extends T{setConfig(e){this.setCommonConfig(e,{requireEventLimits:!1})}static getConfigElement(){return document.createElement(`timeline-preview-card-editor`)}static getStubConfig(){return{entity:`calendar.llm_vision_timeline`,language:`en`,time_format:`24h`,filter_false_positives:!0}}getCardSize(){return 3}getGridOptions(){return{rows:2,columns:6,min_rows:2,max_rows:8,min_columns:6,max_columns:24}}set hass(e){this.content||=(this.style.display=`block`,this.style.height=`100%`,this.innerHTML=`
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
            `,this.querySelector(`.preview-card-content`)),this._loadAndRender(e)}async _loadAndRender(e){let t=await this.fetchEvents(e,{limit:1,days:this.number_of_days,cameras:this.camera_filters,categories:this.category_filters,includeNoActivity:!this.filter_false_positives});if(!t)return;let n=this._hashState({...t,category_filters:this.category_filters,camera_filters:this.camera_filters,number_of_events:this.number_of_events,number_of_days:this.number_of_days,time_format:this.time_format,filter_false_positives:this.filter_false_positives});if(n!==this._lastEventHash){if(this._lastEventHash=n,!t.length){this.content.innerHTML=``;let e;e=this.category_filters.length?`noEventsCategory`:this.camera_filters.length?`noEventsCamera`:this.number_of_days?`noEventsHours`:`noEvents`;let t=v(e,this.language)||`No events found.`;e===`noEventsHours`&&(t=t.replace(`{hours}`,this.number_of_days)),this.content.innerHTML=`<div class="event-container preview-empty-state"><h3>${t}</h3></div>`;return}this._render(t,e)}}_render(e,t){let n=e[0],i=document.createElement(`div`);i.classList.add(`preview-event-container`);let a=h(n.category,n.label),{icon:o,color:s}=a;console.log(`icon result`,a,n.title),(n.category===void 0||n.category===``)&&this.default_icon&&(o=this.default_icon),console.log(`icon`,o,n.title,a);let c=n.cameraName,l=new Date(n.startTime),u=this.formatDateLabel(l),d=this.formatTime(l);i.innerHTML=`
                <img class="preview-event-image" src="" alt="Key frame" onerror="this.style.display='none'">
                <div class="preview-event-vignette"></div>
                <div class="preview-icon-container">
                    <ha-icon icon="${o}" style="color:white;font-size:24px;"></ha-icon>
                </div>
                <div class="preview-event-details">${r(`${c} • ${u}, ${d}`)}</div>
                <div class="preview-event-title">${r(n.title)}</div>
            `,i.addEventListener(`click`,()=>this.openEventPopup(t,n,o)),this.content.innerHTML=``,this.content.appendChild(i),this.resolveKeyFrame(t,n.keyFrame).then(e=>{this.showImageWhenLoaded(i.querySelector(`img`),e,`block`)})}static getStubConfig(){return{language:`en`,time_format:`24h`,filter_false_positives:!0}}},customElements.define(`llmvision-preview-card`,O)}));k();export{O as LLMVisionPreviewCard,T as n,E as r,k as t};