# CLAUDE.md — Veluruiz Realtor

## Project Overview
Real estate platform: property catalog, private client/employee portals, a 24/7 AI chatbot, and a database of 45,000+ records. This is a near-complete project (~90% done per the owner's estimate) about to go through a full code review before closing it out.

## Critical Context — read this first
- This project was built with **Gemini**, not Claude Code. The owner (Alejandro) does **not** know this codebase as deeply as his other Claude Code projects (e.g. his portfolio). Treat it as unfamiliar code, even where patterns look standard.
- **Do not assume the scope of work is small.** The owner's own estimate ("2-3 details left") is explicitly **not** to be trusted as the audit boundary — do a full review regardless of what he predicts is wrong.
- **Do not touch the production database** (45,000+ records) — schema, migrations, or seed data — without explicit confirmation in Plan Mode first.
- **Do not assume API keys/secrets (Groq, Supabase) are handled safely.** Verify env var usage explicitly during the audit; flag any hardcoded or exposed credentials as Critical.
- When something in the code isn't self-explanatory, explain the *why*, not just the *what*. Alejandro reads unfamiliar code more slowly than he writes new code — don't assume context he hasn't confirmed.

## Current Stack (as built — confirmed by inspecting actual files)
- Framework: **Next.js (App Router)** — confirmed via `src/app/` structure, `next.config.js`, `next-env.d.ts`. This was originally assumed to be plain React; it is not. No migration needed.
- Frontend: React + TypeScript + Tailwind CSS (within Next.js)
- Database / ORM: Prisma (`src/prisma/schema.prisma`, migrations present) + Supabase
- AI Chatbot: Groq, via `src/app/api/chat/route.ts`
- Auth: partial code already exists — `src/app/login/page.tsx`, `src/app/register/page.tsx`, `src/context/AuthContext.tsx`. State unknown — do not assume it's wired up or working. Audit first.
- Hosting / deploy target: to verify during audit

## Target Stack (Alejandro's longer-term plan — context, not a mandate)
- TypeScript (already in use — deepen typing rigor where loose)
- React (already in use, via Next.js)
- Tailwind (already in use)
- Python / SQLAlchemy — explicitly OUT OF SCOPE for this project. Reserved for Month 3 of the plan (separate project). Do not introduce a Python service here.

## Pre-Existing Code — audit before assuming greenfield
This project is further along than initially scoped. Confirmed present in the repo, state unknown until audited:
- Auth pages/context (`login`, `register`, `AuthContext.tsx`)
- Calendly webhook route (`src/app/api/webhooks/calendly/route.ts`) + `appointment.services.ts` + `ScheduleModal.tsx` — **this contradicts the confirmed $0/Calendly-free-tier decision** (webhooks require a paid Calendly plan). Audit must determine if this is live/used; if so, it likely needs to be disabled/replaced with the manual-confirmation flow described in VELURUIZ_FEATURE_SPEC.md.
- Public property-add route (`src/app/catalog/add/page.tsx`, `AddPropertyModal.tsx`) — **confirmed decision: remove from public access**, functionality moves into `/admin` only. See subagent's audit checklist — this is flagged 🔴 Critical regardless of findings.

Do not assume any "planned new feature" below is being built from scratch — check first.

## Cost Constraint
This project runs at $0/month except the domain (paid after client approval). Every technical decision must respect this:
- Supabase: free tier (currently sufficient — verify DB/storage size during audit given 45,000+ records)
- Groq: free tier (watch rate limits as chatbot usage grows with new lead-capture features)
- Calendly: **free tier only** — no webhooks, no paid API features. See FEATURE_SPEC.md for how appointment tracking works without them.
- Google OAuth via Supabase Auth: free.

Do not propose or default to any paid service/tier without flagging the cost explicitly first.

## Planned New Features
See `VELURUIZ_FEATURE_SPEC.md` in this same directory for the full spec of new features being added in this phase (employee admin, client area, exclusive listings, appointment flow). That file is the source of truth for scope — this CLAUDE.md stays high-level on purpose.

## Open Decisions — RESOLVED by audit (2026-06-25)
- Catalog filters: confirmed present (operationType, type, city, price min/max, text search, "Solo Privadas" checkbox) — all client-side in `catalog/page.tsx`. "Solo Privadas" is currently broken (no `isPrivate` field in schema — see EXECUTION_PLAN.md Batch 4).
- Zone field: confirmed present (`zone String`, required, non-nullable) in schema and migration. No index — add one if zone-ranking queries get slow.
- Supabase Auth: confirmed NOT configured at all. `@supabase/supabase-js` isn't even in `package.json`. Building from true zero.
- Employee login method: resolved — Google OAuth via Supabase Auth, same system as clients, distinguished by a `role` field. Small fixed employee team gets `role: 'empleado'` set manually via the Supabase dashboard after first login. See EXECUTION_PLAN.md Batch 2.

## Still open
- Current Supabase DB/storage size vs free tier limits — audit confirmed the *query pattern* is risky (no pagination, ~22MB/request) but not the current total stored size. Check the Supabase dashboard directly.

## Execution
See `EXECUTION_PLAN.md` for the full prioritized, batched build order combining this audit's findings with the feature spec.

## Project Structure
*To be filled in / confirmed during initial exploration (Phase 1 audit).*

## Working Method
- Aliados, no jefe-empleado: Alejandro sets direction and reviews; Claude Code executes and explains.
- Explore → Plan → Code → Commit. **Plan Mode is mandatory** before any multi-file change, schema change, or anything touching auth or the production DB.
- Instructions are briefs, not step-by-step recipes — but for this specific project, default to **more** explanation, not less, given the unfamiliarity factor above.
- Every diff gets read and explained before being accepted — no batch-accepting changes.

## Audit Protocol (current phase)
1. Full **read-only** exploration in Plan Mode. No edits.
2. Cover: repo structure, auth flow (client + employee portals), Groq chatbot integration, env var/secrets handling, Supabase/Prisma schema and queries, build/lint health, error handling, accessibility.
3. Do not limit findings to what the owner predicted. Evaluate as a complete professional code review.
4. Output: categorized findings — **Critical / Important / Polish** — with no fixes applied yet. Plan goes back to the owner for prioritization before any code changes.

## Conventions
*To verify/establish during audit: naming conventions, component structure, styling approach, file organization patterns.*

## Commands
*To confirm and fill in once verified: dev server, build, lint, test commands.*

## Developer Preferences
- Brief-style instructions, not step-by-step recipes.
- Explain the "why" behind changes, not just the "what."
- Plan Mode required for: schema changes, auth changes, anything touching the production database.
- Current skill level: comfortable with React/JS fundamentals; reading unfamiliar code is slower than writing new code — pace explanations accordingly.
- Public-facing copy (README, etc.) should never frame this project as "in progress / learning" — value framing only, consistent with the portfolio's language conventions.
