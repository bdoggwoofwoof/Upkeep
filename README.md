# Upkeep

A shared household app that takes the mental load out of running a home. It knows every chore and maintenance job your house needs, puts each on the right schedule (and in the right season), and splits the work fairly across the family.

## Features
- **Home profile setup** picks tasks that fit your home (house or apartment, own or rent, yard, septic, well, fireplace, generator, pool, kids, pets, car…) from a library of about 200.
- **Seasonal timing**: yearly jobs land on the first Saturday of their month (furnace in September, AC in April, gutters May and November).
- **Today**: weather prep and tonight's shift first, then today's tasks by time of day, a short Coming up and the season; Everyone / Mine / Up for grabs; "Have a few minutes?" plans with a countdown timer.
- **Task view**: tap a task to read it (Done means, steps, notes, comments, history); Edit is a separate grouped form.
- **Schedule**: the next 7 days by day, later weeks and months folded with a jump index, seasons, routines.
- **Sharing**: invite link for adults; assign, rotate, claim ("I'll take it"), nudge; photo proof; "Done means" standards; notes and comments.
- **Closing shift**: nightly routine split across the family, resets at 4 AM. Add more routines.
- **Kid mode**: kids use Kid view on any family device, earn stars, ask for rewards; optional grown-up OK and allowance per star.
- **Household**: approvals, people and each person's share of the week's minutes, invite link and phones, one Activity feed, milestones, kids and rewards.
- **More**: home info board, appliances with warranty and service history, contractors, shopping lists, shared expenses, printable fridge chart, Away mode.
- **Calendar**: subscribe once in Google or Apple Calendar (`/api/ics`) and tasks stay in sync; per-task Google links and .ics files.
- Today groups tasks by morning, afternoon, evening and anytime; Reorder (or long-press) to rearrange, with arrow buttons for keyboard and touch; pull down to sync.
- Settings: theme, larger text, more contrast, reduce motion.
- Season checklists (Winter, Spring, Summer, Fall) and household milestones.
- Freeze, snow, wind and heat prep lists from the forecast.
- Backup and restore (JSON), tasks as CSV, undo after deleting.
- Optional PIN to leave Kid view; a device can open straight into Kid view.
- Installable on the phone (Add to Home Screen), works offline and syncs when back online.

## How it's built
- `src/` → `node build.mjs` → `index.html` (one-page app, no framework). Vercel runs the build on every push.
  - `head.html`: tokens and all CSS. `lib.js`, `lib2.js`: the task library. `app.js`: data, sync, logic, sheets and older screens. `design.js`: Today, task rows and sheets, Schedule, Household, Kid view, Home, More, Shift. `web.js`: welcome, invites, calendar. `features.js`: seasons, milestones, weather, Kid view PIN, Settings, backup, reordering, pull to sync, the render hook. Each view is defined once.
- `api/house.js` stores each house as one private JSON file in Vercel Blob, with conditional writes (`ifMatch`) so simultaneous edits don't overwrite each other. Phones sync every 15 seconds while the app is open.
- `api/photo.js` stores photos (shrunk to 1600px on the phone) as public Blob files with random names.
- `api/ics.js` serves the calendar feed.
- Access: the invite link carries a join key. Joining gives that phone its own device key, so the invite link can be reset without signing anyone out, and a single phone can be removed from Household → Phones in this house. Calendar feeds use a separate read-only key.
- `api/health.js` checks Blob storage end to end (write, read, conditional write, stale write refused).
- Weather prep uses the free Open-Meteo forecast for the town set in Settings.

Needs a Vercel Blob store connected to the project (`BLOB_READ_WRITE_TOKEN`).
