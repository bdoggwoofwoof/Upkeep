/* ---------- Web app: identity, invites, calendar feeds, notifications ---------- */
function myPid(){return ME.pid&&D.people[ME.pid]?ME.pid:""}
function resolveNames(){}
function loadCalendars(){}
function actorName(a){return pShort(a.actor||a.who)}
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
 return `<header class="top"><div class="ttl"><h1>Run the house together</h1></div></header>${S.note?`<div class="notice err" role="alert">${IC.alert}<span>${esc(S.note)}</span></div>`:""}
 <p class="lede">Every chore and maintenance job your home needs, on the right schedule, shared fairly across the household.</p>
 <section class="set-group"><h2>Start a new house</h2><label class="field"><span>Your name</span><input type="text" id="w-name" placeholder="What the household calls you" autocomplete="given-name"></label><div class="btn-row"><button class="btn primary" data-create="1" ${ui.busy?"disabled":""}>${ui.busy?"Setting up…":"Start my house"}</button></div></section>
 <section class="set-group"><h2>Join a house</h2><p class="note">Someone in your house can send you an invite link from the Household tab. Open it on this phone, or paste it here.</p><div class="cmtform" style="margin-top:12px"><input type="text" id="w-link" placeholder="Paste the invite link" aria-label="Invite link"><button class="btn" data-joinlink="1" ${ui.busy?"disabled":""}>Join</button></div></section>`;
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
 return `<p class="cal-links"><a class="linkish" href="${esc(gcalLink(ev))}" target="_blank" rel="noopener">Add to Google Calendar</a><a class="linkish" href="${esc(icsUrl(Object.assign({dl:"1"},o)))}">Apple or Outlook (.ics)</a></p><p class="note">To keep every task in sync on its own, subscribe under More → Calendar.</p>`;
}
function moreCal(){
 const me=myPid(),mine=icsUrl({p:me||"all"}),all=icsUrl({p:"all"});
 const subRow=(label,sub,url,primary)=>`<div class="set-row cal-row"><span class="s-text"><span class="s-label">${label}</span><span class="s-sub">${sub}</span></span><span class="cal-acts"><a class="btn small ${primary?"primary":""}" href="${esc(googleSub(url))}" target="_blank" rel="noopener">Google</a><a class="btn small" href="${esc(webcal(url))}">Apple</a><button class="btn small text" data-copy="${esc(url)}">Copy link</button></span></div>`;
 return `<p class="summary">Subscribe once and Upkeep's schedule shows up as its own calendar. New and finished tasks update on their own.</p>
 <section class="set-group"><h2>Subscribe</h2><div class="set-list">
 ${subRow(me?"My tasks":"All tasks",me?"Yours and anything up for grabs":"Everything in the house",mine,true)}
 ${me?subRow("The whole house","Every task, whoever's job it is",all,false):""}
 ${setMore("calhelp","If the Google button doesn't work","",`<p>After Google Calendar opens, choose Add. On some phones the button won't open the app; copy the link instead and add it on a computer under Other calendars → From URL.</p><p>Anyone with one of these links can see your house's tasks, so share them only with family.</p>`)}</div></section>
 <section class="set-group"><h2>Reminders</h2><div class="set-list">
 <label class="set-row"><span class="s-text"><span class="s-label">Reminder before each task</span><span class="s-sub">Used by subscribed calendars and .ics files</span></span><select id="remind" class="s-select">${[[-1,"None"],[0,"At start"],[10,"10 min before"],[30,"30 min before"],[60,"1 hour before"],[1440,"1 day before"]].map(([v,l])=>`<option value="${v}" ${Number(ME.reminder)===v?"selected":""}>${l}</option>`).join("")}</select></label>
 <label class="set-row"><span class="s-text"><span class="s-label">Default time for new tasks</span></span><input type="time" id="deftime" class="s-select" value="${esc(ME.defaultTime||"09:00")}"></label></div></section>
 <section class="set-group"><h2>One-time copies</h2><div class="set-list">
 <div class="set-row"><span class="s-text"><span class="s-label">Everything as an .ics file</span><span class="s-sub">A snapshot; it won't update</span></span><a class="btn small" href="${esc(icsUrl({p:"all",dl:"1"}))}">Download</a></div>
 <div class="set-row"><span class="s-text"><span class="s-label">Printable fridge chart</span><span class="s-sub">This week's tasks by person, plus the closing shift</span></span><button class="btn small" data-chart="1">Open</button></div></div></section>`;
}
function saveChart(){
 const blob=new Blob([chartHtml().replace("</body>","<script>setTimeout(()=>print(),400)<\/script></body>")],{type:"text/html"});
 const u=URL.createObjectURL(blob),w=window.open(u,"_blank");
 if(!w){const a=document.createElement("a");a.href=u;a.download=`upkeep-week-${today()}.html`;document.body.appendChild(a);a.click();a.remove()}
 setTimeout(()=>URL.revokeObjectURL(u),60000);
}
document.addEventListener("click",e=>{
 const b=e.target.closest("button");if(!b)return;const ds=b.dataset;
 if(ds.create){createHouse((document.getElementById("w-name").value||"").trim().slice(0,30));return}
 if(ds.joinlink){const v=document.getElementById("w-link").value;const m=/join=([a-z0-9]{10})\.([A-Za-z0-9_-]{10,})/.exec(v);if(!m){S.note="That doesn't look like an Upkeep invite link.";render();return}joinHouse(m[1],m[2]);return}
 if(ds.iam){ME.pid=ds.iam;saveMe();return}
 if(ds.iamnew){const n=(document.getElementById("w-me").value||"").trim().slice(0,30);if(!n)return;const pid=rid();ME.pid=pid;ls.set("upkeep-me",ME);put("people",pid,{name:n,role:"adult",color:nextColor(),joined:today()});logEvent({kind:"join",text:"joined the house"});return}
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

