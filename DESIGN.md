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
- Light (default): paper #F5F1E8, leaf #FBF9F4, tint #EDE7DA, rule #DED6C6, ink #2B2D29, forest #2E4A3B, sage #7A8768, clay #9C5F45.
- Dark: deep forest #111713 / #172019, forest #9BC2A6.
- Meaning: forest = brand and complete, amber = coming due, red = genuinely late. Status always has a shape or word too (dot, ring, triangle, "2 days late"), never color alone.
- Type: Hanken Grotesk for the interface; Newsreader (restrained serif) for page titles and section heads. Two families only.
- Spacing scale 4/8/12/16/24/32/48. Radii 8/12/18, used on purpose: pills for controls, 12 for the few panels, sheets 18.

## Layout
- Lists divided by hairline rules, not boxes. Cards only where they earn it (tonight's shift, a few panels). Rooms are a simple grid.
- Bottom tabs with labels: Today, Schedule, Household, Home, More. From 900px they become a sidebar and Today splits into two columns.
- Today answers: what today, who, what's next, what tonight. Greeting, one summary line, Needs attention, Today, then Tonight and Coming up. When everything's done: "You're all caught up." with what's next.
- Complete buttons sit at the right edge for the thumb; secondary actions (Tomorrow, Skip) are a swipe away and also in the task sheet.

## Motion and feedback
Subtle everywhere; respect reduced motion. Small moments: the check settles and the row slides away; closing the shift; a star pops in Kid view. Short haptic on completion where supported. Sound only in Kid view (soft chime, can be off).

## Words
Plain, concise, occasionally friendly: Complete task, Move to tomorrow, All caught up, Ready for tonight?
Prefer home, household, upkeep, routine, closing shift, maintenance, shared responsibilities. Avoid "chores" as the frame, productivity jargon, guilt, and anything implying one person manages and the rest help.

## Practical
iPhone (small screens too), Android, tablets (Kid view), desktop for setup and records. Larger text, strong contrast, 44px touch targets, screen-reader labels, offline with sync. Logical CSS properties so right-to-left can come later.

**Guiding principle: personality through design decisions, not visual clutter.**
