const STARTER_DAILY_CAP=6;
const LIB=LIB_RAW.map((r,i)=>({lib:"L"+i,pack:r[0],room:r[1],name:r[2],unit:r[3],every:r[4],mins:r[5],steps:r[6]?r[6].split("|"):[],months:(r.meta&&r.meta.m)||[],req:(r.meta&&r.meta.r)||[]}));
const ROOMS=["Kitchen","Bathroom","Bedroom","Living areas","Whole house","Laundry","Outside","Systems","Safety","Money & admin","Supplies","Car","Pets","Other"];
const DAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const RR_DAYS=["SU","MO","TU","WE","TH","FR","SA"];
const CAL_SERVER="Google Calendar";
const COLORS=["#2D5D4C","#8A4B2D","#3D5A8A","#7A3D72","#8A6B1F","#2F7A7A","#6B4FA0","#A03D4F"];
const CLOSING_STARTER=[
 ["Dishes done, sink empty","Nothing left in the sink or on the counter. Dishwasher loaded and running if it's full."],
 ["Counters and stovetop wiped","No crumbs or sticky spots. Spray, wipe, dry."],
 ["Food put away","Leftovers in containers in the fridge. Nothing left out overnight."],
 ["Kitchen trash out if it's full","Lid closes all the way. New bag in."],
 ["Living room reset","Blankets folded, cushions back, cups and plates to the kitchen."],
 ["Shoes, bags and coats put away","Entry floor is clear."],
 ["Pets fed and water filled","Water bowl fresh and full."],
 ["Doors locked, windows checked","Front, back and garage doors. Windows shut if it's cold or raining."],
 ["Lights off, thermostat set","Night setting on the thermostat."],
 ["Coffee and lunches ready for morning","Coffee maker set up. Tomorrow's lunches packed or planned."]];
const PROFILE_Q=[
 ["yard","Yard or lawn"],["deck","Deck or porch"],["garage","Garage"],["basement","Basement"],["central","Central heat/AC or heat pump"],
 ["fireplace","Fireplace or wood stove"],["septic","Septic tank"],["well","Well water"],["softener","Water softener"],["sprinkler","Sprinklers"],
 ["pool","Pool"],["generator","Generator"],["grill","Grill"],["kids","Kids"],["pets","Pets"],["car","A car"]];
const INFO_SUGGEST=["Wi-Fi name","Wi-Fi password","Trash day","Recycling day","Water shutoff","Breaker panel","Gas shutoff","HVAC filter size","Paint colors","Landlord or HOA contact","Emergency contacts","Spare key","Alarm code","Vet","Pediatrician"];
const LISTS=["Groceries","Household","Hardware store"];

/* ---------- Dates ---------- */
const pad=n=>String(n).padStart(2,"0");
const ymd=d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const parse=s=>{const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d)};
const today=()=>ymd(new Date());
const shiftDate=()=>{const d=new Date();if(d.getHours()<4)d.setDate(d.getDate()-1);return ymd(d)};
const addDays=(s,n)=>{const d=parse(s);d.setDate(d.getDate()+n);return ymd(d)};
const daysBetween=(a,b)=>Math.round((parse(b)-parse(a))/864e5);
function addInterval(s,t){
 const d=parse(s),n=Math.max(1,t.every|0);
 if(t.unit==="day")d.setDate(d.getDate()+n);
 else if(t.unit==="week")d.setDate(d.getDate()+7*n);
 else if(t.unit==="month"){const day=d.getDate();d.setDate(1);d.setMonth(d.getMonth()+n);d.setDate(Math.min(day,new Date(d.getFullYear(),d.getMonth()+1,0).getDate()))}
 else d.setFullYear(d.getFullYear()+n);
 return ymd(d);
}
function onWeekday(s,wd){const d=parse(s);while(d.getDay()!==wd)d.setDate(d.getDate()+1);return ymd(d)}
// Seasonal tasks land on the first Saturday of their next allowed month (or stay put if already in one).
function snapSeason(s,months){
 if(!months||!months.length)return s;
 const d=parse(s);
 for(let i=0;i<24;i++){
  const m=d.getMonth()+1;
  if(months.includes(m)){
   if(i===0)return s;
   const f=new Date(d.getFullYear(),d.getMonth(),1);while(f.getDay()!==6)f.setDate(f.getDate()+1);return ymd(f);
  }
  d.setDate(1);d.setMonth(d.getMonth()+1);
 }
 return s;
}
function nextAfter(t,from){
 let n;
 if(t.flexible)n=addInterval(from,t);else{n=t.next;do{n=addInterval(n,t)}while(n<=from)}
 if(t.months&&t.months.length){
  // for seasonal tasks the interval is the minimum gap; then snap to the next allowed month
  const gap=t.months.length>1?Math.floor(12/t.months.length):12*Math.max(1,t.unit==="year"?t.every:1);
  const d=parse(from);d.setDate(1);d.setMonth(d.getMonth()+Math.max(1,gap-1));n=snapSeason(ymd(d),t.months);
 }
 if(t.unit==="week"&&t.weekday!=null&&!t.flexible)n=onWeekday(n,t.weekday);
 return n;
}
function nice(s){
 const diff=daysBetween(today(),s);
 if(diff===0)return"Today";if(diff===1)return"Tomorrow";if(diff===-1)return"Yesterday";
 const d=parse(s),o={weekday:"short",month:"short",day:"numeric"};if(d.getFullYear()!==new Date().getFullYear())o.year="numeric";
 return d.toLocaleDateString(undefined,o);
}
const clock=ms=>new Date(ms).toLocaleTimeString(undefined,{hour:"numeric",minute:"2-digit"});
function ago(ms){const m=Math.round((Date.now()-ms)/6e4);if(m<1)return"just now";if(m<60)return m+" min ago";const h=Math.round(m/60);if(h<24)return h+" hr ago";return new Date(ms).toLocaleDateString(undefined,{month:"short",day:"numeric"})}
const t12=s=>{const [h,m]=(s||"21:00").split(":").map(Number);const d=new Date();d.setHours(h,m);return clock(d)};
function freqText(t){
 if(t.months&&t.months.length)return t.months.length===1?`Every ${MONTHS[t.months[0]-1]}`+(t.unit==="year"&&t.every>1?` · every ${t.every} yrs`:""):t.months.map(m=>MONTHS[m-1]).join(" & ");
 const n=t.every|0,u=t.unit;
 if(u==="day")return n===1?"Daily":`Every ${n} days`;
 if(u==="week")return(n===1?"Weekly":`Every ${n} weeks`)+(t.weekday!=null?` on ${DAYS[t.weekday].slice(0,3)}`:"");
 if(u==="month")return n===1?"Monthly":n===3?"Every 3 months":n===6?"Twice a year":n===12?"Yearly":`Every ${n} months`;
 return n===1?"Yearly":`Every ${n} years`;
}
const intervalDays=t=>t.months&&t.months.length?Math.round(365/t.months.length)*(t.unit==="year"?Math.max(1,t.every):1):({day:1,week:7,month:30,year:365}[t.unit])*Math.max(1,t.every|0);
function status(t){if(paused())return"later";const d=daysBetween(today(),t.next);return d<0?"late":d===0?"today":d<=7?"soon":"later"}
const ptsFor=mins=>Math.max(1,Math.min(5,Math.round((mins|0)/10)));
const rid=()=>Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const money=c=>(c<0?"−":"")+"$"+(Math.abs(c)/100).toFixed(2);

/* ---------- Store: house file on the server, cached on the device ---------- */
const COLS=["tasks","routines","checks","comments","activity","people","approvals","rewards","things","service","pros","info","items","expenses"];
const D={house:null};COLS.forEach(c=>D[c]={});
const ls={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let ME=Object.assign({house:"",key:"",pid:"",device:"",reminder:30,defaultTime:"09:00",lastSeen:0,notify:false},ls.get("upkeep-me",{}));
if(!ME.device){ME.device=Math.random().toString(36).slice(2,12);ls.set("upkeep-me",ME)}
const S={mode:"loading",uid:ME.device,canWrite:true,note:"",isOwner:true,bootAt:Date.now(),v:0,ops:ls.get("upkeep-ops",[]),flushing:false,online:navigator.onLine,photos:true,downloads:true};
function saveMe(){ls.set("upkeep-me",ME);render()}
function cacheSave(){ls.set("upkeep-cache",{h:ME.house,v:S.v,D})}
function applyOp(o){
 if(o.c==="house"){if(o.t==="del")D.house=null;else D.house=Object.assign({},o.d);return}
 const col=D[o.c];if(!col)return;
 if(o.t==="del")delete col[o.i];else col[o.i]=Object.assign({},o.d,{id:o.i});
}
function queueOp(o){applyOp(o);S.ops.push(o);ls.set("upkeep-ops",S.ops);cacheSave();render();scheduleFlush()}
function put(col,id,data){const d=Object.assign({},data);delete d.id;queueOp({t:"set",c:col,i:id,d});return Promise.resolve()}
function patch(col,id,data){const cur=D[col][id];if(!cur)return;return put(col,id,Object.assign({},cur,data))}
function remove(col,id){queueOp({t:"del",c:col,i:id});return Promise.resolve()}
function putHouse(data){const h=Object.assign({},D.house||{},data);queueOp({t:"set",c:"house",i:"main",d:h})}
function setHouse(h){queueOp({t:"set",c:"house",i:"main",d:h})}
function logEvent(o){const id=rid();put("activity",id,Object.assign({by:S.uid,actor:myPid(),who:myPid(),at:Date.now(),pts:0,mins:0},o));return id}

function loadDocs(docs,v){
 const seenAct=new Set(Object.keys(D.activity));const first=S.v===0;
 D.house=docs.house&&docs.house.main?Object.assign({},docs.house.main):null;
 COLS.forEach(c=>{const m={};Object.entries(docs[c]||{}).forEach(([id,d])=>m[id]=Object.assign({},d,{id}));D[c]=m});
 S.v=v;
 S.ops.forEach(applyOp); // keep changes that haven't reached the server yet
 if(!first)Object.values(D.activity).forEach(a=>{if(!seenAct.has(a.id)&&a.by!==S.uid&&a.at>S.bootAt)liveNotice(a)});
 cacheSave();
}
async function api(method,body,query){
 const url="/api/house"+(query?"?"+new URLSearchParams(query):"");
 const r=await fetch(url,{method,headers:body?{"Content-Type":"application/json"}:{},body:body?JSON.stringify(body):undefined});
 if(r.status===404)throw Object.assign(new Error("not_found"),{code:"not_found"});
 if(!r.ok)throw Object.assign(new Error("server"),{code:"server"});
 return r.json();
}
let flushTimer=null;
function scheduleFlush(){clearTimeout(flushTimer);flushTimer=setTimeout(flush,350)}
async function flush(){
 if(!ME.house||S.flushing||!S.ops.length)return;
 S.flushing=true;const batch=S.ops.slice(0,250);
 try{
  const res=await api("POST",{h:ME.house,k:ME.key,ops:batch});
  S.ops=S.ops.slice(batch.length);ls.set("upkeep-ops",S.ops);
  loadDocs(res.docs,res.v);if(S.note.startsWith("Offline"))S.note="";render();
 }catch(e){
  if(e.code==="not_found"){S.note="This house link no longer works. Ask for a new invite link.";}
  else S.note="Offline. Your changes are saved on this phone and will sync when you're back online.";
  render();setTimeout(scheduleFlush,8000);
 }
 S.flushing=false;if(S.ops.length&&!S.note)scheduleFlush();
}
async function poll(){
 if(!ME.house||document.hidden||S.flushing||S.ops.length)return;
 try{const res=await api("GET",null,{h:ME.house,k:ME.key,v:S.v});if(!res.same){loadDocs(res.docs,res.v);render()}if(S.note.startsWith("Offline")){S.note="";render()}}
 catch(e){if(e.code!=="not_found"&&!S.note){S.note="Offline. Your changes are saved on this phone and will sync when you're back online.";render()}}
}
setInterval(poll,15000);
window.addEventListener("online",()=>{scheduleFlush();poll()});
async function boot(){
 const m=/#join=([a-z0-9]{10})\.([A-Za-z0-9_-]{10,})/.exec(location.hash);
 if(m){ui.join={h:m[1],k:m[2]};history.replaceState(null,"",location.pathname)}
 if(!ME.house){S.mode="welcome";render();if(ui.join)joinHouse(ui.join.h,ui.join.k);return}
 const c=ls.get("upkeep-cache",null);
 if(c&&c.h===ME.house){Object.assign(D,c.D);S.v=c.v||0;S.ops.forEach(applyOp);S.mode="db";render()}
 try{const res=await api("GET",null,{h:ME.house,k:ME.key});S.v=0;loadDocs(res.docs,res.v);S.mode="db";S.note="";afterLoad()}
 catch(e){
  if(e.code==="not_found"){S.mode="welcome";S.note="That house couldn't be found. Start a new one or use an invite link.";ME.house="";saveMe();return}
  S.mode="db";S.note="Offline. Showing what's saved on this phone.";render();
 }
 scheduleFlush();
}
async function createHouse(name){
 ui.busy=true;render();
 try{
  const res=await api("POST",{create:true});
  ME.house=res.h;ME.key=res.key;S.ops=[];ls.set("upkeep-ops",[]);
  COLS.forEach(c=>D[c]={});D.house=null;S.v=res.v;
  const pid=rid();ME.pid=pid;saveMe();
  put("people",pid,{name:name||"Me",role:"adult",color:COLORS[0],joined:today(),owner:true});
  S.mode="db";ui.busy=false;render();
 }catch(e){ui.busy=false;S.note="Couldn't reach the server. Check your connection and try again.";render()}
}
async function joinHouse(h,k){
 ui.busy=true;render();
 try{const res=await api("GET",null,{h,k});ME.house=h;ME.key=k;ME.pid="";S.ops=[];ls.set("upkeep-ops",[]);S.v=0;loadDocs(res.docs,res.v);saveMe();S.mode="db";ui.busy=false;ui.join=null;render()}
 catch(e){ui.busy=false;S.note=e.code==="not_found"?"That invite link doesn't work. Ask for a new one.":"Couldn't reach the server. Check your connection and try again.";render()}
}
function leaveHouse(){ME.house="";ME.key="";ME.pid="";saveMe();S.ops=[];ls.set("upkeep-ops",[]);ls.set("upkeep-cache",null);COLS.forEach(c=>D[c]={});D.house=null;S.mode="welcome";render()}
function inviteLink(){return `${location.origin}/#join=${ME.house}.${ME.key}`}
function afterLoad(){render()}
function subChecks(){}
async function uploadPhoto(file){
 const data=await shrink(file);
 const r=await fetch("/api/photo",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({h:ME.house,k:ME.key,data})});
 if(r.status===413)throw{code:"too_large"};if(!r.ok)throw{code:"upload"};
 return(await r.json()).url;
}
function shrink(file){
 return new Promise((res,rej)=>{const img=new Image(),u=URL.createObjectURL(file);
  img.onload=()=>{const max=1600,sc=Math.min(1,max/Math.max(img.width,img.height));const c=document.createElement("canvas");c.width=Math.round(img.width*sc);c.height=Math.round(img.height*sc);c.getContext("2d").drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(u);res(c.toDataURL("image/jpeg",.82))};
  img.onerror=()=>{URL.revokeObjectURL(u);rej({code:"unsupported_type"})};img.src=u});
}
const photoUrl=x=>!x?"":/^https?:/.test(x)?x:"";

