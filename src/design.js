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
 chevd:'<svg class="chevd" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
 chev:'<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
 x:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
 moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z"/></svg>',
 alert:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5 21.5 20h-19z"/><path d="M12 10v4.5M12 17.4v.1"/></svg>',
 cloud:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 18h10a4 4 0 0 0 .6-7.96A6 6 0 0 0 6.1 9.2 4.4 4.4 0 0 0 7 18z"/><path d="M4 4l16 16"/></svg>',
 back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
 up:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
 down:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6"/></svg>',
 plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
 star:'<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z"/></svg>'
};
ui.tab=ui.tab==="family"?"household":ui.tab==="house"?"home":ui.tab;ui.homeView=ui.homeView||"rooms";ui.schedView=ui.schedView||"upcoming";if(!["lists","money","cal","settings"].includes(ui.more))ui.more="lists";

function renderBase(){
 if(S.mode==="loading")return;app.className="wrap narrow";
 if(S.mode==="welcome"){tabsEl.hidden=true;app.innerHTML=viewWelcome();softLayer();return}
 if(!myPid()&&Object.keys(D.people).length){tabsEl.hidden=true;app.innerHTML=viewWhoAmI();softLayer();return}
 const empty=!(D.house&&D.house.setupDone)&&!tasks().length;
 if(empty){tabsEl.hidden=true;app.innerHTML=viewSetup();softLayer();return}
 if(ui.kid){tabsEl.hidden=true;app.innerHTML=viewKid();softLayer();return}
 tabsEl.hidden=false;renderTabs();app.className="wrap "+(ui.tab==="today"||ui.tab==="home"?"wide":"narrow");
 const v={today:viewToday,shift:viewShift,schedule:viewSchedule,household:viewHousehold,home:viewHome,more:viewMore2}[ui.tab]||viewToday;
 app.innerHTML=v()+(ui.tab==="shift"?"":pageHelp());softLayer();
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
 return `<section class="group"${o.id?` id="${o.id}"`:""}><div class="group-head"><h2>${title}</h2><span class="gh-r">${o.sort&&list.length>1&&S.canWrite?`<button class="linkish" data-arrange="1">Reorder</button>`:""}${o.stamp!==""?`<span class="stamp">${o.stamp||list.length}</span>`:""}</span></div><div class="list"${o.sort?` data-sort="${o.sort}"`:""}>${list.map(t=>taskRow(t,o)).join("")}</div></section>`;
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
 ${systemNotices()}${summary}${actionNotices()?`<div class="notices">${actionNotices()}</div>`:""}
 <div class="today-grid">${top?`<div class="t-top">${top}</div>`:""}
 <div class="t-main">${caught}${listSection("Needs attention",late,{stamp:""})}${todayTasks(tod)}</div>
 <div class="t-side">${extra}</div></div>`;
}
/* ---------- Shared: sub-navigation (changes the view) and folding groups ---------- */
function subnav(label,items,cur,attr){
 return `<nav class="subnav" aria-label="${esc(label)}">${items.map(([v,l])=>`<button data-${attr}="${v}" ${cur===v?'aria-current="page"':""}>${l}</button>`).join("")}</nav>`;
}
function fold(id,title,stamp,inner,defOpen,preview,cls=""){
 const open=ui.folds&&id in ui.folds?ui.folds[id]:defOpen;
 return `<details class="fold ${cls}" id="g-${id}" data-fold="${id}" ${open?"open":""}><summary><span class="f-head"><span class="f-title">${title}</span>${preview&&!open?`<span class="f-prev">${preview}</span>`:""}</span><span class="stamp">${stamp}</span>${IC.chevd}</summary><div class="f-body">${open?inner():""}</div></details>`;
}
const preview=l=>{const n=l.slice(0,2).map(t=>esc(t.name)).join(", ");return l.length>2?`${n} and ${l.length-2} more`:n};
document.addEventListener("toggle",e=>{const d=e.target;if(!d||!d.dataset||!d.dataset.fold)return;const prev=ui.folds&&ui.folds[d.dataset.fold];ui.folds=Object.assign({},ui.folds||{},{[d.dataset.fold]:d.open});const fb=d.querySelector(":scope > .f-body");if(fb&&!!prev!==d.open&&(d.open?!fb.children.length:d.querySelector(".f-prev")===null)){const id=d.id;render();document.getElementById(id)?.querySelector("summary")?.focus({preventScroll:true})}},true);
function jumpTo(id){if(id!=="routines")ui.folds=Object.assign({},ui.folds||{},{[id]:true});render();const el=document.getElementById("g-"+id);if(el){el.scrollIntoView({block:"start",behavior:reduced()?"auto":"smooth"});el.querySelector("summary,h2")?.focus({preventScroll:true})}}

/* ---------- Schedule: the next two weeks open, later months folded, seasons by season ---------- */
const dayLabel=d=>{const n=daysBetween(today(),d);return n===1?"Tomorrow":parse(d).toLocaleDateString(undefined,{weekday:"long",month:"short",day:"numeric"})};
function byDay(list,openFirst){
 const g={};list.forEach(t=>(g[t.next]=g[t.next]||[]).push(t));
 return Object.keys(g).sort().map((k,i)=>fold("d"+k,dayLabel(k),`${g[k].length} · ${fmtMins(g[k].reduce((a,t)=>a+(t.mins|0),0))}`,()=>`<div class="list">${g[k].map(t=>taskRow(t,{due:false})).join("")}</div>`,openFirst&&i===0,preview(g[k]),"day")).join("");
}
function routinesSection(){
 const rs=routines();
 const rows=rs.map(r=>{const done=r.items.filter(i=>D.checks[checkId(r.id,i.id)]).length,days=r.days||[0,1,2,3,4,5,6];
  return `<button class="row link" data-openroutine="${r.id}"><span class="main"><span class="name">${esc(r.name)}</span><span class="meta"><span>${days.length===7?"Every night":days.map(d=>DAYS[d].slice(0,3)).join(", ")} at ${t12(r.time)}</span><span>${r.items.length} item${r.items.length===1?"":"s"}</span>${routineRunsTonight(r)?`<span>${done} of ${r.items.length} done tonight</span>`:""}</span></span>${IC.chev}</button>`}).join("");
 return `<section class="group" id="g-routines"><div class="group-head"><h2>Routines</h2>${S.canWrite&&rs.length?`<button class="linkish" data-newroutine="1">New routine</button>`:""}</div>
 ${rs.length?`<div class="list">${rows}</div>`:`<div class="empty"><strong>No routines yet.</strong>A closing shift is the short list everyone runs before bed.${S.canWrite?`<div class="btn-row"><button class="btn" data-mkclosing="1">Start a closing shift</button><button class="linkish" data-newroutine="1">New routine</button></div>`:""}</div>`}</section>`;
}
function viewSchedule(){
 if(ui.schedView==="routines")ui.schedView="upcoming";
 const nav=subnav("Schedule views",[["upcoming","Upcoming"],["seasonal","By season"]],ui.schedView,"sv");
 let body="",index=[];
 if(ui.schedView==="upcoming"){
  const t0=today(),w1=addDays(t0,7),w2=addDays(t0,14),y1=addDays(t0,366);
  const ts=tasks().filter(t=>passWho(t)&&t.next>t0&&t.next<=y1).sort((a,b)=>a.next.localeCompare(b.next)||a.name.localeCompare(b.name));
  const wk=ts.filter(t=>t.next<=w1),nx=ts.filter(t=>t.next>w1&&t.next<=w2),later=ts.filter(t=>t.next>w2);
  const mins=l=>fmtMins(l.reduce((a,t)=>a+(t.mins|0),0));
  const months={};later.forEach(t=>{const k=t.next.slice(0,7);(months[k]=months[k]||[]).push(t)});
  const thisMonth=t0.slice(0,7);
  const mName=k=>{const [y,m]=k.split("-").map(Number),d=new Date(y,m-1,1);const n=d.toLocaleDateString(undefined,{month:"long",year:y!==new Date().getFullYear()?"numeric":undefined});return k===thisMonth?`Later in ${d.toLocaleDateString(undefined,{month:"long"})}`:n};
  if(nx.length)index.push(["next","Week after"]);
  Object.keys(months).sort().forEach(k=>{const [y,m]=k.split("-").map(Number);index.push(["m"+k,new Date(y,m-1,1).toLocaleDateString(undefined,{month:"short"})+(y!==new Date().getFullYear()?" ’"+String(y).slice(2):"")])});
  index.push(["routines","Routines"]);
  body=`${ts.length?`<p class="summary">Next 7 days: <b>${wk.length} task${wk.length===1?"":"s"}</b>, about ${mins(wk)}. Today's tasks are on Today.</p>`:""}
  <nav class="jump" aria-label="Jump to"><span>Jump to</span>${index.map(([id,l])=>`<button data-jump="${id}">${esc(l)}</button>`).join("")}</nav>
  ${wk.length?`<section class="group" id="g-week"><div class="group-head"><h2>Next 7 days</h2><span class="stamp">${wk.length} · ${mins(wk)}</span></div>${byDay(wk,true)}</section>`:""}
  ${nx.length||Object.keys(months).length?`<section class="group"><div class="group-head"><h2>Later</h2></div>`:""}
  ${nx.length?fold("next","The week after",`${nx.length} · ${mins(nx)}`,()=>`<div class="list">${nx.map(t=>taskRow(t)).join("")}</div>`,false,preview(nx)):""}
  ${Object.keys(months).sort().map(k=>fold("m"+k,mName(k),`${months[k].length} task${months[k].length===1?"":"s"}`,()=>`<div class="list">${months[k].map(t=>taskRow(t)).join("")}</div>`,false,preview(months[k]))).join("")}
  ${nx.length||Object.keys(months).length?`</section>`:""}
  ${!ts.length?`<div class="empty"><strong>Nothing else on the schedule.</strong>Add tasks from Home → Library.</div>`:""}
  ${routinesSection()}`;
 }else{
  const cur=seasonNow(),order=[...Array(4)].map((_,i)=>SEASONS[(SEASONS.findIndex(s=>s[0]===cur.name)+i)%4]);
  const long=tasks().filter(t=>passWho(t)&&!(t.months&&t.months.length)&&(t.unit==="year"||(t.unit==="month"&&t.every>=3)));
  const y1=addDays(today(),366);
  body=`<p class="summary">Seasonal jobs and the bigger ones that come around once or a few times a year.</p>`+order.map(([name,ms],i)=>{
   const list=tasks().filter(t=>passWho(t)&&t.months&&t.months.some(m=>ms.includes(m)));
   const big=long.filter(t=>(i===0?t.next<=cur.end:t.next<=y1)&&ms.includes(parse(t.next).getMonth()+1));
   const all=[...list,...big];if(!all.length)return"";
   if(i===0){const st=seasonTasks();const left=st.left.filter(passWho),done=st.done.filter(passWho);
    return `<section class="group" id="g-s${name}"><div class="group-head"><h2>${name} checklist</h2><span class="stamp">${done.length} of ${list.length} done</span></div><p class="more-note">This season runs through ${nice(cur.end)}.</p><span class="meter wide" aria-hidden="true"><i style="width:${list.length?done.length/list.length*100:0}%"></i></span>${left.length?`<div class="list">${left.sort((a,b)=>a.next.localeCompare(b.next)).map(t=>taskRow(t)).join("")}</div>`:`<p class="caught-line">The ${name.toLowerCase()} checklist is done.</p>`}
    ${big.length?fold("sbig",`Other big jobs before ${nice(cur.end)}`,`${big.length}`,()=>`<div class="list">${big.sort((a,b)=>a.next.localeCompare(b.next)).map(t=>taskRow(t)).join("")}</div>`,false,preview(big)):""}
    ${done.length?fold("sdone","Done this season",`${done.length}`,()=>`<div class="list">${done.map(t=>`<div class="row"><span class="main"><span class="name done-name">${esc(t.name)}</span><span class="meta"><span class="checked-by">${IC.tick}Done ${nice(t.lastDone)}${t.lastBy?" · "+esc(pShort(t.lastBy)):""}</span></span></span><span></span></div>`).join("")}</div>`,false):""}</section>${order.length>1?`<div class="group-head next-seasons"><h2>Later seasons</h2></div>`:""}`}
   return fold("s"+name,name,`${all.length} task${all.length===1?"":"s"}`,()=>`<div class="list">${all.sort((a,b)=>a.next.localeCompare(b.next)).map(t=>taskRow(t)).join("")}</div>`,false,preview(all));
  }).join("");
 }
 return `<header class="top"><div class="ttl"><h1>Schedule</h1><span class="date">${tasks().length} recurring tasks</span></div></header>${nav}${whoSeg()?`<div class="filter-row">${whoSeg()}</div>`:""}${body}`;
}
/* ---------- Household: what's waiting on you, people and their share, invite, activity, kids ---------- */
function actDay(ms){const d=ymd(new Date(ms)),n=daysBetween(d,today());return n===0?"Today":n===1?"Yesterday":nice(d)}
function viewHousehold(){
 const me=myPid(),canApprove=!isKid(me),seen=ui.seenBefore??(ME.lastSeen||0);
 if(ui.tab==="household"&&ui.seenBefore==null&&!ui.tour){ui.seenBefore=ME.lastSeen||0;setTimeout(()=>{if(ui.tab==="household"){ME.lastSeen=Date.now();ls.set("upkeep-me",ME);renderTabs()}},1200)}
 const aps=Object.values(D.approvals).sort((a,b)=>a.at-b.at),ws=weekStats(),total=Object.values(ws).reduce((a,x)=>a+x.mins,0);
 const approvals=aps.length&&canApprove?`<section class="group"><div class="group-head"><h2>Waiting for your OK</h2><span class="stamp">${aps.length}</span></div><div class="list">${aps.map(a=>`<div class="row approve"><span class="main"><span class="name">${esc(pName(a.who))}: ${esc(a.label)}</span><span class="meta"><span>${a.kind==="reward"?`Wants this reward · ${a.pts} stars`:`${a.pts} star${a.pts>1?"s":""}`}</span><span>${ago(a.at)}</span></span>${a.photo?`<img src="${esc(photoUrl(a.photo))}" alt="Photo of ${esc(a.label)}" class="proof">`:""}</span><span class="row-acts"><button class="btn small" data-reject="${a.id}">${a.kind==="reward"?"Not now":"Redo"}</button><button class="btn small primary" data-approve="${a.id}">OK</button></span></div>`).join("")}</div></section>`:"";
 const ppl=`<section class="group"><div class="group-head"><h2>People</h2><span class="gh-r">${S.canWrite?`<button class="linkish" data-newperson="1">Add someone</button>`:""}<span class="stamp">This week</span></span></div>
 <div class="list">${people().map(p=>{const x=ws[p.id]||{pts:0,mins:0,n:0},sk=streakOf(p.id),share=total?Math.round(x.mins/total*100):0;
  return `<button class="row person" data-person="${p.id}"><span class="av-wrap">${av(p.id,32)}</span><span class="main"><span class="name">${esc(pName(p.id))}${p.id===me?" (you)":""}</span><span class="meta"><span>${p.role==="kid"?"Kid":"Adult"}</span><span>${x.n} done, ${fmtMins(x.mins)}</span>${sk>1?`<span>${sk}-day streak</span>`:""}${p.role==="kid"?`<span>${pointsOf(p.id)} ★</span>`:""}</span><span class="share"><span class="meter" aria-hidden="true"><i style="width:${share}%"></i></span><span class="pct">${share}%</span></span></span>${IC.chev}</button>`}).join("")}</div>
 <p class="more-note">The percentage is each person's share of the minutes done in the last 7 days.</p></section>`;
 const devs=(S.devices||[]).slice().sort((a,b)=>a.at-b.at);
 const invite=`<section class="group"><div class="group-head"><h2>Invite someone</h2></div>
 <p class="note">Send this link to adults in your house. They open it, pick their name and they're in. Kids don't need it; use Kid view on any family phone or tablet.</p>
 <div class="btn-row"><button class="btn primary small" data-invite="1">Share invite link</button><button class="btn small" data-copy="${esc(inviteLink())}">Copy link</button>${ui.confirmRotate?"":`<button class="linkish" data-rotate="1">Reset link</button>`}</div>
 ${ui.confirmRotate?`<div class="confirm" role="alert"><span>Make a new invite link? The old one stops working. Phones already in the house stay in.</span><button class="btn small danger" data-rotate="2">Make new link</button><button class="btn small" data-rotate="0">Cancel</button></div>`:""}
 ${devs.length?fold("phones","Phones in this house",`${devs.length}`,()=>`<div class="list">${devs.map(d=>`<div class="row"><span class="main"><span class="name">${esc(d.label)}</span><span class="meta"><span>Joined ${new Date(d.at).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}</span></span></span>${d.id===S.deviceId?`<span class="added">This phone</span>`:ui.confirmRevoke===d.id?`<span class="confirm"><button class="btn small danger" data-revoke="${d.id}">Remove</button><button class="btn small" data-revoke="">Keep</button></span>`:`<button class="linkish" data-askrevoke="${d.id}">Remove</button>`}</div>`).join("")}</div><p class="more-note">Removing a phone signs it out of the house. Its person and history stay.</p>`,false):""}</section>`;
 const acts=Object.values(D.activity).filter(a=>!ui.histWho||a.who===ui.histWho||a.actor===ui.histWho).sort((a,b)=>b.at-a.at);
 const lim=ui.actLimit||25,shown=acts.slice(0,lim),newN=acts.filter(a=>a.by!==S.uid&&a.at>seen).length;
 const byDay=[];shown.forEach(a=>{const k=actDay(a.at);let g=byDay.find(x=>x.k===k);if(!g)byDay.push(g={k,list:[]});g.list.push(a)});
 const activity=`<section class="group"><div class="group-head"><h2>Activity</h2><label class="inline-select"><span class="sr">Show activity for</span><select id="histwho">${[["","Everyone"],...people().map(p=>[p.id,pName(p.id)])].map(([v,l])=>`<option value="${v}" ${ui.histWho===v?"selected":""}>${esc(l)}</option>`).join("")}</select></label></div>
 ${newN?`<p class="more-note">${newN} new since you last looked.</p>`:""}
 ${byDay.length?byDay.map(g=>`<h3 class="day">${g.k}<span>${g.list.filter(a=>a.kind==="task"||a.kind==="check").length?g.list.filter(a=>a.kind==="task"||a.kind==="check").length+" done":""}</span></h3><div class="feed">${g.list.map(a=>{const nw=a.by!==S.uid&&a.at>seen;return `<div class="ev${nw?" new":""}">${av(a.who||a.actor||"",24)}<span><b>${esc(actorName(a))}</b> ${esc(a.text)}${a.photo?` <a class="linkish" href="${esc(photoUrl(a.photo))}" target="_blank" rel="noopener">Photo</a>`:""}${nw?` <span class="new-tag">New</span>`:""}</span><span class="stamp">${clock(a.at)}</span></div>`}).join("")}</div>`).join(""):`<div class="empty">When anyone finishes something or comments, it shows up here.</div>`}
 ${acts.length>lim?`<button class="btn small" data-actmore="1">Show more</button>`:""}</section>`;
 const ms=milestonesBlock();
 return `<header class="top"><div class="ttl"><h1>Household</h1><span class="date">${people().length} ${people().length===1?"person":"people"}</span></div>${kids().length?`<button class="btn small" data-kidview="1">Open Kid view</button>`:""}</header>
 ${banners()}${approvals}${ppl}${invite}${activity}${ms}
 <section class="group"><div class="group-head"><h2>Kids, stars and rewards</h2></div>${moreKids()}</section>`;
}

