/* ---------- Tour: a spotlight walk-through on a sample house (Ironwood style), plus Help ---------- */
IC.help='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.4c-.6.3-1 .8-1 1.5v.4M12 17h.01"/></svg>';

/* While the tour runs, the real house is set aside and a sample one is shown.
   Nothing is saved or synced until the tour ends and the real house comes back. */
let TOUR_REAL=null;
function tourSample(){
 const me=myPid()||"tme",meName=(TOUR_REAL.people[me]&&TOUR_REAL.people[me].name)||"You";
 COLS.forEach(c=>D[c]={});D.house=null;
 if(!ME.pid||!TOUR_REAL.people[ME.pid])ui.tourPid=ME.pid,ME.pid=me;
 const jo="tjordan",sam="tsam",day=864e5,now=Date.now();
 D.people[me]={id:me,name:meName,role:"adult",color:COLORS[0],joined:addDays(today(),-40)};
 D.people[jo]={id:jo,name:"Jordan",role:"adult",color:COLORS[1],joined:addDays(today(),-40)};
 D.people[sam]={id:sam,name:"Sam",role:"kid",color:COLORS[2],joined:addDays(today(),-40)};
 setupHouse({home:"house",own:"own",yard:true,central:true,kids:true,pets:true,car:true,garage:true,closing:true});
 putHouse({kidApproval:true,centsPerPoint:10});
 const ts=Object.values(D.tasks);
 const due=ts.filter(t=>status(t)==="today"||status(t)==="soon");
 due.forEach((t,i)=>patch("tasks",t.id,{assignee:[me,jo,"",sam][i%4]}));
 const late=ts.filter(t=>t.unit==="month").slice(0,2);
 late.forEach(t=>patch("tasks",t.id,{next:addDays(today(),-3),assignee:jo}));
 const tod=Object.values(D.tasks).filter(t=>status(t)==="today");
 if(tod[0])patch("tasks",tod[0].id,{time:"07:30",timeSet:true,assignee:me,standard:"Counters clear, wiped down and dry. Nothing left in the sink."});
 if(tod[1])patch("tasks",tod[1].id,{time:"19:00",timeSet:true});
 const r=routines()[0];
 if(r){updateRoutine(r,{items:r.items.map((it,i)=>Object.assign({},it,{assignee:[me,jo,sam][i%3]}))});
  r.items.slice(0,2).forEach((it,i)=>put("checks",checkId(r.id,it.id),{routine:r.id,item:it.id,date:shiftDate(),by:"tour",who:[me,jo][i],at:now-600e3}))}
 const ev=(who,t,ago,extra)=>put("activity",rid(),Object.assign({by:"tour",actor:who,who,at:now-ago,kind:"task",ref:"task:"+(t?t.id:""),text:`finished “${t?t.name:"a task"}”`,pts:ptsFor(t?t.mins:10),mins:t?t.mins|0:10},extra||{}));
 const pool=ts.slice(5,20);
 [[jo,0,2*3600e3],[me,1,3*3600e3],[sam,2,5*3600e3],[jo,3,day+3600e3],[me,4,day+2*3600e3],[jo,5,2*day],[sam,6,2*day+3600e3],[me,7,3*day],[jo,8,4*day],[me,9,5*day]].forEach(([w,i,a])=>pool[i]&&ev(w,pool[i],a));
 if(late[0])put("activity",rid(),{by:"tour",actor:me,who:me,at:now-1800e3,kind:"nudge",ref:"task:"+late[0].id,target:jo,text:`nudged Jordan about “${late[0].name}”`,pts:0,mins:0});
 if(tod[0])put("comments",rid(),{ref:"task:"+tod[0].id,text:"New spray is under the sink, works much better.",by:"tour",who:jo,at:now-3600e3});
 put("things","tt1",{name:"Furnace",room:"Basement",brand:"Carrier",model:"59SC5",bought:"2019-10-01",warranty:addDays(today(),40),notes:"Filter 16x25x1"});
 put("pros","tp1",{name:"Mountain Air HVAC",trade:"HVAC",phone:"828-555-0142",rating:5,notes:"Ask for Dale"});
 put("info","ti1",{label:"Wi-Fi name",value:"Sample house",order:1});put("info","ti2",{label:"Trash day",value:"Tuesday, out by 7am",order:2});
 [["Coffee beans",me,false],["Dish soap",jo,false],["Eggs",me,true]].forEach(([text,who,done],i)=>put("items","tl"+i,{list:"Groceries",text,done,who,at:now-i*3600e3,n:1}));
 put("expenses","te1",{what:"Power bill",amount:14230,date:today(),paidBy:me,split:[me,jo]});
 put("rewards","tr1",{name:"Pick the movie",cost:20});put("rewards","tr2",{name:"Stay up 30 minutes late",cost:40});
 return {me,jo,sam,late:late[0]&&late[0].id,today:tod[0]&&tod[0].id,routine:r&&r.id};
}

