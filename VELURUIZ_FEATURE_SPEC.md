# Veluruiz Realtor — Feature Spec (this build phase)

This is the detailed scope for the employee admin panel, client area, and appointment flow agreed on with Alejandro. `CLAUDE.md` stays high-level; this file is the source of truth for what to build.

## 1. Auth Architecture — single system

One Supabase Auth system for everyone, distinguished by a `rol` field: `publico` (no login) / `cliente` / `empleado`. Do not build two separate auth systems.

- **Clients:** sign in with Google (Supabase OAuth provider).
- **Employees:** method open — default recommendation is Google OAuth too (same system, simpler), but confirm with Alejandro before building. Email/password is the alternative if he wants tighter control over the small internal team.

## 2. Employee Admin (`/admin`)

- **Not linked anywhere in public navigation.** No "Employee Section" button/link visible to visitors.
- Hiding the route is NOT the security control — real auth + role check behind it is. Both must exist together.
- Sonnet-reviewed by the `veluruiz-code-reviewer` subagent before any admin code ships, focusing on auth correctness.

### Admin features:
1. **Property CRUD** — add / edit / remove properties.
2. **Leads / chatbot messages** — organized view of contacts the chatbot captured (name, phone, property of interest). Includes visit requests with a status: `Solicita visita` → `Confirmada`. Confirming a request is also where the appointment gets logged for stats (see section 4 — no Calendly webhook involved).
3. **Direct photo upload** — via Supabase Storage, no external URL pasting required.
4. **Soft delete** — toggle properties active/inactive instead of deleting rows. Preserves history.
5. **Basic stats** — count of active/inactive properties.
6. **Views & zone ranking** — view counter per property page; ranking of most-viewed zones (zone field to be confirmed during audit). Seeds real data for the Month 6-7 capstone (data analysis on Veluruiz's own numbers, not a generic dataset).
7. **Exclusive listing access approval** — when a registered client requests a visit to an exclusive (off-market) property, an employee approves or denies in the admin before any scheduling happens.
8. **Appointment stats** — booked appointments by property and by zone, broken down weekly/monthly/annual. Captured at the moment the employee marks a request `Confirmada` (manual entry of date/property) — not via Calendly webhook, since Calendly stays on the free plan (see section 4).

## 3. Client Area

- Registration/login via Google only (no separate password flow).
- Once logged in, clients can see **exclusive ("off-market"/"pocket listing") properties** that are NOT shown to anonymous/public visitors. These are legitimate off-market listings — common practice in luxury real estate when owners want privacy/security.
- Exclusive listings show description only, **no photos**, to anonymous-but-registered eyes.
- Clients can request a visit to an exclusive property → creates a lead tied to their account → goes to admin for employee approval (section 2.7) → only after approval does scheduling happen.
- No tiering/curation needed: any registered client can request any exclusive listing; the actual gate is the employee approval step, not differentiated visibility per client.

## 4. Appointments — Calendly, free tier only (confirmed decision)

**⚠️ Audit note:** the repo already contains `src/app/api/webhooks/calendly/route.ts`, `appointment.services.ts`, and `ScheduleModal.tsx` — a prior attempt at webhook-based Calendly integration. This contradicts the decision below (Calendly free tier, no webhooks). Confirm whether this is live/used before deciding to disable or repurpose it — do not assume it's dead code without checking.

**Decision made:** stay on Calendly's free plan. No webhooks, no paid API/Scheduling features. This means:

- **No instant self-service booking widget anywhere** (neither public catalog nor exclusive listings). This was the original plan for public properties but is dropped to keep cost at $0 — confirmed trade-off.
- **Every appointment request — public or exclusive — becomes a lead in the admin**, following the same flow as section 2.2/2.7. An employee confirms manually (phone/email/Calendly used internally if convenient) and logs the date in our own database at that point.
- Because logging happens at confirmation time (not via webhook), appointment stats (section 2.8) work without any Calendly paid feature — the data source is our own DB, populated by the employee action, not by Calendly's API.
- One single business calendar/account for now (not per-agent). Revisit if the team grows.

### Chatbot booking — two tiers, only the simple one now
- **Now (this phase):** chatbot detects booking intent → captures contact info + property + preferred time → creates a lead with status `Solicita visita`, same as a request that comes through a form. No live calendar checking, no Calendly link shared automatically (since there's no instant-booking flow to point to under the free-tier decision).
- **Deferred to Month 4 of the plan (Claude API / tool use):** chatbot uses function-calling to check real availability and book directly inside the conversation. Already identified as a natural project for that phase — do not build now.

## 5. Data Being Captured (seeds for Month 6-7 capstone)
- Views per property
- Views per zone (ranking)
- Search filters used, if the catalog already has them (confirm in audit)
- Appointments by property and by zone, weekly/monthly/annual

This is real business data from a real client — a stronger capstone dataset than a generic one. No analysis is done now; just make sure it's being captured correctly from day one.

## 6. Explicitly Out of Scope (this phase)
- Calendly paid plan / webhooks / Scheduling API
- Chatbot live calendar booking (function-calling) — Month 4
- Python/SQLAlchemy backend migration — Month 3, separate project
- Per-client curated visibility of exclusive listings (all registered clients see all exclusives; only the visit approval is gated)
- Multi-agent/multi-calendar support

## 7. Open Items for the Audit to Resolve
- Next.js migration: worth it or not (depends on routing coupling found in audit)
- Existing Supabase Auth configuration, if any
- Existing catalog filters (price/zone/rooms)
- Current Supabase DB/storage usage vs free tier limits
- Final employee login method (Google vs email/password — default leans Google, confirm with Alejandro)