/* ---------- People ---------- */
const names={},asked=new Set();
async function resolveNames(){
 if(!S.user||!S.user.profiles)return;
 const ids=Object.values(D.people).map(p=>p.uid).filter(u=>u&&u!=="local"&&!asked.has(u));if(!ids.length)return;ids.forEach(u=>asked.add(u));
 try{const ps=await S.user.profiles(ids);ids.forEach(u=>{names[u]=(ps&&ps[u]&&ps[u].name)||""});render()}catch(e){}
}
const people=()=>Object.values(D.people).sort((a,b)=>(a.role==="kid")-(b.role==="kid")||(a.joined||"").localeCompare(b.joined||""));
const kids=()=>people().filter(p=>p.role==="kid");
const adults=()=>people().filter(p=>p.role!=="kid");
function myPid(){const p=Object.values(D.people).find(p=>p.uid===S.uid);return p?p.id:""}
function pName(pid){if(!pid)return"Anyone";const p=D.people[pid];if(!p)return"Someone";return p.name||(p.uid&&names[p.uid]?names[p.uid].split(" ")[0]:"")||"Someone"}
function pShort(pid){return pid&&pid===myPid()?"You":pName(pid)}
function av(pid,size){const p=D.people[pid];const n=pid?pName(pid):"?";const c=p&&p.color?p.color:"var(--muted)";return `<span class="av" style="background:${c};color:#fff;${size?`width:${size}px;height:${size}px;font-size:${size/2.4}px`:""}" aria-hidden="true">${esc(pid?n.charAt(0).toUpperCase():"·")}</span>`}
function peopleOptions(sel){return `<option value="">Anyone (up for grabs)</option>`+people().map(p=>`<option value="${p.id}" ${p.id===sel?"selected":""}>${esc(pName(p.id))}${p.role==="kid"?" (kid)":""}</option>`).join("")}
const isKid=pid=>D.people[pid]&&D.people[pid].role==="kid";
const multiUser=()=>S.mode==="db"||people().length>1;

/* ---------- Profile / setup ---------- */
function tagsOf(pr){
 const t=new Set();if(!pr)return t;
 if(pr.home!=="apartment")t.add("house");t.add(pr.own==="rent"?"rent":"own");
 PROFILE_Q.forEach(([k])=>{if(pr[k])t.add(k)});if(!pr.septic)t.add("sewer");
 return t;
}
function libFits(l,tags){
 if(l.pack==="car"&&!tags.has("car"))return false;
 if(l.pack==="pets"&&!tags.has("pets"))return false;
 if(l.pack==="kids"&&!tags.has("kids"))return false;
 if(l.pack==="outside"&&!(tags.has("house")||tags.has("yard")))return false;
 return l.req.every(r=>tags.has(r));
}
const paused=()=>!!(D.house&&D.house.pause);

/* ---------- Tasks ---------- */
function newTask(src,start){
 const t={lib:src.lib||null,name:src.name,room:src.room||"Other",unit:src.unit,every:src.every,weekday:null,months:[...(src.months||[])],mins:src.mins||15,
  steps:[...(src.steps||[])],stepsDone:[],standard:"",notes:"",assignee:"",rotate:[],photoProof:false,time:ME.defaultTime||"09:00",flexible:false,
  next:snapSeason(start||today(),src.months),lastDone:null,lastBy:"",created:Date.now()};
 if(t.unit==="week")t.weekday=parse(t.next).getDay();
 return t;
}
function spreadStart(src,i){
 if(src.months&&src.months.length){
  const d=new Date();if(!src.months.includes(d.getMonth()+1))return today();
  const left=new Date(d.getFullYear(),d.getMonth()+1,0).getDate()-d.getDate()+1;
  return addDays(today(),(i*5+(src.lib?parseInt(src.lib.slice(1)):0))%Math.max(1,left));
 }
 if(src.unit==="day")return today();
 const span=Math.min(intervalDays(src),src.unit==="week"?7:45);
 return addDays(today(),(i*3+(src.lib?parseInt(src.lib.slice(1)):0))%span);
}
const tasks=()=>Object.values(D.tasks);
function finishTask(id,credit,photo){
 const t=D.tasks[id];if(!t||!S.canWrite)return;
 const pid=credit||myPid(),now=today();
 const prev={next:t.next,lastDone:t.lastDone,lastBy:t.lastBy,stepsDone:t.stepsDone||[],assignee:t.assignee};
 const n=nextAfter(t,now);
 let assignee=t.assignee;
 if(t.rotate&&t.rotate.length>1){const i=t.rotate.indexOf(t.assignee);assignee=t.rotate[(i+1)%t.rotate.length]}
 patch("tasks",id,{next:n,lastDone:now,lastBy:pid,stepsDone:[],assignee});
 const kidNeedsOk=isKid(pid)&&(D.house?D.house.kidApproval!==false:true);
 const forWho=t.assignee&&t.assignee!==pid?` for ${pName(t.assignee)}`:"";
 const actId=logEvent({kind:"task",text:`finished “${t.name}”${forWho}`,ref:"task:"+id,who:pid,pts:ptsFor(t.mins),mins:t.mins|0,photo:photo||"",pending:kidNeedsOk});
 if(kidNeedsOk)put("approvals",rid(),{kind:"task",ref:id,act:actId,who:pid,label:t.name,pts:ptsFor(t.mins),photo:photo||"",prev,at:Date.now()});
 toast(`${kidNeedsOk?"Sent for an OK. ":"Done. "}Next: ${nice(n)}`,kidNeedsOk?null:()=>{patch("tasks",id,prev);remove("activity",actId)});
}
function claim(id){if(!S.canWrite)return;const t=D.tasks[id];patch("tasks",id,{assignee:myPid()});logEvent({kind:"claim",text:`took “${t.name}”`,ref:"task:"+id})}
function nudge(id){const t=D.tasks[id];if(!t||!t.assignee)return;logEvent({kind:"nudge",text:`nudged ${pName(t.assignee)} about “${t.name}”`,ref:"task:"+id,target:t.assignee});toast(`Nudged ${pName(t.assignee)}`)}
function nudgesForMe(){
 const me=myPid();if(!me)return[];
 return Object.values(D.activity).filter(a=>a.kind==="nudge"&&a.target===me).filter(a=>{const t=D.tasks[(a.ref||"").slice(5)];return t&&(!t.lastDone||parse(t.lastDone).getTime()+864e5<a.at)&&status(t)!=="later"}).sort((a,b)=>b.at-a.at);
}

/* ---------- Routines ---------- */
const routines=()=>Object.values(D.routines).sort((a,b)=>(a.created||0)-(b.created||0));
const routineRunsTonight=r=>(r.days||[0,1,2,3,4,5,6]).includes(parse(shiftDate()).getDay());
const checkId=(r,i)=>`${r}_${shiftDate()}_${i}`;
function toggleCheck(r,item,credit){
 if(!S.canWrite)return;const id=checkId(r.id,item.id);
 if(D.checks[id]){const c=D.checks[id];remove("checks",id);if(c.act)remove("activity",c.act);return}
 const pid=credit||myPid(),kidOk=isKid(pid)&&(D.house?D.house.kidApproval!==false:true);
 const forWho=item.assignee&&item.assignee!==pid?` for ${pName(item.assignee)}`:"";
 const act=logEvent({kind:"check",text:`checked “${item.text}”${forWho}`,ref:"item:"+r.id+":"+item.id,who:pid,pts:1,mins:5,pending:kidOk});
 put("checks",id,{routine:r.id,item:item.id,date:shiftDate(),by:S.uid,who:pid,at:Date.now(),act});
 if(kidOk)put("approvals",rid(),{kind:"item",ref:id,act,who:pid,label:item.text,pts:1,at:Date.now()});
 if(item.rotate&&item.rotate.length>1){const i=item.rotate.indexOf(item.assignee);const nx=item.rotate[(i+1)%item.rotate.length];updateRoutine(r,{items:r.items.map(x=>x.id===item.id?Object.assign({},x,{assignee:nx}):x)})}
 const done=r.items.filter(i=>D.checks[checkId(r.id,i.id)]).length;
 if(done===r.items.length&&r.items.length)setTimeout(()=>logEvent({kind:"shift",text:`closed out the ${r.name}: all ${r.items.length} done`,ref:"routine:"+r.id}),50);
}
function makeClosing(){const id=rid();put("routines",id,{name:"Closing shift",time:"21:00",days:[0,1,2,3,4,5,6],created:Date.now(),items:CLOSING_STARTER.map(([text,standard])=>({id:rid(),text,standard,notes:"",assignee:"",rotate:[]}))});return id}
function updateRoutine(r,ch){const x=Object.assign({},D.routines[r.id]||r,ch);delete x.id;put("routines",r.id,x)}

/* ---------- Points, streaks, approvals ---------- */
const credited=()=>Object.values(D.activity).filter(a=>a.who&&!a.pending);
function pointsOf(pid){return credited().filter(a=>a.who===pid).reduce((s,a)=>s+(a.pts||0),0)}
function weekStats(){
 const since=Date.now()-7*864e5,m={};
 credited().filter(a=>a.at>=since&&(a.kind==="task"||a.kind==="check")).forEach(a=>{const x=m[a.who]||(m[a.who]={pts:0,mins:0,n:0});x.pts+=a.pts||0;x.mins+=a.mins||0;x.n++});
 return m;
}
function streakOf(pid){
 const days=new Set(credited().filter(a=>a.who===pid&&(a.kind==="task"||a.kind==="check")).map(a=>ymd(new Date(a.at))));
 let d=today(),n=0;if(!days.has(d))d=addDays(d,-1);while(days.has(d)){n++;d=addDays(d,-1)}return n;
}
function decide(ap,ok){
 if(ok){if(ap.act)patch("activity",ap.act,{pending:false});
  if(ap.kind==="reward")logEvent({kind:"reward",text:`gave ${pName(ap.who)} “${ap.label}”`,who:ap.who,pts:-ap.pts});
  else logEvent({kind:"ok",text:`OK'd ${pName(ap.who)}'s “${ap.label}”`});
 }else{
  if(ap.act)remove("activity",ap.act);
  if(ap.kind==="task"&&ap.prev&&D.tasks[ap.ref])patch("tasks",ap.ref,ap.prev);
  if(ap.kind==="item"&&D.checks[ap.ref])remove("checks",ap.ref);
  logEvent({kind:"ok",text:`asked ${pName(ap.who)} to try “${ap.label}” again`});
 }
 remove("approvals",ap.id);
}

/* ---------- Comments / notices ---------- */
const commentsFor=ref=>Object.values(D.comments).filter(c=>c.ref===ref).sort((a,b)=>a.at-b.at);
function addComment(ref,text,label){text=text.trim();if(!text||!S.canWrite)return;put("comments",rid(),{ref,text,by:S.uid,who:myPid(),at:Date.now()});logEvent({kind:"comment",text:`commented on “${label}”: ${text.length>60?text.slice(0,57)+"…":text}`,ref})}
let toastTimer=null;
function toast(msg,undo){ui.toast={msg,undo};clearTimeout(toastTimer);toastTimer=setTimeout(()=>{ui.toast=null;renderLayer()},5500);renderLayer()}
function liveNotice(a){const actor=Object.values(D.people).find(p=>p.uid===a.by);toast(`${actor?pName(actor.id):"Someone"} ${a.text}`)}
const unread=()=>Object.values(D.activity).filter(a=>a.by!==S.uid&&a.at>(ME.lastSeen||0)).length;

/* ---------- Calendar ---------- */
function rrule(t){
 if(t.byday&&t.byday.length&&t.byday.length<7)return`RRULE:FREQ=WEEKLY;BYDAY=${t.byday.map(i=>RR_DAYS[i]).join(",")}`;
 if(t.months&&t.months.length)return`RRULE:FREQ=YEARLY;INTERVAL=${t.unit==="year"?Math.max(1,t.every):1};BYMONTH=${t.months.join(",")};BYDAY=1SA`;
 const n=Math.max(1,t.every|0),f={day:"DAILY",week:"WEEKLY",month:"MONTHLY",year:"YEARLY"}[t.unit];
 let r=`RRULE:FREQ=${f}`;if(n>1)r+=`;INTERVAL=${n}`;if(t.unit==="week"&&t.weekday!=null)r+=`;BYDAY=${RR_DAYS[t.weekday]}`;return r;
}
function eventTimes(t){const [h,m]=(t.time||"09:00").split(":").map(Number);const s=parse(t.next);s.setHours(h,m,0,0);const e=new Date(s.getTime()+Math.max(5,t.mins|0)*6e4);const f=d=>ymd(d)+"T"+pad(d.getHours())+":"+pad(d.getMinutes())+":00";return{start:f(s),end:f(e)}}
function eventDesc(t){let d=t.room?`${t.room} · ${freqText(t)} · about ${t.mins} min`:"";if(t.assignee)d+=`\nWhose job: ${pName(t.assignee)}`;if(t.standard)d+=`\n\nDone means: ${t.standard}`;if(t.steps&&t.steps.length)d+="\n\nChecklist:\n"+t.steps.map(s=>"☐ "+s).join("\n");if(t.notes)d+="\n\n"+t.notes;return(d+"\n\nFrom Upkeep").trim()}
function gcalLink(t){const {start,end}=eventTimes(t),c=s=>s.replace(/[-:]/g,"");return"https://calendar.google.com/calendar/render?"+new URLSearchParams({action:"TEMPLATE",text:t.name,dates:c(start)+"/"+c(end),details:eventDesc(t),recur:rrule(t)})}
function routineAsEvent(r){let next=today();const days=r.days||[0,1,2,3,4,5,6];while(!days.includes(parse(next).getDay()))next=addDays(next,1);return{name:r.name,unit:"day",every:1,byday:days,mins:30,time:r.time,next,steps:r.items.map(i=>i.text+(i.assignee?` (${pName(i.assignee)})`:"")),notes:"Check items off in Upkeep so everyone can see.",room:""}}
function icsUrl(o={}){const q=new URLSearchParams(Object.assign({h:ME.house,k:ME.key,r:String(ME.reminder)},o));return `${location.origin}/api/ics?${q}`}
const webcal=u=>u.replace(/^https?:/,"webcal:");
const googleSub=u=>"https://calendar.google.com/calendar/r?cid="+encodeURIComponent(webcal(u));

