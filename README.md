# Stakeholder Flow

Build a web app called "Stakeholder Documentation & Tracking System". It's an internal tool I use to track partner/stakeholder relationships as they move through a fixed 5-stage funnel. Below is the full spec.

1. Shared data — this is the most important requirement

This app must use a shared, server-side database (Supabase), not browser local storage and not per-user private data. There is no login/authentication required — anyone who opens the published link should see the exact same live dataset, be able to add stakeholders, move them through stages, add notes/comments, and immediately have those changes visible to the next person who opens the link. Treat all data as one global shared workspace:

One shared stakeholders table and one shared stage_history table (or a history jsonb column on stakeholders — your choice), with public read/write access (no row-level security tied to a user).

No "my data" vs "their data" — it's one continuous shared record everyone contributes to and continues from.

Persist every change immediately (add stakeholder, move stage, edit comments) so nothing is lost on refresh or when a different person opens the link later.

2. The funnel / pipeline stages

Exactly 5 stages, in this order, each with a fixed color and decreasing width to form a visual funnel (like a sales funnel chart — wide at top, narrow at bottom, trapezoid segments stacked with a small gap between them):

Contacted — dark navy (#1c2541), white text

Connected — slate blue (#2e4374), white text

Initial Interaction Completed — teal (#1e6b6b), white text

Discovery Workshop Conducted — burnt red/orange (#c1503e), white text

Closure (Alignment & Overall Purpose) — green (#2f7d4f), white text

Each funnel segment shows the stage name and a live count of how many stakeholders currently sit in that stage. Clicking a segment opens a popup (see section 5).

New stakeholders always start at Contacted by default.

3. Add Stakeholder form

A button opens a form to create a new stakeholder with these fields:

Name (required, text)

About (optional, multi-line text)

LinkedIn profile (optional, URL)

Industries — multi-select, choose one or more from this fixed list: Agriculture Inputs, Automotive & Auto Ancillaries, Building Materials (Cement & Paints), Chemicals, Consumer Durables / Industrial, Energy & Fuel, Energy Storage, FMCG, IT Hardware, Metals & Mining, Pharma, Retail, Telecom, Textiles

Companies — free-text tag input, user can add multiple company names one at a time (type + press Enter to add a chip, click x to remove)

Partner archetype — single-select from exactly these 3 options:

Ex-BU Head / Ex-Head of Retail / M&S / Ex-GM or Ex-VP

Ex-Tech Software firms selling to BHs

Ex-Consulting Partner

On submit, the stakeholder is created in the shared database at the "Contacted" stage.

4. Moving a stakeholder between stages

A stakeholder can be moved from any stage to any other stage (not just to the next one) at any time. Moving always requires explicit confirmation:

Show a confirmation dialog before the move actually happens, displaying "from stage → to stage".

Include an optional notes text field in this confirmation dialog, labeled something like "Notes on what happened at this stage" — this captures what happened before/while leaving the stage.

On confirm, update the stakeholder's current stage and append an entry to their stage history log (from stage, to stage, note text if any, timestamp).

On cancel, nothing changes.

5. Stage popup (click a funnel segment)

Clicking a funnel stage opens a popup/modal titled with that exact stage's name (must always stay in sync if the stage name ever changes) showing:

Count of stakeholders currently in that stage

A search box that filters by name, company, about text, industries, and archetype (live, case-insensitive)

Filter dropdowns: filter by Industry and filter by Partner Archetype, plus a "clear filters" option

A readable list/cards of matching stakeholders, each showing: name, archetype, a short "about" snippet, industry tags, companies, and a snippet of their comments (if any)

Clicking a stakeholder card opens their full detail view (section 6)

6. Stakeholder detail view

Clicking into a stakeholder shows:

All their profile fields (name, about, LinkedIn link, industries as tags, companies as tags, archetype), with an edit option to update any of these fields

One single field per contact: "Any comments on the stakeholder" — a free-text box, autosaves as the user types (not tied to any particular stage, just one persistent field per person)

Buttons to move them to any other stage (opens the confirmation dialog from section 4)

A chronological stage history log: every past transition, showing from-stage → to-stage, the optional note left at that time, and the date/time it happened

7. Excel export

A "Download Excel" button in the header that exports the entire shared dataset as an .xlsx workbook with two sheets:

Sheet 1 "Stakeholders": one row per stakeholder — Name, Current Stage, About, LinkedIn Profile, Industries (semicolon-separated), Companies (semicolon-separated), Partner Archetype, Any Comments on the Stakeholder, Added On (date)

Sheet 2 "Stage History": one row per stage transition across all stakeholders — Name, From Stage, To Stage, Note, Date

8. Design direction

Professional, clean CRM-style tool — not flashy. Warm off-white background (~#fbf9f4), dark charcoal/navy text, warm neutral borders (~#eee6d6 / #ddd6c7). Rounded cards and pill-shaped chips/badges. The funnel itself is the visual centerpiece — the rest of the UI (forms, modals, lists) stays quiet and functional so the funnel stands out. Fully responsive down to mobile.

9. Behavior summary / non-negotiables

All data is shared globally across every visitor to the published link — nobody starts from a blank slate; everyone continues the same shared pipeline.

Every change (new stakeholder, stage move, comment edit, field edit) saves immediately to the shared database — no manual save button, nothing resets on reload.

Moving a stage always requires a confirmation step first.

Only one "comments" field exists per stakeholder (not per stage).

Stage names, funnel labels, and popup titles must always match exactly — if a stage is renamed later, it should only need to change in one place.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://illumine-stakeholder-tracking-system.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/61f3b98f-e4d8-4c85-9232-4200f59df9b7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
