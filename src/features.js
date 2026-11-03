/* ---------- Batch 2: phones & invites, arranging, pull to refresh, seasons & milestones,
   time of day, undo delete, backup, Kid view lock, freeze & storm prep ---------- */

/* Phones and invite link */
function inviteBlock(){
 const devs=(S.devices||[]).slice().sort((a,b)=>a.at-b.at);
 return `<div class="calbox" style="margin-top:var(--s4)"><b>Invite someone</b><p class="note">Send this link to adults in your house. They open it, pick their name and they're in. Kids don't need it; use Kid view on any family phone or tablet.</p>
 <div style="display:flex;gap:var(--s2);flex-wrap:wrap"><button class="btn primary small" data-invite="1">Share invite link</button><button class="btn small" data-copy="${esc(inviteLink())}">Copy link</button></div>
 ${ui.confirmRotate?`<div class="confirm">Make a new invite link? The old one stops working. Phones already in the house stay in. <button class="btn small danger" data-rotate="2">Make new link</button><button class="btn small" data-rotate="0">Cancel</button></div>`:`<button class="linkish" data-rotate="1">Reset invite link</button>`}</div>
 ${devs.length?`<section class="group" style="margin-top:var(--s5)"><div class="group-head"><h2>Phones in this house</h2><span class="stamp">${devs.length}</span></div><div class="list">${devs.map(d=>`<div class="row"><span class="main"><span class="name">${esc(d.label)}</span><span class="meta"><span>Joined ${new Date(d.at).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}</span></span></span>${d.id===S.deviceId?`<span class="pill">This phone</span>`:ui.confirmRevoke===d.id?`<span class="confirm"><button class="btn small danger" data-revoke="${d.id}">Remove</button><button class="btn small" data-revoke="">Keep</button></span>`:`<button class="linkish" data-askrevoke="${d.id}">Remove</button>`}</div>`).join("")}</div><p class="note" style="padding-top:var(--s2)">Removing a phone signs it out of the house. Its person and history stay.</p></section>`:""}`;
}

/* Time of day on Today */
function todaySections(list){
 if(!list.length)return"";
 const anyTimed=list.some(t=>t.timeSet);
 const ordered=[...list].sort((a,b)=>(a.ord??999)-(b.ord??999)||(a.time||"").localeCompare(b.time||"")||a.name.localeCompare(b.name));
 const sectionHtml=(title,l,key)=>l.length?`<section class="group"><div class="group-head"><h2>${title}</h2><span class="stamp">${l.length}</span></div><div class="list" data-sort="${key}">${l.map(taskRow).join("")}</div></section>`:"";
 if(!anyTimed)return sectionHtml("Today",ordered,"today");
 const slot=t=>!t.timeSet?"any":+t.time.slice(0,2)<12?"am":+t.time.slice(0,2)<17?"pm":"eve";
 return sectionHtml("Morning",ordered.filter(t=>slot(t)==="am"),"today")+sectionHtml("Afternoon",ordered.filter(t=>slot(t)==="pm"),"today")+sectionHtml("Evening",ordered.filter(t=>slot(t)==="eve"),"today")+sectionHtml("Anytime today",ordered.filter(t=>slot(t)==="any"),"today");
}