/* Steps. g = the part of the app (for "Tour this screen"). at = the screen to show. sel = what to point at
   (a selector, a list of selectors to frame together, or a function); none = a card in the middle. */
const TOUR=[
 {g:"intro",at:{tab:"today"},title:"Welcome to Upkeep",text:"A quick look around. It takes about two minutes, and you can skip it any time. The house you'll see is a sample; your own tasks are set aside and come back when the tour ends."},
 {g:"today",at:{tab:"today"},sel:["#app .today-head .ttl","#app > .summary"],title:"Today",text:"Everything due today, about how long it takes, and how it's split between you."},
 {g:"today",at:{tab:"today"},sel:".today-head .filters",title:"Everyone, Mine, Up for grabs",text:"Narrow the list to your own jobs, or to the ones nobody has taken yet."},
 {g:"today",at:{tab:"today"},sel:".callout.shift",title:"Tonight's closing shift",text:"The few things that reset the house each night, split between people. Tap it to check items off together; everyone sees it close."},
 {g:"today",at:{tab:"today"},sel:()=>document.querySelector(".t-main section.group"),title:"Needs attention",text:"Anything late waits here, at the top, until it's done or moved. It says how late in words, never just in red."},
 {g:"today",at:{tab:"today"},sel:".t-main .row.task .check",title:"Complete a task",text:"The circle on the right finishes it. The next date is set from its schedule, and Undo is there for a few seconds."},
 {g:"today",at:{tab:"today"},sel:".t-main .swipe",peek:true,title:"Swipe for more",text:"Swipe a task to the left for Tomorrow, Skip, or Take it when it's up for grabs."},
 {g:"today",at:{tab:"today"},sel:".t-main [data-arrange]",title:"Put the day in order",text:"Tap Reorder, or press and hold a task, then drag it or use the arrows. The order is the same on every phone."},
 {g:"today",at:{tab:"today"},sel:".t-side .chips",title:"Have a few minutes?",text:"Pick 10, 20 or 30 minutes and Upkeep suggests jobs that fit."},
 {g:"task",at:{tab:"today",sheet:"task"},sel:".sheet .panel",title:"Everything about one task",text:"When it's due and whose job it is, what done means, steps, notes, comments and history. Move it to tomorrow, skip it once, or nudge whoever has it. Edit changes the schedule."},
 {g:"schedule",at:{tab:"schedule"},sel:"#g-week",title:"The week ahead",text:"The next 7 days, day by day. Later weeks and months are folded so the list stays short."},
 {g:"schedule",at:{tab:"schedule"},sel:".jump",title:"Jump ahead",text:"Go straight to a month, or to your routines like the closing shift."},
 {g:"schedule",at:{tab:"schedule"},sel:".subnav",title:"By season",text:"Seasonal jobs and the big ones that come around once or twice a year, with a checklist for this season."},
 {g:"household",at:{tab:"household"},sel:()=>document.querySelector("[data-person]")?.closest("section"),title:"Who does what",text:"Each person's share of the minutes done this week, so the split stays fair and visible. Tap a person for their week."},
 {g:"household",at:{tab:"household"},sel:"[data-invite]",title:"Invite your household",text:"Send the link to the adults in your house. They open it on their own phones, pick their name and they're in. No accounts or passwords."},
 {g:"household",at:{tab:"household"},sel:".feed",title:"Activity",text:"What everyone finished, took, commented on or nudged, newest first. New items are marked since you last looked."},
 {g:"household",at:{tab:"household"},sel:()=>[...document.querySelectorAll("#app section.group")].pop(),title:"Kids, stars and rewards",text:"Kids earn stars for their jobs. Choose rewards, an allowance per star, and whether a grown-up OKs each check-off."},
 {g:"kid",at:{kid:"sam"},sel:".kidgrid",title:"Kid view",text:"Big cards with a clear done button and stars, on a shared tablet or phone. Set a PIN in Settings so only a grown-up can leave it."},
 {g:"home",at:{tab:"home"},sel:".rooms",title:"Your home, room by room",text:"Each room says what's late or due today. Tap one for its tasks."},
 {g:"home",at:{tab:"home"},sel:"[data-new]",title:"Add a task",text:"Add your own, with its schedule, owner and what done means."},
 {g:"home",at:{tab:"home"},sel:()=>document.querySelector("[data-hv2=library]")?.closest(".list"),title:"Task library and records",text:"About 200 ready-made tasks with steps, suggested for your home. Keep appliances, model numbers, contractors and home info here too."},
 {g:"more",at:{tab:"more",more:"lists"},sel:"#app .subnav",title:"Shopping, costs and calendar",text:"Shared shopping lists, shared costs and who owes what, and calendar subscriptions, all in More."},
 {g:"more",at:{tab:"more",more:"cal"},sel:()=>document.querySelector("#app .subnav")?.nextElementSibling,title:"On your calendar",text:"Subscribe once and everyone's tasks show up in Apple, Google or Outlook Calendar, with reminders."},
 {g:"more",at:{tab:"more",more:"settings"},sel:()=>document.querySelector(".set-group"),title:"Make it comfortable",text:"Light or dark, larger text, more contrast and less motion. These are just for this phone."},
 {g:"more",at:{tab:"more",more:"settings"},sel:()=>[...document.querySelectorAll(".set-group")].find(x=>/Away mode/.test(x.textContent)),title:"Away mode and weather",text:"Away mode stops anything going overdue while you're gone. Set your town to get a short prep list before a hard freeze, heavy snow, high winds or extreme heat."},
 {g:"limits",at:{tab:"today"},lim:true,title:"Notifications need Upkeep open",text:"Upkeep can notify you while it's open or in the background, but not when it's fully closed yet. Calendar reminders work any time. On iPhone, add Upkeep to your Home Screen first."},
 {g:"limits",at:{tab:"today"},lim:true,title:"Calendars update on their own time",text:"Calendar apps check the feed every few hours, so a change in Upkeep can take a while to show up there."},
 {g:"limits",at:{tab:"today"},lim:true,title:"iPhone doesn't vibrate",text:"Safari on iPhone doesn't allow vibration, so check-offs there have the animation but no buzz."},
 {g:"limits",at:{tab:"today"},lim:true,title:"Syncing needs internet",text:"Without a connection, changes wait on your phone and sync when you're back online. Others won't see them until then."},
 {g:"outro",at:{tab:"today"},sel:".page-help",title:"Help is at the bottom of every screen",text:"Open Help for how things work and every limitation, or tour just the screen you're on."},
 {g:"outro",at:{tab:"today"},title:"You're set",text:"Your own house is back. Start with what's due today."},
];
const TOUR_PARTS=[["today","Today"],["task","A task"],["schedule","Schedule"],["household","Household"],["kid","Kid view"],["home","Home"],["more","More"],["limits","Limitations"]];
const tourPartFor=()=>ui.kid?"kid":ui.tab==="shift"?"today":ui.tab==="more"?"more":ui.tab;

