/* ---------- Design layer: navigation, Today, Schedule, Household, Home, More ---------- */
const IC={
 check:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--forest-ink)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
 today:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.5 1.5M17.2 17.2l1.5 1.5M5.3 18.7l1.5-1.5M17.2 6.8l1.5-1.5"/></svg>',
 sched:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4M7.5 14h3M13.5 14h3M7.5 17h3"/></svg>',
 people:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 19.5a5.5 5.5 0 0 1 11 0M16 5.8a3 3 0 0 1 0 5.6M18.2 19.5a5 5 0 0 0-2.6-4.4"/></svg>',
 home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 11 12 4l8.5 7M5.5 9.5V20h13V9.5M10 20v-5.5h4V20"/></svg>',
 more:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
 dot:'<svg viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="4" fill="currentColor"/></svg>',
 tri:'<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1.5 11 10.5H1z" fill="currentColor"/></svg>',
 ring:'<svg viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
 tick:'<svg class="tk" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
 chev:'<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
 x:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
 moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z"/></svg>',
 alert:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5 21.5 20h-19z"/><path d="M12 10v4.5M12 17.4v.1"/></svg>',
 cloud:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 18h10a4 4 0 0 0 .6-7.96A6 6 0 0 0 6.1 9.2 4.4 4.4 0 0 0 7 18z"/><path d="M4 4l16 16"/></svg>',
 plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
 star:'<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z"/></svg>'
};
ui.tab=ui.tab==="family"?"household":ui.tab==="house"?"home":ui.tab;ui.homeView=ui.homeView||"rooms";ui.schedView=ui.schedView||"upcoming";if(!["lists","money","cal","settings"].includes(ui.more))ui.more="lists";

function renderBase(){
 if(S.mode==="loading")return;
 if(S.mode==="welcome"){tabsEl.hidden=true;app.innerHTML=viewWelcome();softLayer();return}
 if(!myPid()&&Object.keys(D.people).length){tabsEl.hidden=true;app.innerHTML=viewWhoAmI();softLayer();return}
 const empty=!(D.house&&D.house.setupDone)&&!tasks().length;
 if(empty){tabsEl.hidden=true;app.innerHTML=viewSetup();softLayer();return}
 if(ui.kid){tabsEl.hidden=true;app.innerHTML=viewKid();softLayer();return}
 tabsEl.hidden=false;renderTabs();
 const v={today:viewToday,shift:viewShift,schedule:viewSchedule,household:viewHousehold,home:viewHome,more:viewMore2}[ui.tab]||viewToday;
 app.innerHTML=v();softLayer();
}
function renderTabs(){
 const u=unread()+Object.keys(D.approvals).length,cur=ui.tab==="shift"?"today":ui.tab;
 const t=[["today","Today",IC.today],["schedule","Schedule",IC.sched],["household","Household",IC.people],["home","Home",IC.home],["more","More",IC.more]];
 tabsEl.querySelector(".in").innerHTML=`<div class="brand">Upkeep</div>`+t.map(([id,l,ic])=>`<button data-tab="${id}" ${cur===id?'aria-current="page"':""}>${ic}<span>${l}</span>${id==="household"&&u?`<span class="badge" aria-label="${u} new">${u}</span>`:""}</button>`).join("");
}
/* ---------- Task rows ---------- */
const fmtMins=m=>{m=Math.round(m||0);if(m<60)return m+" min";const h=Math.floor(m/60),r=m%60;return h+" hr"+(r?" "+r+" min":"")};
function dueLabel(t){
 const st=status(t),d=daysBetween(today(),t.next);
 if(st==="late")return `<span class="due late">${IC.tri}${-d===1?"1 day late":-d+" days late"}</span>`;
 if(st==="today")return `<span class="due today">${IC.dot}Today</span>`;
 if(st==="soon")return `<span class="due soon">${IC.ring}${d===1?"Tomorrow":nice(t.next)}</span>`;
 return `<span class="due later">${nice(t.next)}</span>`;
}
function ownerTag(pid){
 if(!multiUser())return"";
 return pid?`<span class="who">${av(pid,18)}<span>${esc(pShort(pid))}</span></span>`:`<span class="who open"><span class="av-open" aria-hidden="true"></span><span>Up for grabs</span></span>`;
}
/* o.due: false hides the due label when the section already says when (Today, a dated group). Late is always shown. */
function taskRow(t,o){
 o=o&&typeof o==="object"?o:{};
 const open=ui.open[t.id],nc=commentsFor("task:"+t.id).length,st=status(t);
 const showDue=st==="late"||o.due!==false;
 const steps=(t.steps||[]).length?`<div class="steps"><button class="linkish" data-toggle="${t.id}" aria-expanded="${!!open}">${open?"Hide":"Show"} checklist · ${(t.stepsDone||[]).length} of ${t.steps.length}</button>${open?t.steps.map((s,i)=>`<label><input type="checkbox" data-step="${t.id}" data-i="${i}" ${(t.stepsDone||[]).includes(i)?"checked":""}><span>${esc(s)}</span></label>`).join(""):""}</div>`:"";
 const meta=[t.timeSet&&st!=="later"?`<span class="time">${t12(t.time)}</span>`:"",showDue?dueLabel(t):"",ownerTag(t.assignee),`<span>${esc(t.room)}</span>`,`<span>${fmtMins(t.mins)}</span>`,t.photoProof?"<span>Photo</span>":"",nc?`<span>${nc} comment${nc>1?"s":""}</span>`:""].join("");
 const acts=S.canWrite?`${!t.assignee&&multiUser()&&st!=="later"?`<button class="a-take" data-claim="${t.id}" tabindex="-1">Take it</button>`:""}<button class="a-tom" data-tomorrow="${t.id}" tabindex="-1">Tomorrow</button><button class="a-skip" data-skip="${t.id}" tabindex="-1">Skip</button>`:"";
 return `<div class="swipe" data-sw="${t.id}"><div class="acts" aria-hidden="true">${acts}</div>
 <div class="row task" data-row="${t.id}">
  <button class="main" data-edit="${t.id}" aria-haspopup="dialog"><span class="name">${esc(t.name)}</span><span class="meta">${meta}</span></button>
  <button class="check" data-done="${t.id}" aria-label="Complete ${esc(t.name)}" ${S.canWrite?"":"disabled"}><i>${IC.check}</i></button>
  ${steps}
 </div></div>`;
}
function whoSeg(){if(!multiUser())return"";return `<div class="filters" role="group" aria-label="Show tasks for">${[["all","Everyone"],["mine","Mine"],["open","Up for grabs"]].map(([v,l])=>`<button class="filter" data-who="${v}" aria-pressed="${ui.who===v}">${IC.tick}${l}</button>`).join("")}</div>`}
function listSection(title,list,o={}){
 if(!list.length)return"";
 return `<section class="group"${o.id?` id="${o.id}"`:""}><div class="group-head"><h2>${title}</h2>${o.stamp!==""?`<span class="stamp">${o.stamp||list.length}</span>`:""}</div><div class="list"${o.sort?` data-sort="${o.sort}"`:""}>${list.map(t=>taskRow(t,o)).join("")}</div></section>`;
}