/* Seasons */
const SEASONS=[["Winter",[12,1,2]],["Spring",[3,4,5]],["Summer",[6,7,8]],["Fall",[9,10,11]]];
function seasonNow(){
 const d=new Date(),m=d.getMonth()+1,s=SEASONS.find(x=>x[1].includes(m));
 let y=d.getFullYear();const startMonth=s[1][0];const startYear=(s[0]==="Winter"&&m<=2)?y-1:y;
 const start=ymd(new Date(startYear,startMonth-1,1));const endM=s[1][2];const endY=s[0]==="Winter"?startYear+1:startYear;
 const end=ymd(new Date(endY,endM,0));
 return{name:s[0],months:s[1],start,end,key:`season-${startYear}-${s[0].toLowerCase()}`};
}
function seasonTasks(){
 const s=seasonNow();
 const list=tasks().filter(t=>t.months&&t.months.some(m=>s.months.includes(m)));
 const done=list.filter(t=>t.lastDone&&t.lastDone>=s.start),left=list.filter(t=>!(t.lastDone&&t.lastDone>=s.start));
 return{s,list,done,left};
}
function seasonCard(){
 const {s,list,done}=seasonTasks();if(!list.length)return"";
 const all=list.length,n=done.length,fin=n===all;
 return `<button class="tonight ${fin?"closed":""}" data-season="1" style="background:${fin?"var(--forest-wash)":"transparent"};border:1px solid var(--rule)"><span style="min-width:0"><span class="eyebrow">${fin?"Season complete":"Through "+nice(s.end)}</span><span class="t-title" style="display:block">${s.name} checklist</span><span class="t-meta">${n} of ${all} done</span><span class="progress fresh"><i style="width:${n/all*100}%"></i></span></span><span class="linkish">Open</span></button>`;
}
function seasonBlock(){
 const {s,list,done,left}=seasonTasks();if(!list.length)return"";
 return `<section class="group"><div class="group-head"><h2>${s.name} checklist</h2><span class="stamp">${done.length} of ${list.length} done</span></div>
 <div class="progress fresh" style="margin:var(--s3) 0"><i style="width:${done.length/list.length*100}%"></i></div>
 <div class="list">${left.sort((a,b)=>a.next.localeCompare(b.next)).map(taskRow).join("")}</div>
 ${done.length?`<div class="list" style="opacity:.7">${done.map(t=>`<div class="row"><span class="main"><span class="name" style="color:var(--ink-2)">${esc(t.name)}</span><span class="meta"><span class="checked-by">Done ${nice(t.lastDone)}${t.lastBy?" · "+esc(pShort(t.lastBy)):""}</span></span></span><span></span></div>`).join("")}</div>`:""}
 ${!left.length?`<div class="caught"><span class="big">The ${s.name.toLowerCase()} checklist is done.</span><span class="muted">Everything this season asked of the house is taken care of.</span></div>`:""}</section>`;
}

/* Milestones: recorded once per house */
const MILESTONE_TEXT={
 "tasks-25":"completed 25 tasks together","tasks-100":"completed 100 tasks together","tasks-250":"completed 250 tasks together","tasks-500":"completed 500 tasks together",
 "shift-7":"closed the house 7 nights in a row","shift-30":"closed the house 30 nights in a row","shift-100":"closed the house 100 nights in a row"
};
function shiftStreak(){
 const days=new Set(Object.values(D.activity).filter(a=>a.kind==="shift").map(a=>ymd(new Date(a.at-4*3600e3))));
 let d=shiftDate(),n=0;if(!days.has(d))d=addDays(d,-1);while(days.has(d)){n++;d=addDays(d,-1)}return n;
}
let msBusy=false;
function checkMilestones(){
 if(msBusy||!D.house||!D.house.setupDone||S.mode!=="db"||!S.canWrite)return;
 const have=D.house.milestones||{},hit=[];
 const total=Object.values(D.activity).filter(a=>a.kind==="task"&&!a.pending).length;
 [25,100,250,500].forEach(n=>{if(total>=n&&!have["tasks-"+n])hit.push("tasks-"+n)});
 const st=shiftStreak();[7,30,100].forEach(n=>{if(st>=n&&!have["shift-"+n])hit.push("shift-"+n)});
 const {s,list,left}=seasonTasks();if(list.length>=3&&!left.length&&!have[s.key])hit.push(s.key);
 if(!hit.length)return;
 msBusy=true;const m=Object.assign({},have);hit.forEach(k=>m[k]=Date.now());putHouse({milestones:m});
 hit.forEach(k=>{const text=MILESTONE_TEXT[k]||`finished the ${s.name} checklist`;logEvent({kind:"milestone",text,who:""})});
 const last=hit[hit.length-1];toast(last.startsWith("season")?`${s.name} checklist complete. The house is ready for the season.`:`Milestone: the household ${MILESTONE_TEXT[last]}.`);
 haptic&&haptic([10,50,10]);setTimeout(()=>msBusy=false,1500);
}
function milestonesBlock(){
 const m=(D.house&&D.house.milestones)||{},ks=Object.keys(m).sort((a,b)=>m[b]-m[a]);
 if(!ks.length)return"";
 return `<section class="group"><div class="group-head"><h2>Milestones</h2><span class="stamp">${ks.length}</span></div><div class="list">${ks.map(k=>`<div class="row"><span class="main"><span class="name">${k.startsWith("season")?esc(k.split("-")[2].replace(/^./,c=>c.toUpperCase())+" "+k.split("-")[1]+" checklist finished"):"The household "+esc(MILESTONE_TEXT[k]||k)}</span><span class="meta"><span>${new Date(m[k]).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}</span></span></span><span></span></div>`).join("")}</div></section>`;
}
function viewHousehold(){
 const html=viewFamily().replace("<h1>Family</h1>","<h1>Household</h1>");
 const at=html.indexOf('<section class="group"><div class="group-head"><h2>What\'s new');
 const withMs=at>0?html.slice(0,at)+milestonesBlock()+html.slice(at):html+milestonesBlock();
 return withMs+`<section class="group"><div class="group-head"><h2>Kids, stars and rewards</h2></div><div style="height:var(--s3)"></div>${moreKids()}</section>`;
}

