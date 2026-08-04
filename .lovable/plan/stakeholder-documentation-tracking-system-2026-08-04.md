# Stakeholder Documentation & Tracking System

A single-page internal CRM tool built around a 5-stage funnel, backed by one shared cloud database that every visitor reads and writes — no login, no local storage.

## Backend (Lovable Cloud)

Two tables, both openly readable and writable by anyone (one global workspace, no per-user ownership):

- `stakeholders` — name, about, linkedin_url, industries (array), companies (array), archetype, current_stage, comments, created_at, updated_at
- `stage_history` — stakeholder_id, from_stage, to_stage, note, created_at

Policies allow anonymous select/insert/update/delete so the published link works with no sign-in. History cascades with its stakeholder.

Note: this dataset is intentionally public — anyone with the link can read, edit and delete everything. That matches the spec; say the word if you want a light passcode gate later.

## Single source of truth for stages

One `STAGES` constant defines id, label, color and funnel width for all 5 stages. Funnel, popup titles, move dialog, detail view and Excel export all read from it, so a rename happens in exactly one place.

| Stage | Color |
|---|---|
| Contacted | #1c2541 |
| Connected | #2e4374 |
| Initial Interaction Completed | #1e6b6b |
| Discovery Workshop Conducted | #c1503e |
| Closure (Alignment & Overall Purpose) | #2f7d4f |

## Screens and interactions

**Home (single page)**
- Header: title, "Add Stakeholder", "Download Excel"
- Funnel centerpiece: 5 stacked trapezoid segments, decreasing width, small gaps, white label plus live count. Clicking one opens the stage popup.

**Add Stakeholder dialog** — name (required), about, LinkedIn URL, industries multi-select from the fixed 14-item list, companies chip input (Enter to add, x to remove), archetype single-select from the 3 fixed options. Created at Contacted.

**Stage popup** — titled with the stage label, shows the count, live case-insensitive search across name / company / about / industries / archetype, Industry and Archetype filter dropdowns with clear-filters, and result cards (name, archetype, about snippet, industry and company chips, comments snippet). Card click opens the detail view.

**Stakeholder detail** — all profile fields with inline edit, one persistent "Any comments on the stakeholder" textarea that autosaves as you type (debounced), buttons to move to any other stage, and a chronological history log (from → to, note, timestamp).

**Move confirmation** — always shown before a move: "From Stage → To Stage" plus an optional "Notes on what happened at this stage". Confirm writes the new stage and appends a history row; cancel changes nothing.

## Excel export

A two-sheet .xlsx: "Stakeholders" (Name, Current Stage, About, LinkedIn Profile, Industries, Companies, Partner Archetype, Any Comments on the Stakeholder, Added On) and "Stage History" (Name, From Stage, To Stage, Note, Date).

## Design

Warm off-white #fbf9f4 background, charcoal-navy text, warm neutral borders #eee6d6 / #ddd6c7, rounded cards, pill chips. Quiet forms and modals so the funnel stays the focal point. Responsive: funnel segments go full-width on mobile, dialogs become scrollable sheets.

## Technical notes

- Data access through TanStack Start server functions on a publishable-key Supabase client, wired to TanStack Query with invalidation after every mutation, so changes persist instantly and show up for the next visitor.
- New dependency: `xlsx`.
- Stage constants in `src/lib/stages.ts`; feature components under `src/components/`.