/* ---------- Time plan + timer ---------- */
function buildPlan(mins){
 const pool=tasks().filter(t=>status(t)!=="later"&&(ui.who!=="mine"||t.assignee===myPid()||!t.assignee)).sort((a,b)=>a.next.localeCompare(b.next)||(a.mins-b.mins));
 const out=[];let left=mins;
 for(const t of pool){if((t.mins|0)<=left){out.push(t.id);left-=t.mins|0}}
 if(!out.length&&pool.length)out.push(pool.sort((a,b)=>a.mins-b.mins)[0].id);
 return out;
}
const timer={end:0,left:0,running:false,iv:null,lock:null};
function timerStart(){timer.end=Date.now()+timer.left*1000;timer.running=true;clearInterval(timer.iv);timer.iv=setInterval(tick,1000);navigator.wakeLock?.request?.("screen").then(l=>timer.lock=l).catch(()=>{});render()}
function timerPause(){timer.left=Math.max(0,Math.round((timer.end-Date.now())/1000));timer.running=false;clearInterval(timer.iv);timer.lock?.release?.().catch(()=>{});render()}
function tick(){const el=document.getElementById("clock");const s=Math.max(0,Math.round((timer.end-Date.now())/1000));if(el)el.textContent=fmtTime(s);if(s<=0){timerPause();timer.left=0;toast("Time's up. Nice work.")}}
const fmtTime=s=>Math.floor(s/60)+":"+pad(s%60);

/* ---------- Print chart ---------- */
function chartHtml(){
 const days=[...Array(7)].map((_,i)=>addDays(today(),i));
 const ts=tasks().filter(t=>daysBetween(today(),t.next)<=6).sort((a,b)=>a.next.localeCompare(b.next));
 const r=routines().find(routineRunsTonight)||routines()[0];
 const ppl=[...people(),{id:"",name:"Anyone"}];
 const cell=(pid,d)=>ts.filter(t=>(t.assignee||"")===pid&&(t.next===d||(d===today()&&t.next<d))).map(t=>`<div>☐ ${esc(t.name)}</div>`).join("");
 return `<!doctype html><html><head><meta charset="utf-8"><title>Upkeep week of ${nice(today())}</title><style>body{font:13px/1.35 Georgia,serif;margin:24px;color:#111}h1{font-size:22px;margin:0 0 4px}table{border-collapse:collapse;width:100%;margin-top:14px}th,td{border:1px solid #999;padding:6px;vertical-align:top;text-align:left}th{background:#eee}td div{margin:2px 0}.s td{width:auto}@media print{body{margin:10mm}}</style></head><body>
 <h1>House chores · week of ${parse(today()).toLocaleDateString(undefined,{month:"long",day:"numeric"})}</h1><div>Check off as you go. Printed from Upkeep.</div>
 <table><tr><th>Who</th>${days.map(d=>`<th>${parse(d).toLocaleDateString(undefined,{weekday:"short",month:"numeric",day:"numeric"})}</th>`).join("")}</tr>
 ${ppl.map(p=>`<tr><th>${esc(p.id?pName(p.id):"Anyone")}</th>${days.map(d=>`<td>${cell(p.id,d)}</td>`).join("")}</tr>`).join("")}</table>
 ${r?`<h1 style="margin-top:22px">${esc(r.name)} · ${t12(r.time)}</h1><table class="s"><tr><th>Item</th><th>Who</th><th>Done means</th>${days.map(d=>`<th>${parse(d).toLocaleDateString(undefined,{weekday:"short"})}</th>`).join("")}</tr>${r.items.map(i=>`<tr><td>${esc(i.text)}</td><td>${esc(pName(i.assignee))}</td><td>${esc(i.standard||"")}</td>${days.map(()=>"<td></td>").join("")}</tr>`).join("")}</table>`:""}
 </body></html>`;
}
async function saveChart(){
 if(!S.downloads){toast("Saving files isn't available in this view.");return}
 try{await S.downloads.save({filename:`upkeep-week-${today()}.html`,data:chartHtml()});toast("Saved. Open it and print from your browser.")}
 catch(e){if(e&&e.code!=="declined")toast(e&&e.code==="rate_limited"?"One save at a time. Try again in a moment.":"Couldn't save the chart here.")}
}

/* ---------- Pause ---------- */
function startPause(){putHouse({pause:{from:today(),by:S.uid}});logEvent({kind:"pause",text:"turned on Away mode"})}
function endPause(){
 const from=D.house.pause.from,shift=Math.max(0,daysBetween(from,today()));
 if(shift)tasks().forEach(t=>{const moved=addDays(t.next,shift);const n=t.months&&t.months.length?snapSeason(moved,t.months):moved;patch("tasks",t.id,{next:n})});
 const h=Object.assign({},D.house);delete h.pause;setHouse(h);
 logEvent({kind:"pause",text:`is back. Due dates moved ${shift} day${shift===1?"":"s"}`});render();
}

/* ---------- Freshness ---------- */
function freshness(room){
 const ts=tasks().filter(t=>t.room===room);if(!ts.length)return null;
 const v=ts.map(t=>{const total=intervalDays(t),left=daysBetween(today(),t.next);return Math.max(0,Math.min(1,left/total))});
 return v.reduce((a,b)=>a+b,0)/v.length;
}

/* ---------- Expenses ---------- */
function balances(){
 const b={};people().forEach(p=>b[p.id]=0);
 Object.values(D.expenses).forEach(e=>{const split=(e.split&&e.split.length?e.split:adults().map(p=>p.id));const share=Math.round(e.amount/split.length);b[e.paidBy]=(b[e.paidBy]||0)+e.amount;split.forEach(p=>b[p]=(b[p]||0)-share)});
 return b;
}
function settleUp(){
 const b=balances(),pos=[],neg=[];Object.entries(b).forEach(([p,v])=>{if(v>50)pos.push([p,v]);else if(v<-50)neg.push([p,-v])});
 const out=[];pos.sort((a,b)=>b[1]-a[1]);neg.sort((a,b)=>b[1]-a[1]);
 while(pos.length&&neg.length){const x=Math.min(pos[0][1],neg[0][1]);out.push([neg[0][0],pos[0][0],x]);pos[0][1]-=x;neg[0][1]-=x;if(pos[0][1]<50)pos.shift();if(neg[0][1]<50)neg.shift()}
 return out;
}