/* ---------- Notices: errors, things waiting on you, household reminders ---------- */
function systemNotices(){
 let h="";
 if(S.note)h+=`<div class="notice ${/^Offline/.test(S.note)?"offline":"err"}" role="${/^Offline/.test(S.note)?"status":"alert"}">${/^Offline/.test(S.note)?IC.cloud:IC.alert}<span>${esc(S.note)}${S.ops.length?` ${S.ops.length} change${S.ops.length>1?"s":""} waiting.`:""}</span></div>`;
 else if(S.ops.length>3&&Date.now()-(S.lastFlush||Date.now())>20e3)h+=`<div class="notice offline" role="status">${IC.cloud}<span>Syncing ${S.ops.length} changes…</span></div>`;
 return h;
}
function actionNotices(){
 let h="";
 if(paused())h+=`<div class="banner">Away mode is on since ${nice(D.house.pause.from)}, so nothing is overdue. <button class="linkish" data-unpause="1">I'm back</button></div>`;
 const aps=!isKid(myPid())?Object.keys(D.approvals).length:0;
 if(aps)h+=`<div class="banner">${aps} kid check-off${aps>1?"s":""} waiting for your OK. <button class="linkish" data-tab="household">Review</button></div>`;
 nudgesForMe().slice(0,3).forEach(a=>{const t=D.tasks[a.ref.slice(5)];h+=`<div class="banner">${esc(actorName(a))} asked about <button class="linkish" data-edit="${esc(a.ref.slice(5))}">${esc(t?t.name:"a task")}</button></div>`});
 return h;
}
function houseNotices(){
 const gone=ME.dismissed||{};
 return Object.values(D.things).filter(x=>x.warranty&&daysBetween(today(),x.warranty)>=0&&daysBetween(today(),x.warranty)<=60&&!gone["warranty:"+x.id+":"+x.warranty]).map(x=>`<div class="banner quiet"><span>The ${esc(x.name)} warranty ends ${nice(x.warranty)}.</span><button class="x" data-dismiss="${esc("warranty:"+x.id+":"+x.warranty)}" aria-label="Dismiss the ${esc(x.name)} warranty reminder">${IC.x}</button></div>`).join("");
}
/* Kept for screens that still call it: only errors and things waiting on you, never household reminders. */
function banners(){const h=systemNotices()+actionNotices();return h?`<div class="notices">${h}</div>`:""}