let tourState=null;
function startTour(part){
 if(tourState||S.mode!=="db")return;
 const steps=part?TOUR.filter(s=>s.g===part):TOUR;if(!steps.length)return;
 const keep={};["tab","more","schedView","homeView","roomOpen","kid","who","sheet","plan","routine","arranging","open","folds","actLimit","histWho"].forEach(k=>keep[k]=ui[k]);
 TOUR_REAL={house:D.house};COLS.forEach(c=>TOUR_REAL[c]=D[c]);
 const canW=S.canWrite;S.canWrite=true;ui.tour=true;ui.toast=null;
 const ids=tourSample();ui.who="all";ui.plan=null;ui.arranging=null;ui.open={};
 const ov=document.createElement("div");ov.className="tour";ov.setAttribute("role","dialog");ov.setAttribute("aria-modal","true");ov.setAttribute("aria-label","Tour of Upkeep");
 ov.innerHTML=`<svg class="tour-dim" aria-hidden="true"><defs><mask id="tour-mask" maskUnits="userSpaceOnUse"><rect x="0" y="0" width="100%" height="100%" fill="#fff"/><rect class="tour-cut" x="0" y="0" width="0" height="0" rx="12" fill="#000"/></mask></defs><rect x="0" y="0" width="100%" height="100%" class="tour-shade" mask="url(#tour-mask)"/></svg><div class="tour-ring" aria-hidden="true"></div><div class="tour-card" aria-live="polite"><div class="tour-txt"></div><div class="tour-btns"></div></div>`;
 document.body.append(ov);document.body.classList.add("tour-on");
 const stop=e=>{if(!e.target.closest(".tour-card"))e.preventDefault()};
 ov.addEventListener("wheel",stop,{passive:false});ov.addEventListener("touchmove",stop,{passive:false});
 const T={els:null,mid:true,side:"mid",show:false},cur={x:innerWidth/2,y:innerHeight/2,w:0,h:0,ring:0,cy:null,op:0},vel={x:0,y:0,w:0,h:0,cy:0};
 const cut=ov.querySelector(".tour-cut"),ring=ov.querySelector(".tour-ring"),card=ov.querySelector(".tour-card");
 let raf=0,prev=performance.now(),step=0,where="",cardBox=null;
 const W=11,spring=(p,g,dt)=>{const a=W*W*(g-cur[p])-2*W*vel[p];vel[p]+=a*dt;cur[p]+=vel[p]*dt};
 const loop=now=>{const dt=Math.min(64,now-prev);prev=now;const r=reduced(),k=1-Math.exp(-dt/(r?60:85)),sdt=Math.min(.032,dt/1000),snap=cur.op<.04||cur.cy===null;
  const vw=innerWidth,vh=innerHeight,pad=6;let q=null;
  if(T.els)for(const e of T.els){if(!e.isConnected)continue;const b=e.getBoundingClientRect();if(!b.width)continue;q=q?{l:Math.min(q.l,b.left),t:Math.min(q.t,b.top),r:Math.max(q.r,b.right),b:Math.max(q.b,b.bottom)}:{l:b.left,t:b.top,r:b.right,b:b.bottom}}
  const g=!T.mid&&q?{x:Math.max(2,q.l-pad),y:Math.max(2,q.t-pad),w:Math.min(vw-2,q.r+pad)-Math.max(2,q.l-pad),h:Math.min(vh-2,q.b+pad)-Math.max(2,q.t-pad),ring:1}:{x:vw/2,y:vh/2,w:0,h:0,ring:0};
  if(g.ring&&cardBox){const gap=10;if(T.side==="bottom"){const lim=cardBox.t-gap;if(g.y+g.h>lim)g.h=Math.max(40,lim-g.y)}else if(T.side==="top"){const lim=cardBox.b+gap;if(g.y<lim){g.h=Math.max(40,g.h-(lim-g.y));g.y=lim}}} // a tall target is framed only where the card isn't
  for(const p of["x","y","w","h"]){if(r||(snap&&!cur.w)){cur[p]=g[p];vel[p]=0}else spring(p,g[p],sdt)}cur.ring+=(g.ring-cur.ring)*k;
  cut.setAttribute("x",cur.x.toFixed(1));cut.setAttribute("y",cur.y.toFixed(1));cut.setAttribute("width",Math.max(0,cur.w).toFixed(1));cut.setAttribute("height",Math.max(0,cur.h).toFixed(1));
  ring.style.transform=`translate(${cur.x.toFixed(1)}px,${cur.y.toFixed(1)}px)`;ring.style.width=Math.max(0,cur.w)+"px";ring.style.height=Math.max(0,cur.h)+"px";ring.style.opacity=cur.ring.toFixed(3);
  const ch=card.offsetHeight,side=T.mid?"mid":T.side,top=12+(parseFloat(getComputedStyle(document.documentElement).paddingTop)||0),bot=16+(parseFloat(getComputedStyle(document.documentElement).paddingBottom)||0);
  const ty=side==="top"?top:side==="bottom"?vh-ch-bot:(vh-ch)/2;cardBox={t:ty,b:ty+ch};
  if(cur.cy===null||snap||r){cur.cy=ty;vel.cy=0}else spring("cy",ty,sdt);cur.op+=((T.show?1:0)-cur.op)*k;
  card.style.transform=`translateY(${cur.cy.toFixed(1)}px)`;card.style.opacity=cur.op.toFixed(3);card.style.visibility=cur.op<.02&&!T.show?"hidden":"visible";
  raf=requestAnimationFrame(loop)};
 raf=requestAnimationFrame(loop);
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 const show=at=>{
  ui.sheet=null;ui.kid=null;ui.roomOpen=null;ui.homeView="rooms";ui.schedView="upcoming";ui.tab=at.tab||"today";if(at.more)ui.more=at.more;
  if(at.kid)ui.kid=ids[at.kid];
  render();
  if(at.sheet==="task"&&(ids.late||ids.today))openTask(ids.late||ids.today,"view");
  window.scrollTo(0,0);
 };
 const end=()=>{
  cancelAnimationFrame(raf);removeEventListener("keydown",key,true);ov.remove();document.body.classList.remove("tour-on");
  COLS.forEach(c=>D[c]=TOUR_REAL[c]);D.house=TOUR_REAL.house;TOUR_REAL=null;
  if("tourPid" in ui){ME.pid=ui.tourPid;delete ui.tourPid}
  Object.assign(ui,keep);ui.tour=false;ui.toast=null;S.canWrite=canW;tourState=null;
  if(!part){ME.tourDone=true;ls.set("upkeep-me",ME)}
  render();window.scrollTo(0,0);scheduleFlush();poll();
  document.querySelector(part?".page-help [data-tour]":"#tabs [aria-current]")?.focus?.({preventScroll:true});
 };
 const key=e=>{if(e.key==="Escape"){e.preventDefault();e.stopImmediatePropagation();end()}else if(e.key==="ArrowRight"&&!e.target.closest?.("input,textarea"))go(step+1);else if(e.key==="ArrowLeft"&&step>0)go(step-1)};
 addEventListener("keydown",key,true);
 const go=async n=>{
  if(n>=steps.length)return end();step=n;const s=steps[n],last=n===steps.length-1,first=n===0;
  const key2=JSON.stringify(s.at);
  if(key2!==where||s.peek){T.show=false;await wait(reduced()?0:180);if(step!==n)return;where=key2;show(s.at);await wait(s.at.sheet?320:60)}
  else if(reduced()&&T.show){T.show=false;await wait(120)}
  if(step!==n)return;
  card.querySelector(".tour-txt").innerHTML=`<div class="tour-top"><span class="tour-eyebrow">${n+1} of ${steps.length}${s.lim?`<span class="tour-lim">Limitation</span>`:""}</span>${last?"":`<button class="tour-skip" data-t="skip">${part?"Close":"Skip tour"}</button>`}</div><h3 id="tour-h">${esc(s.title)}</h3><p>${esc(s.text)}</p>`;
  card.querySelector(".tour-btns").innerHTML=`${n>0?`<button class="btn" data-t="back">Back</button>`:""}<button class="btn primary" data-t="next">${last?"Done":first&&!part?"Show me":"Next"}</button>`;
  let els=[];
  if(s.sel)for(let i=0;i<30&&step===n;i++){
   const pick=x=>{const e=typeof x==="function"?x():document.querySelector(x);return e&&e.getBoundingClientRect().width?e:null};
   els=(Array.isArray(s.sel)?s.sel.map(pick):[pick(s.sel)]).flat().filter(Boolean);if(els.length)break;await wait(50)}
  if(step!==n)return;
  if(s.peek&&els[0]){const row=els[0].querySelector(".row"),acts=els[0].querySelector(".acts");if(row&&acts){row.style.transition="transform .45s var(--ease)";requestAnimationFrame(()=>row.style.transform=`translateX(${(document.dir==="rtl"?1:-1)*acts.offsetWidth}px)`)}}
  if(els.length){const sc=els[0].closest(".sheet-body,.panel");const tall=els[0].getBoundingClientRect().height>innerHeight*.45;if(!sc){els[0].scrollIntoView({block:tall?"start":"center",behavior:"instant"});if(tall)window.scrollBy(0,-16)}await new Promise(r=>requestAnimationFrame(r));
   let t=Infinity,b=-Infinity;els.forEach(e=>{const r=e.getBoundingClientRect();t=Math.min(t,r.top);b=Math.max(b,r.bottom)});
   T.side=tall&&!sc?"bottom":(t+b)/2>innerHeight/2?"top":"bottom";T.mid=false;T.els=els}
  else{T.mid=true;T.els=null}
  T.show=true;card.querySelector("[data-t=next]").focus({preventScroll:true});
 };
 ov.addEventListener("click",e=>{const b=e.target.closest("[data-t]");if(!b)return;const t=b.dataset.t;if(t==="skip")end();else go(t==="next"?step+1:step-1)});
 tourState={go,end};go(0);
}