/* ---------- Kid view: big cards with a clear done button, simple words, stars ---------- */
function viewKid(){
 const k=ui.kid==="pick"?null:D.people[ui.kid];
 if(!k)return `<header class="top kid-head"><div class="ttl"><h1>Who's helping today?</h1></div><button class="btn small" data-exitkid="1">Exit kid view</button></header>
  <div class="kidpick">${kids().map(p=>`<button data-kidpick="${p.id}">${av(p.id,64)}<b>${esc(pName(p.id))}</b><span>${pointsOf(p.id)} stars</span></button>`).join("")||`<div class="empty">Add a kid under Household → People first.</div>`}</div>`;
 const mine=tasks().filter(t=>t.assignee===k.id&&(status(t)==="today"||status(t)==="late"));
 const r=routines().find(routineRunsTonight),items=r?r.items.filter(i=>i.assignee===k.id):[];
 const doneToday=Object.values(D.activity).filter(a=>a.kind==="task"&&a.who===k.id&&ymd(new Date(a.at))===today()).sort((a,b)=>a.at-b.at);
 const rewards=Object.values(D.rewards).sort((a,b)=>a.cost-b.cost),pts=pointsOf(k.id),cpp=(D.house&&D.house.centsPerPoint)|0,sk=streakOf(k.id);
 const openItems=items.filter(i=>!D.checks[checkId(r.id,i.id)]),allDone=!mine.length&&!openItems.length;
 const card=(attr,title,std,stars,tag,done,note)=>`<button class="kidcard ${done?"done":""}" ${attr} ${done?"disabled":""} aria-label="${esc(title)}${done?", done":`, ${stars} star${stars>1?"s":""}. Tap when it's done.`}"><span class="k-text">${tag?`<span class="k-tag">${tag}</span>`:""}<b>${esc(title)}</b>${std?`<span class="k-std">${esc(std)}</span>`:""}<span class="k-stars">${done?esc(note||"Done!"):`${IC.star}${stars}`}</span></span><span class="k-check" aria-hidden="true">${IC.check}</span></button>`;
 return `<header class="top kid-head"><div class="ttl"><h1>Hi, ${esc(pName(k.id))}</h1></div><button class="btn small" data-exitkid="1">Exit kid view</button></header>
 <div class="kidstars">${IC.star}<b>${pts}</b><span>stars${cpp?` · ${money(pts*cpp)}`:""}${sk>1?` · ${sk} days in a row`:""}</span></div>
 ${allDone?`<div class="kid-done"><span class="k-check big" aria-hidden="true">${IC.check}</span><b>All done for today!</b><span>Nice work. Go have fun.</span></div>`:`<h2 class="kid-h">Your jobs today</h2>`}
 <div class="kidgrid">
 ${mine.map(t=>card(`data-kiddone="${t.id}"`,t.name,t.standard,ptsFor(t.mins),t.photoProof?"Take a photo":"",false)).join("")}
 ${items.map(i=>{const c=D.checks[checkId(r.id,i.id)];return card(`data-kidtick="${i.id}"`,i.text,c?"":i.standard,1,"Tonight",!!c,c&&Object.values(D.approvals).some(a=>a.ref===c.id)?"Done! Waiting for a grown-up":"Done!")}).join("")}
 ${doneToday.map(a=>card("",(D.tasks[(a.ref||"").slice(5)]||{}).name||a.text,"",a.pts||1,"",true,a.pending?"Done! Waiting for a grown-up":"Done!")).join("")}
 </div>
 ${rewards.length?`<section class="group kid-rewards"><h2 class="kid-h">Rewards</h2><div class="list">${rewards.map(w=>`<div class="row"><span class="main"><span class="name">${esc(w.name)}</span><span class="meta"><span>${w.cost} stars</span></span></span><button class="btn ${pts>=w.cost?"primary":""}" data-redeem="${w.id}" ${pts>=w.cost?"":"disabled"}>${pts>=w.cost?"Ask for it":`${w.cost-pts} more stars`}</button></div>`).join("")}</div></section>`:""}`;
}

