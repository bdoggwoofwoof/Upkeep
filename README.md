# Upkeep

A shared household app that takes the mental load out of running a home. It knows every chore and maintenance job your house needs, puts each on the right schedule (and in the right season), and splits the work fairly across the family.

## Features
- **Home profile setup** picks tasks that fit your home (house or apartment, own or rent, yard, septic, well, fireplace, generator, pool, kids, pets, car…) from a library of about 200.
- **Seasonal timing**: yearly jobs land on the first Saturday of their month (furnace in September, AC in April, gutters May and November).
- **Today**: overdue, due today and this week; Everyone / Mine / Up for grabs; "How much time do you have?" plans with a countdown timer.
- **Sharing**: invite link for adults; assign, rotate, claim ("I'll take it"), nudge; photo proof; "Done means" standards; notes and comments.
- **Closing shift**: nightly routine split across the family, resets at 4 AM. Add more routines.
- **Kid mode**: kids use Kid view on any family device, earn stars, ask for rewards; optional grown-up OK and allowance per star.
- **Family**: approvals, weekly share of the work, streaks, history, live notices.
- **More**: home info board, appliances with warranty and service history, contractors, shopping lists, shared expenses, printable fridge chart, Away mode.
- **Calendar**: subscribe once in Google or Apple Calendar (`/api/ics`) and tasks stay in sync; per-task Google links and .ics files.
- Installable on the phone (Add to Home Screen), works offline and syncs when back online.

## How it's built
- `src/` → `node build.mjs` → `index.html` (one-page app, no framework). Vercel runs the build on every push.
- `api/house.js` stores each house as one private JSON file in Vercel Blob, with conditional writes (`ifMatch`) so simultaneous edits don't overwrite each other. Phones sync every 15 seconds while the app is open.
- `api/photo.js` stores photos (shrunk to 1600px on the phone) as public Blob files with random names.
- `api/ics.js` serves the calendar feed.
- A house is reached by its id and secret key (the invite link). Anyone with the link can see and change that house.

Needs a Vercel Blob store connected to the project (`BLOB_READ_WRITE_TOKEN`).