/* ---------- UI ---------- */
let ui={tab:"today",who:"all",room:"All",q:"",houseView:"mine",libRoom:"All",routine:null,open:{},sheet:null,toast:null,cal:{list:null,loading:false,err:""},bulk:null,setup:null,editShift:false,plan:null,more:"home",kid:null,list:"Groceries",histWho:""};
const I={
 check:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--on-accent)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
 today:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l2.5 2.5L16 9"/><rect x="4" y="4" width="16" height="16" rx="3"/></svg>',
 moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z"/></svg>',
 house:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11l8-6 8 6v8a1 1 0 0 1-1 1h-4v-5H9v5H5a1 1 0 0 1-1-1z"/></svg>',
 people:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 5.5a3 3 0 0 1 0 5.8M18 19a5 5 0 0 0-2.5-4.3"/></svg>',
 more:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/></svg>',
 star:'<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z"/></svg>'
};
const app=document.getElementById("app"),tabsEl=document.getElementById("tabs"),layer=document.getElementById("layer");
function render(){
 if(S.mode==="loading")return;if(S.mode==="welcome"){tabsEl.hidden=true;app.innerHTML=viewWelcome();renderLayer();return}
 if(!myPid()&&Object.keys(D.people).length){tabsEl.hidden=true;app.innerHTML=viewWhoAmI();renderLayer();return}
 const empty=!(D.house&&D.house.setupDone)&&!tasks().length;
 if(empty){tabsEl.hidden=true;app.innerHTML=S.canWrite?viewSetup():`<header class="top"><div><div class="eyebrow">Upkeep</div><h1>This house isn't set up yet</h1></div></header><div class="empty">Ask the person who shared it with you to finish setting it up.</div>`;renderLayer();return}
 if(ui.kid){tabsEl.hidden=true;app.innerHTML=viewKid();renderLayer();return}
 tabsEl.hidden=false;renderTabs();
 app.innerHTML=({today:viewToday,shift:viewShift,house:viewHouse,family:viewFamily,more:viewMore}[ui.tab])();
 renderLayer();
}
function renderTabs(){
 const u=unread(),ap=Object.keys(D.approvals).length;
 const t=[["today","Today",I.today],["shift","Shift",I.moon],["house","House",I.house],["family","Family",I.people],["more","More",I.more]];
 tabsEl.querySelector(".in").innerHTML=t.map(([id,l,ic])=>`<button data-tab="${id}" ${ui.tab===id?'aria-current="page"':""}>${ic}<span>${l}</span>${id==="family"&&(u+ap)?`<span class="badge">${u+ap}</span>`:""}</button>`).join("");
}
const note=()=>(S.note?`<div class="banner">${esc(S.note)}</div>`:"")+(paused()?`<div class="banner">Away mode is on since ${nice(D.house.pause.from)}. Nothing shows as overdue. <button class="linkish" data-unpause="1">I'm back</button></div>`:"");
function whoFilter(){if(!multiUser())return"";return `<div class="seg" role="group" aria-label="Show">${[["all","Everyone"],["mine","Mine"],["open","Up for grabs"]].map(([v,l])=>`<button data-who="${v}" aria-pressed="${ui.who===v}">${l}</button>`).join("")}</div>`}
const passWho=t=>ui.who==="all"||(ui.who==="mine"&&t.assignee===myPid())||(ui.who==="open"&&!t.assignee);
function taskRow(t,o={}){
 const st=status(t),open=ui.open[t.id],nc=commentsFor("task:"+t.id).length;
 const pill=st==="late"?`<span class="pill late">${-daysBetween(today(),t.next)}d late</span>`:st==="today"?`<span class="pill today">Today</span>`:st==="soon"?`<span class="pill soon">${nice(t.next)}</span>`:`<span class="stamp muted">${nice(t.next)}</span>`;
 const steps=(t.steps||[]).length?`<div class="steps" style="padding-top:0"><button class="linkish" data-toggle="${t.id}">${open?"Hide":"Show"} checklist (${(t.stepsDone||[]).length}/${t.steps.length})</button></div>`+(open?`<div class="steps">${t.steps.map((s,i)=>`<label><input type="checkbox" data-step="${t.id}" data-i="${i}" ${(t.stepsDone||[]).includes(i)?"checked":""} ${S.canWrite?"":"disabled"}><span>${esc(s)}</span></label>`).join("")}</div>`:""):"";
 const extra=[];
 if(multiUser()&&!t.assignee&&S.canWrite&&st!=="later")extra.push(`<button class="linkish" data-claim="${t.id}">I'll take it</button>`);
 return `<div class="row">
  <button class="check" data-done="${t.id}" aria-label="Mark ${esc(t.name)} done" ${S.canWrite?"":"disabled"}>${I.check}</button>
  <button class="main" data-edit="${t.id}"><span class="name">${esc(t.name)}</span>
   <span class="meta">${multiUser()?`<span class="who">${av(t.assignee)}${esc(pShort(t.assignee))}</span>`:""}<span>${esc(t.room)}</span><span>${freqText(t)}</span><span>${t.mins} min</span>${t.photoProof?"<span>Photo</span>":""}${t.rotate&&t.rotate.length>1?"<span>Rotates</span>":""}${nc?`<span>${nc} comment${nc>1?"s":""}</span>`:""}</span>
   ${t.standard?`<span class="std"><b>Done means:</b> ${esc(t.standard)}</span>`:""}</button>
  <div>${pill}</div>${steps}${extra.length?`<div class="steps" style="padding-top:0">${extra.join("")}</div>`:""}</div>`;
}
function shiftCard(){
 const r=routines().find(routineRunsTonight);if(!r)return"";
 const done=r.items.filter(i=>D.checks[checkId(r.id,i.id)]).length,mine=r.items.filter(i=>i.assignee===myPid()&&!D.checks[checkId(r.id,i.id)]).length;
 return `<section class="group"><div class="list"><button class="row main" data-tab="shift" style="grid-template-columns:1fr auto;width:100%"><span style="min-width:0"><span class="eyebrow">Tonight · ${t12(r.time)}</span><span class="name" style="font-family:var(--display);font-weight:400;font-size:1.15rem">${esc(r.name)}</span><span class="meta"><span>${done} of ${r.items.length} done</span>${mine?`<span>${mine} on you</span>`:""}</span><span class="progress"><i style="width:${r.items.length?done/r.items.length*100:0}%"></i></span></span><span class="linkish">Open</span></button></div></section>`;
}
function viewToday(){
 const ts=tasks().filter(passWho).sort((a,b)=>a.next.localeCompare(b.next)||a.name.localeCompare(b.name));
 const late=ts.filter(t=>status(t)==="late"),tod=ts.filter(t=>status(t)==="today"),soon=ts.filter(t=>status(t)==="soon");
 const doneToday=credited().filter(a=>a.kind==="task"&&ymd(new Date(a.at))===today()).length;
 const mins=[...late,...tod].reduce((a,t)=>a+(t.mins|0),0);
 const g=(title,list,em)=>`<section class="group"><div class="group-head"><h2>${title}</h2><span class="stamp muted">${list.length}</span></div>${list.length?`<div class="list">${list.map(t=>taskRow(t)).join("")}</div>`:`<div class="empty">${em}</div>`}</section>`;
 const nudges=nudgesForMe();
 const warr=Object.values(D.things).filter(x=>x.warranty&&daysBetween(today(),x.warranty)>=0&&daysBetween(today(),x.warranty)<=60);
 const myApprovals=S.isOwner||!isKid(myPid())?Object.values(D.approvals):[];
 return `<header class="top"><div><div class="eyebrow">${new Date().toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"})}</div><h1>Today at home</h1></div>${whoFilter()}</header>${note()}
 ${nudges.map(a=>`<div class="banner">${esc(actorName(a))} nudged you about <button class="linkish" data-edit="${esc(a.ref.slice(5))}">${esc((D.tasks[a.ref.slice(5)]||{}).name||"a task")}</button></div>`).join("")}
 ${myApprovals.length?`<div class="banner">${myApprovals.length} kid check-off${myApprovals.length>1?"s":""} waiting for your OK. <button class="linkish" data-tab="family">Review</button></div>`:""}
 ${warr.map(x=>`<div class="banner">Warranty on ${esc(x.name)} ends ${nice(x.warranty)}.</div>`).join("")}
 <div class="meter"><div class="${late.length?"is-late":""}"><b>${late.length}</b><span>overdue</span></div><div><b>${tod.length}</b><span>due today · ${mins} min</span></div><div><b>${doneToday}</b><span>done today</span></div></div>
 <section class="group"><div class="calbox"><b>How much time do you have?</b><div class="chips" style="margin:0">${[10,20,30,45,60,90].map(m=>`<button class="chip" data-plan="${m}" aria-pressed="${ui.plan&&ui.plan.mins===m}">${m<60?m+" min":m/60+" hr"+(m>60?"s":"")}</button>`).join("")}${kids().length?`<button class="chip" data-kidview="1">Kid view</button>`:""}</div>${ui.plan?planBlock():""}</div></section>
 ${shiftCard()}
 ${late.length?g("Catch up",late,""):""}
 ${g("Due today",tod,"<strong>Nothing due today.</strong> Enjoy the quiet, or get ahead on something below.")}
 ${g("Coming up this week",soon,"Nothing else this week.")}`;
}
function planBlock(){
 const ids=ui.plan.ids.filter(id=>D.tasks[id]);const list=ids.map(id=>D.tasks[id]);
 const total=list.reduce((a,t)=>a+(t.mins|0),0);
 const s=timer.running?Math.max(0,Math.round((timer.end-Date.now())/1000)):timer.left;
 if(!list.length)return `<p class="note" style="margin:0">Nothing's due. You're ahead.</p>`;
 return `<p class="note" style="margin:0">${list.length} task${list.length>1?"s":""} · ${total} min, oldest first</p>
 <div class="list">${list.map(t=>`<div class="row" style="grid-template-columns:auto 1fr"><button class="check" data-done="${t.id}" aria-label="Mark ${esc(t.name)} done">${I.check}</button><button class="main" data-edit="${t.id}"><span class="name">${esc(t.name)}</span><span class="meta"><span>${t.mins} min</span><span>${esc(t.room)}</span></span></button></div>`).join("")}</div>
 <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><span class="stamp" id="clock" style="font-size:1.4rem">${fmtTime(s)}</span>${timer.running?`<button class="btn small" data-timer="pause">Pause</button>`:`<button class="btn small primary" data-timer="start">${s<total*60?"Resume":"Start timer"}</button>`}<button class="btn small" data-timer="reset">Reset</button><button class="linkish" data-plan="0">Close</button></div>`;
}
function viewShift(){
 const rs=routines();
 if(!rs.length)return `<header class="top"><div><div class="eyebrow">Routines</div><h1>Closing shift</h1></div></header>${note()}<div class="empty"><strong>No shift yet.</strong> A closing shift is the short list everyone runs before bed, each with their own part. ${S.canWrite?`<div style="margin-top:12px"><button class="btn primary" data-mkclosing="1">Start a closing shift</button></div>`:""}</div>`;
 if(!ui.routine||!D.routines[ui.routine])ui.routine=(rs.find(routineRunsTonight)||rs[0]).id;
 const r=D.routines[ui.routine],done=r.items.filter(i=>D.checks[checkId(r.id,i.id)]).length;
 const chips=`<div class="chips">${rs.map(x=>`<button class="chip" data-routine="${x.id}" aria-pressed="${x.id===r.id}">${esc(x.name)}</button>`).join("")}${S.canWrite?`<button class="chip" data-newroutine="1">+ New routine</button>`:""}</div>`;
 if(ui.editShift)return viewShiftEdit(r,chips);
 const me=myPid(),order=[...r.items].sort((a,b)=>(a.assignee===me?0:1)-(b.assignee===me?0:1));
 return `<header class="top"><div><div class="eyebrow">${routineRunsTonight(r)?`Tonight · ${t12(r.time)}`:"Not scheduled tonight"}</div><h1>${esc(r.name)}</h1></div>${S.canWrite?`<button class="btn small" data-editshift="1">Edit</button>`:""}</header>${note()}${chips}
 <div class="progress" style="margin-top:0"><i style="width:${r.items.length?done/r.items.length*100:0}%"></i></div>
 <p class="note" style="margin:0 0 14px">${done} of ${r.items.length} done${done===r.items.length&&r.items.length?" · the house is closed for the night":""}. Resets at 4 AM.</p>
 <div class="list">${order.map(i=>{const c=D.checks[checkId(r.id,i.id)],nc=commentsFor("item:"+r.id+":"+i.id).length;
  return `<div class="row"><button class="check ${c?"done":""}" data-tick="${i.id}" aria-label="${c?"Uncheck":"Check"} ${esc(i.text)}" ${S.canWrite?"":"disabled"}>${I.check}</button>
  <button class="main" data-item="${i.id}"><span class="name">${esc(i.text)}</span><span class="meta"><span class="who">${av(i.assignee)}${esc(pShort(i.assignee))}</span>${i.rotate&&i.rotate.length>1?"<span>Rotates</span>":""}${nc?`<span>${nc} comment${nc>1?"s":""}</span>`:""}</span>${i.standard?`<span class="std"><b>Done means:</b> ${esc(i.standard)}</span>`:""}</button>
  <div>${c?`<span class="checked-by">${esc(pShort(c.who))} · ${clock(c.at)}${c.pending||Object.values(D.approvals).some(a=>a.ref===c.id)?" · needs OK":""}</span>`:""}</div></div>`}).join("")||`<div class="row"><span class="muted">No items yet. Tap Edit to add some.</span></div>`}</div>
 <section class="group" style="margin-top:22px"><div class="calbox"><b>Put it on my calendar</b><p class="note" style="margin:0">One repeating event at ${t12(r.time)} with everyone's parts in the notes.</p>${calButtons("routine:"+r.id,routineAsEvent(r))}</div></section>`;
}
function viewShiftEdit(r,chips){
 const days=r.days||[0,1,2,3,4,5,6];
 return `<header class="top"><div><div class="eyebrow">Editing</div><h1>${esc(r.name)}</h1></div><button class="btn small primary" data-doneedit="1">Done</button></header>${chips}
 <div class="calbox" style="margin-bottom:16px"><div class="grid2"><label class="field"><span>Name</span><input type="text" id="r-name" value="${esc(r.name)}"></label><label class="field"><span>Starts at</span><input type="time" id="r-time" value="${esc(r.time||"21:00")}"></label></div>
 <div class="field"><span>Runs on</span><div class="daypick">${DAYS.map((d,i)=>`<label><input type="checkbox" data-rday="${i}" ${days.includes(i)?"checked":""}>${d.slice(0,3)}</label>`).join("")}</div></div></div>
 <div class="list">${r.items.map((i,ix)=>`<div class="row" style="grid-template-columns:1fr auto"><button class="main" data-item="${i.id}"><span class="name">${esc(i.text)}</span><span class="meta"><span class="who">${av(i.assignee)}${esc(pShort(i.assignee))}</span>${i.standard?"<span>Has a standard</span>":""}</span></button><span style="display:flex;gap:4px"><button class="btn small" data-up="${ix}" ${ix?"":"disabled"} aria-label="Move up">↑</button><button class="btn small danger" data-rmitem="${i.id}" aria-label="Remove ${esc(i.text)}">✕</button></span></div>`).join("")}</div>
 <div class="cmtform" style="margin-top:12px"><input type="text" id="r-new" placeholder="Add an item, e.g. Start the dishwasher"><button class="btn primary" data-additem="1">Add</button></div>
 <div style="margin-top:22px">${ui.confirmRmRoutine?`<span class="confirm">Delete this whole routine? <button class="btn small danger" data-rmroutine="2">Delete</button><button class="btn small" data-rmroutine="0">Keep</button></span>`:`<button class="btn danger" data-rmroutine="1">Delete routine</button>`}</div>`;
}
function viewHouse(){
 const seg=`<div class="seg" role="group" aria-label="View">${[["mine","My tasks"],["fit","Suggested"],["lib","Full library"]].map(([v,l])=>`<button data-hv="${v}" aria-pressed="${ui.houseView===v}">${l}</button>`).join("")}</div>`;
 if(ui.houseView!=="mine")return viewLibrary(seg);
 const rooms=["All",...ROOMS.filter(r=>tasks().some(t=>t.room===r))];
 const ts=tasks().filter(t=>passWho(t)&&(ui.room==="All"||t.room===ui.room)&&(!ui.q||t.name.toLowerCase().includes(ui.q.toLowerCase())));
 const by={};ts.forEach(t=>(by[t.room]=by[t.room]||[]).push(t));
 const weekMins=tasks().reduce((a,t)=>a+(t.mins|0)*7/intervalDays(t),0);
 return `<header class="top"><div><div class="eyebrow">${tasks().length} tasks · about ${Math.round(weekMins/6)/10} hrs a week</div><h1>The house</h1></div>${seg}</header>${note()}
 <div class="toolbar"><input type="search" id="q" placeholder="Search tasks" value="${esc(ui.q)}">${S.canWrite?`<button class="btn primary" data-new="1">New task</button>`:""}</div>
 ${multiUser()?`<div style="margin-bottom:10px">${whoFilter()}</div>`:""}
 <div class="chips">${rooms.map(r=>`<button class="chip" data-room="${esc(r)}" aria-pressed="${ui.room===r}">${esc(r)}</button>`).join("")}</div>
 ${Object.keys(by).length?ROOMS.filter(r=>by[r]).map(r=>{const f=freshness(r);return `<section class="group"><div class="group-head"><h2>${esc(r)}</h2><span class="stamp muted">${f==null?"":Math.round(f*100)+"% fresh"}</span></div>${f==null?"":`<div class="progress fresh" style="margin:0 0 8px"><i style="width:${Math.round(f*100)}%;background:${f<.25?"var(--late)":f<.5?"var(--soon)":"var(--accent)"}"></i></div>`}<div class="list">${by[r].sort((a,b)=>a.next.localeCompare(b.next)).map(t=>taskRow(t)).join("")}</div></section>`}).join(""):`<div class="empty"><strong>No tasks match.</strong> Try Everyone, or add some from Suggested.</div>`}`;
}
function viewLibrary(seg){
 const tags=tagsOf(D.house&&D.house.profile),have=new Set(tasks().map(t=>t.lib));
 let items=LIB.filter(l=>(ui.libRoom==="All"||l.room===ui.libRoom)&&(!ui.q||l.name.toLowerCase().includes(ui.q.toLowerCase())));
 if(ui.houseView==="fit")items=items.filter(l=>libFits(l,tags)&&!have.has(l.lib));
 const rooms=["All",...ROOMS.filter(r=>LIB.some(l=>l.room===r))];
 return `<header class="top"><div><div class="eyebrow">${ui.houseView==="fit"?items.length+" that fit your home and aren't added yet":LIB.length+" tasks to choose from"}</div><h1>Library</h1></div>${seg}</header>${note()}
 <div class="toolbar"><input type="search" id="q" placeholder="Search: filter, gutters, sheets…" value="${esc(ui.q)}">${ui.houseView==="fit"&&items.length&&S.canWrite?`<button class="btn primary" data-addall="1">Add all ${items.length}</button>`:""}</div>
 <div class="chips">${rooms.map(r=>`<button class="chip" data-libroom="${esc(r)}" aria-pressed="${ui.libRoom===r}">${esc(r)}</button>`).join("")}</div>
 <div class="list">${items.map(l=>`<div class="row" style="grid-template-columns:1fr auto"><div class="main"><span class="name">${esc(l.name)}</span><span class="meta"><span>${esc(l.room)}</span><span>${freqText(l)}</span><span>${l.mins} min</span>${l.steps.length?`<span>${l.steps.length}-step checklist</span>`:""}</span></div>${have.has(l.lib)?`<span class="pill cal">Added</span>`:S.canWrite?`<button class="btn small" data-add="${l.lib}">Add</button>`:""}</div>`).join("")||`<div class="row"><span class="muted">${ui.houseView==="fit"?"Everything that fits your home is already added.":"Nothing matches. Make it yourself under My tasks → New task."}</span></div>`}</div>`;
}
function calButtons(key,ev){
 const a=ME.calAdded[key];
 if(a)return `<p class="note" style="margin:0">${a.unconfirmed?"This may not have saved. Check your calendar.":`On your ${esc(a.cal||"")} calendar since ${nice(a.added)}. Edits here don't change that event.`}</p><button class="linkish" data-calreset="${esc(key)}" style="text-align:left">It's not on my calendar anymore</button>`;
 const name=ui.cal.list&&ME.calendarId?(ui.cal.list.find(c=>c.id===ME.calendarId)||{}).name:"";
 return `<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">${name?`<button class="btn primary small" data-addcal="${esc(key)}" ${ui.calBusy===key?"disabled":""}>${ui.calBusy===key?"Adding…":"Add to "+esc(name)}</button>`:`<button class="btn small" data-gocal="1">Set up calendar</button>`}<a class="linkish" href="${esc(gcalLink(ev))}" target="_blank" rel="noopener">Open in Google Calendar</a></div>${ui.calMsg&&ui.calMsg.key===key?`<p class="note err">${esc(ui.calMsg.msg)}</p>`:""}`;
}
function viewFamily(){
 const acts=Object.values(D.activity).sort((a,b)=>b.at-a.at),seen=ME.lastSeen||0,ws=weekStats(),aps=Object.values(D.approvals).sort((a,b)=>a.at-b.at);
 const canApprove=!isKid(myPid());
 setTimeout(()=>{if(unread()&&ui.tab==="family"){ME.lastSeen=Date.now();saveMe()}},1500);
 const totalMins=Object.values(ws).reduce((a,x)=>a+x.mins,0)||1;
 const hist=acts.filter(a=>(a.kind==="task"||a.kind==="check")&&(!ui.histWho||a.who===ui.histWho));
 const byDay={};hist.forEach(a=>{const d=ymd(new Date(a.at));(byDay[d]=byDay[d]||[]).push(a)});
 return `<header class="top"><div><div class="eyebrow">${people().length} in this house</div><h1>Family</h1></div>${kids().length?`<button class="btn small" data-kidview="1">Kid view</button>`:""}</header>${note()}
 ${aps.length&&canApprove?`<section class="group"><div class="group-head"><h2>Waiting for your OK</h2><span class="stamp muted">${aps.length}</span></div><div class="list">${aps.map(a=>`<div class="row" style="grid-template-columns:auto 1fr auto">${av(a.who)}<span><span class="name">${esc(pName(a.who))}: ${esc(a.label)}</span><span class="meta"><span>${a.kind==="reward"?`wants this reward · ${a.pts} stars`:`${a.pts} star${a.pts>1?"s":""}`}</span><span>${ago(a.at)}</span></span>${a.photo?`<img src="${esc(photoUrl(a.photo))}" alt="Photo of ${esc(a.label)}" style="max-width:160px;border-radius:8px;margin-top:6px">`:""}</span><span style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn small primary" data-approve="${a.id}">OK</button><button class="btn small" data-reject="${a.id}">${a.kind==="reward"?"Not now":"Redo"}</button></span></div>`).join("")}</div></section>`:""}
 <section class="group"><div class="group-head"><h2>This week</h2><span class="stamp muted">last 7 days</span></div><div class="list">${people().map(p=>{const x=ws[p.id]||{pts:0,mins:0,n:0},sk=streakOf(p.id);return `<div class="row" style="grid-template-columns:auto 1fr auto">${av(p.id)}<span style="min-width:0"><span class="name">${esc(pName(p.id))}${p.id===myPid()?" (you)":""}</span><span class="meta"><span>${x.n} done</span><span>${x.mins} min</span>${sk?`<span>${sk}-day streak</span>`:""}</span><span class="progress"><i style="width:${Math.round(x.mins/totalMins*100)}%;background:${p.color||"var(--accent)"}"></i></span></span><span class="stamp">${x.pts} ★</span></div>`}).join("")}</div><p class="note">Bars show each person's share of the minutes done this week.</p></section>
 <section class="group"><div class="group-head"><h2>What's new</h2><span class="stamp muted">${unread()} new</span></div>${acts.length?`<div class="list feed">${acts.slice(0,30).map(a=>`<div class="ev ${a.by!==S.uid&&a.at>seen?"new":""}">${av(a.who||"")}<span><b>${esc(actorName(a))}</b> ${esc(a.text)}${a.photo?` <a class="linkish" href="${esc(photoUrl(a.photo))}" target="_blank" rel="noopener">photo</a>`:""}</span><span class="stamp muted">${ago(a.at)}</span></div>`).join("")}</div>`:`<div class="empty">When anyone checks something off or comments, it shows up here and pops up for everyone who has Upkeep open.</div>`}</section>
 <section class="group"><div class="group-head"><h2>History</h2><select id="histwho" style="width:auto"><option value="">Everyone</option>${people().map(p=>`<option value="${p.id}" ${ui.histWho===p.id?"selected":""}>${esc(pName(p.id))}</option>`).join("")}</select></div>${Object.keys(byDay).length?Object.keys(byDay).slice(0,14).map(d=>`<div class="eyebrow" style="margin:12px 0 6px">${nice(d)} · ${byDay[d].length} done</div><div class="list feed">${byDay[d].map(a=>`<div class="ev">${av(a.who)}<span><b>${esc(pShort(a.who))}</b> ${esc(a.text)}</span><span class="stamp muted">${clock(a.at)}</span></div>`).join("")}</div>`).join(""):`<div class="empty">Nothing finished yet.</div>`}</section>
 <section class="group"><div class="group-head"><h2>People</h2>${S.canWrite?`<button class="btn small" data-newperson="1">Add a kid or person</button>`:""}</div><div class="list">${people().map(p=>`<button class="row main" data-person="${p.id}" style="grid-template-columns:auto 1fr auto;width:100%">${av(p.id)}<span><span class="name">${esc(pName(p.id))}${p.id===myPid()?" (you)":""}</span><span class="meta"><span>${p.role==="kid"?"Kid":"Adult"}</span><span>${p.role==="kid"?"Uses Kid view":"Has their own phone"}</span><span>${pointsOf(p.id)} ★ total</span></span></span><span class="linkish">Edit</span></button>`).join("")}</div>
 ${inviteBlock()}</section>`;
}
function viewKid(){
 const k=ui.kid==="pick"?null:D.people[ui.kid];
 if(!k)return `<header class="top"><div><div class="eyebrow">Kid view</div><h1>Who's doing chores?</h1></div><button class="btn small" data-exitkid="1">Back</button></header>
  <div class="kidpick">${kids().map(p=>`<button data-kidpick="${p.id}">${av(p.id,64)}<b>${esc(pName(p.id))}</b><span>${pointsOf(p.id)} stars</span></button>`).join("")||`<div class="empty">Add a kid on the Family tab first.</div>`}</div>`;
 const mine=tasks().filter(t=>t.assignee===k.id&&status(t)!=="later"&&status(t)!=="soon");
 const r=routines().find(routineRunsTonight);const items=r?r.items.filter(i=>i.assignee===k.id):[];
 const pend=Object.values(D.approvals).filter(a=>a.who===k.id);
 const rewards=Object.values(D.rewards).sort((a,b)=>a.cost-b.cost),pts=pointsOf(k.id);
 const cpp=(D.house&&D.house.centsPerPoint)|0;
 const allDone=!mine.length&&items.every(i=>D.checks[checkId(r.id,i.id)]);
 return `<header class="top"><div><div class="eyebrow">Hi ${esc(pName(k.id))}!</div><h1>Your chores</h1></div><button class="btn small" data-exitkid="1">Done</button></header>
 <div class="kidstars">${I.star}<b>${pts}</b><span>stars${cpp?` · ${money(pts*cpp)}`:""}</span>${streakOf(k.id)>1?`<span>· ${streakOf(k.id)} days in a row</span>`:""}</div>
 ${allDone?`<div class="kidcard done"><b>All done for today!</b><span>Go have fun.</span></div>`:""}
 <div class="kidgrid">
 ${mine.map(t=>`<button class="kidcard" data-kiddone="${t.id}"><b>${esc(t.name)}</b>${t.standard?`<span>${esc(t.standard)}</span>`:""}${t.steps&&t.steps.length?`<span>${t.steps.map(esc).join(" · ")}</span>`:""}<em>${ptsFor(t.mins)} ★ ${t.photoProof?"· take a photo":""}</em></button>`).join("")}
 ${items.map(i=>{const c=D.checks[checkId(r.id,i.id)];return `<button class="kidcard ${c?"done":""}" data-kidtick="${i.id}" ${c?"disabled":""}><b>${esc(i.text)}</b>${i.standard?`<span>${esc(i.standard)}</span>`:""}<em>${c?"Done":"Tonight · 1 ★"}</em></button>`}).join("")}
 </div>
 ${pend.length?`<p class="note">${pend.length} waiting for a grown-up's OK.</p>`:""}
 ${rewards.length?`<section class="group"><h2 style="margin:20px 0 10px">Rewards</h2><div class="list">${rewards.map(w=>`<div class="row" style="grid-template-columns:1fr auto"><span><span class="name">${esc(w.name)}</span><span class="meta"><span>${w.cost} ★</span></span></span><button class="btn small ${pts>=w.cost?"primary":""}" data-redeem="${w.id}" ${pts>=w.cost?"":"disabled"}>${pts>=w.cost?"Ask for it":(w.cost-pts)+" more ★"}</button></div>`).join("")}</div></section>`:""}`;
}
function viewMore(){
 const tabs=[["home","Home info"],["things","Appliances"],["pros","Contractors"],["lists","Shopping"],["money","Expenses"],["kids","Kids & rewards"],["cal","Calendar"],["settings","Settings"]];
 const body={home:moreInfo,things:moreThings,pros:morePros,lists:moreLists,money:moreMoney,kids:moreKids,cal:moreCal,settings:moreSettings}[ui.more]();
 return `<header class="top"><div><div class="eyebrow">Upkeep</div><h1>${esc(tabs.find(t=>t[0]===ui.more)[1])}</h1></div></header>${note()}
 <div class="chips">${tabs.map(([k,l])=>`<button class="chip" data-more="${k}" aria-pressed="${ui.more===k}">${l}</button>`).join("")}</div>${body}`;
}
function moreInfo(){
 const rows=Object.values(D.info).sort((a,b)=>(a.order||0)-(b.order||0));const have=new Set(rows.map(r=>r.label));
 return `<p class="note" style="margin-top:0">The things everyone asks about. Anyone this page is shared with can see these, so keep alarm codes and passwords to what you'd tell a house guest.</p>
 <div class="list">${rows.map(r=>`<button class="row main" data-form="info:${r.id}" style="grid-template-columns:1fr auto;width:100%"><span style="min-width:0"><span class="eyebrow">${esc(r.label)}</span><span class="name" style="font-weight:500">${esc(r.value)||'<span class="muted">Tap to fill in</span>'}</span></span><span class="linkish">Edit</span></button>`).join("")||`<div class="row"><span class="muted">Nothing here yet. Pick one below.</span></div>`}</div>
 ${S.canWrite?`<div class="chips" style="margin-top:12px">${INFO_SUGGEST.filter(l=>!have.has(l)).map(l=>`<button class="chip" data-infoadd="${esc(l)}">+ ${esc(l)}</button>`).join("")}<button class="chip" data-infoadd="">+ Something else</button></div>`:""}`;
}
function moreThings(){
 const xs=Object.values(D.things).sort((a,b)=>(a.room||"").localeCompare(b.room||"")||a.name.localeCompare(b.name));
 return `<p class="note" style="margin-top:0">Appliances and systems: model, serial, warranty, manual and every repair. Handy for insurance, resale and calling a repair person.</p>
 ${S.canWrite?`<div class="toolbar"><button class="btn primary" data-form="things:new">Add appliance</button></div>`:""}
 <div class="list">${xs.map(x=>{const sv=Object.values(D.service).filter(s=>s.thing===x.id).sort((a,b)=>b.date.localeCompare(a.date));const w=x.warranty?daysBetween(today(),x.warranty):null;
  return `<button class="row main" data-thing="${x.id}" style="grid-template-columns:${x.photo?"56px ":""}1fr auto;width:100%">${x.photo?`<img src="${esc(photoUrl(x.photo))}" alt="" style="width:56px;height:56px;object-fit:cover;border-radius:8px">`:""}<span style="min-width:0"><span class="name">${esc(x.name)}</span><span class="meta">${x.room?`<span>${esc(x.room)}</span>`:""}${x.brand?`<span>${esc(x.brand)} ${esc(x.model||"")}</span>`:""}<span>${sv.length} service record${sv.length===1?"":"s"}</span></span></span>${w==null?"":`<span class="pill ${w<0?"cal":w<60?"soon":"today"}">${w<0?"Warranty over":"Warranty to "+nice(x.warranty)}</span>`}</button>`}).join("")||`<div class="row"><span class="muted">No appliances yet. Start with the furnace, water heater, fridge and washer.</span></div>`}</div>`;
}
function morePros(){
 const xs=Object.values(D.pros).sort((a,b)=>a.name.localeCompare(b.name));
 return `${S.canWrite?`<div class="toolbar"><button class="btn primary" data-form="pros:new">Add contractor</button></div>`:""}<div class="list">${xs.map(p=>{const jobs=Object.values(D.service).filter(s=>s.pro===p.id);return `<button class="row main" data-form="pros:${p.id}" style="grid-template-columns:1fr auto;width:100%"><span style="min-width:0"><span class="name">${esc(p.name)}</span><span class="meta"><span>${esc(p.trade||"")}</span>${p.phone?`<span class="stamp">${esc(p.phone)}</span>`:""}<span>${jobs.length} job${jobs.length===1?"":"s"}</span>${p.rating?`<span>${"★".repeat(p.rating)}</span>`:""}</span>${p.notes?`<span class="std">${esc(p.notes)}</span>`:""}</span><span class="linkish">Edit</span></button>`}).join("")||`<div class="row"><span class="muted">Plumber, electrician, HVAC, lawn, handyman… save the good ones here.</span></div>`}</div>`;
}
function moreLists(){
 const names=[...new Set([...LISTS,...((D.house&&D.house.lists)||[])])];
 const its=Object.values(D.items).filter(i=>i.list===ui.list);
 const open=its.filter(i=>!i.done).sort((a,b)=>a.at-b.at),bought=its.filter(i=>i.done).sort((a,b)=>(b.n||0)-(a.n||0));
 return `<div class="chips">${names.map(n=>`<button class="chip" data-list="${esc(n)}" aria-pressed="${ui.list===n}">${esc(n)} <span class="stamp">${Object.values(D.items).filter(i=>i.list===n&&!i.done).length}</span></button>`).join("")}${S.canWrite?`<button class="chip" data-newlist="1">+ New list</button>`:""}</div>
 ${ui.newList?`<div class="cmtform" style="margin-bottom:12px"><input type="text" id="nl-name" placeholder="List name, e.g. Costco"><button class="btn" data-savelist="1">Create</button></div>`:""}
 ${S.canWrite?`<div class="cmtform" style="margin-bottom:12px"><input type="text" id="li-new" placeholder="Add to ${esc(ui.list)}"><button class="btn primary" data-additem2="1">Add</button></div>`:""}
 <div class="list">${open.map(i=>`<div class="row" style="grid-template-columns:auto 1fr auto"><button class="check" data-buy="${i.id}" aria-label="Got ${esc(i.text)}">${I.check}</button><span style="min-width:0"><span class="name">${esc(i.text)}</span><span class="meta"><span class="who">${av(i.who)}${esc(pShort(i.who))}</span></span></span><button class="btn small" data-rmli="${i.id}" aria-label="Remove ${esc(i.text)}">✕</button></div>`).join("")||`<div class="row"><span class="muted">List is empty.</span></div>`}</div>
 ${bought.length?`<div class="eyebrow" style="margin:16px 0 6px">Buy again</div><div class="chips" style="flex-wrap:wrap">${bought.slice(0,24).map(i=>`<button class="chip" data-again="${i.id}">+ ${esc(i.text)}</button>`).join("")}</div>`:""}
 ${ui.list==="Groceries"?`<p class="note">Meal planning lives in Extract, your recipe app.</p>`:""}`;
}
function moreMoney(){
 const xs=Object.values(D.expenses).sort((a,b)=>b.date.localeCompare(a.date)),b=balances(),st=settleUp();
 return `<p class="note" style="margin-top:0">Shared house costs: utilities, supplies, repairs. Split evenly between the people you pick.</p>
 ${S.canWrite?`<div class="toolbar"><button class="btn primary" data-form="expenses:new">Add expense</button></div>`:""}
 <section class="group"><div class="group-head"><h2>Settle up</h2></div><div class="list">${st.map(([from,to,amt])=>`<div class="row" style="grid-template-columns:1fr auto"><span><b>${esc(pShort(from))}</b> owes <b>${esc(pName(to))}</b></span><span class="stamp">${money(amt)}</span></div>`).join("")||`<div class="row"><span class="muted">Everyone's even.</span></div>`}</div></section>
 <section class="group"><div class="group-head"><h2>Recent</h2></div><div class="list">${xs.slice(0,40).map(e=>`<button class="row main" data-form="expenses:${e.id}" style="grid-template-columns:1fr auto;width:100%"><span><span class="name">${esc(e.what)}</span><span class="meta"><span>${esc(pShort(e.paidBy))} paid</span><span>${nice(e.date)}</span><span>split ${(e.split||[]).length||adults().length} ways</span></span></span><span class="stamp">${money(e.amount)}</span></button>`).join("")||`<div class="row"><span class="muted">No expenses yet.</span></div>`}</div></section>`;
}
function moreKids(){
 const ws=Object.values(D.rewards).sort((a,b)=>a.cost-b.cost),h=D.house||{};
 return `<div class="calbox" style="margin-bottom:16px">
  <label class="switch"><input type="checkbox" id="kidok" ${h.kidApproval!==false?"checked":""} ${S.canWrite&&!isKid(myPid())?"":"disabled"}><span>Kids' check-offs wait for a grown-up's OK before stars count</span></label>
  <div class="grid2"><label class="field"><span>Allowance per star</span><select id="cpp" ${S.canWrite?"":"disabled"}>${[0,5,10,25,50,100].map(c=>`<option value="${c}" ${(h.centsPerPoint|0)===c?"selected":""}>${c?money(c):"No money, just stars"}</option>`).join("")}</select></label></div>
  <p class="note" style="margin:0">Stars: 1 for a quick job, up to 5 for a long one. Shift items are 1 star.</p></div>
 <section class="group"><div class="group-head"><h2>Rewards</h2>${S.canWrite?`<button class="btn small" data-form="rewards:new">Add reward</button>`:""}</div><div class="list">${ws.map(w=>`<button class="row main" data-form="rewards:${w.id}" style="grid-template-columns:1fr auto;width:100%"><span class="name">${esc(w.name)}</span><span class="stamp">${w.cost} ★</span></button>`).join("")||`<div class="row"><span class="muted">Ideas: pick the movie (20 ★), stay up 30 minutes late (30 ★), a trip for ice cream (50 ★).</span></div>`}</div></section>
 <section class="group"><div class="group-head"><h2>Balances</h2></div><div class="list">${kids().map(k=>`<div class="row" style="grid-template-columns:auto 1fr auto">${av(k.id)}<span class="name">${esc(pName(k.id))}</span><span style="display:flex;gap:8px;align-items:center"><span class="stamp">${pointsOf(k.id)} ★${h.centsPerPoint?" · "+money(pointsOf(k.id)*h.centsPerPoint):""}</span>${h.centsPerPoint&&pointsOf(k.id)>0&&S.canWrite?`<button class="btn small" data-payout="${k.id}">Paid out</button>`:""}</span></div>`).join("")||`<div class="row"><span class="muted">Add kids on the Family tab.</span></div>`}</div></section>`;
}
function moreCal(){
 const pending=tasks().filter(t=>!ME.calAdded["task:"+t.id]&&(t.assignee===myPid()||!t.assignee||S.isOwner));
 const sel=ui.cal.list?`<label class="field"><span>Add my events to</span><select id="calpick"><option value="">Choose a calendar</option>${ui.cal.list.map(c=>`<option value="${esc(c.id)}" ${c.id===ME.calendarId?"selected":""}>${esc(c.name)}</option>`).join("")}</select></label>`:ui.cal.err==="none"?`<p class="note">Direct adding isn't available here. Each task has an Open in Google Calendar link instead.</p>`:`<button class="btn primary" data-loadcal="1" ${ui.cal.loading?"disabled":""}>${ui.cal.loading?"Loading calendars…":"Connect my Google Calendar"}</button>`;
 const b=ui.bulk;
 return `<div class="calbox"><p class="note" style="margin:0">Each task becomes one repeating event on your own calendar, marked free so it doesn't block time. Seasonal tasks repeat on the first Saturday of their month. Everyone sets this up for themselves.</p>${sel}${ui.cal.err&&ui.cal.err!=="none"?`<p class="note err">${esc(ui.cal.err)}</p>`:""}
 <div class="grid2"><label class="field"><span>Reminder</span><select id="remind">${[[-1,"Calendar default"],[0,"At start"],[10,"10 min before"],[30,"30 min before"],[60,"1 hour before"],[1440,"1 day before"]].map(([v,l])=>`<option value="${v}" ${Number(ME.reminder)===v?"selected":""}>${l}</option>`).join("")}</select></label><label class="field"><span>Default time for new tasks</span><input type="time" id="deftime" value="${esc(ME.defaultTime||"09:00")}"></label></div>
 ${ui.cal.list&&ME.calendarId&&pending.length?`<button class="btn primary" data-bulk="1" ${b&&b.running?"disabled":""}>${b&&b.running?`Adding ${b.done} of ${b.total}…`:`Add ${pending.length} ${S.isOwner?"":"of my "}tasks to my calendar`}</button>`:""}${b&&b.msg?`<p class="note ${b.err?"err":""}">${esc(b.msg)}</p>`:""}</div>
 <section class="group" style="margin-top:18px"><div class="calbox"><b>Fridge chart</b><p class="note" style="margin:0">This week's chores by person plus the closing shift, as a page you can print.</p><div><button class="btn" data-chart="1" ${S.downloads?"":"disabled"}>Save printable chart</button></div>${S.downloads?"":`<p class="note">Saving files isn't available in this view.</p>`}</div></section>`;
}
function moreSettings(){
 const pr=(D.house&&D.house.profile)||{};
 return `<section class="group"><div class="calbox"><b>Away mode</b><p class="note" style="margin:0">Going on a trip? Turn this on and nothing goes overdue. When you're back, every due date moves forward by the days you were gone.</p>${paused()?`<button class="btn primary" data-unpause="1">I'm back</button>`:`<button class="btn" data-pause="1" ${S.canWrite?"":"disabled"}>Turn on Away mode</button>`}</div></section>
 <section class="group"><div class="group-head"><h2>Your home</h2></div>${profileForm(pr)}<p class="note">Changing this updates the Suggested list under House. It doesn't remove tasks you already have.</p></section>`;
}
function profileForm(pr){
 const seg=(k,opts)=>`<div class="seg" role="group">${opts.map(([v,l])=>`<button data-prof="${k}" data-v="${v}" aria-pressed="${pr[k]===v}">${l}</button>`).join("")}</div>`;
 return `<div class="calbox"><div class="field"><span>Type of home</span>${seg("home",[["house","House"],["townhouse","Townhouse"],["apartment","Apartment"]])}</div>
 <div class="field"><span>Own or rent</span>${seg("own",[["own","Own"],["rent","Rent"]])}</div>
 <div class="field"><span>Your home has</span><div class="chips" style="flex-wrap:wrap;margin:0">${PROFILE_Q.map(([k,l])=>`<button class="chip" data-proft="${k}" aria-pressed="${!!pr[k]}">${l}</button>`).join("")}</div></div></div>`;
}
function viewSetup(){
 const pr=ui.setup||(ui.setup={home:"house",own:"own",closing:true});
 const tags=tagsOf(pr),fit=LIB.filter(l=>libFits(l,tags)),count=fit.filter(l=>l.unit!=="day").length+Math.min(STARTER_DAILY_CAP,fit.filter(l=>l.unit==="day").length);
 return `<header class="top"><div><div class="eyebrow">Upkeep · set up your house</div><h1>Tell us about your home</h1></div></header>${note()}
 <p class="lede">Upkeep picks the tasks that fit your home, sets each one to the right season (furnace in fall, AC in spring, faucets before the first freeze), and spreads the rest so nothing piles up on day one.</p>
 ${profileForm(pr)}
 <label class="pack" style="margin-top:12px"><input type="checkbox" id="su-closing" ${pr.closing?"checked":""}><span><b>Closing shift</b><small>A nightly checklist the family splits up: dishes, counters, doors, lights</small></span></label>
 <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px;align-items:center"><button class="btn primary" data-setup="1">Add ${count} tasks</button><button class="btn" data-setup="0">Start empty</button></div>`;
}