/* ---------- Today: alerts, tonight, tasks, coming up, the rest ---------- */
function prepAlert(){
 const a=wxAlert();if(!a)return"";
 const st=(D.house&&D.house.prep&&D.house.prep[a.key])||[];if(st==="dismissed")return"";
 const items=PREP[a.kind],done=Array.isArray(st)?st:[];
 if(!ME.alerted||!ME.alerted[a.key]){ME.alerted=Object.assign({},ME.alerted||{},{[a.key]:1});ls.set("upkeep-me",ME);if(ME.notify&&document.hidden&&"Notification" in window&&Notification.permission==="granted"){try{navigator.serviceWorker?.ready.then(r=>r.showNotification("Upkeep",{body:a.title,icon:"/icon-192.png",tag:a.key}))}catch(e){}}}
 const open=ui.prepOpen&&a.key in ui.prepOpen?ui.prepOpen[a.key]:a.day<=1;
 const fin=done.length===items.length;
 return `<section class="callout alert" aria-labelledby="wx-t"><div class="c-body"><span class="c-kicker">${IC.alert}Get the house ready</span><h2 class="c-title" id="wx-t">${esc(a.title)}</h2>
 <span class="c-meta">${fin?"Every prep step is done.":`${done.length} of ${items.length} prep steps done`}</span>
 ${open?`<div class="steps">${items.map((x,i)=>`<label><input type="checkbox" data-prep="${a.key}" data-i="${i}" ${done.includes(i)?"checked":""}><span>${esc(x)}</span></label>`).join("")}</div>`:""}
 <div class="c-acts"><button class="linkish" data-prepopen="${a.key}" aria-expanded="${open}">${open?"Hide the prep list":"Show the prep list"}</button><button class="linkish quiet" data-prepdismiss="${a.key}">Not needed</button></div></div></section>`;
}
function tonightStrip(){
 const r=routines().find(routineRunsTonight);if(!r)return"";
 const done=r.items.filter(i=>D.checks[checkId(r.id,i.id)]).length,all=r.items.length,closed=all&&done===all;
 const mine=r.items.filter(i=>i.assignee===myPid()&&!D.checks[checkId(r.id,i.id)]).length;
 if(closed)return `<button class="callout shift closed" data-openroutine="${r.id}"><span class="c-body"><span class="c-kicker">${IC.moon}Tonight</span><span class="c-title">The house is closed for the night</span><span class="c-meta">${all} of ${all} done</span></span>${IC.chev}</button>`;
 return `<button class="callout shift" data-openroutine="${r.id}" aria-label="Open the ${esc(r.name)}, ${done} of ${all} done"><span class="c-body"><span class="c-kicker">${IC.moon}Tonight · ${t12(r.time)}</span><span class="c-title">${esc(r.name)}</span><span class="c-meta">${done} of ${all} done${mine?` · ${mine} ${mine>1?"are":"is"} yours`:""}</span><span class="meter" aria-hidden="true"><i style="width:${all?done/all*100:0}%"></i></span></span>${IC.chev}</button>`;
}
function seasonRow(){
 const {s,list,done}=seasonTasks();if(!list.length)return"";
 const fin=done.length===list.length;
 return `<button class="callout quiet" data-season="1"><span class="c-body"><span class="c-title">${s.name} checklist</span><span class="c-meta">${fin?"All done for the season":`${done.length} of ${list.length} done · through ${nice(s.end)}`}</span><span class="meter" aria-hidden="true"><i style="width:${done.length/list.length*100}%"></i></span></span>${IC.chev}</button>`;
}
function todayTasks(list){
 if(!list.length)return"";
 const ordered=[...list].sort((a,b)=>(a.ord??999)-(b.ord??999)||(a.timeSet&&b.timeSet?(a.time||"").localeCompare(b.time||""):(b.timeSet?1:0)-(a.timeSet?1:0))||a.name.localeCompare(b.name));
 const o={due:false,sort:"today"};
 if(!list.some(t=>t.timeSet))return listSection("Due today",ordered,o);
 const slot=t=>!t.timeSet?"any":+t.time.slice(0,2)<12?"am":+t.time.slice(0,2)<17?"pm":"eve";
 return listSection("Morning",ordered.filter(t=>slot(t)==="am"),o)+listSection("Afternoon",ordered.filter(t=>slot(t)==="pm"),o)+listSection("Evening",ordered.filter(t=>slot(t)==="eve"),o)+listSection("Anytime today",ordered.filter(t=>slot(t)==="any"),o);
}
function viewToday(){
 const ts=tasks().filter(passWho).sort((a,b)=>a.next.localeCompare(b.next)||a.name.localeCompare(b.name));
 const late=ts.filter(t=>status(t)==="late"),tod=ts.filter(t=>status(t)==="today"),soon=ts.filter(t=>status(t)==="soon");
 const doneToday=credited().filter(a=>a.kind==="task"&&ymd(new Date(a.at))===today()).length;
 const todo=[...late,...tod],mins=todo.reduce((a,t)=>a+(t.mins|0),0);
 const byWho={};todo.forEach(t=>{byWho[t.assignee||""]=(byWho[t.assignee||""]||0)+1});
 const me=myPid();
 const split=multiUser()&&ui.who==="all"?Object.entries(byWho).sort((a,b)=>(b[0]===me)-(a[0]===me)||b[1]-a[1]).map(([p,n])=>p?`${p===me?"you have":esc(pName(p))} ${n}`:`${n} up for grabs`).join(", "):"";
 const nextUp=ts.filter(t=>status(t)!=="late"&&status(t)!=="today")[0];
 const summary=todo.length?`<p class="summary"><b>${todo.length} to do</b>, about ${fmtMins(mins)}${late.length?`, ${late.length} carried over`:""}.${split?` <span>${split.charAt(0).toUpperCase()+split.slice(1)}.</span>`:""}</p>`:"";
 const caught=!todo.length?`<div class="caught"><span class="big">${ui.who==="mine"?"Nothing on you today.":ui.who==="open"?"Nothing up for grabs today.":"You're all caught up."}</span><span class="muted">${doneToday?`${doneToday} task${doneToday>1?"s":""} done today. `:""}${nextUp?`Next up: ${esc(nextUp.name)}, ${(daysBetween(today(),nextUp.next)===1?"tomorrow":nice(nextUp.next))}.`:"Nothing else is scheduled."}</span></div>`:"";
 const top=prepAlert()+tonightStrip();
 const coming=soon.length?`<section class="group"><div class="group-head"><h2>Coming up</h2><button class="linkish" data-tab="schedule">See the schedule</button></div><div class="list">${soon.slice(0,4).map(t=>taskRow(t)).join("")}</div>${soon.length>4?`<p class="more-note">${soon.length-4} more in the next 7 days</p>`:""}</section>`:"";
 const plan=`<section class="group"><div class="group-head"><h2>Have a few minutes?</h2></div><div class="chips">${[10,20,30,60].map(m=>`<button class="chip" data-plan="${m}" aria-pressed="${!!(ui.plan&&ui.plan.mins===m)}">${m<60?m+" min":"1 hour"}</button>`).join("")}</div>${ui.plan?`<div class="calbox">${planBlock()}</div>`:""}</section>`;
 const notes=houseNotices();
 const extra=`${seasonRow()}${coming}${plan}${notes?`<section class="group"><div class="group-head"><h2>Reminders</h2></div><div class="notices">${notes}</div></section>`:""}${kids().length?`<p class="foot-link"><button class="linkish" data-kidview="1">Open Kid view</button></p>`:""}`;
 return `<header class="top today-head"><div class="ttl"><h1>Today</h1><span class="date">${new Date().toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"})}</span></div>${whoSeg()}</header>
 ${summary}${systemNotices()}${actionNotices()?`<div class="notices">${actionNotices()}</div>`:""}
 <div class="today-grid">${top?`<div class="t-top">${top}</div>`:""}
 <div class="t-main">${caught}${listSection("Needs attention",late,{stamp:""})}${todayTasks(tod)}</div>
 <div class="t-side">${extra}</div></div>`;
}
function viewSchedule(){
 const seg=`<div class="seg" role="group" aria-label="View">${[["upcoming","Upcoming"],["seasonal","Seasonal"],["routines","Routines"]].map(([v,l])=>`<button data-sv="${v}" aria-pressed="${ui.schedView===v}">${l}</button>`).join("")}</div>`;
 let body="";
 if(ui.schedView==="upcoming"){
  const end=addDays(today(),30),ts=tasks().filter(t=>passWho(t)&&t.next<=end).sort((a,b)=>a.next.localeCompare(b.next));
  const by={};ts.forEach(t=>{const d=t.next<today()?today():t.next;(by[d]=by[d]||[]).push(t)});
  body=Object.keys(by).sort().map(d=>`<section class="group"><div class="group-head"><h2>${d===today()?"Today":nice(d)}</h2><span class="stamp">${by[d].reduce((a,t)=>a+(t.mins|0),0)} min</span></div><div class="list">${by[d].map(taskRow).join("")}</div></section>`).join("")||`<div class="empty"><strong>Nothing in the next 30 days.</strong>Add tasks from Home → Library.</div>`;
 }else if(ui.schedView==="seasonal"){
  const months=[...Array(12)].map((_,i)=>{const d=new Date();d.setDate(1);d.setMonth(d.getMonth()+i);return{y:d.getFullYear(),m:d.getMonth()}});
  const long=tasks().filter(t=>(t.months&&t.months.length)||t.unit==="year"||(t.unit==="month"&&t.every>=3));
  body=seasonBlock()+`<p class="lede" style="margin-top:0">The bigger jobs, month by month: seasonal maintenance, yearly service and everything that only comes around a few times a year.</p>`+months.map(({y,m})=>{const list=long.filter(t=>{const d=parse(t.next);return d.getFullYear()===y&&d.getMonth()===m}).sort((a,b)=>a.next.localeCompare(b.next));
   return list.length?`<section class="group"><div class="group-head"><h2>${new Date(y,m,1).toLocaleDateString(undefined,{month:"long",year:y!==new Date().getFullYear()?"numeric":undefined})}</h2><span class="stamp">${list.length} job${list.length>1?"s":""}</span></div><div class="list">${list.map(taskRow).join("")}</div></section>`:""}).join("");
 }else{
  body=`<div class="list">${routines().map(r=>{const done=r.items.filter(i=>D.checks[checkId(r.id,i.id)]).length;return `<button class="row" data-openroutine="${r.id}"><span class="main"><span class="name">${esc(r.name)}</span><span class="meta"><span>${t12(r.time)}</span><span>${(r.days||[]).length===7?"Every day":(r.days||[]).map(d=>DAYS[d].slice(0,3)).join(", ")}</span><span>${r.items.length} items</span>${routineRunsTonight(r)?`<span>${done} of ${r.items.length} done tonight</span>`:""}</span></span><span class="linkish">Open</span></button>`}).join("")||`<div class="empty"><strong>No routines yet.</strong>A closing shift is the short list everyone runs before bed.</div>`}</div>
  <div style="display:flex;gap:var(--s2);margin-top:var(--s4)">${routines().length?"":`<button class="btn primary" data-mkclosing="1">Start a closing shift</button>`}<button class="btn" data-newroutine="1">New routine</button></div>`;
 }
 return `<header class="top"><div><span class="eyebrow">${tasks().length} recurring tasks</span><h1>Schedule</h1></div>${ui.schedView==="routines"?"":whoSeg()}</header>${seg}<div style="height:var(--s5)"></div>${body}`;
}
function viewHome(){
 const seg=`<div class="seg" role="group" aria-label="Section">${[["rooms","Rooms"],["library","Library"],["things","Appliances"],["pros","Contractors"],["info","Home info"]].map(([v,l])=>`<button data-hv2="${v}" aria-pressed="${ui.homeView===v}">${l}</button>`).join("")}</div>`;
 let body="";
 if(ui.homeView==="rooms"){
  if(ui.roomOpen){
   const r=ui.roomOpen,ts=tasks().filter(t=>t.room===r).sort((a,b)=>a.next.localeCompare(b.next)),f=freshness(r);
   body=`<button class="linkish" data-roomopen="">← All rooms</button><section class="group" style="margin-top:var(--s4)"><div class="group-head"><h2>${esc(r)}</h2><span class="stamp">${f==null?"":Math.round(f*100)+"% fresh"}</span></div><div class="list">${ts.map(taskRow).join("")||`<div class="empty">No tasks here yet.</div>`}</div></section>${S.canWrite?`<button class="btn" data-new="1">New task</button>`:""}`;
  }else{
   const rooms=ROOMS.filter(r=>tasks().some(t=>t.room===r));
   body=`<p class="lede" style="margin-top:0">How each part of the house is doing. The bar empties as tasks come due.</p><div class="rooms">${rooms.map(r=>{const ts=tasks().filter(t=>t.room===r),f=freshness(r),due=ts.filter(t=>status(t)==="late"||status(t)==="today").length;
    return `<button class="room" data-roomopen="${esc(r)}"><b>${esc(r)}</b><span>${ts.length} task${ts.length>1?"s":""}${due?` · ${due} due`:""}</span><span class="progress fresh" style="margin:2px 0 0"><i style="width:${Math.round((f||0)*100)}%"></i></span></button>`}).join("")}</div>${S.canWrite?`<button class="btn" data-new="1">New task</button>`:""}`;
  }
 }else if(ui.homeView==="library"){
  const tags=tagsOf(D.house&&D.house.profile),have=new Set(tasks().map(t=>t.lib));
  const fitOnly=ui.libFit!==false;
  let items=LIB.filter(l=>(ui.libRoom==="All"||l.room===ui.libRoom)&&(!ui.q||l.name.toLowerCase().includes(ui.q.toLowerCase())));
  if(fitOnly)items=items.filter(l=>libFits(l,tags)&&!have.has(l.lib));
  const rooms=["All",...ROOMS.filter(r=>LIB.some(l=>l.room===r))];
  body=`<div class="toolbar"><input type="search" id="q" placeholder="Search the maintenance library" value="${esc(ui.q)}"><div class="seg"><button data-libfit="1" aria-pressed="${fitOnly}">Suggested for you</button><button data-libfit="0" aria-pressed="${!fitOnly}">Everything</button></div></div>
  <div class="chips">${rooms.map(r=>`<button class="chip" data-libroom="${esc(r)}" aria-pressed="${ui.libRoom===r}">${esc(r)}</button>`).join("")}</div>
  ${fitOnly&&items.length&&S.canWrite?`<p class="note" style="margin-bottom:var(--s3)">${items.length} tasks fit your home and aren't added yet. <button class="linkish" data-addall="1">Add all</button></p>`:""}
  <div class="list">${items.map(l=>`<div class="row"><div class="main"><span class="name">${esc(l.name)}</span><span class="meta"><span>${esc(l.room)}</span><span>${freqText(l)}</span><span>${l.mins} min</span>${l.steps.length?`<span>${l.steps.length}-step checklist</span>`:""}</span></div>${have.has(l.lib)?`<span class="pill">Added</span>`:`<button class="btn small" data-add="${l.lib}">Add</button>`}</div>`).join("")||`<div class="empty">${fitOnly?"Everything that fits your home is already added.":"Nothing matches."}</div>`}</div>`;
 }else body={things:moreThings,pros:morePros,info:moreInfo}[ui.homeView]();
 return `<header class="top"><div><span class="eyebrow">Maintenance and records</span><h1>Home</h1></div></header>${seg}<div style="height:var(--s5)"></div>${body}`;
}
function viewMore2(){
 const tabs=[["lists","Shopping"],["money","Shared costs"],["cal","Calendar"],["settings","Settings"]];
 const body={lists:moreLists,money:moreMoney,cal:moreCal,settings:moreSettings}[ui.more]();
 return `<header class="top"><div><span class="eyebrow">Upkeep</span><h1>${tabs.find(t=>t[0]===ui.more)[1]}</h1></div></header>${banners()}
 <div class="seg" role="group" style="margin-bottom:var(--s5)">${tabs.map(([k,l])=>`<button data-more="${k}" aria-pressed="${ui.more===k}">${l}</button>`).join("")}</div>${body}`;
}

/* ---------- Interaction: completion moment, swipe, haptics, kid chime ---------- */
const haptic=(ms=8)=>{try{navigator.vibrate&&navigator.vibrate(ms)}catch(e){}};
let audioCtx=null;
function chime(){
 if(ME.kidSound===false)return;
 try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();const t=audioCtx.currentTime;
  [660,880].forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type="sine";o.frequency.value=f;g.gain.setValueAtTime(0,t+i*.09);g.gain.linearRampToValueAtTime(.12,t+i*.09+.02);g.gain.exponentialRampToValueAtTime(.001,t+i*.09+.35);o.connect(g);g.connect(audioCtx.destination);o.start(t+i*.09);o.stop(t+i*.09+.4)})}catch(e){}
}
const reduced=()=>window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
function moveTomorrow(id){const t=D.tasks[id];if(!t)return;const prev=t.next;patch("tasks",id,{next:addDays(today(),1)});toast(`Moved to tomorrow`,()=>patch("tasks",id,{next:prev}))}
function skipOnce(id){const t=D.tasks[id];if(!t)return;const prev=t.next;const n=nextAfter(t,today());patch("tasks",id,{next:n});toast(`Skipped · next ${nice(n)}`,()=>patch("tasks",id,{next:prev}))}
document.addEventListener("click",e=>{
 const b=e.target.closest("button");if(!b)return;const ds=b.dataset;
 if(swipeState.blockClick){e.stopImmediatePropagation();e.preventDefault();swipeState.blockClick=false;return}
 if(ds.done){
  const t=D.tasks[ds.done];if(!t||!S.canWrite)return;
  e.stopImmediatePropagation();haptic(10);
  if(t.photoProof){startDone(ds.done);return}
  const row=b.closest(".row");if(row&&!reduced()){row.classList.add("completing");setTimeout(()=>row.classList.add("gone"),20)}
  setTimeout(()=>startDone(ds.done),reduced()?0:420);return;
 }
 if(ds.tick||ds.kidtick){haptic(10);if(ds.kidtick)chime();
  setTimeout(()=>{const r=routines().find(x=>x.id===ui.routine)||routines().find(routineRunsTonight);if(r){const all=r.items.length,done=r.items.filter(i=>D.checks[checkId(r.id,i.id)]).length;if(all&&done===all){haptic([12,60,12]);toast("That's the house closed for the night.")}}},60);return}
 if(ds.kiddone){haptic(10);chime();setTimeout(()=>{const s=document.querySelector(".kidstars");if(s){s.classList.remove("pop");void s.offsetWidth;s.classList.add("pop")}},80);return}
 if(ds.tomorrow){e.stopImmediatePropagation();if(ui.sheet)ui.sheet=null;moveTomorrow(ds.tomorrow);return}
 if(ds.skip){e.stopImmediatePropagation();if(ui.sheet)ui.sheet=null;skipOnce(ds.skip);return}
 if(ds.prepopen){e.stopImmediatePropagation();const a=wxAlert();ui.prepOpen=Object.assign({},ui.prepOpen||{},{[ds.prepopen]:!(ui.prepOpen&&ds.prepopen in ui.prepOpen?ui.prepOpen[ds.prepopen]:a&&a.day<=1)});render();return}
 if(ds.dismiss){e.stopImmediatePropagation();ME.dismissed=Object.assign({},ME.dismissed||{},{[ds.dismiss]:Date.now()});saveMe();return}
 if(ds.claim&&b.closest(".acts")){e.stopImmediatePropagation();closeSwipe();claim(ds.claim);return}
 if(ds.sv){e.stopImmediatePropagation();ui.schedView=ds.sv;render();return}
 if(ds.hv2){e.stopImmediatePropagation();ui.homeView=ds.hv2;ui.q="";ui.roomOpen=null;render();return}
 if(ds.roomopen!=null){e.stopImmediatePropagation();ui.roomOpen=ds.roomopen||null;render();window.scrollTo(0,0);return}
 if(ds.libfit){e.stopImmediatePropagation();ui.libFit=ds.libfit==="1";render();return}
 if(ds.openroutine){e.stopImmediatePropagation();ui.routine=ds.openroutine;ui.tab="shift";ui.editShift=false;render();window.scrollTo(0,0);return}
},true);
const actsWidth=row=>{const a=row.parentNode&&row.parentNode.querySelector(".acts");return a?a.offsetWidth:170};
const swipeState={el:null,x:0,y:0,dx:0,open:null,blockClick:false,moved:false};
function closeSwipe(){if(swipeState.open){swipeState.open.style.transform="";swipeState.open=null}}
document.addEventListener("pointerdown",e=>{
 const row=e.target.closest(".swipe > .row");if(!row||ui.arranging||e.pointerType==="mouse"&&e.button!==0)return;
 if(swipeState.open&&swipeState.open!==row)closeSwipe();
 Object.assign(swipeState,{el:row,x:e.clientX,y:e.clientY,dx:0,moved:false});
});
document.addEventListener("pointermove",e=>{
 const s=swipeState;if(!s.el)return;const dx=e.clientX-s.x,dy=e.clientY-s.y;
 if(!s.moved&&Math.abs(dy)>Math.abs(dx))return;
 if(Math.abs(dx)>8){s.moved=true}
 if(!s.moved)return;
 const w=actsWidth(s.el),base=s.open===s.el?-w:0;s.dx=Math.min(0,Math.max(-(w+20),base+dx));
 s.el.style.transition="none";s.el.style.transform=`translateX(${s.dx}px)`;
});
document.addEventListener("pointerup",()=>{
 const s=swipeState;if(!s.el)return;s.el.style.transition="";
 if(s.moved){s.blockClick=true;setTimeout(()=>s.blockClick=false,350);
  if(s.dx<-70){s.el.style.transform=`translateX(-${actsWidth(s.el)}px)`;s.open=s.el;haptic(6)}else{s.el.style.transform="";if(s.open===s.el)s.open=null}}
 s.el=null;
});
document.addEventListener("pointercancel",()=>{if(swipeState.el){swipeState.el.style.transform="";swipeState.el=null}});

/* Background re-renders (sync, polling) must not rebuild an open sheet, or typed input is lost. */
function toastHtml(){return ui.toast?`<div class="toast" role="status"><span>${esc(ui.toast.msg)}</span>${ui.toast.undo?'<button data-undo="1">Undo</button>':""}</div>`:""}
function renderToastOnly(){layer.querySelectorAll(".toast").forEach(x=>x.remove());if(ui.toast)layer.insertAdjacentHTML("beforeend",toastHtml())}
function softLayer(){if(ui.sheet&&layer._sheet===ui.sheet&&layer.querySelector(".sheet")){renderToastOnly();return}renderLayer()}
function toast(msg,undo){ui.toast={msg,undo};clearTimeout(toastTimer);toastTimer=setTimeout(()=>{ui.toast=null;renderToastOnly()},5500);renderToastOnly()}

function viewShift(){
 const rs=routines();
 if(!rs.length)return `<button class="linkish" data-tab="today">← Today</button><header class="top" style="margin-top:var(--s4)"><div><span class="eyebrow">Routines</span><h1>Closing shift</h1></div></header>${banners()}<div class="caught"><span class="big">No closing shift yet.</span><span class="muted">It's the short list the household runs before bed, each person with their own part.</span></div>${S.canWrite?`<div style="margin-top:var(--s4)"><button class="btn primary" data-mkclosing="1">Start a closing shift</button></div>`:""}`;
 if(!ui.routine||!D.routines[ui.routine])ui.routine=(rs.find(routineRunsTonight)||rs[0]).id;
 const r=D.routines[ui.routine],done=r.items.filter(i=>D.checks[checkId(r.id,i.id)]).length,all=r.items.length,closed=all&&done===all;
 const chips=`<div class="chips">${rs.map(x=>`<button class="chip" data-routine="${x.id}" aria-pressed="${x.id===r.id}">${esc(x.name)}</button>`).join("")}${S.canWrite?`<button class="chip" data-newroutine="1">New routine</button>`:""}</div>`;
 if(ui.editShift)return viewShiftEdit(r,chips);
 const me=myPid(),order=[...r.items].sort((a,b)=>(a.assignee===me?0:1)-(b.assignee===me?0:1));
 return `<button class="linkish" data-tab="today">← Today</button>
 <header class="top" style="margin-top:var(--s4)"><div><span class="eyebrow">${routineRunsTonight(r)?`Tonight · ${t12(r.time)}`:"Not scheduled tonight"}</span><h1>${closed?"Closed for the night":esc(r.name)}</h1></div>${S.canWrite?`<button class="btn small" data-editshift="1">Edit</button>`:""}</header>${banners()}
 ${rs.length>1?chips:""}
 <div class="progress"><i style="width:${all?done/all*100:0}%"></i></div>
 <p class="note" style="margin-bottom:var(--s4)">${done} of ${all} done${closed?". Nice work, everyone.":""} · Resets at 4 AM</p>
 <div class="list" data-sort="shift:${r.id}">${order.map(i=>{const c=D.checks[checkId(r.id,i.id)],nc=commentsFor("item:"+r.id+":"+i.id).length,pend=c&&Object.values(D.approvals).some(a=>a.ref===c.id);
  return `<div class="row task" data-row="${i.id}"><button class="main" data-item="${i.id}"><span class="name" ${c?'style="color:var(--ink-2)"':""}>${esc(i.text)}</span>
   ${i.standard&&!c?`<span class="std"><b>Done means:</b> ${esc(i.standard)}</span>`:""}
   <span class="meta">${c?`<span class="checked-by">${esc(pShort(c.who))} · ${clock(c.at)}${pend?" · waiting for OK":""}</span>`:""}${nc?`<span>${nc} comment${nc>1?"s":""}</span>`:""}</span></button>
   ${multiUser()?(i.assignee?`<span class="who">${av(i.assignee)}<span>${esc(pShort(i.assignee))}</span></span>`:`<span class="who">Anyone</span>`):"<span></span>"}
   <button class="check ${c?"done":""}" data-tick="${i.id}" aria-label="${c?"Undo":"Complete"} ${esc(i.text)}" aria-pressed="${!!c}"><i>${IC.check}</i></button></div>`}).join("")||`<div class="empty">No items yet. Tap Edit to add some.</div>`}</div>
 <section class="group" style="margin-top:var(--s6)"><div class="calbox"><b>Put it on your calendar</b><p class="note">One repeating event at ${t12(r.time)} with everyone's parts in the notes.</p>${calButtons("routine:"+r.id,routineAsEvent(r))}</div></section>`;
}