/* Freeze and storm prep (Open-Meteo, no key) */
const PREP={
 freeze:["Drip faucets on outside walls","Open cabinet doors under sinks","Disconnect and drain outdoor hoses","Cover or bring in tender plants","Keep the heat at 55°F or higher, even if you're away","Check generator fuel and extension cords"],
 storm:["Charge phones and power banks","Test the generator and check its fuel","Secure or bring in outdoor furniture and trash cans","Find flashlights and fresh batteries","Fill a few jugs of water","Clear gutters and drains near the house"],
 snow:["Stock salt or ice melt and find the shovels","Fill the car's gas tank","Charge phones and power banks","Test the generator and check its fuel","Drip faucets on outside walls","Clear snow from vents and meters after it stops"],
 heat:["Check the AC filter","Close blinds on the sunny side","Check on pets' water and shade","Water the garden early in the morning"]
};
function wxCache(){try{return JSON.parse(localStorage.getItem("upkeep-wx")||"null")}catch(e){return null}}
async function loadForecast(force){
 const pl=D.house&&D.house.place;if(!pl)return null;
 const c=wxCache();if(!force&&c&&c.lat===pl.lat&&Date.now()-c.at<3*3600e3)return c;
 try{
  const u=`https://api.open-meteo.com/v1/forecast?latitude=${pl.lat}&longitude=${pl.lon}&daily=temperature_2m_min,temperature_2m_max,wind_gusts_10m_max,snowfall_sum,precipitation_sum&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto&forecast_days=4`;
  const r=await fetch(u);if(!r.ok)return c;const j=await r.json();
  const out={at:Date.now(),lat:pl.lat,daily:j.daily};localStorage.setItem("upkeep-wx",JSON.stringify(out));return out;
 }catch(e){return c}
}
function wxAlert(){
 const c=wxCache();if(!c||!c.daily||!c.daily.time)return null;
 const d=c.daily,dayName=i=>i===0?"tonight":i===1?"tomorrow night":new Date(d.time[i]+"T12:00").toLocaleDateString(undefined,{weekday:"long"})+" night";
 const dayName2=i=>i===0?"today":i===1?"tomorrow":new Date(d.time[i]+"T12:00").toLocaleDateString(undefined,{weekday:"long"});
 for(let i=0;i<d.time.length;i++){
  if((d.snowfall_sum[i]||0)>=2)return{kind:"snow",key:"snow-"+d.time[i],title:`About ${Math.round(d.snowfall_sum[i])}" of snow ${dayName2(i)}`};
  if((d.wind_gusts_10m_max[i]||0)>=45)return{kind:"storm",key:"storm-"+d.time[i],title:`Gusts to ${Math.round(d.wind_gusts_10m_max[i])} mph ${dayName2(i)}`};
  if((d.precipitation_sum[i]||0)>=2)return{kind:"storm",key:"storm-"+d.time[i],title:`About ${d.precipitation_sum[i].toFixed(1)}" of rain ${dayName2(i)}`};
  if((d.temperature_2m_min[i]??99)<=25)return{kind:"freeze",key:"freeze-"+d.time[i],title:`Hard freeze ${dayName(i)} · low of ${Math.round(d.temperature_2m_min[i])}°F`};
  if((d.temperature_2m_max[i]??0)>=95)return{kind:"heat",key:"heat-"+d.time[i],title:`Heat ${dayName2(i)} · high of ${Math.round(d.temperature_2m_max[i])}°F`};
 }
 return null;
}
function prepCard(){
 const a=wxAlert();if(!a)return"";
 const st=(D.house&&D.house.prep&&D.house.prep[a.key])||[];if(st==="dismissed")return"";
 const items=PREP[a.kind],done=Array.isArray(st)?st:[];
 if(!ME.alerted||!ME.alerted[a.key]){ME.alerted=Object.assign({},ME.alerted||{},{[a.key]:1});ls.set("upkeep-me",ME);setTimeout(()=>liveNotice({id:a.key,actor:"",who:"",text:"",at:Date.now(),_wx:a.title}),50)}
 return `<section class="group" style="background:var(--tint);border-radius:var(--r);padding:var(--s4)"><span class="eyebrow">Get the house ready</span><div style="font-family:var(--serif);font-size:1.25rem;margin:4px 0 var(--s3)">${esc(a.title)}</div>
 <div class="steps">${items.map((x,i)=>`<label><input type="checkbox" data-prep="${a.key}" data-i="${i}" ${done.includes(i)?"checked":""}><span>${esc(x)}</span></label>`).join("")}</div>
 <div style="margin-top:var(--s3);display:flex;gap:var(--s3)"><span class="note">${done.length} of ${items.length} done</span><button class="linkish" data-prepdismiss="${a.key}">Not needed</button></div></section>`;
}
function liveNotice(a){
 if(a._wx){toast(a._wx+". There's a short prep list on Today.");if(ME.notify&&document.hidden&&"Notification" in window&&Notification.permission==="granted"){try{navigator.serviceWorker?.ready.then(r=>r.showNotification("Upkeep",{body:a._wx,icon:"/icon-192.png",tag:a.id}))}catch(e){}}return}
 const text=`${pName(a.actor||a.who)} ${a.text}`;toast(text);
 if(ME.notify&&document.hidden&&"Notification" in window&&Notification.permission==="granted"){try{navigator.serviceWorker?.ready.then(r=>r.showNotification("Upkeep",{body:text,icon:"/icon-192.png",tag:a.id})).catch(()=>{})}catch(e){}}
}
async function findPlace(q){
 const r=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=en&countryCode=US`);
 if(!r.ok)throw new Error("geo");const j=await r.json();return(j.results||[]).map(x=>({name:`${x.name}${x.admin1?", "+x.admin1:""}`,lat:+x.latitude.toFixed(3),lon:+x.longitude.toFixed(3)}));
}

/* Kid view lock */
async function sha(s){const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode("upkeep:"+s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
const pinLayer=document.createElement("div");document.body.appendChild(pinLayer);
function showPin(onOk){
 ui.pin={entry:"",onOk,err:""};drawPin();
}
function drawPin(){
 const p=ui.pin;if(!p){pinLayer.innerHTML="";return}
 pinLayer.innerHTML=`<div class="scrim"></div><div class="sheet" role="dialog" aria-label="Enter PIN"><div class="panel" style="align-items:center;max-width:380px">
 <h2>Grown-ups only</h2><p class="note">Enter the PIN to leave Kid view.</p>
 <div class="pindots" aria-live="polite">${[0,1,2,3].map(i=>`<i class="${i<p.entry.length?"on":""}"></i>`).join("")}</div>
 ${p.err?`<p class="note err">${esc(p.err)}</p>`:""}
 <div class="pinpad">${[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map(k=>k===""?"<span></span>":`<button data-pinkey="${k}" aria-label="${k==="⌫"?"Delete":k}">${k}</button>`).join("")}</div>
 <button class="linkish" data-pincancel="1">Cancel</button></div></div>`;
}

/* Settings (adds backup, Kid view lock, location; keeps the earlier sections) */
function moreSettings(){
 const pr=(D.house&&D.house.profile)||{},h=D.house||{};
 const canNotify="Notification" in window;
 return `<section class="group"><div class="calbox"><b>Away mode</b><p class="note">Going on a trip? Turn this on and nothing goes overdue. When you're back, every due date moves forward by the days you were gone.</p>${paused()?`<button class="btn primary" data-unpause="1">I'm back</button>`:`<div><button class="btn" data-pause="1">Turn on Away mode</button></div>`}</div></section>
 <section class="group"><div class="calbox"><b>Freeze and storm reminders</b><p class="note">With your town set, Upkeep checks the forecast and shows a short prep list before a hard freeze, heavy snow, high winds or a big storm.</p>
 ${h.place?`<p style="margin:0">${esc(h.place.name)} <button class="linkish" data-placeclear="1">Change</button></p>`:`<div class="cmtform"><input type="text" id="place-q" placeholder="Town, e.g. Andrews NC" autocomplete="address-level2"><button class="btn" data-placefind="1">Find</button></div>${ui.places?ui.places.length?`<div class="list">${ui.places.map((p,i)=>`<button class="row" data-placepick="${i}"><span class="main"><span class="name">${esc(p.name)}</span></span><span class="linkish">Use</span></button>`).join("")}</div>`:`<p class="note">No towns found. Try the town name without the ZIP.</p>`:""}`}</div></section>
 <section class="group"><div class="calbox"><b>Notifications on this device</b><p class="note">A notice when someone completes something, checks a shift item, comments or nudges you, and before bad weather. On iPhone, add Upkeep to your Home Screen first (Share → Add to Home Screen).</p>${canNotify?`<label class="switch"><input type="checkbox" id="notify" ${ME.notify&&Notification.permission==="granted"?"checked":""}><span>Show notifications</span></label>${Notification.permission==="denied"?`<p class="note err">Notifications are blocked for Upkeep in this browser's settings.</p>`:""}`:`<p class="note">This browser doesn't support notifications.</p>`}</div></section>
 <section class="group"><div class="calbox"><b>Kid view</b><p class="note">A PIN keeps kids from leaving Kid view on a shared tablet. It's the same PIN on every device in the house.</p>
 ${h.kidPin?`<p style="margin:0">PIN is on.</p>`:""}
 <div class="cmtform"><input type="password" inputmode="numeric" pattern="[0-9]*" maxlength="4" id="pin-new" placeholder="${h.kidPin?"New 4-digit PIN":"4-digit PIN"}" autocomplete="off"><button class="btn" data-pinset="1">${h.kidPin?"Change":"Set PIN"}</button></div>
 ${h.kidPin?`<button class="linkish" data-pinclear="1">Turn off the PIN</button>`:""}
 <label class="switch"><input type="checkbox" id="kiddevice" ${ME.kidDevice?"checked":""}><span>Open this device straight into Kid view</span></label>
 <label class="switch"><input type="checkbox" id="kidsound" ${ME.kidSound!==false?"checked":""}><span>Soft sound when a kid completes something</span></label></div></section>
 <section class="group"><div class="group-head"><h2>Your home</h2></div><div style="height:var(--s3)"></div>${profileForm(pr)}<p class="note" style="margin-top:var(--s2)">Changing this updates Home → Library → Suggested for you. It doesn't remove tasks you already have.</p></section>
 <section class="group"><div class="calbox"><b>Backup</b><p class="note">Save everything in this house to a file: tasks, routines, people, history, records and lists. Photos stay online and are linked from the backup.</p>
 <div style="display:flex;gap:var(--s2);flex-wrap:wrap"><button class="btn small" data-backup="1">Download backup</button><button class="btn small" data-csv="1">Tasks as a spreadsheet (CSV)</button><label class="btn small" style="cursor:pointer">Restore from backup<input type="file" accept="application/json,.json" id="restore-file" hidden></label></div>
 ${ui.restore?`<div class="confirm">Replace everything in this house with the backup from ${esc(ui.restore.when)}? (${ui.restore.count} items) Everyone in the house will see the restored version. <button class="btn small danger" data-restore="1">Replace</button><button class="btn small" data-restore="0">Cancel</button></div>`:""}</div></section>
 <section class="group"><div class="calbox"><b>This phone</b><p class="note">Signed in as ${esc(pName(myPid()))}. ${S.ops.length?`${S.ops.length} change${S.ops.length>1?"s":""} waiting to sync.`:"Everything is synced."}</p><div style="display:flex;gap:var(--s2);flex-wrap:wrap"><button class="btn small" data-switchme="1">I'm someone else</button>${ui.confirmLeave?`<span class="confirm">Leave this house on this phone? <button class="btn small danger" data-leave="2">Leave</button><button class="btn small" data-leave="0">Stay</button></span>`:`<button class="btn small danger" data-leave="1">Leave this house</button>`}</div></div></section>`;
}
function downloadFile(name,text,type){const u=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement("a");a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),30000)}
function backupJson(){
 const docs={house:{main:D.house}};COLS.forEach(c=>{docs[c]={};Object.values(D[c]).forEach(d=>{const x=Object.assign({},d);delete x.id;docs[c][d.id]=x})});
 return JSON.stringify({app:"upkeep",version:1,exported:new Date().toISOString(),docs},null,1);
}
function tasksCsv(){
 const q=v=>`"${String(v??"").replace(/"/g,'""')}"`;
 const rows=[["Task","Room","Repeats","Next due","Last done","Whose job","Minutes","Done means","Checklist","Notes"]];
 tasks().sort((a,b)=>a.room.localeCompare(b.room)||a.name.localeCompare(b.name)).forEach(t=>rows.push([t.name,t.room,freqText(t),t.next,t.lastDone||"",pName(t.assignee),t.mins,t.standard||"",(t.steps||[]).join("; "),t.notes||""]));
 return rows.map(r=>r.map(q).join(",")).join("\n");
}

