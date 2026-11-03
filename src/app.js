const STARTER_DAILY_CAP=5;
const LIB=LIB_RAW.map((r,i)=>({lib:"L"+i,pack:r[0],room:r[1],name:r[2],unit:r[3],every:r[4],mins:r[5],steps:r[6]?r[6].split("|"):[],months:(r.meta&&r.meta.m)||[],req:(r.meta&&r.meta.r)||[]}));
const ROOMS=["Kitchen","Bathroom","Bedroom","Living areas","Whole house","Laundry","Outside","Systems","Safety","Money & admin","Supplies","Car","Pets","Other"];
const DAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const RR_DAYS=["SU","MO","TU","WE","TH","FR","SA"];
const CAL_SERVER="Google Calendar";
/* Person colors: distinct in hue and lightness, all keep white initials above 4.5:1. Names always sit next to them. */
const COLORS=["#2F5D4E","#9A4A2E","#34588F","#7A3F75","#6B5A16","#1F6B73","#5B4B9A","#A13A55"];
function nextColor(){const used=new Set(Object.values(D.people).map(p=>p.color));return COLORS.find(c=>!used.has(c))||COLORS[Object.keys(D.people).length%COLORS.length]}
const OLD_COLORS=["#2D5D4C","#8A4B2D","#3D5A8A","#7A3D72","#8A6B1F","#2F7A7A","#6B4FA0","#A03D4F"];
function fixColors(){if(!S.canWrite||S.mode!=="db")return;const seen=new Set();people().forEach(p=>{let c=OLD_COLORS.includes(p.color)?COLORS[OLD_COLORS.indexOf(p.color)]:p.color;if(!c||seen.has(c))c=COLORS.find(x=>!seen.has(x))||c;seen.add(c);if(c!==p.color)patch("people",p.id,{color:c})})}
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
let ME=Object.assign({house:"",key:"",token:"",feed:"",pid:"",device:"",reminder:30,defaultTime:"09:00",lastSeen:0,notify:false},ls.get("upkeep-me",{}));
if(!ME.device){ME.device=Math.random().toString(36).slice(2,12);ls.set("upkeep-me",ME)}
const S={mode:"loading",uid:ME.device,canWrite:true,note:"",isOwner:true,bootAt:Date.now(),v:0,ops:ls.get("upkeep-ops",[]),flushing:false,online:navigator.onLine,photos:true,downloads:true};
function saveMe(){ls.set("upkeep-me",ME);render()}
function cacheSave(){if(ui.tour)return;ls.set("upkeep-cache",{h:ME.house,v:S.v,D})}
function applyOp(o){
 if(o.c==="house"){if(o.t==="del")D.house=null;else D.house=Object.assign({},o.d);return}
 const col=D[o.c];if(!col)return;
 if(o.t==="del")delete col[o.i];else col[o.i]=Object.assign({},o.d,{id:o.i});
}
function queueOp(o){if(ui.tour){applyOp(o);render();return}applyOp(o);S.ops.push(o);ls.set("upkeep-ops",S.ops);cacheSave();render();scheduleFlush()}
function put(col,id,data){const d=Object.assign({},data);delete d.id;queueOp({t:"set",c:col,i:id,d});return Promise.resolve()}
function patch(col,id,data){const cur=D[col][id];if(!cur)return;return put(col,id,Object.assign({},cur,data))}
function remove(col,id){queueOp({t:"del",c:col,i:id});return Promise.resolve()}
function putHouse(data){const h=Object.assign({},D.house||{},data);queueOp({t:"set",c:"house",i:"main",d:h})}
function setHouse(h){queueOp({t:"set",c:"house",i:"main",d:h})}
function logEvent(o){const id=rid();put("activity",id,Object.assign({by:S.uid,actor:myPid(),who:myPid(),at:Date.now(),pts:0,mins:0},o));return id}

