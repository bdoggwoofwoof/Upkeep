/* ---------- Store: house file on the server, cached on the device ---------- */
const COLS=["tasks","routines","checks","comments","activity","people","approvals","rewards","things","service","pros","info","items","expenses"];
const D={house:null};COLS.forEach(c=>D[c]={});
const ls={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let ME=Object.assign({house:"",key:"",token:"",feed:"",pid:"",device:"",reminder:30,defaultTime:"09:00",lastSeen:0,notify:false},ls.get("upkeep-me",{}));
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

function loadMeta(res){let ch=false;if(res.invite&&res.invite!==ME.key){ME.key=res.invite;ch=true}if(res.feed&&res.feed!==ME.feed){ME.feed=res.feed;ch=true}if(res.devices)S.devices=res.devices;if(res.me)S.deviceId=res.me;if(ch)ls.set("upkeep-me",ME)}
const authKey=()=>ME.token||ME.key;
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
  const res=await api("POST",{h:ME.house,k:authKey(),ops:batch});loadMeta(res);
  S.ops=S.ops.slice(batch.length);ls.set("upkeep-ops",S.ops);
  loadDocs(res.docs,res.v);if(S.note.startsWith("Offline"))S.note="";render();
 }catch(e){
  if(e.code==="not_found"){S.note="This phone no longer has access to the house. Ask someone in the house for a new invite link.";}
  else S.note="Offline. Your changes are saved on this phone and will sync when you're back online.";
  render();setTimeout(scheduleFlush,8000);
 }
 S.flushing=false;if(S.ops.length&&!S.note)scheduleFlush();
}
async function poll(){
 if(!ME.house||document.hidden||S.flushing||S.ops.length)return;
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
