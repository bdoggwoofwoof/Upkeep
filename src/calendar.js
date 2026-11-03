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
