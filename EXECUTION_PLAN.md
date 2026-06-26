# Veluruiz Realtor — Execution Plan (post-audit, 2026-06-25)

Built from the full read-only audit + VELURUIZ_FEATURE_SPEC.md. Key insight from the audit: most "features to build" already have a broken/empty first attempt in the repo — fixing and building are the same task in most cases here, not two separate passes. Each batch = its own commits, diffs read and explained before accepting, per the working method in CLAUDE.md.

## Verify First (run before trusting this plan)
```
wc -c src/app/login/page.tsx
grep -r "isPrivate" src/prisma/schema.prisma
grep -r "appointment.services" src/
```

## Batch 0 — Unblock the build (trivial, no design decisions needed)
- C-2: delete the three empty files (`login/page.tsx`, `register/page.tsx`, `AuthContext.tsx`) — they're 0 bytes, deleting costs nothing. Real versions get built in Batch 2.
- I-5: make `PropertyCard.onDelete` optional in the interface.
- C-3: fix the chatbot's hardcoded `localhost:3000` fetch — call `propertyService.getAllProperties()` directly instead.
- C-5: remove `details: error.message` from the 500 response in `api/properties/[id]/route.ts`.

## Batch 1 — Cost & scale safety (treat as urgent despite "Important" label)
Given the $0 budget constraint and 45,000+ records, these protect against breaking free-tier limits:
- I-2: add pagination (`take`/`skip`) to `property.service.ts` — currently fetches the entire table on every request (~22MB+), risking Vercel's serverless timeout and Supabase's free-tier bandwidth cap. Chatbot route should use a summarized subset, not the full catalog.
- I-9: basic rate limiting on the chatbot endpoint — protects Groq's free-tier request limits.

## Batch 2 — Real authentication
This is VELURUIZ_FEATURE_SPEC.md section 1, starting from confirmed zero (no Supabase Auth SDK installed at all):
- Supabase Auth + Google OAuth provider setup
- `role` field (`cliente` / `empleado`) — per audit recommendation, set manually via Supabase dashboard for the small fixed employee team after their first login
- `middleware.ts` (currently absent) to gate `/admin/*` and any client-only routes by role

## Batch 3 — Close the public exposure
- C-1: remove the public "+ Agregar Propiedad" button and the `/catalog/add` route entirely
- Add role check (`empleado` only) to POST/DELETE in `api/properties`
- C-4: connect the existing (already written, never imported) Zod schema in `validations/property.ts` to validate POST input

## Batch 4 — Admin panel
Behind the auth from Batch 2. Reuse `AddPropertyModal` as the base for property CRUD — it already exists, just needs to move behind the gate.
- I-1: add `isPrivate` field to `schema.prisma` + migration — this fixes the already-broken "Solo Privadas" filter and is what powers the exclusive/off-market listings feature
- Leads/chatbot messages, direct photo upload, soft delete, basic stats, views + zone ranking, exclusive-access approval — per FEATURE_SPEC sections 2 and 4

## Batch 5 — Appointments, the real way
- I-12: delete the dead Calendly webhook route (confirmed unused, also contradicts the confirmed $0/free-tier-only decision)
- I-4: connect `ScheduleModal`'s `handleSubmit` to the already-functional (already-written, never imported) `appointment.services.ts` — this becomes the manual-confirmation lead flow from FEATURE_SPEC section 4

## Batch 6 — Client area
Per FEATURE_SPEC section 3 — now unblocked by Batch 2 (auth) and Batch 4 (isPrivate).

## Batch 7 — Cleanup (low risk, no rush — no deadline pressure currently)
I-3 (migration drift), I-6 (Favorites mock data), I-7 (empty stub files), I-8 (duplicate Property types), I-10 (SVG path), I-11 (contact form), I-13 (operationType data inconsistency), all Polish items P-1 through P-10.
- **Found during Batch 4 (admin panel):** el role check ('empleado') está duplicado inline en tres lugares (POST de api/properties, DELETE de api/properties/[id], GET de api/appointments) — los tres bloques son idénticos. Extraer a un helper reutilizable (ej. requireEmployeeRole(request)) cuando se llegue a este lote.
- **Found during Batch 4 (chatbot):** ningún catch block del proyecto imprime errores en consola. Agregar console.error(error) en desarrollo en todos los API routes y services.
- **Found during i18n lote:** Pre-llenar ScheduleModal con nombre/email del usuario logueado (desde useAuth().profile) — mejora UX, no requisito de spec.
- **Corregido durante el lote de i18n (no pendiente):** el `value` del `<select>` de tipo de propiedad en AddPropertyModal estaba en inglés (e.g. `"apartment"`) mientras la DB guarda strings en español (`"Apartamento"`). Corregido: los `value` ahora coinciden exactamente con la DB. Se encontraron 2 propiedades corruptas (`"Mansion"` y `"Casa Mancera"` con `type: "house"`) y se corrigieron a `"Casa"` via `updateMany` en esta misma sesión. Si encuentras alguna propiedad con un `type` que no esté en la lista (`Apartamento`, `Casa`, `Terreno`, `Oficina`, `Local Comercial`, `Penthouse`, `Galpón`), es data corrupta por el bug anterior a este fix — reportarlo para corrección manual.

## Open question for Alejandro
I-6 (Favorites page uses mock data, never matches real properties) — fold into Batch 7, or treat as a quick win earlier since it's user-facing breakage? Your call.

## Backlog — fuera de los lotes actuales
- **Dark mode por defecto:** hoy el sitio carga siempre en light mode al entrar por primera vez. Cambiar el default a dark mode, respetando la preferencia explícita del usuario si ya eligió light (debe persistir esa elección, no resetear en cada visita). No es parte de ningún lote actual — revisar después de cerrar el Lote 4.

## Lección de proceso (2026-06-26)
Durante esta sesión, tres verificaciones distintas fallaron por la misma razón: confiar en que "el campo no es null/no está vacío" significa "el contenido es correcto", sin verificar el contenido real. Pasó con type:'house' en Property, con el value del <select> de tipo en AddPropertyModal, y con 3 propiedades cuyo titleEn ya existía pero era el texto en español copiado tal cual (o, en un caso, una traducción manual incorrecta). Regla a seguir: cuando una auditoría reporte "X ya está hecho" basándose en presencia de un campo, pedir ver el VALOR real de una muestra antes de aceptar la conclusión, no solo confirmar que el campo no es null.