function loadMeta(res){let ch=false;if(res.invite&&res.invite!==ME.key){ME.key=res.invite;ch=true}if(res.feed&&res.feed!==ME.feed){ME.feed=res.feed;ch=true}if(res.devices)S.devices=res.devices;if(res.me)S.deviceId=res.me;if(ch)ls.set("upkeep-me",ME)}
const authKey=()=>ME.token||ME.key;
function loadDocs(docs,v){
 if(ui.tour)return; // the real house is set aside during the tour; the next sync check fetches it
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
 if(ui.tour||!ME.house||S.flushing||!S.ops.length)return;
 S.flushing=true;const batch=S.ops.slice(0,250);
 try{
  const res=await api("POST",{h:ME.house,k:authKey(),ops:batch});loadMeta(res);
  S.ops=S.ops.slice(batch.length);ls.set("upkeep-ops",S.ops);S.lastFlush=Date.now();
  loadDocs(res.docs,res.v);if(S.note.startsWith("Offline"))S.note="";render();
 }catch(e){
  if(e.code==="not_found"){S.note="This phone no longer has access to the house. Ask someone in the house for a new invite link.";}
  else S.note="Offline. Your changes are saved on this phone and will sync when you're back online.";
  render();setTimeout(scheduleFlush,8000);
 }
 S.flushing=false;if(S.ops.length&&!S.note)scheduleFlush();
}
async function poll(){
 if(ui.tour||!ME.house||document.hidden||S.flushing||S.ops.length)return;
 try{const res=await api("GET",null,{h:ME.house,k:authKey(),v:S.v});if(!res.same){loadMeta(res);loadDocs(res.docs,res.v);render()}if(S.note.startsWith("Offline")){S.note="";render()}}
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
 try{
  if(!ME.token){const j=await api("POST",{join:true,h:ME.house,k:ME.key,label:deviceLabel()});ME.token=j.token;ls.set("upkeep-me",ME)}
  const res=await api("GET",null,{h:ME.house,k:authKey()});S.v=0;loadMeta(res);loadDocs(res.docs,res.v);S.mode="db";S.note="";afterLoad()}
 catch(e){
  if(e.code==="not_found"){S.mode="welcome";S.note="This phone no longer has access to that house. Ask someone in the house for a new invite link, or start a new house.";ME.house="";ME.token="";saveMe();return}
  S.mode="db";S.note="Offline. Showing what's saved on this phone.";render();
 }
 scheduleFlush();
}
async function createHouse(name){
 ui.busy=true;render();
 try{
  const res=await api("POST",{create:true,label:deviceLabel()});
  ME.house=res.h;ME.token=res.token;loadMeta(res);S.ops=[];ls.set("upkeep-ops",[]);
  COLS.forEach(c=>D[c]={});D.house=null;S.v=res.v;
  const pid=rid();ME.pid=pid;saveMe();
  put("people",pid,{name:name||"Me",role:"adult",color:COLORS[0],joined:today(),owner:true});
  S.mode="db";ui.busy=false;render();
 }catch(e){ui.busy=false;S.note="Couldn't reach the server. Check your connection and try again.";render()}
}
async function joinHouse(h,k){
 ui.busy=true;render();
 try{const res=await api("POST",{join:true,h,k,label:deviceLabel()});ME.house=h;ME.token=res.token;ME.pid="";loadMeta(res);S.ops=[];ls.set("upkeep-ops",[]);S.v=0;loadDocs(res.docs,res.v);saveMe();S.mode="db";ui.busy=false;ui.join=null;render()}
 catch(e){ui.busy=false;S.note=e.code==="not_found"?"That invite link doesn't work. Ask for a new one.":"Couldn't reach the server. Check your connection and try again.";render()}
}
function leaveHouse(){ME.house="";ME.key="";ME.token="";ME.feed="";ME.pid="";saveMe();S.ops=[];ls.set("upkeep-ops",[]);ls.set("upkeep-cache",null);COLS.forEach(c=>D[c]={});D.house=null;S.mode="welcome";render()}
function inviteLink(){return `${location.origin}/#join=${ME.house}.${ME.key}`}
function afterLoad(){render()}
function subChecks(){}
async function uploadPhoto(file){
 const data=await shrink(file);
 const r=await fetch("/api/photo",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({h:ME.house,k:authKey(),data})});
 if(r.status===413)throw{code:"too_large"};if(!r.ok)throw{code:"upload"};
 return(await r.json()).url;
}
function shrink(file){
 return new Promise((res,rej)=>{const img=new Image(),u=URL.createObjectURL(file);
  img.onload=()=>{const max=1600,sc=Math.min(1,max/Math.max(img.width,img.height));const c=document.createElement("canvas");c.width=Math.round(img.width*sc);c.height=Math.round(img.height*sc);c.getContext("2d").drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(u);res(c.toDataURL("image/jpeg",.82))};
  img.onerror=()=>{URL.revokeObjectURL(u);rej({code:"unsupported_type"})};img.src=u});
}
const photoUrl=x=>!x?"":/^https?:/.test(x)?x:"";
function deviceLabel(){const u=navigator.userAgent;const kind=/iPad/.test(u)?"iPad":/iPhone/.test(u)?"iPhone":/Android/.test(u)?(/Mobile/.test(u)?"Android phone":"Android tablet"):/Mac/.test(u)?"Mac":/Windows/.test(u)?"Windows computer":"Device";return kind+" · "+new Date().toLocaleDateString(undefined,{month:"short",day:"numeric"})}
async function houseAction(body){const res=await api("POST",Object.assign({h:ME.house,k:authKey()},body));loadMeta(res);loadDocs(res.docs,res.v);render();return res}