/* Auto-start once on each phone, after the house is set up and this person is chosen */
function maybeAutoTour(){
 if(ME.tourDone||ui.tour||ui.tourQueued||S.mode!=="db"||ui.kid||ME.kidDevice||!myPid()||!(D.house&&D.house.setupDone)||!tasks().length)return;
 ui.tourQueued=true;setTimeout(()=>{if(!ME.tourDone&&!ui.sheet&&!ui.kid&&!ui.tour)startTour()},900);
}

/* Help: a quiet footer on every screen, and a sheet with how things work and the limitations */
function pageHelp(){return `<footer class="page-help"><button class="linkish" data-help="1">${IC.help}Help</button><button class="linkish" data-tour="${tourPartFor()}">Tour this screen</button></footer>`}
function helpSheet(){
 const sec=(t,p)=>`<div class="t-sec"><h3>${t}</h3><p>${p}</p></div>`;
 const body=`<div class="help-tour"><button class="btn primary" data-tour="all">Take the tour</button><p class="note">About two minutes, on a sample house. Or tour one part:</p><div class="chips">${TOUR_PARTS.map(([k,l])=>`<button class="chip" data-tour="${k}">${l}</button>`).join("")}</div></div>
 ${sec("Today","What's due today, by morning, afternoon and evening when tasks have times. Late jobs sit under Needs attention. Tap a task to read it, tap the circle to complete it, swipe it for Tomorrow, Skip or Take it, and press and hold to reorder.")}
 ${sec("How tasks are scheduled","Each task repeats on its own schedule. Seasonal jobs land on the first Saturday of their month. When you finish a task, the next date is set from its schedule, or from the day you finished it if it counts from when it's done.")}
 ${sec("The closing shift","A short list that resets the house each night. Each item can belong to someone or take turns. It runs on the days you choose and closes when every item is checked.")}
 ${sec("Sharing fairly","Household shows each person's share of the minutes done this week. Assign a task to someone, let people take turns, or leave it up for grabs for whoever has time.")}
 ${sec("Adults and kids","Adults join with the invite link on their own phones; each phone gets its own key, so you can reset the link or remove a phone without signing anyone else out. Kids use Kid view on any family device and earn stars.")}
 ${sec("Add Upkeep to your Home Screen","On iPhone: open Upkeep in Safari, tap Share, then Add to Home Screen. On Android: open the browser menu and tap Install app. It opens like an app and works offline.")}
 <div class="t-sec"><h3>Limitations</h3><ul class="lims">
 <li><b>Notifications need Upkeep open</b> or in the background. Calendar reminders work any time. On iPhone, add it to your Home Screen first.</li>
 <li><b>Calendars update on their own time</b>, usually every few hours, so changes can take a while to appear there.</li>
 <li><b>No vibration on iPhone.</b> Safari doesn't allow it.</li>
 <li><b>Syncing needs internet.</b> Offline changes wait on your phone until you're back online.</li>
 <li><b>Weather prep needs your town</b> in Settings, and only warns about serious weather: a hard freeze, 2 inches of snow or rain, 45 mph gusts, or 95°F heat.</li>
 <li><b>Stars, streaks and history</b> count the newest 1,000 activity entries.</li>
 <li><b>Photos</b> need a connection to upload.</li>
 <li><b>No search across everything yet</b>, and no app store version: Upkeep runs in the browser.</li></ul></div>`;
 return sheetShell("Help",`<h2 class="sheet-title" tabindex="-1">Help</h2>`,body,"","view help");
}
document.addEventListener("click",e=>{
 const b=e.target.closest("[data-help],[data-tour]");if(!b||ui.tour)return;
 e.stopImmediatePropagation();
 if(b.dataset.help){ui.sheet={kind:"help"};renderLayer();return}
 const part=b.dataset.tour==="all"?null:b.dataset.tour;ui.sheet=null;renderLayer();setTimeout(()=>startTour(part),60);
},true);
