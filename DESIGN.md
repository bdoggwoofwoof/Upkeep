# Upkeep: product and visual direction

**Purpose.** A shared household management system that takes the mental load out of maintaining a home by organizing, scheduling and fairly distributing the work of keeping it running.

**People.** The whole household: couples, families, roommates, multigenerational homes. One adult usually sets it up, other adults use their own phones, kids use Kid view on a shared tablet or phone. Never assume who does the work.

**Moments.** Kitchen routines, the nightly closing shift, checking something off mid-day, shopping and repairs. Visits are 15 seconds to 2 minutes; the shift about 5. Easy while standing or moving: little reading, little navigation.

**Must be perfect.** Obvious what needs doing, when, and who is responsible. Scheduling and fair distribution are the core. Records, lists and costs can be utilitarian.

## Feel
Grounded, capable, reassuring. Never corporate, infantilizing or overwhelming.
A well-used household notebook on the counter of a well-kept home: a homekeeping journal, a field notebook, a reference book. Tangible, not rustic or decorative.
Calm and quiet. A serious tool with small moments of play in Kid view, completions, the closing shift, streaks and seasonal transitions.
Familiar iPhone conventions, its own identity through type, color, spacing and small details.

References for quality, not templates: Things 3 (hierarchy, restraint), Apple Home (organization), Day One (editorial warmth). Avoid generic chore apps and AI SaaS dashboards: piles of rounded cards, pastel gradients, floating widgets, emoji, heavy gamification. Avoid the opposite extreme too: no farmhouse, gingham, botanical borders or scrapbook.

## Tokens (src/head.html)
- Light (default): paper #F5F1E8, leaf #FBF9F4, tint #EDE7DA, rule #DED6C6, ink #2B2D29, ink-2 #5F625A, ink-3 #66685F, forest #2E4A3B, sage #7A8768, soon #805B11, late #9E3A28, clay #9C5F45.
- Dark: deep forest #111713 / #172019, forest #9BC2A6, ink-3 #8A8F83.
- Contrast: every text color meets 4.5:1 on paper and on tint in both themes; meters use an outlined track (ink-3) so zero progress is still visible. Settings → More contrast darkens secondary text and lines further.
- Meaning: forest = brand and complete, amber = coming due, red = genuinely late. Status always has a shape or word too (dot, ring, triangle, "2 days late"), never color alone.
- Type: Hanken Grotesk for the interface; Newsreader (restrained serif) for page titles and section heads. Two families only. One scale: --fs-xs 13 · sm 14 · md 15 · base 16 · lg 18 · xl 20 · 2xl 24, h1 32. Labels are sentence case, never tiny uppercase.
- Spacing scale 4/8/12/16/24/32/48. Radii 8/12/18, used on purpose: pills for controls, 12 for the few panels, sheets 18.

## Layout
- Lists divided by hairline rules, not boxes. Callouts (one component, three variants) only for what should be seen first: weather prep, tonight's shift, the season. Rooms are a simple grid.
- Bottom tabs with labels: Today, Schedule, Household, Home, More. From 760px Today splits into two columns; from 900px the tabs become a sidebar.
- Today reads in the order you act: alerts, tonight's shift, today's tasks by time of day, a short Coming up, then the season, plans and reminders. The DOM follows the same order.
- Each task row has one trailing control, the complete button. The owner is in the meta line (small avatar + name). Tomorrow, Skip and Take it are a swipe away and in the task's read view.
- Tapping a task opens a read view (when, who, Done means, steps, notes, comments, history). Edit is a separate state with grouped fields and a sticky Save.

## Control roles
- Primary: solid forest, one per screen or sheet.
- Secondary: outlined pill or plain text. Destructive: quiet red text, always with Undo.
- Filter (Everyone / Mine / Up for grabs, lists, Suggested): outlined chip, forest wash and a check when on.
- Sub-navigation (Schedule views, More sections): text tabs with an underline; wraps, never clips.
- Choices in forms (months, days, people): square toggles. Settings switches: real switches.
- Visual size can be compact; hit areas are at least 44px through padding or an invisible extension.

## Motion and feedback
Subtle everywhere; respect reduced motion (the device setting, or Settings → Reduce motion). Feedback uses one slot over the tab bar (top of the screen while a sheet or Kid view is open). Undo always wins; notices about what others did wait their turn. Small moments: the check settles and the row slides away; closing the shift; a star pops in Kid view. Short haptic on completion where supported. Sound only in Kid view (soft chime, can be off).

## Words
Plain, concise, occasionally friendly: Complete task, Move to tomorrow, All caught up, Ready for tonight?
Prefer home, household, upkeep, routine, closing shift, maintenance, shared responsibilities. Avoid "chores" as the frame, productivity jargon, guilt, and anything implying one person manages and the rest help.

## Practical
iPhone (small screens too), Android, tablets (Kid view), desktop for setup and records. Larger text, strong contrast, 44px touch targets, screen-reader labels, offline with sync. Logical CSS properties so right-to-left can come later.

**Guiding principle: personality through design decisions, not visual clutter.**