/* ---------- People ---------- */
const names={},asked=new Set();
const people=()=>Object.values(D.people).sort((a,b)=>(a.role==="kid")-(b.role==="kid")||(a.joined||"").localeCompare(b.joined||""));
const kids=()=>people().filter(p=>p.role==="kid");
const adults=()=>people().filter(p=>p.role!=="kid");
function pName(pid){if(!pid)return"Anyone";const p=D.people[pid];if(!p)return"Someone";return p.name||(p.uid&&names[p.uid]?names[p.uid].split(" ")[0]:"")||"Someone"}
function pShort(pid){return pid&&pid===myPid()?"You":pName(pid)}
function av(pid,size){const p=D.people[pid];const n=pid?pName(pid):"?";const c=p&&p.color?p.color:"var(--muted)";return `<span class="av" style="background:${c};color:#fff;${size?`width:${size}px;height:${size}px;font-size:${size<30?Math.round(size*.56):size/2.4}px`:""}" aria-hidden="true">${esc(pid?n.charAt(0).toUpperCase():"·")}</span>`}
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
  return addDays(today(),left>1?1+(i*5+(src.lib?parseInt(src.lib.slice(1)):0))%(left-1):0);
 }
 if(src.unit==="day")return today();
 const span=Math.min(intervalDays(src),src.unit==="week"?7:45);
 return addDays(today(),1+(i*3+(src.lib?parseInt(src.lib.slice(1)):0))%span); // nothing but daily tasks lands on day one
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
 toast(`${kidNeedsOk?"Sent for an OK · ":"Completed · "}next ${nice(n)}`,kidNeedsOk?null:()=>{patch("tasks",id,prev);remove("activity",actId)});
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
function icsUrl(o={}){const q=new URLSearchParams(Object.assign({h:ME.house,k:ME.feed||ME.key,r:String(ME.reminder)},o));return `${location.origin}/api/ics?${q}`}
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
 return `<!doctype html><html><head><meta charset="utf-8"><title>Upkeep · week of ${nice(today())}</title><style>body{font:13px/1.35 Georgia,serif;margin:24px;color:#111}h1{font-size:22px;margin:0 0 4px}table{border-collapse:collapse;width:100%;margin-top:14px}th,td{border:1px solid #999;padding:6px;vertical-align:top;text-align:left}th{background:#eee}td div{margin:2px 0}.s td{width:auto}@media print{body{margin:10mm}}</style></head><body>
 <h1>This week at home · ${parse(today()).toLocaleDateString(undefined,{month:"long",day:"numeric"})}</h1><div>Check things off as you go.</div>
 <table><tr><th>Who</th>${days.map(d=>`<th>${parse(d).toLocaleDateString(undefined,{weekday:"short",month:"numeric",day:"numeric"})}</th>`).join("")}</tr>
 ${ppl.map(p=>`<tr><th>${esc(p.id?pName(p.id):"Anyone")}</th>${days.map(d=>`<td>${cell(p.id,d)}</td>`).join("")}</tr>`).join("")}</table>
 ${r?`<h1 style="margin-top:22px">${esc(r.name)} · ${t12(r.time)}</h1><table class="s"><tr><th>Item</th><th>Who</th><th>Done means</th>${days.map(d=>`<th>${parse(d).toLocaleDateString(undefined,{weekday:"short"})}</th>`).join("")}</tr>${r.items.map(i=>`<tr><td>${esc(i.text)}</td><td>${esc(pName(i.assignee))}</td><td>${esc(i.standard||"")}</td>${days.map(()=>"<td></td>").join("")}</tr>`).join("")}</table>`:""}
 </body></html>`;
}

