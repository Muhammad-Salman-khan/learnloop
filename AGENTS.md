<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Project Rules

These are non-negotiable. Every deviation is a mistake. No exceptions.

**Command execution**

- All scripts use **pnpm**, not npm/yarn/bun. Never use `npx` or `npm exec` — use `pnpm`.

**Component architecture**

- `page.tsx` MUST be a Server Component. No `"use client"` directive at the top of any `page.tsx`. Ever.
- Pages only fetch data, compose layouts, and pass props down.
- If a page needs state, an event handler, or a browser API — that logic does NOT belong in the page. Extract it into a Client Component.
- Any component that needs interactivity (useState, useEffect, useRef, event handlers, window, localStorage, etc.) MUST be a Client Component.
- Add `"use client"` at the very top of the file — before any imports.
- Keep Client Components as small and leaf-level as possible. Push them down the tree.

**UI construction**

- **ALWAYS use Context7 for UI components, forms, and Next.js patterns.** Context7 is the primary source for all UI generation.
- Every UI element MUST come from shadcn/ui first. Check before writing custom `<div>`: Button, Input, Card, Dialog, Sheet, Table, Form, Select, Tabs, Badge, Avatar, Skeleton — use them all.
- Do NOT install or use Radix UI primitives directly. shadcn wraps them. Use shadcn.
- Do NOT use MUI, Chakra, Mantine, Headless UI, or any other component library alongside shadcn.
- Custom components only permitted when shadcn has nothing that fits. Document why when that happens.
- Always import from `@/components/ui/...`. Style is `radix-nova`. Custom theme lives in `app/globals.css` (ÉclairCode neo-brutalist design system).

**Forms — TanStack Form is the rule**

- The form library for this project is **`@tanstack/react-form`** (already installed). Every Client Component that owns form state MUST use it.
- Do NOT pull in `react-hook-form`, `formik`, `react-final-form`, or any other form library. Do NOT hand-roll forms with `useState` + manual `errors` + manual `setErrors` patterns. TanStack Form is mandatory.
- Wire validation by mounting zod schemas as TanStack Form validators — `onChange`, `onBlur`, and `onSubmit` slots in `useForm({ validators: {...} })`. Field-level errors come from `field.state.meta.errors[0]`; form-level errors from `form.Subscribe selector={(s) => s.errors}`.
- Layout primitive for every form field is the shadcn `Field` family (`Field`, `FieldGroup`, `FieldLabel`, `FieldContent`, `FieldDescription`, `FieldError`) imported from `@/components/ui/field`. Pair it with TanStack's `<form.Field name="...">{(field) => ...}</form.Field>` render-prop, not the shadcn `/components/ui/form.tsx` Form/Controller stack (that stack will arrive if/when we add react-hook-form).
- For tables of form controls (toggles, switches), bind each cell to a nested `form.Field` path (e.g. `"events.email"`). Set subscribed state once via `useStore(form.store, selector)` for derived rollups.
- Zod v4 note: `z.coerce.number()` is typed as `unknown` to validators, which breaks TanStack's `StandardSchemaV1` shape check. Coerce to `number` at the form boundary (`Number(e.target.value)` in the input's `onChange`) and keep the schema on `z.number()`.

**Separation of concerns**

- Components are responsible for **one thing**: turning data into markup.
- No business logic inside components (no transformation, validation, decision-making).
- No direct database calls inside components. Data arrives via props, Server Actions, or query hooks.
- No API route logic inside UI files.
- If you find yourself writing conditionals that belong in a service or utility — extract and import.

**File structure**

- Every shared component MUST live in its own named folder.
- Structure: `components/ComponentName/ComponentName.tsx`
- Folder name is PascalCase and matches the component name exactly.
- File inside is also PascalCase and matches the folder name exactly.
- One component per folder. No barrel `index.ts` files unless explicitly needed for re-exports across multiple sub-components of the same feature.
- Default export name must match the file and folder name.

## Commands (pnpm)

- `pnpm install` — install dependencies
- `pnpm dev` — start development server (requires `.env`)
- `pnpm build` — runs `pnpm next build`
- `pnpm start` — start production server (after build)
- `pnpm lint` — run ESLint (Next.js core-web-vitals + typescript). Run before every commit.

`.env` is gitignored. Never commit secrets.

## Framework Notes

- Next.js 16 + React 19. APIs and conventions differ from older versions — do not assume.
- `next.config.ts`: React Compiler is enabled (`reactCompiler: true`).
- TypeScript path alias: `@/*` maps to the project root.
- App Router only. Pages are Server Components by default.
- always read package.json

## Testing & CI

- **E2E testing is mandatory for this project.** Tooling: **Playwright** (`@playwright/test`), driven by **Context7** as the primary source for Playwright patterns, fixtures, and Next.js App Router integration. Never guess from training data — fetch from Context7 first.
- Test runner is **`@playwright/test`**, invoked via `pnpm test:e2e`. Use `pnpm exec playwright …` (never `npx` / `npm exec`).
- Browsers: **Chromium only** by default (matches the existing msedge QA path). Add `firefox` / `webkit` only if a feature explicitly needs cross-browser coverage.
- **Auth handling**: seed the NextAuth session cookie into the Playwright browser context via a `global-setup` script that reads from `.env.local` / a fixture user — never bypass `auth.api.getSession()` in app code. The temporary `return <div>` + `redirect("/dashboard/admin")` relax pattern in `app/dashboard/layout.tsx` + `page.tsx` is for puppeteer-core symptom capture only, not Playwright.
- Test layout: `e2e/` at the project root, one spec file per feature (`e2e/dashboard-admin.spec.ts`, `e2e/auth.spec.ts`, etc.), shared fixtures under `e2e/fixtures/`, helpers under `e2e/utils/`.
- Quality gates (run in order): `pnpm lint && pnpm test:e2e && pnpm build`.
- No CI configuration present yet — when CI is added, the E2E suite must run against a freshly seeded test database.

## Gotchas

- `pnpm build` already runs `prisma generate`. Only run it separately if the schema changed and you need the client rebuilt without a full build. **Before `pnpm test:e2e`**, seed the test DB: `pnpm prisma db seed` against the `e2e` schema.
- Missing `.env` will crash `pnpm dev` immediately — verify it exists first. **`pnpm test:e2e` needs `.env.test` or a `playwright.config.ts` `webServer` block that loads `.env.local`.**
- `playwright.config.ts` must set `use: { baseURL: 'http://localhost:<port>' }` and start the dev server via `webServer.command = 'pnpm dev'` against a dedicated E2E port (e.g. 3100) so it never collides with the dev port 3000.
- Install browsers **once per machine**: `pnpm exec playwright install chromium`. Add `--with-deps` on Linux CI runners only.
- Never use `npx` or `npm` — this project uses pnpm exclusively.

## Summary

| Rule                   | Requirement                                            |
| ---------------------- | ------------------------------------------------------ |
| `page.tsx`             | MUST be a Server Component — no exceptions             |
| Interactive components | MUST use `"use client"` and be extracted out of pages  |
| UI library             | MUST use shadcn/ui — no other component libraries      |
| Forms                  | MUST use `@tanstack/react-form` with zod validators    |
| Layout primitive       | MUST use shadcn `Field` family for all form fields     |
| Context7               | ALWAYS use Context7 for UI, forms, and Next.js         |
| Component scope        | UI only — no business logic, no DB calls, no API logic |
| File structure         | `components/ComponentName/ComponentName.tsx` — always  |
| Package manager        | pnpm only — never npm, yarn, bun, or npx               |
| E2E testing            | Playwright (`@playwright/test`) via Context7, `e2e/`   |