/* Arranging (long-press) */
const arr={timer:null,row:null,x:0,y:0,drag:null};
function startArrange(list){
 ui.arranging=list.dataset.sort;list.classList.add("arranging");
 list.insertAdjacentHTML("beforebegin",`<div class="arrange-bar"><span>Drag to reorder</span><button class="btn small primary" data-arrdone="1">Done</button></div>`);
 haptic(12);
}
function finishArrange(){
 const list=document.querySelector(".list.arranging");if(!list){ui.arranging=null;return}
 const key=list.dataset.sort,ids=[...list.querySelectorAll("[data-row]")].map(r=>r.dataset.row);
 if(key==="today")ids.forEach((id,i)=>{if(D.tasks[id]&&D.tasks[id].ord!==i)patch("tasks",id,{ord:i})});
 if(key&&key.startsWith("shift:")){const r=D.routines[key.slice(6)];if(r){const by=Object.fromEntries(r.items.map(i=>[i.id,i]));const items=ids.map(id=>by[id]).filter(Boolean);r.items.forEach(i=>{if(!ids.includes(i.id))items.push(i)});updateRoutine(r,{items})}}
 ui.arranging=null;render();toast("Order saved");
}
document.addEventListener("pointerdown",e=>{
 const row=e.target.closest(".list[data-sort] [data-row]");if(!row||ui.arranging)return;
 arr.x=e.clientX;arr.y=e.clientY;arr.row=row;
 clearTimeout(arr.timer);arr.timer=setTimeout(()=>{const list=row.closest(".list[data-sort]");if(list&&!swipeState.moved){swipeState.el=null;startArrange(list);swipeState.blockClick=true;setTimeout(()=>swipeState.blockClick=false,600)}},550);
},true);
document.addEventListener("pointermove",e=>{
 if(arr.timer&&arr.row&&(Math.abs(e.clientX-arr.x)>8||Math.abs(e.clientY-arr.y)>8)){clearTimeout(arr.timer);arr.timer=null}
 const g=arr.drag;if(!g)return;e.preventDefault();
 const dy=e.clientY-g.y;g.el.style.transform=`translateY(${dy}px)`;
 const sib=[...g.list.children].filter(x=>x!==g.el);
 for(const s of sib){const r=s.getBoundingClientRect();const mid=r.top+r.height/2;
  if(dy>0&&e.clientY>mid&&g.el.compareDocumentPosition(s)&Node.DOCUMENT_POSITION_FOLLOWING){s.after(g.el);g.y=e.clientY;g.el.style.transform="";break}
  if(dy<0&&e.clientY<mid&&g.el.compareDocumentPosition(s)&Node.DOCUMENT_POSITION_PRECEDING){s.before(g.el);g.y=e.clientY;g.el.style.transform="";break}}
},{passive:false});
document.addEventListener("pointerup",()=>{clearTimeout(arr.timer);arr.timer=null;arr.row=null;if(arr.drag){arr.drag.el.style.transform="";arr.drag.el.classList.remove("dragging");arr.drag=null}});
document.addEventListener("pointerdown",e=>{
 const list=e.target.closest(".list.arranging");if(!list)return;
 const item=e.target.closest(".list.arranging > *");if(!item)return;
 e.preventDefault();arr.drag={el:item,list,y:e.clientY};item.classList.add("dragging");
});