/* ---------- Pause ---------- */
function startPause(){putHouse({pause:{from:today(),by:S.uid}});logEvent({kind:"pause",text:"turned on Away mode"})}
function endPause(){
 const from=D.house.pause.from,shift=Math.max(0,daysBetween(from,today()));
 if(shift)tasks().forEach(t=>{const moved=addDays(t.next,shift);const n=t.months&&t.months.length?snapSeason(moved,t.months):moved;patch("tasks",t.id,{next:n})});
 const h=Object.assign({},D.house);delete h.pause;setHouse(h);
 logEvent({kind:"pause",text:`is back. Due dates moved ${shift} day${shift===1?"":"s"}`});render();
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
 check:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--forest-ink)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
 today:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l2.5 2.5L16 9"/><rect x="4" y="4" width="16" height="16" rx="3"/></svg>',
 moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z"/></svg>',
 house:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11l8-6 8 6v8a1 1 0 0 1-1 1h-4v-5H9v5H5a1 1 0 0 1-1-1z"/></svg>',
 people:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 5.5a3 3 0 0 1 0 5.8M18 19a5 5 0 0 0-2.5-4.3"/></svg>',
 more:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/></svg>',
 star:'<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z"/></svg>'
};
const app=document.getElementById("app"),tabsEl=document.getElementById("tabs"),layer=document.getElementById("layer");
const note=()=>(S.note?`<div class="banner">${esc(S.note)}</div>`:"")+(paused()?`<div class="banner">Away mode is on since ${nice(D.house.pause.from)}. Nothing shows as overdue. <button class="linkish" data-unpause="1">I'm back</button></div>`:"");
const passWho=t=>ui.who==="all"||(ui.who==="mine"&&t.assignee===myPid())||(ui.who==="open"&&!t.assignee);
function planBlock(){
 const ids=ui.plan.ids.filter(id=>D.tasks[id]);const list=ids.map(id=>D.tasks[id]);
 const total=list.reduce((a,t)=>a+(t.mins|0),0);
 const s=timer.running?Math.max(0,Math.round((timer.end-Date.now())/1000)):timer.left;
 if(!list.length)return `<p class="note">Nothing's due. You're ahead.</p>`;
 return `<p class="note">${list.length} task${list.length>1?"s":""}, about ${fmtMins(total)}, oldest first</p>
 <div class="list">${list.map(t=>`<div class="row"><button class="main" data-edit="${t.id}"><span class="name">${esc(t.name)}</span><span class="meta"><span>${fmtMins(t.mins)}</span><span>${esc(t.room)}</span></span></button><button class="check" data-done="${t.id}" aria-label="Complete ${esc(t.name)}"><i>${IC.check}</i></button></div>`).join("")}</div>
 <div class="btn-row"><span class="timer" id="clock" role="timer">${fmtTime(s)}</span>${timer.running?`<button class="btn small" data-timer="pause">Pause</button>`:`<button class="btn small primary" data-timer="start">${s<total*60?"Resume":"Start timer"}</button>`}<button class="btn small" data-timer="reset">Reset</button><button class="linkish" data-plan="0">Close</button></div>`;
}
function viewShiftEdit(r){
 const days=r.days||[0,1,2,3,4,5,6];
 return `<button class="back linkish" data-doneedit="1">${IC.back}Back to the ${esc(r.name.toLowerCase())}</button>
 <header class="top"><div class="ttl"><h1>Edit routine</h1></div><button class="btn small primary" data-doneedit="1">Done</button></header>
 <div class="fgroup"><div class="grid2 keep"><label class="field"><span>Name</span><input type="text" id="r-name" value="${esc(r.name)}"></label><label class="field"><span>Starts at</span><input type="time" id="r-time" value="${esc(r.time||"21:00")}"></label></div>
 <div class="field"><span id="rd-l">Runs on</span><div class="toggles days" role="group" aria-labelledby="rd-l">${DAYS.map((d,i)=>`<label><input type="checkbox" data-rday="${i}" ${days.includes(i)?"checked":""}><span>${d.slice(0,3)}</span></label>`).join("")}</div></div></div>
 <section class="group"><div class="group-head"><h2>Items</h2>${r.items.length>1?`<button class="linkish" data-arrange="1">Reorder</button>`:""}</div>
 <div class="list" data-sort="shift:${r.id}">${r.items.map(i=>`<div class="row link" data-row="${i.id}"><button class="main" data-item="${i.id}"><span class="name">${esc(i.text)}</span><span class="meta">${ownerTag(i.assignee)}${i.standard?"<span>Has a standard</span>":""}</span></button>${IC.chev}</div>`).join("")}</div>
 <div class="cmtform add-item" style="margin-top:12px"><input type="text" id="r-new" placeholder="Add an item, e.g. Start the dishwasher" aria-label="New item"><button class="btn" data-additem="1">Add</button></div></section>
 <button class="linkish danger" data-rmroutine="1">Delete this routine</button>`;
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
 const count=n=>Object.values(D.items).filter(i=>i.list===n&&!i.done).length;
 return `<div class="filters lists" role="group" aria-label="Lists">${names.map(n=>`<button class="filter" data-list="${esc(n)}" aria-pressed="${ui.list===n}">${IC.tick}${esc(n)}${count(n)?`<span class="n">${count(n)}</span>`:""}</button>`).join("")}${S.canWrite?`<button class="chip" data-newlist="1">${IC.plus}New list</button>`:""}</div>
 ${ui.newList?`<div class="cmtform" style="margin-bottom:12px"><input type="text" id="nl-name" placeholder="List name, e.g. Costco" aria-label="New list name"><button class="btn" data-savelist="1">Create</button></div>`:""}
 ${S.canWrite?`<div class="cmtform add-item"><input type="text" id="li-new" placeholder="Add to ${esc(ui.list)}" aria-label="Add an item to ${esc(ui.list)}"><button class="btn primary" data-additem2="1">Add</button></div>`:""}
 <div class="list">${open.map(i=>`<div class="row shop"><span class="main"><span class="name">${esc(i.text)}</span>${multiUser()?`<span class="meta">${ownerTag(i.who).replace("Up for grabs","")}<span>added it</span></span>`:""}</span><span class="row-acts"><button class="icon-btn quiet" data-rmli="${i.id}" aria-label="Remove ${esc(i.text)}">${IC.x}</button><button class="check" data-buy="${i.id}" aria-label="Got ${esc(i.text)}"><i>${IC.check}</i></button></span></div>`).join("")||`<div class="empty">Nothing on the ${esc(ui.list)} list.</div>`}</div>
 ${bought.length?`<section class="group again"><div class="group-head"><h2>Buy again</h2></div><div class="chips">${bought.slice(0,24).map(i=>`<button class="chip" data-again="${i.id}">${IC.plus}${esc(i.text)}</button>`).join("")}</div></section>`:""}`;
}
function moreMoney(){
 const xs=Object.values(D.expenses).sort((a,b)=>b.date.localeCompare(a.date)),b=balances(),st=settleUp();
 return `<p class="note" style="margin-top:0">Shared house costs: utilities, supplies, repairs. Split evenly between the people you pick.</p>
 ${S.canWrite?`<div class="toolbar"><button class="btn primary" data-form="expenses:new">Add expense</button></div>`:""}
 <section class="group"><div class="group-head"><h2>Settle up</h2></div><div class="list">${st.map(([from,to,amt])=>`<div class="row" style="grid-template-columns:1fr auto"><span><b>${esc(pShort(from))}</b> owes <b>${esc(pName(to))}</b></span><span class="stamp">${money(amt)}</span></div>`).join("")||`<div class="row"><span class="muted">Everyone's even.</span></div>`}</div></section>
 <section class="group"><div class="group-head"><h2>Recent</h2></div><div class="list">${xs.slice(0,40).map(e=>`<button class="row main" data-form="expenses:${e.id}" style="grid-template-columns:1fr auto;width:100%"><span><span class="name">${esc(e.what)}</span><span class="meta"><span>${esc(pShort(e.paidBy))} paid</span><span>${nice(e.date)}</span><span>split ${(e.split||[]).length||adults().length} ways</span></span></span><span class="stamp">${money(e.amount)}</span></button>`).join("")||`<div class="row"><span class="muted">No expenses yet.</span></div>`}</div></section>`;
}
function moreKids(){
 const ws=Object.values(D.rewards).sort((a,b)=>a.cost-b.cost),h=D.house||{},can=S.canWrite&&!isKid(myPid());
 return `<div class="set-list">
  <label class="set-row"><span class="s-text"><span class="s-label">Grown-up OK before stars count</span><span class="s-sub">Kids' check-offs wait for an adult to approve them.</span></span><input type="checkbox" class="sw" id="kidok" ${h.kidApproval!==false?"checked":""} ${can?"":"disabled"}></label>
  <label class="set-row"><span class="s-text"><span class="s-label">Allowance per star</span><span class="s-sub">1 star for a quick job, up to 5 for a long one. Shift items are 1 star.</span></span><select id="cpp" class="s-select" ${S.canWrite?"":"disabled"}>${[0,5,10,25,50,100].map(c=>`<option value="${c}" ${(h.centsPerPoint|0)===c?"selected":""}>${c?money(c):"Stars only"}</option>`).join("")}</select></label></div>
 <h3 class="day">Rewards<span>${S.canWrite?`<button class="linkish" data-form="rewards:new">Add reward</button>`:""}</span></h3>
 <div class="list">${ws.map(w=>`<button class="row link" data-form="rewards:${w.id}"><span class="main"><span class="name">${esc(w.name)}</span><span class="meta"><span>${w.cost} stars</span></span></span>${IC.chev}</button>`).join("")||`<div class="empty">Ideas: pick the movie (20 stars), stay up 30 minutes late (30), a trip for ice cream (50).</div>`}</div>
 ${kids().length?`<h3 class="day">Balances<span></span></h3><div class="list">${kids().map(k=>`<div class="row"><span class="main"><span class="name">${esc(pName(k.id))}</span><span class="meta"><span>${pointsOf(k.id)} stars${h.centsPerPoint?" · "+money(pointsOf(k.id)*h.centsPerPoint):""}</span></span></span>${h.centsPerPoint&&pointsOf(k.id)>0&&S.canWrite?`<button class="btn small" data-payout="${k.id}">Mark paid out</button>`:"<span></span>"}</div>`).join("")}</div>`:`<p class="note">Add a kid under People to use Kid view.</p>`}`;
}
const PROFILE_GROUPS=[["Outside",["yard","deck","garage","pool","grill","sprinkler"]],["Systems",["central","basement","fireplace","generator","septic","well","softener"]],["Who lives here",["kids","pets","car"]]];
function profileForm(pr){
 const one=(k,opts,label)=>`<div class="field"><span id="pf-${k}">${label}</span><div class="opts" role="group" aria-labelledby="pf-${k}">${opts.map(([v,l])=>`<button class="chip" data-prof="${k}" data-v="${v}" aria-pressed="${pr[k]===v}">${IC.tick}${l}</button>`).join("")}</div></div>`;
 const lab=k=>(PROFILE_Q.find(q=>q[0]===k)||[k,k])[1];
 return `<div class="profile">${one("home",[["house","House"],["townhouse","Townhouse"],["apartment","Apartment"]],"Type of home")}
 ${one("own",[["own","Own"],["rent","Rent"]],"Own or rent")}
 ${PROFILE_GROUPS.map(([g,ks])=>`<div class="field"><span id="pg-${g.replace(/ /g,"")}">${g}</span><div class="opts" role="group" aria-labelledby="pg-${g.replace(/ /g,"")}">${ks.map(k=>`<button class="chip" data-proft="${k}" aria-pressed="${!!pr[k]}">${IC.tick}${esc(lab(k))}</button>`).join("")}</div></div>`).join("")}</div>`;
}
function viewSetup(){
 const pr=ui.setup||(ui.setup={home:"house",own:"own",closing:true});
 return `<header class="top"><div class="ttl"><h1>Set up your house</h1></div></header>${systemNotices()}
 <p class="lede">Tell Upkeep a little about your home. It picks the tasks that fit and spaces them out, so you start with a handful each day and seasonal jobs show up when their season comes.</p>
 ${profileForm(pr)}
 <div class="set-list setup-shift"><label class="set-row"><span class="s-text"><span class="s-label">Closing shift</span><span class="s-sub">A short nightly list the household splits up: dishes, counters, doors, lights</span></span><input type="checkbox" class="sw" id="su-closing" ${pr.closing?"checked":""}></label></div>
 <p class="note">You can add, change or remove any task later.</p>
 <div class="btn-row setup-go"><button class="btn primary" data-setup="1">Set up my house</button><button class="btn text" data-setup="0">Start with an empty list</button></div>`;
}

/* ---------- Sheets ---------- */
function commentBlock(ref,label){
 const cs=commentsFor(ref),canPost=S.canWrite&&multiUser();
 if(!cs.length&&!canPost)return"";
 return `<div class="t-sec"><h3>Comments</h3>${cs.length?`<div class="comments">${cs.map(c=>`<div class="cmt">${av(c.who,22)}<div><b>${esc(pShort(c.who))}</b> <span class="when">${ago(c.at)}</span><div>${esc(c.text)}</div></div></div>`).join("")}</div>`:""}${canPost?`<div class="cmtform"><input type="text" id="c-text" placeholder="Leave a note for the household" aria-label="Comment"><button class="btn small" data-comment="${esc(ref)}" data-label="${esc(label)}">Post</button></div>`:""}</div>`;
}
function rotatePick(list,id){return `<div class="field"><span>Take turns <small>passes to the next person each time it's done</small></span><div class="toggles">${people().map(p=>`<label><input type="checkbox" data-rot="${id}" value="${p.id}" ${list&&list.includes(p.id)?"checked":""} ${S.canWrite?"":"disabled"}><span>${esc(pName(p.id))}</span></label>`).join("")}</div></div>`}
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
  if(type==="people"){const sel=v&&v.length?v:adults().map(p=>p.id);return `<div class="field"><span>${label}</span><div class="toggles">${people().map(p=>`<label><input type="checkbox" data-gk="${k}" value="${p.id}" ${sel.includes(p.id)?"checked":""} ${ro}><span>${esc(pName(p.id))}</span></label>`).join("")}</div></div>`}
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
 const canDel=s.id&&S.canWrite&&!(s.col==="people"&&s.id===myPid());
 return sheetShell(f.title,`<h2 class="sheet-title" tabindex="-1">${s.id?esc(d[f.fields[0][0]]||f.title):"New "+f.title.toLowerCase()}</h2>`,`${f.fields.map(inp).join("")}${photo}${extra}${s.err?`<p class="note err" role="alert">${esc(s.err)}</p>`:""}${canDel?`<button class="linkish danger" data-gdel="1">Delete this ${f.title.toLowerCase()}</button>`:""}`,
  S.canWrite?`<button class="btn primary" data-gsave="1" ${s.busy?"disabled":""}>${s.busy?"Saving…":"Save"}</button><button class="btn text" data-close="1">Cancel</button>`:"","edit-one");
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
 if(isNew&&col==="people"){data.role="kid";data.color=nextColor()}
 ui.sheet={kind:"form",col,id:isNew?null:id,data};renderLayer();
}
function renderLayer(){
 let h="";const s=ui.sheet;
 if(s&&s.kind==="task")h+=taskSheet(s);
 if(s&&s.kind==="item"){
  const r=D.routines[s.rid],i=r&&r.items.find(x=>x.id===s.iid);
  if(i){const ro=!S.canWrite?"disabled":"",c=D.checks[checkId(r.id,i.id)];
  h+=sheetShell(i.text,`<div><p class="sheet-kicker">${esc(r.name)}</p><h2 class="sheet-title" tabindex="-1">${esc(i.text)}</h2></div>`,`
  ${c?`<p class="checked-by">${IC.tick}Checked by ${esc(pShort(c.who))} at ${clock(c.at)}</p>`:""}
  <label class="field"><span>Item</span><input type="text" id="i-text" value="${esc(i.text)}" ${ro}></label>
  ${multiUser()?`<label class="field"><span>Whose part</span><select id="i-who" ${ro}>${peopleOptions(i.assignee)}</select></label>${rotatePick(i.rotate,"item")}`:""}
  <label class="field"><span>Done means</span><textarea id="i-std" rows="2" ${ro}>${esc(i.standard||"")}</textarea></label>
  <label class="field"><span>Notes</span><input type="text" id="i-notes" value="${esc(i.notes||"")}" placeholder="Where things go, tips" ${ro}></label>
  ${commentBlock("item:"+r.id+":"+i.id,i.text)}
  ${S.canWrite?`<button class="linkish danger" data-rmitem="${i.id}">Remove from the ${esc(r.name.toLowerCase())}</button>`:""}`,
  S.canWrite?`<button class="btn primary" data-saveitem="1">Save</button><button class="btn text" data-close="1">Cancel</button>`:"","edit-one")}
 }
 if(s&&s.kind==="finish"){
  const t=D.tasks[s.id];
  h+=sheetShell(t?t.name:"Finish task",`<h2 class="sheet-title" tabindex="-1">${esc(t?t.name:"")}</h2>`,`${t&&t.standard?`<div class="std-box"><b>Done means</b><p>${esc(t.standard)}</p></div>`:""}
  ${S.photos?`<label class="field"><span>Add a photo of the finished job</span><input type="file" accept="image/*" capture="environment" id="fin-photo"></label>`:`<p class="note">Photos aren't available here, so this one goes through without one.</p>`}
  ${s.err?`<p class="note err" role="alert">${esc(s.err)}</p>`:""}`,`<button class="btn primary" data-finish="1" ${s.busy?"disabled":""}>${s.busy?"Uploading…":"Complete task"}</button><button class="btn text" data-close="1">Cancel</button>`,"edit-one");
 }
 if(s&&s.kind==="form")h+=formSheet(s);
 if(s&&s.kind==="help")h+=helpSheet();
 h+=toastHtml();
 const prev=!!layer.querySelector(".sheet");layer.innerHTML=h;layer._sheet=ui.sheet;afterLayer(prev);
}
function readDraft(){
 const d=ui.sheet.draft,v=id=>document.getElementById(id);if(!v("f-name"))return d;
 d.name=v("f-name").value.trim();d.room=v("f-room").value;d.mins=Math.max(1,+v("f-mins").value||15);d.every=Math.max(1,+v("f-every").value||1);d.unit=v("f-unit").value;
 if(v("f-wd"))d.weekday=+v("f-wd").value;if(v("f-who"))d.assignee=v("f-who").value;
 d.rotate=[...document.querySelectorAll('[data-rot="task"]:checked')].map(x=>x.value);
 if(d.rotate.length>1&&!d.rotate.includes(d.assignee))d.assignee=d.rotate[0];
 d.months=[...document.querySelectorAll("[data-month]:checked")].map(x=>+x.dataset.month);
 d.next=v("f-next").value||today();d.time=v("f-time").value||"09:00";d.timeSet=!!d.timeSet||d.time!==(ME.defaultTime||"09:00");d.flexible=v("f-flex").checked;d.photoProof=v("f-photo").checked;
 d.standard=v("f-std").value.trim();d.steps=v("f-steps").value.split("\n").map(x=>x.trim()).filter(Boolean);d.notes=v("f-notes").value.trim();
 return d;
}
function openTask(id,mode){const t=D.tasks[id];if(!t)return;const d=JSON.parse(JSON.stringify(t));delete d.id;d.months=d.months||[];d.rotate=d.rotate||[];ui.sheet={kind:"task",id,draft:d,mode:mode||"view"};ui.calMsg=null;renderLayer();if(!ui.cal.list&&!ui.cal.err)loadCalendars()}
function saveTask(){
 const d=readDraft();if(!d.name){document.getElementById("f-name").focus();return}
 if(d.unit==="week"){if(d.weekday==null)d.weekday=parse(d.next).getDay();d.next=onWeekday(d.next,d.weekday)}else d.weekday=null;
 if(d.months.length)d.next=snapSeason(d.next,d.months);
 d.stepsDone=(d.stepsDone||[]).filter(i=>i<d.steps.length);
 const id=ui.sheet.isNew?rid():ui.sheet.id,prev=D.tasks[id];put("tasks",id,d);
 if(d.assignee&&d.assignee!==myPid()&&(!prev||prev.assignee!==d.assignee))logEvent({kind:"assign",text:`gave ${pName(d.assignee)} “${d.name}”`,ref:"task:"+id});
 if(ui.sheet.isNew){ui.sheet=null;toast(`Added · first due ${nice(d.next)}`)}else{openTask(id,"view");toast(`Saved · next ${nice(d.next)}`)}
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
 if(ds.tab){ui.seenBefore=null;if(ds.tab==="home"&&b.closest("nav.tabs")){ui.homeView="rooms";ui.roomOpen=null}ui.tab=ds.tab;ui.q="";ui.editShift=false;render();window.scrollTo(0,0);if(ds.tab==="more"&&ui.more==="cal")loadCalendars();return}
 if(ds.who){ui.who=ds.who;if(ui.plan)ui.plan.ids=buildPlan(ui.plan.mins);render();return}
 if(ds.done){startDone(ds.done);return}
 if(ds.finish){const s=ui.sheet,file=document.getElementById("fin-photo")?.files?.[0];let photo="";
  if(file&&S.photos){s.busy=true;renderLayer();try{photo=await uploadPhoto(file)}catch(err){s.busy=false;s.err="Couldn't upload the photo. Try again, or close this and check it off without one.";renderLayer();return}}
  ui.sheet=null;finishTask(s.id,s.credit,photo);return}
 if(ds.claim){claim(ds.claim);return}
 if(ds.nudge){nudge(ds.nudge);return}
 if(ds.toggle){ui.open[ds.toggle]=!ui.open[ds.toggle];render();return}
 if(ds.edit){openTask(ds.edit);return}
 if(ds.new){ui.sheet={kind:"task",isNew:true,draft:newTask({name:"",room:ds.roomNew||ui.roomOpen||"Other",unit:"week",every:1,mins:15},today())};renderLayer();document.getElementById("f-name")?.focus();return}
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
 if(ds.undo){const u=ui.toast&&ui.toast.undo;clearTimeout(toastTimer);ui.toast=null;if(u)u();nextToast();return}
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
 if(ds.rmitem){const r=D.routines[ui.routine],prev=r.items;const it=r.items.find(x=>x.id===ds.rmitem);ui.sheet=null;renderLayer();updateRoutine(r,{items:r.items.filter(x=>x.id!==ds.rmitem)});toast(`Removed “${it?it.text:"item"}”`,()=>updateRoutine(D.routines[r.id]||r,{items:prev}));return}
 if(ds.up){const r=D.routines[ui.routine],ix=+ds.up,it=[...r.items];[it[ix-1],it[ix]]=[it[ix],it[ix-1]];updateRoutine(r,{items:it});return}
 if(ds.rmroutine){const id=ui.routine,copy=Object.assign({},D.routines[id]);delete copy.id;remove("routines",id);ui.routine=null;ui.editShift=false;ui.tab="schedule";render();toast(`Deleted the ${copy.name}`,()=>{put("routines",id,copy);ui.routine=id});return}
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
 if(ds.buy){const i=D.items[ds.buy],prev=Object.assign({},i);patch("items",i.id,{done:true,n:(i.n||0)+1,boughtBy:myPid(),boughtAt:Date.now()});toast(`Got ${i.text}`,()=>put("items",i.id,prev));return}
 if(ds.again){patch("items",ds.again,{done:false,who:myPid(),at:Date.now()});return}
 if(ds.rmli){const i=Object.assign({},D.items[ds.rmli]);remove("items",ds.rmli);toast(`Removed ${i.text}`,()=>put("items",i.id,i));return}
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
 if(el.id==="libroom"){ui.libRoom=el.value;render();return}
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