/* ---------- Home: rooms first, then records; each record type is its own page ---------- */
function roomStatus(r){
 const ts=tasks().filter(t=>t.room===r),late=ts.filter(t=>status(t)==="late").length,due=ts.filter(t=>status(t)==="today").length,soon=ts.filter(t=>status(t)==="soon").length;
 if(late)return `<span class="r-st late">${IC.tri}${late} late${due?` · ${due} due today`:""}</span>`;
 if(due)return `<span class="r-st today">${IC.dot}${due} due today</span>`;
 return `<span class="r-st ok">${IC.tick}Nothing due</span>`;
}
function viewHome(){
 const v=ui.homeView==="rooms"?"":ui.homeView;
 const back=`<button class="back linkish" data-hv2="rooms">${IC.back}Home</button>`;
 const newBtn=room=>S.canWrite?`<button class="btn small" data-new="1"${room?` data-room-new="${esc(room)}"`:""}>${IC.plus}New task</button>`:"";
 if(!v&&ui.roomOpen){
  const r=ui.roomOpen,ts=tasks().filter(t=>t.room===r).sort((a,b)=>a.next.localeCompare(b.next));
  return `${back}<header class="top"><div class="ttl"><h1>${esc(r)}</h1><span class="date">${ts.length} task${ts.length===1?"":"s"}</span></div>${newBtn(r)}</header><p class="summary">${roomStatus(r)}</p><div class="list">${ts.map(t=>taskRow(t)).join("")||`<div class="empty">No tasks here yet.</div>`}</div>`;
 }
 if(!v){
  const rooms=ROOMS.filter(r=>tasks().some(t=>t.room===r));
  const tags=tagsOf(D.house&&D.house.profile),have=new Set(tasks().map(t=>t.lib)),fit=LIB.filter(l=>libFits(l,tags)&&!have.has(l.lib)).length;
  const rec=[["library","Task library",fit?`${fit} suggested for your home`:`${LIB.length} tasks to choose from`],["things","Appliances",`${Object.keys(D.things).length} saved`],["pros","Contractors",`${Object.keys(D.pros).length} saved`],["info","Home info",`${Object.keys(D.info).length} saved`]];
  return `<header class="top"><div class="ttl"><h1>Home</h1><span class="date">${tasks().length} tasks across ${rooms.length} rooms</span></div>${newBtn("")}</header>
  <div class="rooms">${rooms.map(r=>{const n=tasks().filter(t=>t.room===r).length;return `<button class="room" data-roomopen="${esc(r)}"><b>${esc(r)}</b>${roomStatus(r)}<span class="r-n">${n} task${n>1?"s":""}</span></button>`}).join("")||`<div class="empty">No tasks yet. Add some from the task library.</div>`}</div>
  <section class="group"><div class="group-head"><h2>Records</h2></div><div class="list">${rec.map(([k,l,m])=>`<button class="row link" data-hv2="${k}"><span class="main"><span class="name">${l}</span><span class="meta"><span>${m}</span></span></span>${IC.chev}</button>`).join("")}</div></section>`;
 }
 const titles={library:"Task library",things:"Appliances",pros:"Contractors",info:"Home info"};
 let body="";
 if(v==="library"){
  const tags=tagsOf(D.house&&D.house.profile),have=new Set(tasks().map(t=>t.lib));
  const fitOnly=ui.libFit!==false;
  let items=LIB.filter(l=>(ui.libRoom==="All"||l.room===ui.libRoom)&&(!ui.q||l.name.toLowerCase().includes(ui.q.toLowerCase())));
  if(fitOnly)items=items.filter(l=>libFits(l,tags)&&!have.has(l.lib));
  const rooms=["All",...ROOMS.filter(r=>LIB.some(l=>l.room===r))];
  body=`<input type="search" id="q" placeholder="Search, e.g. gutters or dryer vent" value="${esc(ui.q)}" aria-label="Search the task library">
  <div class="lib-tools"><div class="filters" role="group" aria-label="Show"><button class="filter" data-libfit="1" aria-pressed="${fitOnly}">${IC.tick}Suggested</button><button class="filter" data-libfit="0" aria-pressed="${!fitOnly}">${IC.tick}Everything</button></div>
  <label class="inline-select"><span>Room</span><select id="libroom">${rooms.map(r=>`<option value="${esc(r)}" ${ui.libRoom===r?"selected":""}>${r==="All"?"All rooms":esc(r)}</option>`).join("")}</select></label></div>
  ${fitOnly&&items.length&&S.canWrite?`<p class="summary">${items.length} task${items.length===1?"":"s"} fit your home and aren't added yet. <button class="linkish" data-addall="1">Add all ${items.length}</button></p>`:""}
  <div class="list">${items.map(l=>`<div class="row"><div class="main"><span class="name">${esc(l.name)}</span><span class="meta"><span>${esc(l.room)}</span><span>${freqText(l)}</span><span>${fmtMins(l.mins)}</span>${l.steps.length?`<span>${l.steps.length} steps</span>`:""}</span></div>${have.has(l.lib)?`<span class="added">${IC.tick}Added</span>`:S.canWrite?`<button class="btn small" data-add="${l.lib}" aria-label="Add ${esc(l.name)}">Add</button>`:""}</div>`).join("")||`<div class="empty">${fitOnly?"Everything that fits your home is already added.":"Nothing matches."}</div>`}</div>`;
 }else body={things:moreThings,pros:morePros,info:moreInfo}[v]();
 return `${back}<header class="top"><div class="ttl"><h1>${titles[v]}</h1></div></header>${body}`;
}
function viewMore2(){
 const tabs=[["lists","Shopping"],["money","Costs"],["cal","Calendar"],["settings","Settings"]];
 const body={lists:moreLists,money:moreMoney,cal:moreCal,settings:moreSettings}[ui.more]();
 return `<header class="top"><div class="ttl"><h1>${{lists:"Shopping",money:"Shared costs",cal:"Calendar",settings:"Settings"}[ui.more]}</h1></div></header>${systemNotices()}${subnav("More",tabs,ui.more,"more")}${body}`;
}

/* ---------- Interaction: completion moment, swipe, haptics, kid chime ---------- */
const haptic=(ms=8)=>{try{navigator.vibrate&&navigator.vibrate(ms)}catch(e){}};
let audioCtx=null;
function chime(){
 if(ME.kidSound===false)return;
 try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();const t=audioCtx.currentTime;
  [660,880].forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type="sine";o.frequency.value=f;g.gain.setValueAtTime(0,t+i*.09);g.gain.linearRampToValueAtTime(.12,t+i*.09+.02);g.gain.exponentialRampToValueAtTime(.001,t+i*.09+.35);o.connect(g);g.connect(audioCtx.destination);o.start(t+i*.09);o.stop(t+i*.09+.4)})}catch(e){}
}
const reduced=()=>ME.motion==="reduce"||!!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches);
function moveTomorrow(id){const t=D.tasks[id];if(!t)return;const prev=t.next;patch("tasks",id,{next:addDays(today(),1)});toast(`Moved to tomorrow`,()=>patch("tasks",id,{next:prev}))}
function skipOnce(id){const t=D.tasks[id];if(!t)return;const prev=t.next;const n=nextAfter(t,today());patch("tasks",id,{next:n});toast(`Skipped · next ${nice(n)}`,()=>patch("tasks",id,{next:prev}))}
document.addEventListener("click",e=>{
 const b=e.target.closest("button");if(!b)return;const ds=b.dataset;
 if(swipeState.blockClick){e.stopImmediatePropagation();e.preventDefault();swipeState.blockClick=false;return}
 if(ds.done&&!b.closest(".sheet")){
  const t=D.tasks[ds.done];if(!t||!S.canWrite)return;
  e.stopImmediatePropagation();haptic(10);
  if(t.photoProof){startDone(ds.done);return}
  const row=b.closest(".row");if(row&&!reduced()){row.classList.add("completing");setTimeout(()=>row.classList.add("gone"),20)}
  setTimeout(()=>startDone(ds.done),reduced()?0:420);return;
 }
 if(ds.tick||ds.kidtick){haptic(10);if(ds.kidtick)chime();
  setTimeout(()=>{const r=routines().find(x=>x.id===ui.routine)||routines().find(routineRunsTonight);if(r){const all=r.items.length,done=r.items.filter(i=>D.checks[checkId(r.id,i.id)]).length;if(all&&done===all){haptic([12,60,12]);toast("That's the house closed for the night.")}}},60);return}
 if(ds.kiddone){haptic(10);chime();setTimeout(()=>{const s=document.querySelector(".kidstars");if(s){s.classList.remove("pop");void s.offsetWidth;s.classList.add("pop")}},80);return}
 if(ds.done&&b.closest(".sheet")){e.stopImmediatePropagation();const id=ds.done;ui.sheet=null;renderLayer();startDone(id);return}
 if(ds.claim&&b.closest(".sheet")){e.stopImmediatePropagation();claim(ds.claim);if(ui.sheet&&ui.sheet.draft)ui.sheet.draft.assignee=myPid();renderLayer();toast("It's yours now");return}
 if(ds.editmode){e.stopImmediatePropagation();ui.sheet.mode="edit";renderLayer();return}
 if(ds.viewmode){e.stopImmediatePropagation();openTask(ui.sheet.id,"view");return}
 if(ds.tomorrow){e.stopImmediatePropagation();if(ui.sheet)ui.sheet=null;moveTomorrow(ds.tomorrow);return}
 if(ds.skip){e.stopImmediatePropagation();if(ui.sheet)ui.sheet=null;skipOnce(ds.skip);return}
 if(ds.prepopen){e.stopImmediatePropagation();const a=wxAlert();ui.prepOpen=Object.assign({},ui.prepOpen||{},{[ds.prepopen]:!(ui.prepOpen&&ds.prepopen in ui.prepOpen?ui.prepOpen[ds.prepopen]:a&&a.day<=1)});render();return}
 if(ds.dismiss){e.stopImmediatePropagation();ME.dismissed=Object.assign({},ME.dismissed||{},{[ds.dismiss]:Date.now()});saveMe();return}
 if(ds.claim&&b.closest(".acts")){e.stopImmediatePropagation();closeSwipe();claim(ds.claim);return}
 if(ds.actmore){e.stopImmediatePropagation();ui.actLimit=(ui.actLimit||25)+50;render();return}
 if(ds.more&&b.closest(".set-row")){e.stopImmediatePropagation();ui.more=ds.more;render();window.scrollTo(0,0);return}
 if(ds.toastx){e.stopImmediatePropagation();clearTimeout(toastTimer);nextToast();return}
 if(ds.jump){e.stopImmediatePropagation();jumpTo(ds.jump);return}
 if(ds.sv){e.stopImmediatePropagation();ui.schedView=ds.sv;render();return}
 if(ds.hv2){e.stopImmediatePropagation();ui.homeView=ds.hv2;ui.q="";ui.roomOpen=null;render();window.scrollTo(0,0);if(ds.hv2!=="rooms")document.querySelector("h1")?.setAttribute("tabindex","-1"),document.querySelector("h1")?.focus({preventScroll:true});return}
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
/* Feedback: one slot over the tab bar (top of the screen when a sheet or Kid view is open).
   Undo has priority; notices about what others did wait their turn and never replace an Undo. */
function toastHtml(){
 const t=ui.toast;if(!t)return"";
 const top=!!(ui.sheet||ui.kid||tabsEl.hidden);
 return `<div class="toasts${top?" top":""}"><div class="toast${t.kind==="notice"?" notice":""}" role="status" aria-live="polite"><span>${esc(t.msg)}</span>${t.undo?'<button data-undo="1">Undo</button>':""}<button class="t-x" data-toastx="1" aria-label="Dismiss">${IC.x}</button></div></div>`;
}
function renderToastOnly(){layer.querySelectorAll(".toasts").forEach(x=>x.remove());if(ui.toast)layer.insertAdjacentHTML("beforeend",toastHtml())}
function softLayer(){if(ui.sheet&&layer._sheet===ui.sheet&&layer.querySelector(".sheet")){renderToastOnly();return}renderLayer()}
const noticeQ=[];
function nextToast(){ui.toast=null;if(noticeQ.length){const n=noticeQ.shift();showToast(n.msg,null,"notice")}else renderToastOnly()}
function showToast(msg,undo,kind){if(ui.tour)return;ui.toast={msg,undo,kind};clearTimeout(toastTimer);toastTimer=setTimeout(nextToast,undo?6500:kind==="notice"?4500:3500);renderToastOnly()}
function toast(msg,undo){showToast(msg,undo,"action")}
function notify(msg){if(ui.kid)return;if(ui.toast&&ui.toast.undo){if(noticeQ.length<3)noticeQ.push({msg});return}showToast(msg,null,"notice")}

function viewShift(){
 const rs=routines(),back=`<button class="back linkish" data-tab="today">${IC.back}Today</button>`;
 if(!rs.length)return `${back}<header class="top"><div class="ttl"><h1>Closing shift</h1></div></header>${systemNotices()}<div class="empty"><strong>No closing shift yet.</strong>It's the short list the household runs before bed, each person with their own part.</div>${S.canWrite?`<button class="btn primary" data-mkclosing="1">Start a closing shift</button>`:""}`;
 if(!ui.routine||!D.routines[ui.routine])ui.routine=(rs.find(routineRunsTonight)||rs[0]).id;
 const r=D.routines[ui.routine],done=r.items.filter(i=>D.checks[checkId(r.id,i.id)]).length,all=r.items.length,closed=all&&done===all;
 const chips=rs.length>1?subnav("Routines",rs.map(x=>[x.id,esc(x.name)]),r.id,"routine"):"";
 if(ui.editShift)return viewShiftEdit(r);
 const me=myPid(),order=[...r.items].sort((a,b)=>(a.assignee===me?0:1)-(b.assignee===me?0:1));
 return `${back}<header class="top"><div class="ttl"><h1>${closed?"Closed for the night":esc(r.name)}</h1><span class="date">${routineRunsTonight(r)?`Tonight at ${t12(r.time)}`:"Not scheduled tonight"}</span></div>${S.canWrite?`<button class="btn small" data-editshift="1">Edit</button>`:""}</header>${systemNotices()}
 ${chips}
 <div class="shift-progress"><span class="meter wide" aria-hidden="true"><i style="width:${all?done/all*100:0}%"></i></span><p class="note">${done} of ${all} done${closed?". Nice work, everyone.":""} · Resets at 4 AM</p></div>
 <section class="group"><div class="group-head"><h2>Tonight's list</h2><span class="gh-r">${all>1&&S.canWrite?`<button class="linkish" data-arrange="1">Reorder</button>`:""}</span></div>
 <div class="list" data-sort="shift:${r.id}">${order.map(i=>{const c=D.checks[checkId(r.id,i.id)],nc=commentsFor("item:"+r.id+":"+i.id).length,pend=c&&Object.values(D.approvals).some(a=>a.ref===c.id);
  return `<div class="row task" data-row="${i.id}"><button class="main" data-item="${i.id}" aria-haspopup="dialog"><span class="name${c?" done-name":""}">${esc(i.text)}</span>
   ${i.standard&&!c?`<span class="std"><b>Done means</b> ${esc(i.standard)}</span>`:""}
   <span class="meta">${c?`<span class="checked-by">${IC.tick}${esc(pShort(c.who))} at ${clock(c.at)}${pend?", waiting for an OK":""}</span>`:ownerTag(i.assignee)}${nc?`<span>${nc} comment${nc>1?"s":""}</span>`:""}</span></button>
   <button class="check ${c?"done":""}" data-tick="${i.id}" aria-label="${c?"Undo":"Complete"} ${esc(i.text)}" aria-pressed="${!!c}" ${S.canWrite?"":"disabled"}><i>${IC.check}</i></button></div>`}).join("")||`<div class="empty"><strong>No items yet.</strong>Tap Edit to add some.</div>`}</div></section>
 <section class="group"><div class="t-sec"><h3>Put it on your calendar</h3><p class="note">One repeating event at ${t12(r.time)} with everyone's parts in the notes.</p>${calButtons("routine:"+r.id,routineAsEvent(r))}</div></section>`;
}

/* ---------- Task sheet: read first, edit on request ---------- */
function sheetShell(label,head,body,foot,cls=""){
 return `<div class="scrim" data-close="1"></div><div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(label)}"><div class="panel split ${cls}">
 <div class="sheet-head">${head}<button class="icon-btn" data-close="1" aria-label="Close">${IC.x}</button></div>
 <div class="sheet-body">${body}</div>${foot?`<div class="sheet-foot">${foot}</div>`:""}</div></div>`;
}
function whenText(t){
 const st=status(t),d=daysBetween(today(),t.next);
 if(st==="late")return `<span class="due late">${IC.tri}${-d===1?"1 day late":-d+" days late"}</span>`;
 if(st==="today")return `<span class="due today">${IC.dot}Due today${t.timeSet?" at "+t12(t.time):""}</span>`;
 if(st==="soon")return `<span class="due soon">${IC.ring}Due ${d===1?"tomorrow":nice(t.next)}${t.timeSet?" at "+t12(t.time):""}</span>`;
 return `<span class="due later">Next ${nice(t.next)}</span>`;
}
function taskView(s){
 const t=D.tasks[s.id]||s.draft,id=s.id,st=status(t),me=myPid();
 const rot=t.rotate&&t.rotate.length>1?`Takes turns: ${t.rotate.map(p=>esc(pShort(p))).join(", ")}`:"";
 const owner=!multiUser()?"":t.assignee?`<span class="who">${av(t.assignee,22)}<span>${t.assignee===me?"Your job":esc(pName(t.assignee))+"'s job"}</span></span>${t.assignee!==me&&S.canWrite&&st!=="later"?`<button class="linkish" data-nudge="${id}">Nudge ${esc(pName(t.assignee))}</button>`:""}`:`<span class="who open"><span class="av-open" aria-hidden="true"></span><span>Up for grabs</span></span>`;
 const hist=Object.values(D.activity).filter(a=>a.kind==="task"&&a.ref==="task:"+id).sort((a,b)=>b.at-a.at).slice(0,3);
 const body=`<p class="t-when">${whenText(t)}${S.canWrite&&st!=="later"?`<span class="t-move"><button class="linkish" data-tomorrow="${id}">Move to tomorrow</button><button class="linkish" data-skip="${id}">Skip this time</button></span>`:""}</p>
 <p class="t-facts">${esc(freqText(t))} · about ${fmtMins(t.mins)} · ${esc(t.room)}</p>
 ${owner?`<p class="t-owner">${owner}</p>`:""}${rot?`<p class="t-facts">${rot}</p>`:""}
 ${t.standard?`<div class="std-box"><b>Done means</b><p>${esc(t.standard)}</p></div>`:""}
 ${(t.steps||[]).length?`<div class="t-sec"><h3>Steps</h3><div class="steps">${t.steps.map((x,i)=>`<label><input type="checkbox" data-step="${id}" data-i="${i}" ${(t.stepsDone||[]).includes(i)?"checked":""} ${S.canWrite?"":"disabled"}><span>${esc(x)}</span></label>`).join("")}</div></div>`:""}
 ${t.notes?`<div class="t-sec"><h3>Notes</h3><p>${esc(t.notes)}</p></div>`:""}
 ${t.photoProof?`<p class="t-facts">Needs a photo when it's done.</p>`:""}
 ${commentBlock("task:"+id,t.name)}
 <div class="t-sec"><h3>History</h3>${hist.length?`<ul class="hist">${hist.map(a=>`<li>${esc(pShort(a.who))} finished it ${nice(ymd(new Date(a.at)))}</li>`).join("")}</ul>`:`<p class="muted">Not done yet in Upkeep.</p>`}</div>
 <div class="t-sec"><h3>Calendar</h3>${calButtons("task:"+id,t)}</div>`;
 const foot=S.canWrite?`<button class="btn primary" data-done="${id}">${IC.tick}Complete</button>${multiUser()&&!t.assignee&&st!=="later"?`<button class="btn" data-claim="${id}">Take it</button>`:""}<button class="btn text push" data-editmode="1">Edit</button>`:"";
 return sheetShell(t.name,`<h2 class="sheet-title" tabindex="-1">${esc(t.name)}</h2>`,body,foot,"view");
}
function taskEdit(s){
 const t=s.draft,ro=!S.canWrite?"disabled":"";
 const body=`<div class="edit-grid">
 <fieldset class="fgroup"><legend>Task</legend>
  <label class="field"><span>Name</span><input type="text" id="f-name" value="${esc(t.name)}" placeholder="e.g. Clean the dryer vent" ${ro}></label>
  <label class="field"><span>Done means</span><textarea id="f-std" rows="2" placeholder="What finished looks like, so everyone does it the same way" ${ro}>${esc(t.standard||"")}</textarea></label>
  <label class="field"><span>Steps <small>one per line</small></span><textarea id="f-steps" rows="3" ${ro}>${esc((t.steps||[]).join("\n"))}</textarea></label>
  <label class="field"><span>Notes</span><input type="text" id="f-notes" value="${esc(t.notes||"")}" placeholder="Filter size, brand, who to call…" ${ro}></label>
 </fieldset>
 <div>
 ${multiUser()?`<fieldset class="fgroup"><legend>Who</legend><label class="field"><span>Whose job</span><select id="f-who" ${ro}>${peopleOptions(t.assignee)}</select></label>${rotatePick(t.rotate,"task")}</fieldset>`:""}
 <fieldset class="fgroup"><legend>When</legend>
  <div class="field"><span id="rep-l">Repeats every</span><div class="repeat" role="group" aria-labelledby="rep-l"><input type="number" id="f-every" min="1" value="${t.every}" aria-label="Number" ${ro}><select id="f-unit" aria-label="Unit" ${ro}>${[["day","days"],["week","weeks"],["month","months"],["year","years"]].map(([v,l])=>`<option value="${v}" ${v===t.unit?"selected":""}>${l}</option>`).join("")}</select>${t.unit==="week"?`<span class="on">on</span><select id="f-wd" aria-label="Day of the week" ${ro}>${DAYS.map((d,i)=>`<option value="${i}" ${i===t.weekday?"selected":""}>${d}</option>`).join("")}</select>`:""}</div></div>
  <div class="grid2 keep"><label class="field"><span>Next due</span><input type="date" id="f-next" value="${esc(t.next)}" ${ro}></label><label class="field"><span>Time</span><input type="time" id="f-time" value="${esc(t.time)}" ${ro}></label></div>
  <div class="field"><span>Only in these months <small>for seasonal jobs</small></span><div class="months">${MONTHS.map((m,i)=>`<label><input type="checkbox" data-month="${i+1}" ${(t.months||[]).includes(i+1)?"checked":""} ${ro}><span>${m}</span></label>`).join("")}</div></div>
  <label class="switch"><input type="checkbox" id="f-flex" ${t.flexible?"checked":""} ${ro}><span>Count from when it's finished, not a fixed date</span></label>
 </fieldset>
 <fieldset class="fgroup"><legend>Details</legend>
  <div class="grid2 keep"><label class="field"><span>Room</span><select id="f-room" ${ro}>${ROOMS.map(r=>`<option ${r===t.room?"selected":""}>${r}</option>`).join("")}</select></label><label class="field"><span>Minutes</span><input type="number" id="f-mins" min="1" value="${t.mins}" ${ro}></label></div>
  <label class="switch"><input type="checkbox" id="f-photo" ${t.photoProof?"checked":""} ${ro}><span>Ask for a photo when it's done</span></label>
 </fieldset>
 ${s.isNew||!S.canWrite?"":`<button class="linkish danger" data-del="1">Delete this task</button>`}
 </div></div>`;
 const foot=S.canWrite?`<button class="btn primary" data-save="1">${s.isNew?"Add task":"Save"}</button><button class="btn text" data-${s.isNew?"close":"viewmode"}="1">Cancel</button>`:"";
 return sheetShell(s.isNew?"New task":"Edit task",`<h2 class="sheet-title" tabindex="-1">${s.isNew?"New task":"Edit task"}</h2>`,body,foot,"edit");
}
function taskSheet(s){return s.isNew||s.mode==="edit"?taskEdit(s):taskView(s)}

/* Focus: move into a sheet when it opens, keep it there, and return it to what opened it */
let sheetOpener=null;
function selectorFor(el){if(!el||!el.dataset)return null;const k=Object.keys(el.dataset)[0];return k?`[data-${k.replace(/[A-Z]/g,m=>"-"+m.toLowerCase())}="${CSS.escape(el.dataset[k])}"]`:null}
function afterLayer(prev){
 const now=layer.querySelector(".sheet");
 if(now&&!prev){sheetOpener=selectorFor(document.activeElement);(now.querySelector("[data-autofocus]")||now.querySelector(".sheet-title,h2")||now).focus?.({preventScroll:true})}
 else if(now&&prev&&layer._mode!==(ui.sheet&&ui.sheet.mode)){(now.querySelector(".sheet-title")||now).focus?.({preventScroll:true})}
 else if(!now&&prev&&sheetOpener){const el=document.querySelector(sheetOpener);if(el)el.focus({preventScroll:true});sheetOpener=null}
 layer._mode=ui.sheet&&ui.sheet.mode;
}
document.addEventListener("keydown",e=>{
 if(e.key!=="Tab")return;const sh=layer.querySelector(".sheet")||document.querySelector("#pinwrap .sheet");if(!sh)return;
 const f=[...sh.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(x=>!x.disabled&&x.offsetParent!==null);if(!f.length)return;
 const first=f[0],last=f[f.length-1];
 if(!sh.contains(document.activeElement)){e.preventDefault();first.focus();return}
 if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
});
