import{_ as e,b as t,c as n,d as r,f as i,g as a,h as o,i as s,l as c,m as l,n as u,o as d,p as f,t as p,u as m,v as h}from"./lit-CN0K8YxB.js";var g,_=t((()=>{g=`1.7.2`}));function v(e){window.__LLMVISION_BADGE_LOGGED||(console.log(`%cLLM Vision Card%c v${g}`,`background:#0071FF;color:#fff;padding:2px 6px 2px 8px;border-radius:4px 0 0 4px;font-weight:600;`,`background:#0058c7;color:#fff;padding:2px 4px;font-weight:500;`,`background:#0058c7;color:#fff;padding:2px 8px 2px 6px;border-radius:0 4px 4px 0;font-weight:600;`),window.__LLMVISION_BADGE_LOGGED=!0)}var y,b,x,S=t((()=>{_(),l(),y=3600*3,b=600,x=class extends HTMLElement{imageCache=new Map;_lastEventHash=null;_lastFetch=0;_fetchPromise=null;_cachedEvents=null;connectedCallback(){this._badgeLogged||=(v(this.badgeContext||`Card`),!0)}setCommonConfig(e,{requireEventLimits:t=!1}={}){if(this.config=e,this.category_filters=e.category_filters||[],this.camera_filters=e.camera_filters||[],this.language=e.language,this.number_of_events=e.number_of_events,this.number_of_days=e.number_of_days,this.custom_colors=e.custom_colors||{},this.default_icon=e.default_icon||`mdi:motion-sensor`,this.default_color=e.default_color||`#929292`,this.time_format=e.time_format||`24h`,this.filter_false_positives=e.filter_false_positives!==!1,this.refresh_interval=Math.max(1,Number(e.refresh_interval||15)),t){if(!this.number_of_events&&!this.number_of_days)throw Error(`Either number_of_events or number_of_days needs to be set.`);if(this.number_of_events&&this.number_of_events<1)throw Error(`number_of_events must be greater than 0.`)}}async fetchEvents(e,{limit:t=10,days:n=null,hours:r=null,cameras:i=[],categories:a=[],includeNoActivity:o=!1}={}){let s=Date.now(),c=(this.refresh_interval||15)*1e3;if(this._fetchPromise)return this._fetchPromise;if(this._cachedEvents&&s-this._lastFetch<c)return this._cachedEvents;this._lastFetch=s,this._fetchPromise=this._fetchEvents(e,{limit:t,days:n,hours:r,cameras:i,categories:a,includeNoActivity:o});try{return this._cachedEvents=await this._fetchPromise,this._cachedEvents}finally{this._fetchPromise=null}}async _fetchEvents(e,{limit:t=10,days:n=null,hours:r=null,cameras:i=[],categories:a=[],includeNoActivity:o=!1}={}){try{let s=new URLSearchParams;t&&s.set(`limit`,t),i?.length&&s.set(`cameras`,i.join(`,`)),n&&s.set(`days`,n),r&&s.set(`hours`,r),a?.length&&s.set(`categories`,a.join(`,`)),s.set(`include_no_activity`,o?`true`:`false`);let l=`llmvision/timeline/events${s.toString()?`?`+s.toString():``}`,u=await e.callApi(`GET`,l);return(Array.isArray(u?.events)?u.events:[]).map(t=>{let n=t.camera_name||``,r=n?e.states[n]:void 0,i=r?r.attributes?.friendly_name||n:``,a=c(t);return{title:t.title||``,description:t.description||``,category:t.category||``,label:a[0]||``,labels:a,keyFrame:t.key_frame||``,clip:t.clip||``,details:t.details??null,cameraName:i,startTime:t.start||null,endTime:t.end||null,id:t.uid||``}})}catch(e){return console.error(`Error fetching events from API:`,e),null}}async deleteEvent(e,t){try{return await e.callApi(`DELETE`,`llmvision/timeline/event/${encodeURIComponent(t)}`),!0}catch(e){return console.error(`Error deleting event from API:`,e),!1}}_hashState(e){return JSON.stringify(e)}_sort(e){return e.sort((e,t)=>new Date(t.startTime)-new Date(e.startTime))}_limit(e){return this.number_of_days,this.number_of_events?e.slice(0,this.number_of_events):e}formatDateLabel(e){let t=new Date,n=new Date(t);return n.setDate(t.getDate()-1),e.toDateString()===t.toDateString()?a(`today`,this.language)||`Today`:e.toDateString()===n.toDateString()?a(`yesterday`,this.language)||`Yesterday`:e.toLocaleDateString(`en`,{month:`short`,day:`numeric`})}formatTime(e){let t=this.time_format||`24h`,n=e.getMinutes().toString().padStart(2,`0`);if(t===`12h`){let t=e.getHours(),r=t%12||12,i=t>=12?`PM`:`AM`;return`${r.toString().padStart(2,`0`)}:${n} ${i}`}return`${e.getHours().toString().padStart(2,`0`)}:${n}`}formatDateTimeShort(e){let t=new Date(e),n=new Date,r=new Date;return r.setDate(n.getDate()-1),t.toDateString()===n.toDateString()?a(`today`,this.language)||`Today`:t.toDateString()===r.toDateString()?a(`yesterday`,this.language)||`Yesterday`:t.toLocaleDateString(`en-US`,{month:`short`,day:`numeric`})}formatDateTimeFull(e){let t=new Date(e);return`${t.toLocaleDateString(`en-US`,{month:`short`,day:`numeric`})}, ${this.formatTime(t)}`}resolveMedia(e,t,{fallback:n=t}={}){if(!t)return Promise.resolve(``);if(/^https?:\/\//i.test(t))return Promise.resolve(t);let r=t.replace(`/media/`,`media-source://media_source/local/`),i=this.imageCache.get(r);return i&&i.renewAt>Date.now()?Promise.resolve(i.url):e.callWS({type:`media_source/resolve_media`,media_content_id:r,expires:y}).then(e=>{let t=e.url;return this.imageCache.set(r,{url:t,renewAt:Date.now()+(y-b)*1e3}),t}).catch(e=>(console.error(`Error resolving media content ID:`,e),n))}resolveKeyFrame(e,t){return this.resolveMedia(e,t)}resolveClip(e,t){return this.resolveMedia(e,t,{fallback:``})}openEventPopup(e,t,n){return Promise.all([this.resolveKeyFrame(e,t.keyFrame),this.resolveClip(e,t.clip)]).then(([r,i])=>{this.showPopup({event:t.title,summary:t.description,startTime:t.startTime,keyFrame:r,clip:i,cameraName:t.cameraName,category:t.category,label:t.label,labels:t.labels,details:t.details,icon:n,prefix:`popup`,eventId:t.id},e)})}computeColors(e,t){let n=this.custom_colors||{},r;r=e==null?this.default_color===void 0?t:this.default_color:n[e]===void 0?t:n[e];let i,a;return Array.isArray(r)&&r.length===3?(i=`rgba(${r[0]},${r[1]},${r[2]},0.2)`,a=`rgba(${r[0]},${r[1]},${r[2]},1)`):(i=f(r,.2),a=f(r,1)),{bgColorRgba:i,iconColorRgba:a}}showPopup({event:e,summary:t,startTime:s,keyFrame:c,clip:l,cameraName:u,category:d,label:f,labels:p,details:m,icon:h,prefix:g,eventId:_},v){let y=v||this.hass,b=this.formatDateTimeFull(s),x=u?`${b} • ${u}`:b,S=`${g}-overlay`,C=`${g}-content`,w=`close-${g}`,T=`${g}-header-row`,E=`${g}-title-row`,D=`${g}-menu`,O=`${g}-menu-btn`,k=`${g}-menu-list`,A=`${g}-menu-item`,j=`${g}-menu-item-delete`,M=`${g}-menu-item-thumbs-up`,N=`${g}-menu-item-thumbs-down`,P=e=>typeof e==`string`?e.trim().toLowerCase():e,F=Array.isArray(p)?p:f?[f]:[],I=!!(d&&!F.some(e=>P(e)===P(d))),L=typeof c==`string`?c.trim().length>0:!!c,R=l?`<video controls preload="metadata"${L?` poster="${n(c)}"`:``} src="${n(l)}"></video>`:`<img src="${n(c)}" alt="Event Snapshot" onerror="this.style.display='none'">`,z=`
                <div>
                    <div class="${T}">
                        <button class="${w}" title="Close" style="font-size:30px">
                            <ha-icon icon="mdi:close"></ha-icon>
                        </button>
                        <div class="${g}-title-main">
                            <h2>${n(e)}</h2>
                        </div>
                        ${_?`
                            <div class="${D}">
                            <button class="${O}" title="Menu" style="font-size:26px">
                                <ha-icon icon="mdi:dots-vertical"></ha-icon>
                            </button>
                            <div class="${k}" hidden>
                                ${L?`
                                <div class="${g}-menu-rate-row">
                                    <button class="${A} ${M}" title="Good response">
                                        <ha-icon icon="mdi:thumb-up-outline"></ha-icon>
                                    </button>
                                    <button class="${A} ${N}" title="Bad response">
                                        <ha-icon icon="mdi:thumb-down-outline"></ha-icon>
                                    </button>
                                </div>`:``}
                                <button class="${A} ${j}" title="Delete event">
                                    <ha-icon icon="mdi:trash-can-outline"></ha-icon>
                                    <span>${a(`delete`,this.language)||`Delete`}</span>
                                </button>
                            </div>
                        </div>`:`<div class="${g}-menu-placeholder"></div>`}
                    </div>
                    <div class="${E}">
                        <div class="${g}-title-secondary">
                            <p class="secondary"><span>${n(x)}</span></p>
                        </div>
                        <div class="${g}-title-tertiary">
                            <div class="${g}-badges-row">
                                ${I?`
                                <span class="${g}-badge">
                                    <ha-icon icon="mdi:label"></ha-icon>
                                    <span class="text" style="text-transform: capitalize;">${n(d)}</span>
                                </span>`:``}
                                ${F.map(e=>`
                                <span class="${g}-badge">
                                    <ha-icon icon="${n(r(e,d))}"></ha-icon>
                                    <span class="text" style="text-transform: capitalize;">${n(e)}</span>
                                </span>`).join(``)}
                            </div>
                        </div>
                    </div>
                    ${R}
                    <p class="summary">${n(t)}</p>
                    ${i(m)?`
                    <details class="${g}-details">
                        <summary>${n(a(`additional_details`,this.language)||`Additional details`)}</summary>
                        <div class="${g}-details-body">${o(m)}</div>
                    </details>`:``}
                </div>
            `,B=document.createElement(`div`);B.innerHTML=`
                <div class="${S}">
                    <div class="${C}">
                        ${z}
                    </div>
                </div>
                <style>
                    .${S} {
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
                    .${S}.show { opacity: 1; }
                    .${C} {
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
                    .${S}.show .${C} { transform: scale(1); }
    
                    .${T} {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        margin-bottom: 4px;
                    }
                    /* Same width on both sides of the title keeps it centered */
                    .${T} > .${w},
                    .${T} > .${D},
                    .${T} > .${g}-menu-placeholder {
                        flex: 0 0 40px;
                    }
    
                    /* Title row: icon + title */
                    .${E} {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 6px;
                        margin-bottom: 6px;
                    }
                    /* Title, between the close and menu buttons */
                    .${g}-title-main {
                        flex: 1 1 auto;
                        min-width: 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .${g}-title-main h2 {
                        flex: 1 1 auto;
                        min-width: 0;
                        max-width: 100%;
                        overflow: visible;
                        white-space: normal;
                        word-break: break-word;
                        margin: 0;
                        font-family: var(--ha-font-family-heading, "Roboto");
                        text-align: center;
                    }
                    .${g}-title-secondary {
                        width: 100%;
                        text-align: center;
                    }
                    .${g}-title-secondary .secondary {
                        font-weight: var(--ha-font-weight-medium, 500);
                        margin-top: 4px;
                        color: var(--primary-text-color);
                        font-family: var(--ha-font-family-body, "Roboto");
                    }
                    .${g}-title-tertiary {
                        width: 100%;
                        display: flex;
                        justify-content: center;
                    }
                    .${g}-badges-row {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-wrap: wrap;
                        gap: 8px;
                        width: 100%;
                    }
                    .${g}-badge {
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
                    .${g}-badge ha-icon {
                        --mdc-icon-size: 18px;
                    }
    
                    /* Image or clip, and text */
                    .${C} img, .${C} video {
                        width: 100%;
                        height: auto;
                        border-radius: calc(var(--ha-card-border-radius, 25px) - 10px);
                        margin-top: 10px;
                    }
                    .${C} video {
                        display: block;
                        max-height: 60vh;
                        background: #000;
                    }
                    .${C} .summary {
                        color: var(--secondary-text-color);
                        font-size: var(--ha-font-size-l, 16px);
                        line-height: 22px;
                        font-family: var(--ha-font-family-body, "Roboto");
                    }
    
                    /* Additional details, collapsed until opened */
                    .${g}-details {
                        margin-top: 4px;
                        border-top: 1px solid var(--divider-color, rgba(0,0,0,0.12));
                        font-family: var(--ha-font-family-body, "Roboto");
                    }
                    .${g}-details > summary {
                        cursor: pointer;
                        padding: 10px 0;
                        font-weight: var(--ha-font-weight-medium, 500);
                        color: var(--primary-text-color);
                        list-style: none;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                    }
                    .${g}-details > summary::-webkit-details-marker { display: none; }
                    .${g}-details > summary::before {
                        content: '';
                        border-style: solid;
                        border-width: 0.35em 0.35em 0 0.35em;
                        border-color: currentColor transparent transparent transparent;
                        transform: rotate(-90deg);
                        transition: transform 0.2s;
                    }
                    .${g}-details[open] > summary::before { transform: rotate(0); }
                    .${g}-details-body {
                        color: var(--secondary-text-color);
                        font-size: var(--ha-font-size-m, 14px);
                        line-height: 1.4;
                        padding-bottom: 8px;
                        overflow-wrap: anywhere;
                    }
                    .${g}-details-body .details-table-wrap {
                        overflow-x: auto;
                    }
                    .${g}-details-body .details-table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: inherit;
                        overflow-wrap: normal;
                    }
                    .${g}-details-body .details-table th,
                    .${g}-details-body .details-table td {
                        text-align: left;
                        vertical-align: top;
                        padding: 6px 10px;
                        border-bottom: 1px solid var(--divider-color, rgba(0,0,0,0.12));
                    }
                    .${g}-details-body .details-table td {
                        color: var(--primary-text-color);
                    }
                    .${g}-details-body .details-table thead th {
                        font-weight: var(--ha-font-weight-medium, 500);
                        font-size: 0.9em;
                        color: var(--secondary-text-color);
                        white-space: nowrap;
                    }
                    .${g}-details-body .details-table thead tr {
                        background: var(--table-header-background-color, rgba(127,127,127,0.08));
                    }
                    .${g}-details-body .details-table tbody th {
                        font-weight: var(--ha-font-weight-medium, 500);
                        color: var(--primary-text-color);
                        white-space: nowrap;
                        width: 1%;
                    }
                    .${g}-details-body .details-table tbody tr:last-child > * {
                        border-bottom: none;
                    }
                    .${g}-details-body .details-table .details-table-wrap {
                        margin: -2px 0;
                    }
                    .${g}-details-body .details-list {
                        margin: 0;
                        padding-left: 1.2em;
                    }
                    .${g}-details-body .details-list > li + li { margin-top: 6px; }
                    .${g}-details-body .details-empty { opacity: 0.6; }
                    .${g}-details-body .details-section + .details-section { margin-top: 12px; }
                    .${g}-details-body h4 {
                        margin: 0 0 4px;
                        font-size: inherit;
                        font-weight: var(--ha-font-weight-bold, 600);
                        color: var(--primary-text-color);
                    }

                    /* Buttons */
                    .${w}, .${O} {
                        background: none;
                        border: none;
                        cursor: pointer;
                        color: var(--primary-text-color);
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                    }
    
                    /* Menu */
                    .${D} {
                        position: relative;
                    }
                    .${k} {
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
                    .${g}-menu-rate-row {
                        display: flex;
                        gap: 8px;
                        align-items: center;
                        margin-bottom: 6px;
                        width: 100%;
                    }
                    .${A}.${M}, .${A}.${N} {
                        flex: 1 1 0;
                        min-width: 0;
                        padding: 8px 12px;
                        justify-content: center;
                        box-sizing: border-box;
                    }
                    .${A} {
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
                    .${A}:hover {
                        background: rgba(0,0,0,0.06);
                    }
                    .${j} {
                        color: var(--error-color, #d32f2f);
                    }
                    .${M} {
                        padding: 6px !important;
                    }
                    .${N} {
                        padding: 6px !important;
                    }
    
                    @media (max-width: 768px) {
                        .${C} {
                            max-width: 100%;
                            width: 100%;
                            max-height: 100%;
                            padding: 15px;
                            border-radius: 0;
                            height: 100%;
                        }
                        .${T} {
                            padding-top: 10px;
                        }
                    }
                </style>
            `,(!history.state||!history.state.popupOpen)&&history.pushState({popupOpen:!0},``);let V=B.querySelector(`.${S}`),H=()=>this.closePopup(B,S,H);window.addEventListener(`popstate`,H),B.querySelector(`.${w}`).addEventListener(`click`,()=>this.closePopup(B,S,H)),V.addEventListener(`click`,e=>{e.target===V&&this.closePopup(B,S,H)});let U=e=>{e.key===`Escape`&&this.closePopup(B,S,H,U)};document.addEventListener(`keydown`,U),B._escHandler=U;let W=B.querySelector(`.${O}`),G=B.querySelector(`.${k}`);W&&G&&(W.addEventListener(`click`,e=>{e.stopPropagation(),G.hidden=!G.hidden}),B.addEventListener(`click`,e=>{!G.hidden&&!e.target.closest(`.${D}`)&&(G.hidden=!0)}));let K=B.querySelector(`.${j}`);K&&_&&K.addEventListener(`click`,async e=>{if(e.stopPropagation(),K.disabled)return;let t=a(`confirm_delete_event`,this.language)||`Are you sure you want to delete this event?`;if(!confirm(t)){G&&(G.hidden=!0);return}K.disabled=!0,await this.deleteEvent(y,_)?this.closePopup(B,S,H,U):(alert(a(`error_delete_event`,this.language)||`Failed to delete the event. Please try again.`),K.disabled=!1,G&&(G.hidden=!0))});let q=B.querySelector(`.${M}`),J=B.querySelector(`.${N}`),Y=async(n,r,i,a,o=``,l=``,u=``,f=``)=>{if(r.disabled)return;r.disabled=!0;let p={eventId:_,feedback:n};this.dispatchEvent(new CustomEvent(`llmvision-feedback`,{detail:p,bubbles:!0,composed:!0}));let m={title:e||``,description:t||``,label:F.join(`, `),category:d||``,icon:h||this.default_icon||``,eventId:_||``,startTime:s||``};try{let r=null,s=``;if(c)try{r=await(c.startsWith(`data:`)?await fetch(c):await fetch(c,{mode:`cors`})).blob();let e=(r.type||`image/jpeg`).split(`/`)[1]||`jpg`;s=`event_${_||Date.now()}.${e}`}catch(e){console.warn(`Unable to fetch key frame for feedback upload; submitting feedback without image.`,e)}try{let c=new FormData;r&&c.append(`image`,r,s||`event_${_||Date.now()}.jpg`),c.append(`isTitle`,m.title||``),c.append(`shouldBeTitle`,o||e||``),c.append(`isDescription`,m.description||``),c.append(`shouldBeDescription`,l||t||``),c.append(`isLabel`,m.label||``),c.append(`shouldBeLabel`,u||m.label||``),c.append(`isCategory`,m.category||``),c.append(`shouldBeCategory`,f||d||``),c.append(`isIcon`,m.icon||``),c.append(`shouldBeIcon`,h||``),c.append(`upDown`,n||``),c.append(`reason`,i||``),c.append(`feedback`,a||``);let p=await fetch(`https://feedback.llmvision.org/`,{method:`POST`,headers:{"X-App-Key":`e2d892b226e34339940079041ebc65fed345a5cdbd888b6f042ec2c44e0f9a2a`},body:c,mode:`cors`});if(p.ok)console.log(`Feedback uploaded successfully`);else{let e=await p.text().catch(()=>``);console.error(`Feedback upload failed:`,p.status,e)}}catch(e){console.error(`Error uploading snapshot to feedback API:`,e)}}catch(e){console.error(`Error uploading snapshot to feedback API:`,e)}finally{this.closePopup(B,S,H,U)}},X=(t,n)=>{if(n.disabled)return;let r=`${g}-feedback-detail-overlay`,i=`${g}-feedback-detail-content`,o=document.createElement(`div`),s=[{value:`event_not_no_activity`,label:`Event is not 'no activity'`},{value:`event_is_no_activity`,label:`Event should be 'no activity'`},{value:`incorrect_title_description`,label:`Incorrect title/descriptions`},{value:`incorrect_label`,label:`Incorrect label`},{value:`other`,label:`Other`}],c=(e||``).trim().toLowerCase(),l=s.filter(e=>c.includes(`no activity`)?e.value!==`event_is_no_activity`:e.value!==`event_not_no_activity`);o.innerHTML=`
                <div class="${r}">
                    <div class="${i}">
                        <button class="${g}-fd-close" title="Close" aria-label="Close" style="font-size:20px">✕</button>
                            <div class="${g}-fd-page ${g}-fd-page-1">
                                <h2>${a(`feedback_reason`,this.language)||`Select a reason`}</h2>
                                <div class="${g}-fd-reason-list">
                                    ${l.map(e=>`
                                        <button type="button" class="${g}-fd-reason-btn" data-value="${e.value}">${e.label}</button>
                                    `).join(``)}
                                </div>
                            </div>

                        <div class="${g}-fd-page ${g}-fd-page-2" hidden>
                            <!-- dynamic second page: for event_not_no_activity show title+description, otherwise show a short note -->
                            <div class="${g}-fd-page-2-content" style="margin-top:24px"></div>
                            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px">
                                <button class="${g}-fd-next-2">${a(`next`,this.language)||`Next`}</button>
                            </div>
                        </div>

                        <div class="${g}-fd-page ${g}-fd-page-3" hidden>
                            <h2>${a(`additional_details`,this.language)||`Additional details`}</h2>
                            <textarea class="${g}-fd-final-details" rows="6" style="width:100%;padding:8px;border-radius:6px;border:1px solid rgba(0,0,0,0.12)"></textarea>
                            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px">
                                <button class="${g}-fd-send">${a(`send`,this.language)||`Send`}</button>
                            </div>
                        </div>
                    </div>
                </div>
                <style>
                    .${r} { position: fixed; inset: 0; display:flex;align-items:center;justify-content:center;z-index:1100;background:rgba(0,0,0,0.45); }
                    .${i} { position:relative; background: var(--ha-card-background, var(--card-background-color, #fff)); color: var(--primary-text-color); padding: 18px; border-radius:12px; width: 520px; max-width: calc(100% - 40px); max-height: calc(100vh - 40px); overflow-y: auto; }
                    .${i} h2 { margin:0 0 8px 0; text-align:center }
                    .${g}-fd-close { position:absolute; left:12px; top:12px; background:none; border:none; cursor:pointer; color:var(--primary-text-color); }
                    .${g}-fd-reason-list { }
                    .${g}-fd-reason-btn {
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
                    .${g}-fd-reason-btn:hover {
                        background: rgba(0,0,0,0.04);
                    }
                    .${g}-fd-reason-btn.selected {
                        background: rgba(0,0,0,0.06);
                    }
                </style>
            `;let u=o.querySelector(`.${r}`),d=o.querySelector(`.${g}-fd-close`),f=o.querySelector(`.${g}-fd-page-1`),p=o.querySelector(`.${g}-fd-page-2`),m=o.querySelector(`.${g}-fd-page-3`),h=o.querySelector(`.${g}-fd-cancel`),_=o.querySelector(`.${g}-fd-next`),v=o.querySelector(`.${g}-fd-next-2`),y=o.querySelector(`.${g}-fd-send`),b=o.querySelector(`.${g}-fd-page-2-content`),x=o.querySelector(`.${g}-fd-final-details`),S=()=>{o._escHandler&&document.removeEventListener(`keydown`,o._escHandler),o.parentElement&&document.body.removeChild(o)};h&&h.addEventListener(`click`,e=>{e.stopPropagation(),S()}),d&&d.addEventListener(`click`,e=>{if(e.stopPropagation(),!p.hidden&&m.hidden)p.hidden=!0,f.hidden=!1,d.textContent=`✕`,d.title=`Close`,d.setAttribute(`aria-label`,`Close`);else if(m.hidden)S();else{let e=p.dataset.reason||``;if(m.hidden=!0,e===`other`){p.hidden=!0,f.hidden=!1,d.textContent=`✕`,d.title=`Close`,d.setAttribute(`aria-label`,`Close`);return}p.hidden=!1,d.innerHTML=`
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m313-440 196 196q12 12 11.5 28T508-188q-12 11-28 11.5T452-188L188-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l264-264q11-11 27.5-11t28.5 11q12 12 12 28.5T508-715L313-520h447q17 0 28.5 11.5T800-480q0 17-11.5 28.5T760-440H313Z"/></svg>
                        `,d.title=`Back`,d.setAttribute(`aria-label`,`Back`)}}),u.addEventListener(`click`,e=>{e.target===u&&S()}),o._escHandler=e=>{e.key===`Escape`&&S()},document.addEventListener(`keydown`,o._escHandler);let C=o.querySelectorAll(`.${g}-fd-reason-btn`);C.forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation(),C.forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`);let n=e.dataset.value;b.innerHTML=``,n===`event_not_no_activity`||n===`incorrect_title_description`?b.innerHTML=`
                            <label style="display:block;margin:8px 0;font-weight:600">${a(`correct_title`,this.language)||`Correct title`}</label>
                            <input class="${g}-fd-correct-title" type="text" style="width:100%;padding:8px;border-radius:6px;border:1px solid rgba(0,0,0,0.12)">
                            <label style="display:block;margin:8px 0;font-weight:600">${a(`correct_description`,this.language)||`Correct description`}</label>
                            <textarea class="${g}-fd-correct-description" rows="4" style="width:100%;padding:8px;border-radius:6px;border:1px solid rgba(0,0,0,0.12)"></textarea>
                        `:n===`incorrect_label`?b.innerHTML=`
                            <label style="display:block;margin:8px 0;font-weight:600">${a(`correct_label`,this.language)||`Pick the correct label`}</label>
                            <select class="${g}-fd-correct-label" style="width:100%;padding:8px;border-radius:6px;border:1px solid rgba(0,0,0,0.12)">
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
                            <p style="margin:6px 0">${a(`please_provide_details`,this.language)||`Please provide more details on the next page.`}</p>
                        `,p.dataset.reason=n,f.hidden=!0,n===`other`?(p.hidden=!0,m.hidden=!1):(p.hidden=!1,m.hidden=!0),d&&(d.innerHTML=`
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m313-440 196 196q12 12 11.5 28T508-188q-12 11-28 11.5T452-188L188-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l264-264q11-11 27.5-11t28.5 11q12 12 12 28.5T508-715L313-520h447q17 0 28.5 11.5T800-480q0 17-11.5 28.5T760-440H313Z"/></svg>
                        `,d.title=`Back`,d.setAttribute(`aria-label`,`Back`))})}),_&&_.addEventListener(`click`,e=>{e.stopPropagation();let t=o.querySelector(`.${g}-fd-reason-btn.selected`);t&&t.click()}),v.addEventListener(`click`,e=>{e.stopPropagation(),p.hidden=!0,m.hidden=!1,d&&(d.innerHTML=`
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m313-440 196 196q12 12 11.5 28T508-188q-12 11-28 11.5T452-188L188-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l264-264q11-11 27.5-11t28.5 11q12 12 12 28.5T508-715L313-520h447q17 0 28.5 11.5T800-480q0 17-11.5 28.5T760-440H313Z"/></svg>
                    `,d.title=`Back`,d.setAttribute(`aria-label`,`Back`))}),y.addEventListener(`click`,async e=>{e.stopPropagation(),y.disabled=!0;let r=p.dataset.reason||``,i=``;if(r===`event_not_no_activity`){let e=o.querySelector(`.${g}-fd-correct-title`),t=o.querySelector(`.${g}-fd-correct-description`),n=e?(e.value||``).trim():``,r=t?(t.value||``).trim():``;n&&(i+=`Title: ${n}`),r&&(i+=(i?`
`:``)+`Description: ${r}`)}let s=(x.value||``).trim(),c=``,l=``,u=``,d=``;if(r===`event_not_no_activity`){let e=o.querySelector(`.${g}-fd-correct-title`),t=o.querySelector(`.${g}-fd-correct-description`);c=e?(e.value||``).trim():``,l=t?(t.value||``).trim():``}else if(r===`incorrect_title_description`){let e=o.querySelector(`.${g}-fd-correct-title`),t=o.querySelector(`.${g}-fd-correct-description`);c=e?(e.value||``).trim():``,l=t?(t.value||``).trim():``}else if(r===`incorrect_label`){let e=o.querySelector(`.${g}-fd-correct-label`);u=e?(e.value||``).trim():``}else if(r===`incorrect_category`){let e=o.querySelector(`.${g}-fd-correct-title`);d=e?(e.value||``).trim():``}await Y(t,n,r,s,c,l,u,d),S(),Z(a(`thanks_for_feedback`,this.language)||`Thanks for your feedback!`)}),document.body.appendChild(o)},Z=e=>{this.closePopup(B,S,H,U),this.dispatchEvent(new CustomEvent(`hass-notification`,{bubbles:!0,composed:!0,detail:{message:e,duration:4e3}}))};q&&_&&q.addEventListener(`click`,e=>{e.stopPropagation(),G&&(G.hidden=!0),Y(`up`,q,`good_response`,``,``,``,``,``),Z(a(`thanks_for_feedback`,this.language)||`Thanks for your feedback!`)}),J&&_&&J.addEventListener(`click`,e=>{e.stopPropagation(),G&&(G.hidden=!0),X(`down`,J)}),document.body.appendChild(B),requestAnimationFrame(()=>V.classList.add(`show`))}closePopup(e,t,n,r){e.querySelectorAll(`video`).forEach(e=>e.pause());let i=e.querySelector(`.${t}`);i.classList.remove(`show`),i.addEventListener(`transitionend`,()=>{e._escHandler&&document.removeEventListener(`keydown`,e._escHandler);try{document.body.removeChild(e)}catch{}},{once:!0}),history.state&&history.state.popupOpen&&history.replaceState(null,``),window.removeEventListener(`popstate`,n)}}})),C,w,T=t((()=>{l(),e(),p(),S(),C=class extends u{static get properties(){return{_config:{type:Object}}}setConfig(e){this._config=e||{}}render(){if(!this._config)return s`<div>Please configure the card.</div>`;let e=this._getSchema(),t=e.slice(0,3),n=e.slice(3,5),r=e.slice(5);return s`
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
        `}_getSchema(){let e=[{name:`category_filters`,description:`Filter events by category (title). Only events matching selected categories will be shown.`,selector:{select:{multiple:!0,options:Object.keys(h).map(e=>({value:e,label:e.charAt(0).toUpperCase()+e.slice(1)}))}}},{name:`camera_filters`,description:`Filter events by camera entity. Only events from selected cameras will be shown.`,selector:{select:{multiple:!0,options:Object.keys(this.hass.states).filter(e=>e.startsWith(`camera.`)).map(e=>({value:e,label:this.hass.states[e].attributes.friendly_name||e}))}}},{name:`filter_false_positives`,description:`Hide events titled 'No activity observed'.`,selector:{boolean:{default:!0}}}],t=[{name:`language`,description:`Language for the card. This will be used to generate icons and translations.`,selector:{select:{options:[{value:`bg`,label:`Bulgarian`},{value:`ca`,label:`Catalan`},{value:`cz`,label:`Czech`},{value:`da`,label:`Danish`},{value:`nl`,label:`Dutch`},{value:`en`,label:`English`},{value:`fr`,label:`French`},{value:`de`,label:`German`},{value:`hu`,label:`Hungarian`},{value:`it`,label:`Italian`},{value:`pl`,label:`Polish`},{value:`pt`,label:`Portuguese`},{value:`sk`,label:`Slovak`},{value:`es`,label:`Spanish`},{value:`sv`,label:`Swedish`}]}}},{name:`time_format`,description:`Choose between 12-hour and 24-hour time display.`,selector:{select:{options:[{value:`24h`,label:`24-hour`},{value:`12h`,label:`12-hour`}]}}}],n=[{name:`default_icon`,description:`Icon when no category keyword matches.`,selector:{icon:{}}}];return[...e,...t,...n]}_computeLabel(e){return{entity:`Calendar Entity`,category_filters:`Category Filters`,camera_filters:`Camera Filters`,filter_false_positives:`Filter False Positives`,language:`Language`,time_format:`Time Format`}[e.name]||e.name}_computeHelper=e=>e.description||``;_valueChanged(e){this.dispatchEvent(new CustomEvent(`config-changed`,{detail:{config:e.detail.value}}))}static get styles(){return d`ha-card{padding:16px;}`}},customElements.define(`timeline-preview-card-editor`,C),w=class extends x{setConfig(e){this.setCommonConfig(e,{requireEventLimits:!1})}static getConfigElement(){return document.createElement(`timeline-preview-card-editor`)}static getStubConfig(){return{entity:`calendar.llm_vision_timeline`,language:`en`,time_format:`24h`,filter_false_positives:!0}}getCardSize(){return 3}getGridOptions(){return{rows:2,columns:6,min_rows:2,max_rows:8,min_columns:6,max_columns:24}}set hass(e){this.content||=(this.style.display=`block`,this.style.height=`100%`,this.innerHTML=`
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
            `,this.querySelector(`.preview-card-content`)),this._loadAndRender(e)}async _loadAndRender(e){let t=await this.fetchEvents(e,{limit:1,days:this.number_of_days,cameras:this.camera_filters,categories:this.category_filters,includeNoActivity:!this.filter_false_positives});if(!t)return;let n=this._hashState({...t,category_filters:this.category_filters,camera_filters:this.camera_filters,number_of_events:this.number_of_events,number_of_days:this.number_of_days,time_format:this.time_format,filter_false_positives:this.filter_false_positives});if(n!==this._lastEventHash){if(this._lastEventHash=n,!t.length){this.content.innerHTML=``;let e;e=this.category_filters.length?`noEventsCategory`:this.camera_filters.length?`noEventsCamera`:this.number_of_days?`noEventsHours`:`noEvents`;let t=a(e,this.language)||`No events found.`;e===`noEventsHours`&&(t=t.replace(`{hours}`,this.number_of_days)),this.content.innerHTML=`<div class="event-container preview-empty-state"><h3>${t}</h3></div>`;return}this._render(t,e)}}_render(e,t){let r=e[0],i=document.createElement(`div`);i.classList.add(`preview-event-container`);let a=m(r.category,r.label),{icon:o,color:s}=a;console.log(`icon result`,a,r.title),(r.category===void 0||r.category===``)&&this.default_icon&&(o=this.default_icon),console.log(`icon`,o,r.title,a);let c=r.cameraName,l=new Date(r.startTime),u=this.formatDateLabel(l),d=this.formatTime(l);i.innerHTML=`
                <img class="preview-event-image" src="" alt="Key frame" onerror="this.style.display='none'">
                <div class="preview-event-vignette"></div>
                <div class="preview-icon-container">
                    <ha-icon icon="${o}" style="color:white;font-size:24px;"></ha-icon>
                </div>
                <div class="preview-event-details">${n(`${c} • ${u}, ${d}`)}</div>
                <div class="preview-event-title">${n(r.title)}</div>
            `,i.addEventListener(`click`,()=>this.openEventPopup(t,r,o)),this.content.innerHTML=``,this.content.appendChild(i),this.resolveKeyFrame(t,r.keyFrame).then(e=>{let t=i.querySelector(`img`);t&&(t.src=e,t.style.display=`block`)})}static getStubConfig(){return{language:`en`,time_format:`24h`,filter_false_positives:!0}}},customElements.define(`llmvision-preview-card`,w)}));T();export{w as LLMVisionPreviewCard,x as n,S as r,T as t};