/* Pull to refresh */
const ptr=document.createElement("div");ptr.className="ptr";ptr.setAttribute("aria-hidden","true");document.body.appendChild(ptr);
const pull={y0:null,dy:0};
document.addEventListener("touchstart",e=>{if(window.scrollY>0||ui.sheet||ui.pin||ui.arranging||e.target.closest(".sheet,.swipe"))return;pull.y0=e.touches[0].clientY;pull.dy=0},{passive:true});
document.addEventListener("touchmove",e=>{if(pull.y0==null)return;pull.dy=Math.max(0,e.touches[0].clientY-pull.y0);if(pull.dy>10){ptr.textContent=pull.dy>70?"Release to sync":"Pull to sync";ptr.style.opacity=Math.min(1,pull.dy/70);ptr.style.transform=`translate(-50%,${Math.min(pull.dy,90)/2}px)`}},{passive:true});
document.addEventListener("touchend",async()=>{if(pull.y0==null)return;const go=pull.dy>70;pull.y0=null;
 if(!go){ptr.style.opacity=0;return}
 ptr.textContent="Syncing…";haptic(8);await forceSync();ptr.textContent=S.note.startsWith("Offline")?"Couldn't reach the server":"Up to date";setTimeout(()=>ptr.style.opacity=0,900)});