/* ---------- Sheets ---------- */
function commentBlock(ref,label){
 const cs=commentsFor(ref);
 return `<div class="field"><span>Comments</span><div class="comments">${cs.map(c=>`<div class="cmt">${av(c.who)}<div><b>${esc(pShort(c.who))}</b> <span class="when">${ago(c.at)}</span><div>${esc(c.text)}</div></div></div>`).join("")||`<span class="note">No comments yet.</span>`}</div>${S.canWrite&&multiUser()?`<div class="cmtform"><input type="text" id="c-text" placeholder="Leave a note for the family"><button class="btn" data-comment="${esc(ref)}" data-label="${esc(label)}">Post</button></div>`:""}</div>`;
}
function rotatePick(list,id){return `<div class="field"><span>Rotate between (passes to the next person each time it's done)</span><div class="chips" style="flex-wrap:wrap;margin:0">${people().map(p=>`<label class="chip"><input type="checkbox" data-rot="${id}" value="${p.id}" ${list&&list.includes(p.id)?"checked":""} ${S.canWrite?"":"disabled"} style="margin-right:4px;accent-color:var(--accent)">${esc(pName(p.id))}</label>`).join("")}</div></div>`}
const FORMS={
 info:{title:"Home info",fields:[["label","Label","text"],["value","Value","textarea"]]},
 things:{title:"Appliance",fields:[["name","Name","text","Furnace, fridge, water heater…"],["room","Where","text"],["brand","Brand","text"],["model","Model number","text"],["serial","Serial number","text"],["bought","Bought or installed","date"],["warranty","Warranty ends","date"],["manual","Manual link","text","https://…"],["filter","Filter or part size","text"],["notes","Notes","textarea"]],photo:true},
 service:{title:"Service record",fields:[["date","Date","date"],["what","What was done","text"],["cost","Cost ($)","money"],["pro","Who did it","pro"],["notes","Notes","textarea"]]},
 pros:{title:"Contractor",fields:[["name","Name or company","text"],["trade","Trade","text","Plumber, HVAC, electrician…"],["phone","Phone","text"],["email","Email","text"],["rating","Rating (1–5)","number"],["notes","Notes","textarea"]]},
 expenses:{title:"Expense",fields:[["what","What for","text","Power bill, groceries…"],["amount","Amount ($)","money"],["date","Date","date"],["paidBy","Paid by","person"],["split","Split between","people"]]},
 rewards:{title:"Reward",fields:[["name","Reward","text","Pick the movie"],["cost","Cost in stars","number"]]},
 people:{title:"Person",fields:[["name","Name","text"],["role","Role","role"],["color","Color","color"]]}
};
function formSheet(s){
 const f=FORMS[s.col],d=s.data,ro=S.canWrite?"":"disabled";
 const inp=([k,label,type,ph])=>{
  const v=d[k];
  if(type==="textarea")return `<label class="field"><span>${label}</span><textarea id="g-${k}" style="min-height:70px" ${ro}>${esc(v||"")}</textarea></label>`;
  if(type==="money")return `<label class="field"><span>${label}</span><input type="number" step="0.01" min="0" id="g-${k}" value="${v!=null&&v!==""?(v/100).toFixed(2):""}" ${ro}></label>`;
  if(type==="person")return `<label class="field"><span>${label}</span><select id="g-${k}" ${ro}>${people().map(p=>`<option value="${p.id}" ${p.id===(v||myPid())?"selected":""}>${esc(pName(p.id))}</option>`).join("")}</select></label>`;
  if(type==="people"){const sel=v&&v.length?v:adults().map(p=>p.id);return `<div class="field"><span>${label}</span><div class="chips" style="flex-wrap:wrap;margin:0">${people().map(p=>`<label class="chip"><input type="checkbox" data-gk="${k}" value="${p.id}" ${sel.includes(p.id)?"checked":""} ${ro} style="margin-right:4px;accent-color:var(--accent)">${esc(pName(p.id))}</label>`).join("")}</div></div>`}
  if(type==="pro")return `<label class="field"><span>${label}</span><select id="g-${k}" ${ro}><option value="">Did it ourselves</option>${Object.values(D.pros).map(p=>`<option value="${p.id}" ${p.id===v?"selected":""}>${esc(p.name)}</option>`).join("")}</select></label>`;
  if(type==="role")return `<label class="field"><span>${label}</span><select id="g-${k}" ${ro}><option value="kid" ${v==="kid"?"selected":""}>Kid (simple view, stars, needs OK)</option><option value="adult" ${v!=="kid"?"selected":""}>Adult</option></select></label>`;
  if(type==="color")return `<div class="field"><span>${label}</span><div class="chips" style="margin:0">${COLORS.map(c=>`<label class="chip" style="padding:4px"><input type="radio" name="g-color" value="${c}" ${c===(v||COLORS[0])?"checked":""} ${ro} style="accent-color:${c}"><span class="av" style="background:${c}"></span></label>`).join("")}</div></div>`;
  return `<label class="field"><span>${label}</span><input type="${type}" id="g-${k}" value="${esc(v??"")}" placeholder="${esc(ph||"")}" ${ro}></label>`;
 };
 let extra="";
 if(s.col==="things"&&s.id){
  const sv=Object.values(D.service).filter(x=>x.thing===s.id).sort((a,b)=>b.date.localeCompare(a.date));
  extra=`<div class="field"><span>Service history</span><div class="list">${sv.map(x=>`<button class="row main" data-form="service:${x.id}" style="grid-template-columns:1fr auto;width:100%"><span><span class="name">${esc(x.what)}</span><span class="meta"><span>${nice(x.date)}</span><span>${x.pro&&D.pros[x.pro]?esc(D.pros[x.pro].name):"Ourselves"}</span></span></span><span class="stamp">${x.cost?money(x.cost):""}</span></button>`).join("")||`<div class="row"><span class="muted">No records yet.</span></div>`}</div>${S.canWrite?`<div><button class="btn small" data-form="service:new:${s.id}">Add service record</button></div>`:""}</div>`;
  if(d.manual)extra+=`<a class="linkish" href="${esc(d.manual)}" target="_blank" rel="noopener">Open the manual</a>`;
 }
 const photo=f.photo?`<div class="field"><span>Photo of the label or model plate</span>${d.photo?`<img src="${esc(photoUrl(d.photo))}" alt="Photo" style="max-width:220px;border-radius:8px">`:""}<input type="file" accept="image/*" id="g-photo"></div>`:"";
 return `<div class="scrim" data-close="1"></div><div class="sheet" role="dialog" aria-label="${f.title}"><div class="panel">
  <div class="bar"><h2>${s.id?"Edit":"New"} ${f.title.toLowerCase()}</h2><button class="btn small" data-close="1">Close</button></div>
  ${f.fields.map(inp).join("")}${photo}${extra}${s.err?`<p class="note err">${esc(s.err)}</p>`:""}
  ${S.canWrite?`<div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><button class="btn primary" data-gsave="1" ${s.busy?"disabled":""}>${s.busy?"Saving…":"Save"}</button>${s.id&&!(s.col==="people"&&s.id===myPid())?(s.confirmDel?`<span class="confirm">Delete? <button class="btn small danger" data-gdel="1">Delete</button><button class="btn small" data-gnodel="1">Keep</button></span>`:`<button class="btn danger" data-gaskdel="1">Delete</button>`):""}</div>`:""}
 </div></div>`;
}
async function saveForm(){
 const s=ui.sheet,f=FORMS[s.col],d=Object.assign({},s.data);delete d.id;
 for(const [k,,type] of f.fields){
  if(type==="people"){d[k]=[...document.querySelectorAll(`[data-gk="${k}"]:checked`)].map(x=>x.value);continue}
  if(type==="color"){const c=document.querySelector('input[name="g-color"]:checked');d[k]=c?c.value:COLORS[0];continue}
  const el=document.getElementById("g-"+k);if(!el)continue;
  if(type==="money")d[k]=Math.round(parseFloat(el.value||"0")*100);else if(type==="number")d[k]=el.value===""?"":Math.max(0,+el.value);else d[k]=el.value.trim();
 }
 const first=f.fields[0][0];if(!d[first]&&f.fields[0][2]!=="date"){document.getElementById("g-"+first)?.focus();return}
 if(s.col==="pros")d.rating=Math.min(5,d.rating|0);
 if(s.col==="rewards")d.cost=Math.max(1,d.cost|0);
 if(s.col==="expenses"&&!d.date)d.date=today();
 if(s.col==="service"&&!d.date)d.date=today();
 if(s.col==="info"&&!s.id)d.order=Date.now();
 const file=document.getElementById("g-photo")?.files?.[0];
 if(file&&S.photos){s.busy=true;renderLayer();
  try{d.photo=await uploadPhoto(file)}
  catch(e){s.busy=false;s.err=e&&e.code==="too_large"?"That photo is over 20 MB. Try a smaller one.":e&&e.code==="unsupported_type"?"Use a JPG, PNG, WEBP or GIF photo.":"Couldn't upload the photo. The rest wasn't saved yet; try again.";renderLayer();return}}
 const id=s.id||rid();put(s.col,id,d);
 if(s.col==="expenses"&&!s.id)logEvent({kind:"expense",text:`added an expense: ${d.what} ${money(d.amount)}`});
 if(s.col==="service"&&!s.id&&D.things[d.thing])logEvent({kind:"service",text:`logged service on the ${D.things[d.thing].name}: ${d.what}`});
 ui.sheet=null;toast("Saved");
}
function openForm(spec){
 const [col,id,extra]=spec.split(":");
 const isNew=id==="new";const data=isNew?{}:Object.assign({},D[col][id]);
 if(isNew&&col==="service")data.thing=extra;
 if(isNew&&col==="service")data.date=today();
 if(isNew&&col==="expenses")data.date=today();
 if(isNew&&col==="people")data.role="kid";
 ui.sheet={kind:"form",col,id:isNew?null:id,data};renderLayer();
}
function renderLayer(){
 let h="";const s=ui.sheet;
 if(s&&s.kind==="task"){
  const t=s.draft,ro=!S.canWrite?"disabled":"";
  h+=`<div class="scrim" data-close="1"></div><div class="sheet" role="dialog" aria-label="Task"><div class="panel">
  <div class="bar"><h2>${s.isNew?"New task":esc(t.name)}</h2><button class="btn small" data-close="1">Close</button></div>
  <label class="field"><span>Task</span><input type="text" id="f-name" value="${esc(t.name)}" placeholder="e.g. Clean the dryer vent" ${ro}></label>
  ${multiUser()?`<label class="field"><span>Whose job</span><select id="f-who" ${ro}>${peopleOptions(t.assignee)}</select></label>${rotatePick(t.rotate,"task")}`:""}
  ${!s.isNew&&t.assignee&&t.assignee!==myPid()&&S.canWrite&&status(t)!=="later"?`<div><button class="btn small" data-nudge="${s.id}">Nudge ${esc(pName(t.assignee))}</button></div>`:""}
  <div class="grid2"><label class="field"><span>Room</span><select id="f-room" ${ro}>${ROOMS.map(r=>`<option ${r===t.room?"selected":""}>${r}</option>`).join("")}</select></label><label class="field"><span>About how long (min)</span><input type="number" id="f-mins" min="1" value="${t.mins}" ${ro}></label></div>
  <div class="grid2"><label class="field"><span>Repeat every</span><input type="number" id="f-every" min="1" value="${t.every}" ${ro}></label><label class="field"><span>&nbsp;</span><select id="f-unit" ${ro}>${[["day","days"],["week","weeks"],["month","months"],["year","years"]].map(([v,l])=>`<option value="${v}" ${v===t.unit?"selected":""}>${l}</option>`).join("")}</select></label></div>
  ${t.unit==="week"?`<label class="field"><span>On</span><select id="f-wd" ${ro}>${DAYS.map((d,i)=>`<option value="${i}" ${i===t.weekday?"selected":""}>${d}</option>`).join("")}</select></label>`:""}
  <div class="field"><span>Only in these months (optional, for seasonal jobs)</span><div class="daypick">${MONTHS.map((m,i)=>`<label><input type="checkbox" data-month="${i+1}" ${(t.months||[]).includes(i+1)?"checked":""} ${ro}>${m}</label>`).join("")}</div></div>
  <div class="grid2"><label class="field"><span>Next due</span><input type="date" id="f-next" value="${esc(t.next)}" ${ro}></label><label class="field"><span>Time</span><input type="time" id="f-time" value="${esc(t.time)}" ${ro}></label></div>
  <label class="switch"><input type="checkbox" id="f-flex" ${t.flexible?"checked":""} ${ro}><span>Count from when it's finished, not a fixed date</span></label>
  <label class="switch"><input type="checkbox" id="f-photo" ${t.photoProof?"checked":""} ${ro}><span>Ask for a photo when it's done</span></label>
  <label class="field"><span>Done means (the standard)</span><textarea id="f-std" style="min-height:60px" placeholder="What finished looks like, so everyone does it the same way" ${ro}>${esc(t.standard||"")}</textarea></label>
  <label class="field"><span>Checklist (one step per line)</span><textarea id="f-steps" ${ro}>${esc((t.steps||[]).join("\n"))}</textarea></label>
  <label class="field"><span>Notes</span><input type="text" id="f-notes" value="${esc(t.notes||"")}" placeholder="Filter size, brand, who to call…" ${ro}></label>
  ${t.lastDone?`<p class="note">Last done ${nice(t.lastDone)}${t.lastBy?" by "+esc(pShort(t.lastBy)):""}.</p>`:""}
  ${s.isNew?"":commentBlock("task:"+s.id,t.name)}
  ${s.isNew?"":`<div class="calbox"><b>My calendar</b>${calButtons("task:"+s.id,t)}</div>`}
  ${S.canWrite?`<div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><button class="btn primary" data-save="1">${s.isNew?"Add task":"Save"}</button>${s.isNew?"":(s.confirmDel?`<span class="confirm">Delete for everyone? <button class="btn small danger" data-del="1">Delete</button><button class="btn small" data-nodel="1">Keep</button></span>`:`<button class="btn danger" data-askdel="1">Delete</button>`)}</div>`:""}
  </div></div>`;
 }
 if(s&&s.kind==="item"){
  const r=D.routines[s.rid],i=r&&r.items.find(x=>x.id===s.iid);
  if(i){const ro=!S.canWrite?"disabled":"",c=D.checks[checkId(r.id,i.id)];
  h+=`<div class="scrim" data-close="1"></div><div class="sheet" role="dialog" aria-label="Shift item"><div class="panel">
  <div class="bar"><div><div class="eyebrow">${esc(r.name)}</div><h2>${esc(i.text)}</h2></div><button class="btn small" data-close="1">Close</button></div>
  ${c?`<p class="checked-by">Checked by ${esc(pShort(c.who))} at ${clock(c.at)}</p>`:""}
  <label class="field"><span>Item</span><input type="text" id="i-text" value="${esc(i.text)}" ${ro}></label>
  ${multiUser()?`<label class="field"><span>Whose part</span><select id="i-who" ${ro}>${peopleOptions(i.assignee)}</select></label>${rotatePick(i.rotate,"item")}`:""}
  <label class="field"><span>Done means (the standard)</span><textarea id="i-std" style="min-height:60px" ${ro}>${esc(i.standard||"")}</textarea></label>
  <label class="field"><span>Notes</span><input type="text" id="i-notes" value="${esc(i.notes||"")}" placeholder="Where things go, tips" ${ro}></label>
  ${commentBlock("item:"+r.id+":"+i.id,i.text)}
  ${S.canWrite?`<div><button class="btn primary" data-saveitem="1">Save</button></div>`:""}</div></div>`}
 }
 if(s&&s.kind==="finish"){
  const t=D.tasks[s.id];
  h+=`<div class="scrim" data-close="1"></div><div class="sheet" role="dialog" aria-label="Finish task"><div class="panel">
  <div class="bar"><h2>${esc(t?t.name:"")}</h2><button class="btn small" data-close="1">Close</button></div>
  ${t&&t.standard?`<p class="std"><b>Done means:</b> ${esc(t.standard)}</p>`:""}
  ${S.photos?`<label class="field"><span>Add a photo of the finished job</span><input type="file" accept="image/*" capture="environment" id="fin-photo"></label>`:`<p class="note">Photos aren't available in this view, so this one goes through without one.</p>`}
  ${s.err?`<p class="note err">${esc(s.err)}</p>`:""}
  <div><button class="btn primary" data-finish="1" ${s.busy?"disabled":""}>${s.busy?"Uploading…":"Mark done"}</button></div></div></div>`;
 }
 if(s&&s.kind==="form")h+=formSheet(s);
 if(ui.toast)h+=`<div class="toast" role="status"><span>${esc(ui.toast.msg)}</span>${ui.toast.undo?'<button data-undo="1">Undo</button>':""}</div>`;
 layer.innerHTML=h;
}
function readDraft(){
 const d=ui.sheet.draft,v=id=>document.getElementById(id);if(!v("f-name"))return d;
 d.name=v("f-name").value.trim();d.room=v("f-room").value;d.mins=Math.max(1,+v("f-mins").value||15);d.every=Math.max(1,+v("f-every").value||1);d.unit=v("f-unit").value;
 if(v("f-wd"))d.weekday=+v("f-wd").value;if(v("f-who"))d.assignee=v("f-who").value;
 d.rotate=[...document.querySelectorAll('[data-rot="task"]:checked')].map(x=>x.value);
 if(d.rotate.length>1&&!d.rotate.includes(d.assignee))d.assignee=d.rotate[0];
 d.months=[...document.querySelectorAll("[data-month]:checked")].map(x=>+x.dataset.month);
 d.next=v("f-next").value||today();d.time=v("f-time").value||"09:00";d.flexible=v("f-flex").checked;d.photoProof=v("f-photo").checked;
 d.standard=v("f-std").value.trim();d.steps=v("f-steps").value.split("\n").map(x=>x.trim()).filter(Boolean);d.notes=v("f-notes").value.trim();
 return d;
}
function openTask(id){const t=D.tasks[id];if(!t)return;const d=JSON.parse(JSON.stringify(t));delete d.id;d.months=d.months||[];d.rotate=d.rotate||[];ui.sheet={kind:"task",id,draft:d};ui.calMsg=null;renderLayer();if(!ui.cal.list&&!ui.cal.err)loadCalendars()}
function saveTask(){
 const d=readDraft();if(!d.name){document.getElementById("f-name").focus();return}
 if(d.unit==="week"){if(d.weekday==null)d.weekday=parse(d.next).getDay();d.next=onWeekday(d.next,d.weekday)}else d.weekday=null;
 if(d.months.length)d.next=snapSeason(d.next,d.months);
 d.stepsDone=(d.stepsDone||[]).filter(i=>i<d.steps.length);
 const id=ui.sheet.isNew?rid():ui.sheet.id,prev=D.tasks[id];put("tasks",id,d);
 if(d.assignee&&d.assignee!==myPid()&&(!prev||prev.assignee!==d.assignee))logEvent({kind:"assign",text:`gave ${pName(d.assignee)} “${d.name}”`,ref:"task:"+id});
 ui.sheet=null;toast(`Saved · next ${nice(d.next)}`);
}
function startDone(id,credit){
 const t=D.tasks[id];if(!t)return;
 if(t.photoProof){ui.sheet={kind:"finish",id,credit};renderLayer();return}
 finishTask(id,credit);
}
function setupHouse(pr){
 const tags=tagsOf(pr),fit=LIB.filter(l=>libFits(l,tags));let daily=0;
 fit.forEach((l,i)=>{if(l.unit==="day"&&l.pack!=="kids"&&++daily>STARTER_DAILY_CAP)return;if(l.pack==="kids")return;put("tasks",rid(),newTask(l,spreadStart(l,i)))});
 if(pr.closing)makeClosing();
 const p=Object.assign({},pr);delete p.closing;putHouse({setupDone:true,created:Date.now(),profile:p,kidApproval:true,centsPerPoint:0});
}

/* ---------- Events ---------- */
document.addEventListener("click",async e=>{
 const b=e.target.closest("button,[data-close]");if(!b)return;const ds=b.dataset;
 if(ds.tab){ui.tab=ds.tab;ui.q="";ui.editShift=false;render();window.scrollTo(0,0);if(ds.tab==="more"&&ui.more==="cal")loadCalendars();return}
 if(ds.who){ui.who=ds.who;if(ui.plan)ui.plan.ids=buildPlan(ui.plan.mins);render();return}
 if(ds.done){startDone(ds.done);return}
 if(ds.finish){const s=ui.sheet,file=document.getElementById("fin-photo")?.files?.[0];let photo="";
  if(file&&S.photos){s.busy=true;renderLayer();try{photo=await uploadPhoto(file)}catch(err){s.busy=false;s.err="Couldn't upload the photo. Try again, or close this and check it off without one.";renderLayer();return}}
  ui.sheet=null;finishTask(s.id,s.credit,photo);return}
 if(ds.claim){claim(ds.claim);return}
 if(ds.nudge){nudge(ds.nudge);return}
 if(ds.toggle){ui.open[ds.toggle]=!ui.open[ds.toggle];render();return}
 if(ds.edit){openTask(ds.edit);return}
 if(ds.new){ui.sheet={kind:"task",isNew:true,draft:newTask({name:"",room:ui.room!=="All"?ui.room:"Other",unit:"week",every:1,mins:15},today())};renderLayer();document.getElementById("f-name")?.focus();return}
 if(ds.room){ui.room=ds.room;render();return}
 if(ds.hv){ui.houseView=ds.hv;ui.q="";render();return}
 if(ds.libroom){ui.libRoom=ds.libroom;render();return}
 if(ds.add){const l=LIB.find(x=>x.lib===ds.add);const t=newTask(l,spreadStart(l,tasks().length));put("tasks",rid(),t);toast(`Added “${l.name}” · first due ${nice(t.next)}`);return}
 if(ds.addall){const tags=tagsOf(D.house&&D.house.profile),have=new Set(tasks().map(t=>t.lib));LIB.filter(l=>libFits(l,tags)&&!have.has(l.lib)).forEach((l,i)=>put("tasks",rid(),newTask(l,spreadStart(l,i))));toast("Added");return}
 if(ds.close){ui.sheet=null;renderLayer();return}
 if(ds.save){saveTask();return}
 if(ds.askdel){readDraft();ui.sheet.confirmDel=true;renderLayer();return}
 if(ds.nodel){readDraft();ui.sheet.confirmDel=false;renderLayer();return}
 if(ds.del){const id=ui.sheet.id;ui.sheet=null;remove("tasks",id);return}
 if(ds.undo){const u=ui.toast&&ui.toast.undo;ui.toast=null;if(u)u();renderLayer();return}
 if(ds.comment){const inp=document.getElementById("c-text");if(ui.sheet&&ui.sheet.kind==="task")readDraft();addComment(ds.comment,inp?inp.value:"",ds.label);return}
 // plan + timer
 if(ds.plan!=null){const m=+ds.plan;if(!m){ui.plan=null;timerPause();render();return}ui.plan={mins:m,ids:buildPlan(m)};const tot=ui.plan.ids.reduce((a,id)=>a+(D.tasks[id].mins|0),0);timerPause();timer.left=tot*60;render();return}
 if(ds.timer){if(ds.timer==="start")timerStart();else if(ds.timer==="pause")timerPause();else{timerPause();timer.left=(ui.plan?ui.plan.ids.reduce((a,id)=>a+((D.tasks[id]||{}).mins|0),0):0)*60;render()}return}
 // shift
 if(ds.mkclosing){ui.routine=makeClosing();return}
 if(ds.routine){ui.routine=ds.routine;render();return}
 if(ds.newroutine){const id=rid();put("routines",id,{name:"New routine",time:"08:00",days:[0,1,2,3,4,5,6],created:Date.now(),items:[]});ui.routine=id;ui.editShift=true;render();return}
 if(ds.tick){const r=D.routines[ui.routine];toggleCheck(r,r.items.find(x=>x.id===ds.tick));return}
 if(ds.item){ui.sheet={kind:"item",rid:ui.routine,iid:ds.item};renderLayer();return}
 if(ds.saveitem){const r=D.routines[ui.sheet.rid],v=id=>document.getElementById(id);const rot=[...document.querySelectorAll('[data-rot="item"]:checked')].map(x=>x.value);
  const items=r.items.map(x=>{if(x.id!==ui.sheet.iid)return x;let a=v("i-who")?v("i-who").value:x.assignee;if(rot.length>1&&!rot.includes(a))a=rot[0];return Object.assign({},x,{text:v("i-text").value.trim()||x.text,assignee:a,rotate:rot,standard:v("i-std").value.trim(),notes:v("i-notes").value.trim()})});
  const before=r.items.find(x=>x.id===ui.sheet.iid),after=items.find(x=>x.id===ui.sheet.iid);updateRoutine(r,{items});
  if(after.assignee&&after.assignee!==myPid()&&after.assignee!==before.assignee)logEvent({kind:"assign",text:`gave ${pName(after.assignee)} “${after.text}” on the ${r.name}`,ref:"routine:"+r.id});
  ui.sheet=null;toast("Saved");return}
 if(ds.editshift){ui.editShift=true;render();return}
 if(ds.doneedit){const r=D.routines[ui.routine];updateRoutine(r,{name:document.getElementById("r-name").value.trim()||r.name,time:document.getElementById("r-time").value||r.time});ui.editShift=false;render();return}
 if(ds.additem){const inp=document.getElementById("r-new"),txt=inp.value.trim();if(!txt)return;const r=D.routines[ui.routine];updateRoutine(r,{items:[...r.items,{id:rid(),text:txt,standard:"",notes:"",assignee:"",rotate:[]}]});setTimeout(()=>document.getElementById("r-new")?.focus(),0);return}
 if(ds.rmitem){const r=D.routines[ui.routine];updateRoutine(r,{items:r.items.filter(x=>x.id!==ds.rmitem)});return}
 if(ds.up){const r=D.routines[ui.routine],ix=+ds.up,it=[...r.items];[it[ix-1],it[ix]]=[it[ix],it[ix-1]];updateRoutine(r,{items:it});return}
 if(ds.rmroutine){if(ds.rmroutine==="1"){ui.confirmRmRoutine=true;render();return}if(ds.rmroutine==="2"){remove("routines",ui.routine);ui.routine=null;ui.editShift=false}ui.confirmRmRoutine=false;render();return}
 // kids
 if(ds.kidview){ui.kid=kids().length===1?kids()[0].id:"pick";render();window.scrollTo(0,0);return}
 if(ds.kidpick){ui.kid=ds.kidpick;render();return}
 if(ds.exitkid){ui.kid=ui.kid!=="pick"&&kids().length>1?"pick":null;render();return}
 if(ds.kiddone){startDone(ds.kiddone,ui.kid);return}
 if(ds.kidtick){const r=routines().find(routineRunsTonight);toggleCheck(r,r.items.find(x=>x.id===ds.kidtick),ui.kid);return}
 if(ds.redeem){const w=D.rewards[ds.redeem];put("approvals",rid(),{kind:"reward",ref:w.id,who:ui.kid,label:w.name,pts:w.cost,at:Date.now()});logEvent({kind:"ask",text:`asked for “${w.name}”`,who:ui.kid});toast("Asked! A grown-up will say OK.");return}
 if(ds.approve){decide(D.approvals[ds.approve],true);return}
 if(ds.reject){decide(D.approvals[ds.reject],false);return}
 if(ds.payout){const k=ds.payout,pts=pointsOf(k),c=(D.house.centsPerPoint|0)*pts;logEvent({kind:"payout",text:`paid ${pName(k)} ${money(c)} for ${pts} stars`,who:k,pts:-pts});return}
 if(ds.newperson){openForm("people:new");return}
 if(ds.person){openForm("people:"+ds.person);return}
 // more
 if(ds.more){ui.more=ds.more;render();if(ds.more==="cal")loadCalendars();return}
 if(ds.form){openForm(ds.form);return}
 if(ds.thing){openForm("things:"+ds.thing);return}
 if(ds.gsave){saveForm();return}
 if(ds.gaskdel){ui.sheet.confirmDel=true;renderLayer();return}
 if(ds.gnodel){ui.sheet.confirmDel=false;renderLayer();return}
 if(ds.gdel){const s=ui.sheet;ui.sheet=null;remove(s.col,s.id);return}
 if(ds.infoadd!=null){const id=rid();put("info",id,{label:ds.infoadd||"New item",value:"",order:Date.now()});openForm("info:"+id);return}
 if(ds.list){ui.list=ds.list;render();return}
 if(ds.newlist){ui.newList=!ui.newList;render();setTimeout(()=>document.getElementById("nl-name")?.focus(),0);return}
 if(ds.savelist){const n=(document.getElementById("nl-name").value||"").trim().slice(0,30);if(n){putHouse({lists:[...new Set([...((D.house&&D.house.lists)||[]),n])]});ui.list=n}ui.newList=false;render();return}
 if(ds.additem2){const inp=document.getElementById("li-new"),txt=inp.value.trim();if(!txt)return;const ex=Object.values(D.items).find(i=>i.list===ui.list&&i.text.toLowerCase()===txt.toLowerCase());if(ex)patch("items",ex.id,{done:false,who:myPid(),at:Date.now()});else put("items",rid(),{list:ui.list,text:txt,done:false,who:myPid(),at:Date.now(),n:0});setTimeout(()=>document.getElementById("li-new")?.focus(),0);return}
 if(ds.buy){const i=D.items[ds.buy];patch("items",i.id,{done:true,n:(i.n||0)+1,boughtBy:myPid(),boughtAt:Date.now()});return}
 if(ds.again){patch("items",ds.again,{done:false,who:myPid(),at:Date.now()});return}
 if(ds.rmli){remove("items",ds.rmli);return}
 if(ds.loadcal){loadCalendars();return}
 if(ds.gocal){ui.sheet=null;ui.tab="more";ui.more="cal";render();loadCalendars();return}
 if(ds.calreset){delete ME.calAdded[ds.calreset];saveMe();return}
 if(ds.chart){saveChart();return}
 if(ds.pause){startPause();return}
 if(ds.unpause){endPause();return}
 if(ds.prof){if(!(D.house&&D.house.setupDone)){ui.setup[ds.prof]=ds.v;render()}else{const pr=Object.assign({},D.house.profile||{},{[ds.prof]:ds.v});putHouse({profile:pr})}return}
 if(ds.proft){if(!(D.house&&D.house.setupDone)){ui.setup[ds.proft]=!ui.setup[ds.proft];render()}else{const pr=Object.assign({},D.house.profile||{});pr[ds.proft]=!pr[ds.proft];putHouse({profile:pr})}return}
 if(ds.addcal){
  const key=ds.addcal;let ev;
  if(key.startsWith("task:")){ev=ui.sheet&&ui.sheet.kind==="task"?readDraft():D.tasks[key.slice(5)]}else ev=routineAsEvent(D.routines[key.slice(8)]);
  ui.calBusy=key;ui.calMsg=null;render();const r=await addToCalendar(key,ev);ui.calBusy=null;ui.calMsg=r.ok?null:{key,msg:r.msg};render();if(r.ok)toast(`“${ev.name}” is on your calendar`);return;
 }
 if(ds.bulk){
  const list=tasks().filter(t=>!ME.calAdded["task:"+t.id]&&(t.assignee===myPid()||!t.assignee||S.isOwner));
  ui.bulk={running:true,done:0,total:list.length};render();
  for(const t of list){const r=await addToCalendar("task:"+t.id,t);if(!r.ok){ui.bulk={running:false,msg:`Stopped after ${ui.bulk.done}: ${r.msg}`,err:true};render();return}ui.bulk.done++;render()}
  ui.bulk={running:false,msg:`Added ${list.length} repeating events.`};render();return;
 }
 if(ds.setup!=null){
  if(ds.setup==="1"){ui.setup.closing=document.getElementById("su-closing").checked;setupHouse(ui.setup)}
  else putHouse({setupDone:true,created:Date.now(),profile:{home:ui.setup.home,own:ui.setup.own},kidApproval:true});
  ui.tab="today";render();return;
 }
});
document.addEventListener("change",e=>{
 const el=e.target;
 if(el.dataset.step){const t=D.tasks[el.dataset.step],i=+el.dataset.i;let sd=[...(t.stepsDone||[])];if(el.checked){if(!sd.includes(i))sd.push(i)}else sd=sd.filter(x=>x!==i);patch("tasks",t.id,{stepsDone:sd});return}
 if(el.dataset.rday!=null){const r=D.routines[ui.routine];let days=[...(r.days||[0,1,2,3,4,5,6])];const i=+el.dataset.rday;days=el.checked?[...new Set([...days,i])].sort():days.filter(x=>x!==i);updateRoutine(r,{days});return}
 
 if(el.id==="remind"){ME.reminder=+el.value;saveMe();return}
 if(el.id==="deftime"){ME.defaultTime=el.value||"09:00";saveMe();return}
 if(el.id==="histwho"){ui.histWho=el.value;render();return}
 if(el.id==="kidok"){putHouse({kidApproval:el.checked});return}
 if(el.id==="cpp"){putHouse({centsPerPoint:+el.value});return}
 if(el.id==="f-unit"){readDraft();if(ui.sheet.draft.unit==="week"&&ui.sheet.draft.weekday==null)ui.sheet.draft.weekday=parse(ui.sheet.draft.next).getDay();renderLayer();return}
});
document.addEventListener("keydown",e=>{
 if(e.key==="Escape"&&ui.sheet){ui.sheet=null;renderLayer()}
 if(e.key==="Enter"&&e.target.id==="c-text")document.querySelector("[data-comment]")?.click();
 if(e.key==="Enter"&&e.target.id==="r-new")document.querySelector("[data-additem]")?.click();
 if(e.key==="Enter"&&e.target.id==="li-new")document.querySelector("[data-additem2]")?.click();
 if(e.key==="Enter"&&e.target.id==="nl-name")document.querySelector("[data-savelist]")?.click();
});
let qTimer=null;
document.addEventListener("input",e=>{if(e.target.id==="q"){ui.q=e.target.value;clearTimeout(qTimer);qTimer=setTimeout(()=>{const p=e.target.selectionStart;render();const q=document.getElementById("q");if(q){q.focus();q.setSelectionRange(p,p)}},200)}});
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&S.mode!=="loading"){resolveNames();render()}});
