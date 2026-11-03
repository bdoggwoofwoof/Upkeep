import { read, auth, ID_RE } from './_store.js';

const RR = ['SU','MO','TU','WE','TH','FR','SA'];
const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const esc = s => String(s ?? '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
function fold(line) {
  const out = []; let cur = '';
  for (const ch of line) {
    if (Buffer.byteLength(cur + ch) > 73) { out.push(cur); cur = ' ' + ch; } else cur += ch;
  }
  out.push(cur); return out.join('\r\n');
}
const pad = n => String(n).padStart(2, '0');
function local(date, time, addMin = 0) {
  const [y, m, d] = date.split('-').map(Number), [hh, mm] = (time || '09:00').split(':').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d, hh, mm) + addMin * 60000);
  return `${t.getUTCFullYear()}${pad(t.getUTCMonth() + 1)}${pad(t.getUTCDate())}T${pad(t.getUTCHours())}${pad(t.getUTCMinutes())}00`;
}
function rrule(t) {
  if (t.byday && t.byday.length && t.byday.length < 7) return `FREQ=WEEKLY;BYDAY=${t.byday.map(i => RR[i]).join(',')}`;
  if (t.months && t.months.length) return `FREQ=YEARLY;INTERVAL=${t.unit === 'year' ? Math.max(1, t.every | 0) : 1};BYMONTH=${t.months.join(',')};BYDAY=1SA`;
  const n = Math.max(1, t.every | 0), f = { day: 'DAILY', week: 'WEEKLY', month: 'MONTHLY', year: 'YEARLY' }[t.unit] || 'WEEKLY';
  let r = `FREQ=${f}`; if (n > 1) r += `;INTERVAL=${n}`;
  if (t.unit === 'week' && t.weekday != null) r += `;BYDAY=${RR[t.weekday]}`;
  return r;
}
function nameOf(people, pid) { return pid ? ((people[pid] && people[pid].name) || 'Someone') : 'Anyone'; }

export default async function handler(req, res) {
  try {
    const { h, k, p = 'all', task, routine, dl, r } = req.query;
    if (!ID_RE.test(h || '')) return res.status(400).send('Bad link');
    const cur = await read(h);
    if (!cur || !auth(cur.state, k)) return res.status(404).send('Not found');
    const docs = cur.state.docs || {}, people = docs.people || {};
    const remind = r === undefined ? 30 : Number(r);
    let tasks = Object.entries(docs.tasks || {}), routines = Object.entries(docs.routines || {});
    if (task) { tasks = tasks.filter(([id]) => id === task); routines = []; }
    else if (routine) { routines = routines.filter(([id]) => id === routine); tasks = []; }
    else if (p !== 'all') tasks = tasks.filter(([, t]) => !t.assignee || t.assignee === p);
    const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
    const L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Upkeep//House//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
      'X-WR-CALNAME:' + esc(p === 'all' ? 'Upkeep · House' : 'Upkeep · ' + nameOf(people, p)), 'REFRESH-INTERVAL;VALUE=DURATION:PT6H', 'X-PUBLISHED-TTL:PT6H'];
    const alarm = () => remind >= 0 ? ['BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:Reminder', `TRIGGER:-PT${remind}M`, 'END:VALARM'] : [];
    for (const [id, t] of tasks) {
      if (!t.next) continue;
      let d = `${t.room || ''} · about ${t.mins || 15} min`;
      if (t.months && t.months.length) d += ` · ${t.months.map(m => MON[m - 1]).join(' & ')}`;
      if (t.assignee) d += `\nWhose job: ${nameOf(people, t.assignee)}`;
      if (t.standard) d += `\n\nDone means: ${t.standard}`;
      if (t.steps && t.steps.length) d += '\n\nChecklist:\n' + t.steps.map(s => '☐ ' + s).join('\n');
      if (t.notes) d += '\n\n' + t.notes;
      d += '\n\nCheck it off in Upkeep.';
      L.push('BEGIN:VEVENT', `UID:${id}@upkeep`, `DTSTAMP:${now}`, `DTSTART:${local(t.next, t.time)}`, `DTEND:${local(t.next, t.time, Math.max(5, t.mins | 0))}`,
        `RRULE:${rrule(t)}`, 'SUMMARY:' + esc(t.name), 'DESCRIPTION:' + esc(d), 'TRANSP:TRANSPARENT', ...alarm(), 'END:VEVENT');
    }
    const today = new Date().toISOString().slice(0, 10);
    for (const [id, ro] of routines) {
      const days = ro.days && ro.days.length ? ro.days : [0, 1, 2, 3, 4, 5, 6];
      const items = (ro.items || []).map(i => '☐ ' + i.text + (i.assignee ? ` (${nameOf(people, i.assignee)})` : '')).join('\n');
      L.push('BEGIN:VEVENT', `UID:routine-${id}@upkeep`, `DTSTAMP:${now}`, `DTSTART:${local(today, ro.time || '21:00')}`, `DTEND:${local(today, ro.time || '21:00', 30)}`,
        `RRULE:FREQ=WEEKLY;BYDAY=${days.map(i => RR[i]).join(',')}`, 'SUMMARY:' + esc(ro.name || 'Closing shift'),
        'DESCRIPTION:' + esc(items + '\n\nCheck items off in Upkeep so everyone can see.'), 'TRANSP:TRANSPARENT', ...alarm(), 'END:VEVENT');
    }
    L.push('END:VCALENDAR');
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    if (dl) res.setHeader('Content-Disposition', `attachment; filename="upkeep${task || routine ? '-event' : ''}.ics"`);
    return res.status(200).send(L.map(fold).join('\r\n') + '\r\n');
  } catch (e) {
    console.error('ics error', e);
    return res.status(500).send('Server error');
  }
}