async function forceSync(){
 if(!ME.house)return;await flush();
 try{const res=await api("GET",null,{h:ME.house,k:authKey()});loadMeta(res);loadDocs(res.docs,res.v);if(S.note.startsWith("Offline"))S.note="";render();loadForecast(true).then(()=>render())}
 catch(e){if(e.code!=="not_found")S.note="Offline. Your changes are saved on this phone and will sync when you're back online.";render()}
}

/* Events */
document.addEventListener("click",async e=>{
 const b=e.target.closest("button,label");if(!b)return;const ds=b.dataset;
 // Undo for deletes
 if(ds.del!=null&&ui.sheet&&ui.sheet.kind==="task"){const id=ui.sheet.id,copy=Object.assign({},D.tasks[id]);setTimeout(()=>toast(`Deleted “${copy.name}”`,()=>put("tasks",id,copy)),0);return}
 if(ds.gdel!=null&&ui.sheet&&ui.sheet.kind==="form"){const {col,id}=ui.sheet,copy=Object.assign({},D[col][id]);setTimeout(()=>toast("Deleted",()=>put(col,id,copy)),0);return}
 if(ds.rotate){e.stopImmediatePropagation();if(ds.rotate==="1"){ui.confirmRotate=true;render();return}if(ds.rotate==="0"){ui.confirmRotate=false;render();return}
  try{await houseAction({rotate:true});ui.confirmRotate=false;toast("New invite link ready. The old one no longer works.")}catch(err){toast("Couldn't reset the link. Check your connection.")}render();return}
 if(ds.askrevoke){e.stopImmediatePropagation();ui.confirmRevoke=ds.askrevoke;render();return}
 if(ds.revoke!=null){e.stopImmediatePropagation();const id=ds.revoke;ui.confirmRevoke=null;if(!id){render();return}try{await houseAction({revoke:id});toast("Phone removed")}catch(err){toast("Couldn't remove that phone. Check your connection.")}render();return}
 if(ds.season){e.stopImmediatePropagation();ui.tab="schedule";ui.schedView="seasonal";render();window.scrollTo(0,0);return}
 if(ds.arrdone){e.stopImmediatePropagation();finishArrange();return}
 if(ds.prepdismiss){e.stopImmediatePropagation();const p=Object.assign({},(D.house&&D.house.prep)||{},{[ds.prepdismiss]:"dismissed"});putHouse({prep:p});return}
 if(ds.placefind){e.stopImmediatePropagation();const q=document.getElementById("place-q").value.trim();if(!q)return;try{ui.places=await findPlace(q)}catch(err){ui.places=null;toast("Couldn't look up towns right now.")}render();return}
 if(ds.placepick!=null){e.stopImmediatePropagation();const p=ui.places[+ds.placepick];ui.places=null;putHouse({place:p});await loadForecast(true);render();return}
 if(ds.placeclear){e.stopImmediatePropagation();const h=Object.assign({},D.house);delete h.place;setHouse(h);return}
 if(ds.pinset){e.stopImmediatePropagation();const v=document.getElementById("pin-new").value;if(!/^\d{4}$/.test(v)){toast("Use exactly 4 digits.");return}putHouse({kidPin:await sha(v)});toast("PIN saved");return}
 if(ds.pinclear){e.stopImmediatePropagation();const h=Object.assign({},D.house);delete h.kidPin;setHouse(h);toast("PIN turned off");return}
 if(ds.pinkey!=null){e.stopImmediatePropagation();const p=ui.pin;if(!p)return;const k=ds.pinkey;if(k==="⌫")p.entry=p.entry.slice(0,-1);else if(p.entry.length<4)p.entry+=k;p.err="";drawPin();
  if(p.entry.length===4){const ok=(await sha(p.entry))===(D.house&&D.house.kidPin);if(ok){const f=p.onOk;ui.pin=null;drawPin();f()}else{p.entry="";p.err="That's not it. Try again.";haptic([20,40,20]);drawPin()}}return}
 if(ds.pincancel){e.stopImmediatePropagation();ui.pin=null;drawPin();return}
 if(ds.exitkid){const leaving=!(ui.kid!=="pick"&&kids().length>1);if(leaving&&D.house&&D.house.kidPin){e.stopImmediatePropagation();showPin(()=>{ui.kid=null;render()})}return}
 if(ds.backup){e.stopImmediatePropagation();downloadFile(`upkeep-backup-${today()}.json`,backupJson(),"application/json");return}
 if(ds.csv){e.stopImmediatePropagation();downloadFile(`upkeep-tasks-${today()}.csv`,tasksCsv(),"text/csv");return}
 if(ds.restore!=null){e.stopImmediatePropagation();if(ds.restore==="1"&&ui.restore){const docs=ui.restore.docs;
   COLS.forEach(c=>{Object.keys(D[c]).forEach(id=>{if(!(docs[c]&&docs[c][id]))queueOp({t:"del",c,i:id})});Object.entries(docs[c]||{}).forEach(([id,d])=>queueOp({t:"set",c,i:id,d}))});
   if(docs.house&&docs.house.main)setHouse(docs.house.main);toast("Backup restored")}
  ui.restore=null;render();return}
},true);
document.addEventListener("change",async e=>{
 const el=e.target;
 if(el.dataset.prep){const k=el.dataset.prep,i=+el.dataset.i;const cur=(D.house&&D.house.prep&&D.house.prep[k]);let arr2=Array.isArray(cur)?[...cur]:[];if(el.checked){if(!arr2.includes(i))arr2.push(i)}else arr2=arr2.filter(x=>x!==i);putHouse({prep:Object.assign({},(D.house&&D.house.prep)||{},{[k]:arr2})});haptic(8);return}
 if(el.id==="kiddevice"){ME.kidDevice=el.checked;saveMe();return}
 if(el.id==="kidsound"){ME.kidSound=el.checked;saveMe();return}
 if(el.id==="restore-file"){const f=el.files&&el.files[0];if(!f)return;try{const j=JSON.parse(await f.text());if(j.app!=="upkeep"||!j.docs)throw 0;const count=COLS.reduce((n,c)=>n+Object.keys(j.docs[c]||{}).length,0);ui.restore={docs:j.docs,when:new Date(j.exported).toLocaleString(),count};render()}catch(err){toast("That file isn't an Upkeep backup.")}return}
});

/* Hooks: run after every render */
function render(){
 renderBase();
 if(S.mode==="db"){checkMilestones();if(ME.kidDevice&&!ui.kid&&!ui.kidBooted&&kids().length){ui.kidBooted=true;ui.kid=kids().length===1?kids()[0].id:"pick";renderBase()}}
 if(ui.arranging){const l=document.querySelector(`.list[data-sort="${ui.arranging}"]`);if(l&&!l.classList.contains("arranging"))startArrange(l)}
}
setInterval(()=>{if(D.house&&D.house.place)loadForecast().then(c=>{if(c&&ui.tab==="today")render()})},30*60e3);
window.addEventListener("load",()=>setTimeout(()=>{if(D.house&&D.house.place)loadForecast().then(()=>render())},1500));

boot();
