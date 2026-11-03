/* ---------- Web app: identity, invites, calendar feeds, notifications ---------- */
function myPid(){return ME.pid&&D.people[ME.pid]?ME.pid:""}
function resolveNames(){}
function loadCalendars(){}
function actorName(a){return pShort(a.actor||a.who)}
function liveNotice(a){
 const text=`${pName(a.actor||a.who)} ${a.text}`;toast(text);
 if(ME.notify&&document.hidden&&"Notification" in window&&Notification.permission==="granted"){
  try{navigator.serviceWorker?.ready.then(r=>r.showNotification("Upkeep",{body:text,icon:"/icon-192.png",tag:a.id})).catch(()=>new Notification("Upkeep",{body:text}))}catch(e){}
 }
}
function copyText(text,okMsg){
 const done=()=>toast(okMsg||"Copied");
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(done,()=>{fallbackCopy(text);done()});else{fallbackCopy(text);done()}
}
function fallbackCopy(t){const a=document.createElement("textarea");a.value=t;document.body.appendChild(a);a.select();try{document.execCommand("copy")}catch(e){}a.remove()}
function shareInvite(){
 const link=inviteLink();
 if(navigator.share)navigator.share({title:"Join our house on Upkeep",text:"Here's our house on Upkeep. Open it to see your chores.",url:link}).catch(()=>{});
 else copyText(link,"Invite link copied");
}
function viewWelcome(){
 return `<header class="top"><div><div class="eyebrow">Upkeep</div><h1>Run the house together</h1></div></header>${S.note?`<div class="banner">${esc(S.note)}</div>`:""}
 <p class="lede">Every chore and maintenance job your home needs, on the right schedule, split fairly across the family.</p>
 <section class="group"><div class="calbox"><b>Start a new house</b><label class="field"><span>Your name</span><input type="text" id="w-name" placeholder="What the family calls you" autocomplete="given-name"></label><div><button class="btn primary" data-create="1" ${ui.busy?"disabled":""}>${ui.busy?"Setting up…":"Start my house"}</button></div></div></section>
 <section class="group"><div class="calbox"><b>Join a house</b><p class="note" style="margin:0">Someone in your house can send you an invite link from the Family tab. Open it on this phone, or paste it here.</p><div class="cmtform"><input type="text" id="w-link" placeholder="Paste the invite link"><button class="btn" data-joinlink="1" ${ui.busy?"disabled":""}>Join</button></div></div></section>`;
}
function viewWhoAmI(){
 const ad=adults();
 return `<header class="top"><div><div class="eyebrow">You're in</div><h1>Who are you?</h1></div></header>
 <p class="lede">Pick yourself so your check-offs and comments have your name on them.</p>
 <div class="kidpick">${ad.map(p=>`<button data-iam="${p.id}">${av(p.id,56)}<b>${esc(pName(p.id))}</b></button>`).join("")}</div>
 <section class="group" style="margin-top:18px"><div class="calbox"><b>I'm not listed</b><div class="cmtform"><input type="text" id="w-me" placeholder="Your name"><button class="btn primary" data-iamnew="1">Add me</button></div></div></section>`;
}
function calButtons(key,ev){
 const o=key.startsWith("task:")?{task:key.slice(5)}:{routine:key.slice(8)};
 return `<div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center"><a class="btn small primary" href="${esc(gcalLink(ev))}" target="_blank" rel="noopener">Add to Google Calendar</a><a class="linkish" href="${esc(icsUrl(Object.assign({dl:"1"},o)))}">Apple / Outlook (.ics)</a></div><p class="note" style="margin:0">Tip: subscribing under More → Calendar keeps every task in sync on its own.</p>`;
}
function moreCal(){
 const me=myPid(),mine=icsUrl({p:me||"all"}),all=icsUrl({p:"all"});
 return `<div class="calbox"><b>Subscribe once, stay in sync</b>
 <p class="note" style="margin:0">Your calendar app pulls Upkeep's schedule and refreshes it every few hours, so new tasks, finished tasks and new due dates show up on their own. It arrives as its own "Upkeep" calendar, separate from your main one. Seasonal tasks land on the first Saturday of their month.</p>
 <label class="field"><span>Reminder before each task</span><select id="remind">${[[-1,"None"],[0,"At start"],[10,"10 min before"],[30,"30 min before"],[60,"1 hour before"],[1440,"1 day before"]].map(([v,l])=>`<option value="${v}" ${Number(ME.reminder)===v?"selected":""}>${l}</option>`).join("")}</select></label>
 <div class="field"><span>${me?"My tasks and up-for-grabs tasks":"All tasks"}</span><div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn primary small" href="${esc(googleSub(mine))}" target="_blank" rel="noopener">Google Calendar</a><a class="btn small" href="${esc(webcal(mine))}">Apple Calendar</a><button class="btn small" data-copy="${esc(mine)}">Copy link</button></div></div>
 ${me?`<div class="field"><span>The whole house</span><div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn small" href="${esc(googleSub(all))}" target="_blank" rel="noopener">Google Calendar</a><a class="btn small" href="${esc(webcal(all))}">Apple Calendar</a><button class="btn small" data-copy="${esc(all)}">Copy link</button></div></div>`:""}
 <p class="note" style="margin:0">Google: after it opens, choose Add. If the button doesn't work on your phone, copy the link and add it on a computer under Other calendars → From URL. Anyone with this link can see your house's tasks, so share it only with family.</p>
 <div><a class="linkish" href="${esc(icsUrl({p:"all",dl:"1"}))}">Download everything as a one-time .ics file</a></div>
 <label class="field"><span>Default time for new tasks</span><input type="time" id="deftime" value="${esc(ME.defaultTime||"09:00")}"></label></div>
 <section class="group" style="margin-top:18px"><div class="calbox"><b>Fridge chart</b><p class="note" style="margin:0">This week's chores by person plus the closing shift, as a page you can print.</p><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn" data-chart="1">Open printable chart</button></div></div></section>`;
}
function saveChart(){
 const blob=new Blob([chartHtml().replace("</body>","<script>setTimeout(()=>print(),400)<\/script></body>")],{type:"text/html"});
 const u=URL.createObjectURL(blob),w=window.open(u,"_blank");
 if(!w){const a=document.createElement("a");a.href=u;a.download=`upkeep-week-${today()}.html`;document.body.appendChild(a);a.click();a.remove()}
 setTimeout(()=>URL.revokeObjectURL(u),60000);
}
function moreSettings(){
 const pr=(D.house&&D.house.profile)||{};
 const canNotify="Notification" in window;
 return `<section class="group"><div class="calbox"><b>Away mode</b><p class="note" style="margin:0">Going on a trip? Turn this on and nothing goes overdue. When you're back, every due date moves forward by the days you were gone.</p>${paused()?`<button class="btn primary" data-unpause="1">I'm back</button>`:`<button class="btn" data-pause="1">Turn on Away mode</button>`}</div></section>
 <section class="group"><div class="calbox"><b>Notifications on this device</b><p class="note" style="margin:0">Get a notice when someone finishes a task, checks a shift item, comments or nudges you, while Upkeep is open or in the background. On iPhone, add Upkeep to your Home Screen first (Share → Add to Home Screen).</p>${canNotify?`<label class="switch"><input type="checkbox" id="notify" ${ME.notify&&Notification.permission==="granted"?"checked":""}><span>Show notifications</span></label>${Notification.permission==="denied"?`<p class="note err">Notifications are blocked for Upkeep in this browser's settings.</p>`:""}`:`<p class="note">This browser doesn't support notifications.</p>`}</div></section>
 <section class="group"><div class="group-head"><h2>Your home</h2></div>${profileForm(pr)}<p class="note">Changing this updates the Suggested list under House. It doesn't remove tasks you already have.</p></section>
 <section class="group"><div class="calbox"><b>This phone</b><p class="note" style="margin:0">Signed in as ${esc(pName(myPid()))}. ${S.ops.length?`${S.ops.length} change${S.ops.length>1?"s":""} waiting to sync.`:"Everything is synced."}</p><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn small" data-switchme="1">I'm someone else</button>${ui.confirmLeave?`<span class="confirm">Leave this house on this phone? <button class="btn small danger" data-leave="2">Leave</button><button class="btn small" data-leave="0">Stay</button></span>`:`<button class="btn small danger" data-leave="1">Leave this house</button>`}</div></div></section>`;
}
function inviteBlock(){
 return `<div class="calbox" style="margin-top:12px"><b>Invite family</b><p class="note" style="margin:0">Send this link to adults in your house. They open it, pick their name and they're in. Anyone with the link can see and change your house, so share it only with family. Kids don't need it; use Kid view on any family phone.</p><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn primary small" data-invite="1">Share invite link</button><button class="btn small" data-copy="${esc(inviteLink())}">Copy link</button></div></div>`;
}
document.addEventListener("click",e=>{
 const b=e.target.closest("button");if(!b)return;const ds=b.dataset;
 if(ds.create){createHouse((document.getElementById("w-name").value||"").trim().slice(0,30));return}
 if(ds.joinlink){const v=document.getElementById("w-link").value;const m=/join=([a-z0-9]{10})\.([A-Za-z0-9_-]{10,})/.exec(v);if(!m){S.note="That doesn't look like an Upkeep invite link.";render();return}joinHouse(m[1],m[2]);return}
 if(ds.iam){ME.pid=ds.iam;saveMe();return}
 if(ds.iamnew){const n=(document.getElementById("w-me").value||"").trim().slice(0,30);if(!n)return;const pid=rid();ME.pid=pid;ls.set("upkeep-me",ME);put("people",pid,{name:n,role:"adult",color:COLORS[Object.keys(D.people).length%COLORS.length],joined:today()});logEvent({kind:"join",text:"joined the house"});return}
 if(ds.switchme){ME.pid="";saveMe();return}
 if(ds.leave){if(ds.leave==="1"){ui.confirmLeave=true;render()}else if(ds.leave==="2"){ui.confirmLeave=false;leaveHouse()}else{ui.confirmLeave=false;render()}return}
 if(ds.invite){shareInvite();return}
 if(ds.copy){copyText(ds.copy,"Link copied");return}
});
document.addEventListener("change",async e=>{
 if(e.target.id==="notify"){
  if(e.target.checked){let p=Notification.permission;if(p==="default")p=await Notification.requestPermission();ME.notify=p==="granted";}
  else ME.notify=false;saveMe();
 }
});
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").catch(()=>{}));

