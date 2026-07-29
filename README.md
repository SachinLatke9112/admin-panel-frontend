<<<<<<< HEAD
# SpeakMate AI Admin Panel Frontend Documentation

> Implementation guide for adding an **Admin Panel** to the existing SpeakMate AI learner-facing frontend. Produced from a full recursive analysis of the frontend codebase at `SpeakMate AI/SpeakMate_AI/SpeakMate AI/` performed on 2026-07-24. No frontend code was written or modified to produce this document. V1 scope is limited to two modules: **Dashboard** and **Users Management (complete CRUD)**.

---

## Project Analysis Summary

| Concern | Current implementation |
|---|---|
| Build tool | Vite 8 (`vite.config.js`), dev server on port 5173, opens browser automatically |
| Framework | React 19.2 + `react-dom` 19.2 |
| Routing | `react-router-dom` v7 — paths centralized in `src/constants/routes.js`, registered in `src/routes/AppRoutes.jsx` |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` (CSS-first config — no `tailwind.config.js`; theme lives in `src/styles/globals.css`) |
| Animation | `framer-motion` v12, shared variants centralized in `src/animations/variants.js` |
| HTTP client | `axios` ^1.18, one instance created in `src/services/api.js` |
| Linting | `oxlint` (not ESLint) — `.oxlintrc.json` enables only `react/rules-of-hooks` and `react/only-export-components` |
| Path aliases | `@`, `@components`, `@pages`, `@hooks`, `@context`, `@services`, `@utils`, `@constants`, `@data`, `@animations`, `@assets`, `@styles`, `@routes` (all defined in `vite.config.js`) |
| Language | JavaScript + JSX — **not TypeScript** (`@types/react`/`@types/react-dom` are dev-only editor aids) |
| State management | No Redux/Zustand/React Query — plain `useState`/`useContext`, static mock-data imports |
| Data source today | Every page reads from static fixtures in `src/data/*.js` — nothing in the frontend currently calls a real network endpoint except the unused `axios` instance |

**Companion backend exists and is relevant to this plan.** A Spring Boot service (`SpeakMate_AI/SpeakMateAI/`, package `com.rslsolution.speakmateai`) sits alongside this frontend and **already implements partial admin support** (`AdminController` at `/api/admin/**`). This changes the task from "design a hypothetical API" to "wire up to what exists and close verified gaps" — see [Backend Requirements](#backend-requirements).

**The single most important structural finding:** the codebase contains **two parallel, non-equivalent layout/navigation systems** — one wired into routing (`components/layout/`, singular) and one entirely orphaned but structurally closer to an admin console (`components/layouts/`, plural, includes an unused `Sidebar.jsx`). Every recommendation in this document accounts for that split. Full detail in [Existing Frontend Architecture](#existing-frontend-architecture).

---

## Existing Frontend Architecture

### Entry point & app shell

- `src/main.jsx` → mounts `<App />` (wrapped in `<StrictMode>`) into `#root`, imports `src/index.css`.
- `src/App.jsx` → wraps the tree in `AuthProvider` (`src/context/AuthContext.jsx`) and react-router's `BrowserRouter`, then renders `src/routes/AppRoutes.jsx`. Imports `src/styles/globals.css` (the CSS that actually applies — `index.css` also exists but its rules are largely superseded).
- **`ThemeProvider` (`src/context/ThemeContext.jsx`) is never mounted in `App.jsx`.** Any component that calls `useTheme()` outside the active route tree would throw at runtime. It is currently only imported by the orphaned `components/layouts/Navbar.jsx`.

### The two parallel layout systems

| | `src/components/layout/` (singular — **active**) | `src/components/layouts/` (plural — **orphaned**) |
|---|---|---|
| Wired into `AppRoutes.jsx`? | **Yes** | **No** — grep confirms nothing imports from this folder except its own files |
| Files | `AppLayout.jsx`, `AuthLayout.jsx` | `Layout.jsx`, `Navbar.jsx`, `Sidebar.jsx`, `Footer.jsx` |
| Composed from | `components/common/Navbar` + `components/common/Footer` | Its own `Navbar`/`Sidebar`/`Footer`, plus `useTheme()` |
| Styling approach | Hard-coded Tailwind utility colors (`slate-*`, `indigo-*`) | CSS custom properties (`var(--bg-base)`, `var(--text-primary)`, `var(--border-default)`, `var(--color-primary-light)`, etc.) |
| Has a sidebar? | No | **Yes** — `Sidebar.jsx` renders a left-hand `NavLink` list with active-state styling, structurally exactly what an admin console needs |

Two additional facts that matter for anyone extending this app:
- The CSS custom properties referenced throughout the orphaned `layouts/` tree and by `src/utils/formatters.js` (`getScoreColor`) — `--bg-base`, `--text-primary`, `--border-default`, `--color-primary`, `--color-primary-light`, `--color-accent`, `--color-warning`, `--color-error`, `--bg-surface`, `--bg-elevated`, `--shadow-sm`, `--shadow-lg` — **are not defined anywhere** in `src/index.css` or `src/styles/globals.css`. This is unfinished work, not a usable design-token system.
- `src/index.css` sets `color-scheme: dark`, while the actually-applied `src/styles/globals.css` hard-codes a light theme (`color: #0f172a; background: #f8fafc;`). The two stylesheets disagree, but because only `globals.css` is imported by `App.jsx`, the light theme is what renders.

**Implication for the Admin Panel:** build on the *active* system (Tailwind utility classes matching `components/common/*`, slate/indigo palette). Reuse `components/layouts/Sidebar.jsx`'s **pattern** (array-driven `NavLink` list) for the new `AdminSidebar`, not the file itself — importing it as-is would pull in undefined CSS variables and a `useTheme()` call that will throw.

### Directory-by-directory summary

| Directory | Purpose | Status |
|---|---|---|
| `src/components/common/` | Shared primitives: `Button`, `Card`, `Input`, `Loader`, `ModulePageShell`, `Navbar`, `Footer` | Active, reused across every page |
| `src/components/dashboard/` | 8 learner-dashboard widgets (`StatisticsCards`, `ContinueLearningCard`, `XPPointsCard`, `WeeklyGoal`, `LearningCalendar`, `AchievementBadges`, `RecentActivity`, `DailyMotivation`) | Active, single-purpose to `Dashboard.jsx`, pattern-reusable only |
| `src/components/layout/` | `AppLayout`, `AuthLayout` | Active — wired into `AppRoutes.jsx` |
| `src/components/layouts/` | `Layout`, `Navbar`, `Sidebar`, `Footer` | **Orphaned/dead code** — not imported anywhere |
| `src/context/` | `AuthContext` (mock auth), `ThemeContext` (unmounted) | Partially active |
| `src/routes/` | `AppRoutes`, `ProtectedRoute`, `PublicRoute` | Active |
| `src/services/` | `api.js` (axios instance + mock `authService`), `aiChat.js` (mock keyword-based chat replies) | Stub layer, no real network calls made |
| `src/data/` | `dashboardMockData.js`, `chatMockData.js`, `moduleMockData.js` | Static fixtures consumed directly by pages |
| `src/hooks/` | `useLocalStorage.js` | Generic, reusable, currently unused by any page |
| `src/utils/` | `formatters.js` (date/duration/score/XP formatting, `timeAgo`, `truncate`, `capitalize`) | Active, pure functions, no side effects |
| `src/constants/` | `routes.js` (route path map), `app.js` (feature flags, storage keys, learning-domain enums) | Active |
| `src/animations/` | `variants.js` — centralized Framer Motion variants (page transitions, stagger containers, modal, sidebar, toast, etc.) | Active, already includes a `sidebarVariants` and `modalVariants` the Admin Panel can reuse directly |
| `src/pages/` | 14 route-level page components | Active |
| `src/assets/`, `public/` | `hero.png`, `react.svg`, `vite.svg`, `favicon.svg`, `icons.svg` | Static assets, none admin-relevant |

---

## Existing Routing

Defined in `src/constants/routes.js` and registered in `src/routes/AppRoutes.jsx`:

| Constant | Path | Layout | Guard |
|---|---|---|---|
| `HOME` | `/` | `AppLayout` | `PublicRoute` |
| `LOGIN` | `/login` | `AuthLayout` | `PublicRoute` |
| `REGISTER` | `/register` | `AuthLayout` | `PublicRoute` |
| `FORGOT_PASSWORD` | `/forgot-password` | `AuthLayout` | `PublicRoute` |
| `DASHBOARD` | `/dashboard` | `AppLayout` | `ProtectedRoute` |
| `AI_CHAT` | `/ai-chat` | `AppLayout` | `ProtectedRoute` |
| `SPEAKING` | `/speaking` | `AppLayout` | `ProtectedRoute` |
| `GRAMMAR` | `/grammar` | `AppLayout` | `ProtectedRoute` |
| `VOCABULARY` | `/vocabulary` | `AppLayout` | `ProtectedRoute` |
| `LISTENING` | `/listening` | `AppLayout` | `ProtectedRoute` |
| `PROGRESS` | `/progress` | `AppLayout` | `ProtectedRoute` |
| `PROFILE` | `/profile` | `AppLayout` | `ProtectedRoute` |
| `SETTINGS` | `/settings` | `AppLayout` | `ProtectedRoute` |
| `NOT_FOUND` | `/404` | none | — |
| `*` | any unmatched path | — | redirects to `NOT_FOUND` |

`AppRoutes.jsx` wraps `<Routes>` in `<AnimatePresence mode="wait">` and every page element in a local `PageTransition` component (fade + slight vertical slide, 0.22s). Route groups are nested under a shared layout `<Route element={<AppLayout />}>` — this is the pattern the Admin route block should follow (a new `<Route element={<AdminLayout />}>` group, parallel to the existing two).

`ProtectedRoute.jsx` and `PublicRoute.jsx` are both simple, single-purpose wrappers around `useAuth().isAuthenticated`, each under 20 lines. They are the direct template for the new `AdminRoute` guard.

---

## Existing Authentication

`src/context/AuthContext.jsx` is **mock-only**:

- `user` lives in a plain `useState(null)` — **no persistence**. Refreshing the browser logs the user out.
- `isAuthenticated` is derived as `Boolean(user)`.
- `login({ email })` and `register({ name, email })` both fabricate a user object client-side from a hard-coded `mockUser` (`{ name: "Dnyaneshwar", email: "learner@speakmate.ai", streak: 7, dailyGoal: 20 }`) and resolve immediately — no network call.
- **There is no `role` field anywhere on the frontend user object**, and no token storage.
- `src/services/api.js` exports a matching mock `authService` (`login`, `register`, `forgotPassword`, `verifyOtp`, `resetPassword`) — all `Promise.resolve` stubs that never touch the `axios` instance defined in the same file.

The real backend (see [Backend Requirements](#backend-requirements)) already issues a JWT (`POST /api/users/login` → `AuthResponse`) and already models a two-value `Role` enum (`USER`, `ADMIN`) on the `User` entity — the frontend simply never wired to it.

**This is a hard prerequisite, not an admin-specific nice-to-have.** Before an Admin Panel can be meaningfully gated, `AuthContext` needs:
1. A `role` field surfaced through `useAuth()`.
2. Persistence — swap `useState(null)` for the existing-but-unused `useLocalStorage` hook, keyed by the existing-but-unused `STORAGE_KEYS.AUTH_TOKEN` / `STORAGE_KEYS.USER` constants already defined in `src/constants/app.js`.
3. A real call to `POST /api/users/login` instead of the mock, so `isAuthenticated` and `role` reflect an actual backend session.

---

## Existing API Layer

`src/services/api.js`:
```
axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api", headers: { "Content-Type": "application/json" } })
```
exported as the default `api`, plus a named `authService` object whose five methods are all mock stubs (see above). No interceptor, no auth header injection, no error normalization exists yet — the file is a placeholder integration seam, not a working client.

`src/services/aiChat.js` is unrelated to admin work — a keyword-matching `buildReply()` plus a `sendMessage()` that resolves after a 700ms `setTimeout`, simulating a remote AI reply for `AiChat.jsx`.

**Environment mismatch to fix before integration testing:** `.env.example` sets `VITE_API_BASE_URL=http://localhost:8080/api`, but the backend's `application.properties.example` sets `server.port=${PORT:9091}`. These disagree — update one or the other before pointing the frontend at the real backend.

**No admin-specific API module exists yet.** A new `src/services/adminApi.js` is required (see [Folder Structure](#folder-structure)).

---

## Existing UI Components

| Component | Path | What it does |
|---|---|---|
| `Button` | `components/common/Button.jsx` | `primary`/`secondary`/`ghost` variants, `h-11` pill button, focus ring, disabled state |
| `Card` | `components/common/Card.jsx` | White surface, `rounded-2xl`, border, shadow — the base wrapper for nearly every panel in the app |
| `Input` | `components/common/Input.jsx` | Labeled text input with error slot and built-in password show/hide toggle |
| `Loader` | `components/common/Loader.jsx` | Small spinner + label, used for every page's simulated 350ms loading state |
| `ModulePageShell` | `components/common/ModulePageShell.jsx` | Page header pattern: badge + title + subtitle + actions slot + animated entrance, wraps children |
| `Navbar` (common) | `components/common/Navbar.jsx` | Active top nav — logo, theme-agnostic Tailwind styling, "Practice" dropdown, profile dropdown, mobile menu, streak pill |
| `Footer` (common) | `components/common/Footer.jsx` | Simple two-line marketing footer |
| `AppLayout` | `components/layout/AppLayout.jsx` | `Navbar` + `<Outlet/>` + `Footer`, no sidebar |
| `AuthLayout` | `components/layout/AuthLayout.jsx` | Minimal logo header + `<Outlet/>` for login/register/forgot-password |
| `StatisticsCards`, `ContinueLearningCard`, `XPPointsCard`, `WeeklyGoal`, `LearningCalendar`, `AchievementBadges`, `RecentActivity`, `DailyMotivation` | `components/dashboard/` | Eight single-purpose learner-dashboard widgets, each takes typed mock-data props, each independently `Card`-wrapped with its own Framer Motion entrance |
| `Layout`, `Navbar`, `Sidebar`, `Footer` | `components/layouts/` (plural) | **Orphaned.** Not rendered anywhere in the running app. `Sidebar.jsx` is nonetheless the closest existing artifact to an admin nav and is used as a *pattern* reference below. |

No data table, pagination control, modal/drawer, toast/notification, or confirmation dialog exists anywhere in the codebase today. All of these are net-new for Users Management CRUD.

---

## Existing Reusable Components

Components confirmed safe to reuse as-is for the Admin Panel, with no modification required:

| Component | Reuse rationale |
|---|---|
| `Button` | Variant set covers every admin action (Save, Cancel, Activate, Deactivate, Delete) |
| `Card` | Base surface for every stat tile, table container, and form panel |
| `Input` | Label/error/password-toggle support directly covers the user create/edit form fields |
| `Loader` | Async loading state for the users table and dashboard tiles |
| `ModulePageShell` | Title/subtitle/badge/actions header matches an admin page header exactly |
| `formatDate`, `formatXP`, `timeAgo`, `capitalize`, `truncate` (`utils/formatters.js`) | Directly usable for the users table (joined date, last active, name truncation) |
| `useLocalStorage` (`hooks/useLocalStorage.js`) | The hook that should finally persist the auth token/user — prerequisite work, not admin-specific |
| `pageVariants`, `modalVariants`, `sidebarVariants`, `containerVariants`, `itemVariants` (`animations/variants.js`) | Already-centralized Framer Motion variants that cover page transitions, a future confirmation-dialog modal, and a collapsible sidebar — no new animation code needed |
| `ProtectedRoute` pattern (`routes/ProtectedRoute.jsx`) | Direct template for the new `AdminRoute` guard (same ~15-line shape, extra `role` check) |

Components reusable only as a **structural pattern**, not by direct import:

| Component | Why not direct reuse |
|---|---|
| `StatisticsCards` | Hard-wired to the learner `dashboardMockData` shape and a per-module icon `switch`; the admin dashboard needs its own tile set driven by `AdminDashboardResponse` fields, but should copy this component's layout/stagger-animation approach |
| `components/layouts/Sidebar.jsx` | Correct shape (array-driven `NavLink` list, active-state styling) but references undefined CSS variables — copy the pattern, not the file |
| `Navbar` (common) | Contains learner-specific nav items (Practice, Progress) — an admin top bar needs a trimmed variant, not this component wholesale |

---

## Component Reusability Matrix

| Component | Status |
|---|---|
| `Button` | ✅ Reuse as-is |
| `Card` | ✅ Reuse as-is |
| `Input` | ✅ Reuse as-is |
| `Loader` | ✅ Reuse as-is |
| `ModulePageShell` | ✅ Reuse as-is |
| `formatDate` / `formatXP` / `timeAgo` / `capitalize` / `truncate` | ✅ Reuse as-is |
| `useLocalStorage` | ✅ Reuse as-is (currently unused — this is its intended purpose) |
| Framer Motion variants (`animations/variants.js`) | ✅ Reuse as-is |
| `ProtectedRoute` | 🔧 Needs modification — clone into `AdminRoute` with an added `role === "ADMIN"` check |
| `AuthContext` / `useAuth()` | 🔧 Needs modification — add `role`, persistence, real login call (see [Existing Authentication](#existing-authentication)) |
| `AppLayout` | 🔧 Needs modification — not reused directly, but is the structural template for `AdminLayout` |
| `components/layouts/Sidebar.jsx` | 🔧 Needs modification — pattern-only reuse, cannot be imported as-is (undefined CSS vars, unmounted `ThemeProvider`) |
| `Navbar` (common) | 🔧 Needs modification — trim to an admin top bar, or build a new lightweight `AdminTopbar` |
| `StatisticsCards` | 🔧 Needs modification — new data shape, same visual pattern |
| Data table | ❌ Missing — must be created (`UsersTable`) |
| Pagination control | ❌ Missing — must be created |
| Modal / drawer | ❌ Missing — must be created (used for `ConfirmDialog`, and optionally the create-user form) |
| Toast / notification | ❌ Missing — must be created for mutation feedback (create/update/delete/activate success or failure) |
| Confirmation dialog | ❌ Missing — must be created (`ConfirmDialog`, gates deactivate/delete) |
| `AdminSidebar` | ❌ Missing — must be created (new, pattern-inspired by orphaned `Sidebar.jsx`) |
| `AdminLayout` | ❌ Missing — must be created |
| `adminApi.js` service | ❌ Missing — must be created |
| `useUsers` data hook | ❌ Missing — must be created |

---

## Admin Panel Feasibility

**Yes — the Admin Panel can be added inside this project without restructuring the existing architecture.**

The app already organizes by type-first-feature-second (`pages/`, `components/`, `hooks/`, `services/`, `constants/`), and that pattern extends cleanly to an `admin` namespace nested one level inside each existing directory (`pages/admin/`, `components/admin/`, `hooks/admin/`) — no new top-level folder, no new build tooling, no new routing library. `AppRoutes.jsx` already demonstrates the exact mechanism needed (a layout-wrapped `<Route>` group with per-page guards) — an admin block is additive, not a rewrite.

### Integrate into the existing frontend vs. build a separate frontend

**Recommendation: integrate into the existing frontend.**

| | Integrated (recommended) | Separate frontend |
|---|---|---|
| Reuses `Button`/`Card`/`Input`/`Loader`/`ModulePageShell` | Yes, directly | No — would duplicate them or extract a shared package (unwarranted at this scope) |
| Reuses routing/guard pattern (`ProtectedRoute` → `AdminRoute`) | Yes, same file shape | Would need its own router setup from scratch |
| Shares one login | Yes — single `/login`, redirect on `role` | Needs a second auth surface or cross-app token handoff |
| Build/deploy complexity | None added — same Vite app, same `npm run build` | New Vite project, new deploy target, new env config |
| Risk of visual drift | Low — same Tailwind classes, same component library | Higher — a second codebase drifts from the design language over time |
| Appropriate at V1 scope (2 modules) | Yes | Over-engineered for 2 modules |

A separate frontend only becomes worth reconsidering if the admin surface grows very large (its own release cadence, a fully distinct design system, or a hard requirement to deploy/scale it independently of the learner app) — none of which applies to the stated V1 scope of Dashboard + Users CRUD.

### Components that can be reused

See [Component Reusability Matrix](#component-reusability-matrix) above for the complete, verified list.

---

## Admin Panel Architecture

### Dashboard module (summary)

- **Purpose:** read-only operational overview for admins — user counts, content counts, engagement counts.
- **Data source:** `GET /api/admin/dashboard` (already implemented, verified in `AdminController.java`).
- **No backend work required** for V1 — this is a direct integration against an existing endpoint.

Full detail: [Dashboard Module](#dashboard-module), [Dashboard UI](#dashboard-ui), [Dashboard Components](#dashboard-components), [Dashboard APIs](#dashboard-apis).

### Users Management module (summary)

- **Purpose:** complete CRUD over the `User` entity — list, search, filter, sort, paginate, view, create, edit, activate/deactivate, delete.
- **Data source:** `GET /api/admin/users`, `GET /api/admin/users/{id}` (both implemented); create/update/delete require **new** backend endpoints (verified gap — see [Backend Requirements](#backend-requirements)).

Full detail: [Users Module](#users-module), [User CRUD](#user-crud), [User Flow](#user-flow), [Users APIs](#users-apis).

---

## Admin Layout

```
AdminLayout
├── AdminTopbar                 (sticky top bar: logo, "Admin" label, user menu, logout, link back to learner app)
├── AdminSidebar                (persistent left nav, desktop; collapsible drawer, mobile)
│   ├── Dashboard                (NavLink → /admin)
│   └── Users                    (NavLink → /admin/users)
├── Breadcrumb                  (page-level, rendered inside each page via ModulePageShell's title/badge slot — no separate global breadcrumb component needed at V1 scope)
├── Main Content (<Outlet/>)    (renders AdminDashboard / AdminUsers / AdminUserDetail / AdminUserCreate)
└── Footer                      (omitted — admin consoles conventionally drop the marketing footer; ModulePageShell already has no footer slot, so this is zero extra work either way)
```

**Section-by-section explanation:**

- **AdminTopbar** — structurally a trimmed copy of `components/common/Navbar.jsx`: logo, user avatar/initials dropdown (name, email, logout), no "Practice" dropdown, no streak pill (not meaningful for an admin). Sticky (`sticky top-0`), same backdrop-blur treatment as the existing `Navbar` for visual continuity.
- **AdminSidebar** — new component, array-driven exactly like the orphaned `components/layouts/Sidebar.jsx` (`MENU_ITEMS.map(...)` → `NavLink`), but built with Tailwind utility classes matching the *active* palette (slate/indigo) instead of the undefined CSS variables the orphaned version references. V1 menu has exactly two entries (Dashboard, Users); the array shape makes future entries (Lessons, Reports, etc.) a one-line addition, not a refactor.
- **Breadcrumb** — no dedicated breadcrumb component exists in the current codebase, and V1's two-module depth (`/admin`, `/admin/users`, `/admin/users/:id`) doesn't need one — `ModulePageShell`'s title + badge already communicates "where am I." Add a real breadcrumb component only if/when nesting grows deeper (see [Future Expansion](#future-expansion)).
- **Main Content** — same `<Outlet/>` pattern already used by `AppLayout.jsx`; page transitions reuse the same `AnimatePresence`/`PageTransition` wrapper already established in `AppRoutes.jsx`.
- **Footer** — intentionally omitted from the admin shell; this matches common admin-console convention and requires no new component.

**Responsive behavior:** `AdminSidebar` collapses to a slide-in drawer below the `md` breakpoint (Tailwind's `hidden md:block`, same technique the orphaned `Sidebar.jsx` already uses), toggled from a hamburger button in `AdminTopbar`. The existing `sidebarVariants` in `animations/variants.js` (`closed: { x: "-100%" }` / `open: { x: 0 }`) is a direct, ready-made fit for this drawer animation — no new animation code needed.

---

## Dashboard Module

- **Purpose:** give admins an at-a-glance operational snapshot — no editing happens on this page.
- **Page:** `pages/admin/AdminDashboard.jsx`.
- **Data source:** `GET /api/admin/dashboard` → `AdminDashboardResponse` (8 fields, all `Long` counts — verified against the live DTO).
- **Loading/error convention:** use `Loader` for the in-flight state (matches every existing page's pattern); since this is the first page in the app making a real network call, establish here the inline-error-plus-retry convention that `AdminUsers.jsx` will reuse.
- **Backend work required:** none — straight integration against an existing, verified endpoint.

### Pages

Single page: `AdminDashboard.jsx`. No sub-routes.

### Components

| Component | Role |
|---|---|
| `AdminStatGrid` | Grid wrapper, renders one `AdminStatCard` per `AdminDashboardResponse` field |
| `AdminStatCard` | Single metric tile: icon chip + label + big number, `Card`-wrapped, follows `StatisticsCards.jsx`'s visual pattern minus the "vs last week" trend row (the backend response has no trend data — do not fabricate one) |

### Statistics Cards

Eight tiles, one per response field: **Total Users, Active Users, Total Lessons, Active Lessons, Total Speaking Sessions, Total Vocabulary Words, Total Achievements, Total Notifications.**

### Charts

**None in V1.** The backend response is flat counters with no time-series data — a chart would require either fabricating data (against the stated rule to base everything on verified reality) or new backend aggregation endpoints, which are out of scope for V1. Flagged as a fast-follow in [Future Expansion](#future-expansion) once the backend exposes historical/time-bucketed data.

### Recent Users

**Not available from `GET /api/admin/dashboard`** — that endpoint returns only aggregate counts, no per-user rows. A "Recent Users" widget on the dashboard page is out of scope for V1 unless sourced by client-side slicing the full `GET /api/admin/users` result (sorted by `createdAt` desc, top 5) — reasonable at current expected data volume, and reuses the already-required Users list call rather than adding a new endpoint. Decide during implementation whether this is worth the extra request on the dashboard page, or deferred until admins land on the Users page anyway.

### Recent Activity

**Not available from the backend today.** No activity-log/audit endpoint exists (see [Future Expansion](#future-expansion) — Activity Logs is explicitly a later module). Omit from V1 dashboard rather than fabricate.

### Widgets

Limited to `AdminStatGrid` at V1 scope — see [Future Expansion](#future-expansion) for what a v2 dashboard could add once backend data exists.

### Navigation

Reached via `AdminSidebar`'s "Dashboard" entry (`/admin`) or as the default landing route after an admin logs in (see [Routing Structure](#routing-structure)).

### Responsive Layout

`AdminStatGrid`: `grid-cols-1` → `sm:grid-cols-2` → `lg:grid-cols-4` (identical breakpoint strategy to the existing `StatisticsCards.jsx`, which already covers 4 tiles at desktop width — 8 tiles at V1 simply wraps to two rows at `lg`).

### Backend APIs

See [Dashboard APIs](#dashboard-apis).

### Reusable Components

`Card`, `Loader`, `ModulePageShell`, Framer Motion stagger pattern from `StatisticsCards.jsx` (copied, not imported — see [Component Reusability Matrix](#component-reusability-matrix)).

### Folder Structure

See the consolidated [Folder Structure](#folder-structure) section.

---

## Dashboard UI

**Sidebar:** `AdminSidebar`, persistent on desktop, two entries (Dashboard active/highlighted, Users).

**Navbar:** `AdminTopbar`, sticky, logo + admin user menu.

**Statistics Cards:** 8 tiles in a responsive grid, each an icon chip + label + large number, `Card`-wrapped (visual language identical to the learner dashboard's `StatisticsCards.jsx`, so the two feel like the same product).

**Charts:** none in V1 (see [Dashboard Module](#dashboard-module) for why).

**Recent Users Table:** optional in V1, client-derived from `GET /api/admin/users` if included (see [Dashboard Module](#dashboard-module)).

**Recent Activity:** omitted in V1 (no backend data source exists).

**Responsive Layout:** sidebar collapses to a drawer below `md`; stat grid reflows from 1 → 2 → 4 columns.

### ASCII Wireframe

```
+--------------------------------------------------------------------+
|  AdminTopbar:  [SM Admin]                    [Admin User ▾] [Logout]|
+---------------+------------------------------------------------------+
|               |  Admin Dashboard                                    |
| AdminSidebar  |  Read-only operational overview                     |
|               |                                                      |
| > Dashboard   |  +-----------+ +-----------+ +-----------+ +-------+ |
|   Users       |  |Total Users| |Active Users| |Total      | |Active | |
|               |  |   1,204   | |    980     | |Lessons    | |Lessons| |
|               |  +-----------+ +-----------+ |    64      | |  52   | |
|               |                              +-----------+ +-------+ |
|               |  +-----------+ +-----------+ +-----------+ +-------+ |
|               |  |Speaking   | |Vocabulary  | |Achievements| |Notifs| |
|               |  |Sessions   | |Words       | |    312     | | 1,880 |
|               |  |  3,410    | |  9,204     | +-----------+ +-------+ |
|               |  +-----------+ +-----------+                        |
|               |                                                      |
|               |  (optional) Recent Users — top 5 by joined date      |
|               |  +--------------------------------------------+     |
|               |  | Name          Email             Joined     |     |
|               |  | ...                                        |     |
|               |  +--------------------------------------------+     |
+---------------+------------------------------------------------------+
```

Mobile (`< md`): `AdminSidebar` hidden behind a hamburger drawer (slide-in via existing `sidebarVariants`); stat tiles stack to a single column; optional Recent Users table becomes a stacked card list (same responsive technique used by `AdminUsers` — see [Responsive Design](#responsive-design)).

---

## Dashboard Components

| Component | Already Exists | Can Be Reused | Needs Modification | Must Be Created |
|---|---|---|---|---|
| `Card` | ✅ | ✅ | | |
| `Loader` | ✅ | ✅ | | |
| `ModulePageShell` | ✅ | ✅ | | |
| `AdminStatGrid` | | | | ✅ |
| `AdminStatCard` | | | | ✅ |
| `StatisticsCards` (learner) | ✅ | pattern-only | ✅ | |

---

## Dashboard APIs

| Method | Endpoint | Status | Response |
|---|---|---|---|
| GET | `/api/admin/dashboard` | ✅ Already implemented (`AdminController.getDashboard()`) | `AdminDashboardResponse`: `totalUsers`, `activeUsers`, `totalLessons`, `activeLessons`, `totalSpeakingSessions`, `totalVocabularyWords`, `totalAchievements`, `totalNotifications` (all `Long`) |

No backend changes required for the Dashboard module.

---

## Users Module

- **Purpose:** complete administrative control over user accounts — the only V1 module with write operations.
- **Pages:** `AdminUsers.jsx` (list), `AdminUserDetail.jsx` (view/edit), `AdminUserCreate.jsx` (create).
- **Data source today:** `GET /api/admin/users` (list, all users, no pagination), `GET /api/admin/users/{id}` (detail) — both verified live in `AdminController.java`. Activate/deactivate also already exist (`PUT /api/admin/users/activate/{id}`, `PUT /api/admin/users/deactivate/{id}`).
- **Verified backend gaps:** no admin-scoped create endpoint, no admin-friendly update endpoint (the only update path, `PUT /api/users/update-user/{id}`, requires a full `RegisterRequest` body — including `password` and `confirmPassword` fields, per the DTO's own validation annotations — which is unusable for an admin editing a name/email/role), no admin-scoped delete endpoint. Full detail in [Backend Requirements](#backend-requirements).

### User Listing

`AdminUsers.jsx` + `UsersTable` + `UsersToolbar`.

- **Search:** free-text over name/email, client-side (`GET /api/admin/users` returns the full list — there is currently no server-side search/filter/sort/pagination on this endpoint).
- **Filters:** role (`All` / `USER` / `ADMIN`), status (`All` / `Active` / `Inactive`) — both derived client-side from `UserResponse.role` / `UserResponse.active`.
- **Sorting:** client-side, by column header click (Name, Email, Joined at minimum).
- **Pagination:** client-side at V1 (the full result set is fetched once and paged/filtered/sorted in memory). Flag server-side pagination as a fast-follow once user volume makes a full-list fetch impractical — see [Future Expansion](#future-expansion).

### Create User

`AdminUserCreate.jsx` (dedicated page, matching the project's existing one-file-per-route pattern rather than a modal).

### View User

`AdminUserDetail.jsx`, read section at the top (all `UserResponse` fields worth surfacing: name, email, role, active status, joined date, plus optionally the onboarding/preference fields already on the entity — `nativeLanguage`, `englishLevel`, `learningGoal`, `dailyGoalMinutes`).

### Edit User

Same `AdminUserDetail.jsx` page, edit form below/alongside the read section, built from the existing `Input` component, fields: `firstName`, `lastName`, `email`, `role`.

### Delete User

Triggered from a row action or the detail page, gated behind `ConfirmDialog` — deletion is destructive and irreversible: the `User` entity's `@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)` relationships (`progressList`, `settingsList`, `onboardingList`, `vocabularyList`, `chatSessions`, `speakingSessions`, `grammarHistories`, `lessonProgresses`, `notifications`, `chatBookmarks`, `achievements`) all cascade-delete with the user — verified directly in `User.java`.

Full page-by-page detail: [User CRUD](#user-crud).

---

## User CRUD

### 1. User Listing (`AdminUsers.jsx`)

- **Purpose:** primary admin entry point — find, filter, and act on any user account.
- **Components:** `ModulePageShell` (header), `UsersToolbar` (search + filters + "Create user" button), `UsersTable` (header row + `UsersTableRow` per user), `Pagination` (new), `Loader` (fetch-in-flight), inline error + retry (fetch failure).
- **Buttons:** "Create user" (primary, top-right, → `AdminUserCreate`), per-row action menu: View, Edit, Activate/Deactivate (label flips per `active`), Delete.
- **Inputs:** search text field, role `<select>`, status `<select>`.
- **Validation:** none (read/filter page — no form submission here).
- **Navigation Flow:** row click or "View" → `/admin/users/:id`; "Edit" → `/admin/users/:id` (edit mode) or a dedicated edit route, decide during implementation; "Create user" → `/admin/users/new`; Activate/Deactivate → in-place `PUT` call + optimistic row update; Delete → `ConfirmDialog` → `DELETE` call → row removed from local list state on success.
- **Backend APIs:** `GET /api/admin/users` (list), `PUT /api/admin/users/activate/{id}` / `PUT /api/admin/users/deactivate/{id}` (existing), `DELETE /api/admin/users/{id}` (**new**, see [Users APIs](#users-apis)).

### 2. Create User (`AdminUserCreate.jsx`)

- **Purpose:** admin-initiated account creation.
- **Components:** `ModulePageShell`, a form built from `Input` fields, `Button` (Submit/Cancel).
- **Buttons:** "Create user" (primary submit), "Cancel" (secondary, → back to `/admin/users`).
- **Inputs:** `firstName`, `lastName`, `email`, `role` (select: `USER` / `ADMIN`), and either an admin-set temporary password field or an invite-flow trigger — **this is an open product decision**, not resolved by this document (the backend already has a working SMTP/OTP mail pipeline used for registration and password reset that an invite flow could reuse — see [Recommendations](#recommendations)).
- **Validation:** required fields (`firstName`, `lastName`, `email`, `role`), email format, and — if the direct-password path is chosen — the same `min 8 characters` rule the backend's `RegisterRequest`/`User` entity already enforce (`@Size(min = 8)`), mirrored client-side for immediate feedback before the request round-trip.
- **Navigation Flow:** successful submit → toast/confirmation → redirect to `/admin/users` (or directly to the new user's `/admin/users/:id`); Cancel → `/admin/users` with no changes.
- **Backend APIs:** `POST /api/admin/users` (**new**, see [Users APIs](#users-apis)).

### 3. User Details (`AdminUserDetail.jsx`, read mode)

- **Purpose:** full-detail view of a single user before editing or deleting.
- **Components:** `ModulePageShell`, `Card`-based detail panel(s), `UserStatusBadge` (role + active/inactive), `Loader` (fetch-in-flight).
- **Buttons:** "Edit" (→ edit mode/route), "Activate"/"Deactivate" (context-sensitive), "Delete" (→ `ConfirmDialog`).
- **Inputs:** none (read-only view).
- **Validation:** n/a.
- **Navigation Flow:** entered from `AdminUsers` row click; "Back to users" link returns to `/admin/users` (preserving prior filter/search state is a nice-to-have, not a V1 requirement given client-side-only filtering).
- **Backend APIs:** `GET /api/admin/users/{id}`.

### 4. Edit User (`AdminUserDetail.jsx`, edit mode)

- **Purpose:** modify an existing user's profile/role.
- **Components:** same page as User Details, form built from `UserFormFields` (shared with Create), `Button` (Save/Cancel).
- **Buttons:** "Save changes" (primary), "Cancel" (secondary, discards edits, returns to read mode).
- **Inputs:** `firstName`, `lastName`, `email`, `role` — pre-filled from the fetched `UserResponse`. **No password field** — this is precisely why the existing `PUT /api/users/update-user/{id}` (which requires `RegisterRequest`, including password) is unusable here; a purpose-built endpoint is required (see [Users APIs](#users-apis)).
- **Validation:** same required/format rules as Create, minus password.
- **Navigation Flow:** Save → toast/confirmation → return to read mode (or `/admin/users`); Cancel → discard, return to read mode.
- **Backend APIs:** `PUT /api/admin/users/{id}` (**new**, see [Users APIs](#users-apis)).

### 5. Delete Confirmation (`ConfirmDialog`)

- **Purpose:** prevent accidental irreversible deletion.
- **Components:** new generic `ConfirmDialog` (modal), reusable for both Delete and Deactivate if a confirmation is deemed warranted for deactivate too (recommended, since deactivate is also account-affecting, even if reversible).
- **Buttons:** "Delete permanently" (destructive/red), "Cancel".
- **Inputs:** none (optionally, a "type the user's email to confirm" pattern for extra safety on delete specifically — a reasonable V1 addition given the cascading data loss, decide during implementation).
- **Validation:** if the type-to-confirm pattern is used, exact-match validation against the target user's email.
- **Navigation Flow:** opened from a row action or the detail page; "Cancel" or backdrop click closes without effect; "Delete permanently" fires the `DELETE` call, closes the dialog, and either redirects to `/admin/users` (if opened from the detail page) or removes the row in place (if opened from the list).
- **Backend APIs:** `DELETE /api/admin/users/{id}` (**new**, see [Users APIs](#users-apis)).

---

## User Flow

```
AdminUsers (list)
  │
  ├─ search / filter / sort / paginate (all client-side, in place)
  │
  ├─ click "Create user" ──────────────► AdminUserCreate
  │                                          │ submit ──► POST /api/admin/users ──► redirect to AdminUsers or AdminUserDetail
  │                                          │ cancel ──► back to AdminUsers
  │
  ├─ click row / "View" ───────────────► AdminUserDetail (read mode)
  │                                          │ GET /api/admin/users/{id}
  │                                          │
  │                                          ├─ click "Edit" ──► AdminUserDetail (edit mode)
  │                                          │                       │ save   ──► PUT /api/admin/users/{id}  ──► back to read mode
  │                                          │                       │ cancel ──► back to read mode
  │                                          │
  │                                          ├─ click "Activate"/"Deactivate" ──► PUT /api/admin/users/(de)activate/{id} ──► refresh status badge
  │                                          │
  │                                          └─ click "Delete" ──► ConfirmDialog ──► DELETE /api/admin/users/{id} ──► redirect to AdminUsers
  │
  ├─ row action "Activate"/"Deactivate" (in place) ──► same PUT calls as above ──► optimistic row update
  │
  └─ row action "Delete" ──► ConfirmDialog ──► DELETE /api/admin/users/{id} ──► row removed from list
```

---

## Users APIs

### Reuse unchanged (verified already implemented in `AdminController.java`)

| Method | Endpoint | Used by |
|---|---|---|
| GET | `/api/admin/users` | User Listing |
| GET | `/api/admin/users/{id}` | User Details / Edit |
| PUT | `/api/admin/users/activate/{id}` | List row action, Detail page |
| PUT | `/api/admin/users/deactivate/{id}` | List row action, Detail page |

### New endpoints required (verified gap — do not exist today)

| Method | Endpoint | Purpose | Request | Response | Frontend Usage |
|---|---|---|---|---|---|
| POST | `/api/admin/users` | Admin-initiated user creation | `firstName`, `lastName`, `email`, `role` (+ password or invite-flow field — open product decision) | `UserResponse` of the created user | `AdminUserCreate.jsx` submit |
| PUT | `/api/admin/users/{id}` | Edit profile/role without a password field | `firstName`, `lastName`, `email`, `role` | Updated `UserResponse` | `AdminUserDetail.jsx` save |
| DELETE | `/api/admin/users/{id}` | Permanently remove a user, admin-scoped | — | 200/204 confirmation | `ConfirmDialog` confirm action |

Why these can't reuse existing endpoints: the only current creation path is public self-registration (`POST /api/users/register`, always creates `Role.USER`, requires the caller to invent a password); the only current update path (`PUT /api/users/update-user/{id}`) requires a `RegisterRequest` body — verified in `UserController.java` and `RegisterRequest.java` — whose `password` and `confirmPassword` fields are both `@NotBlank`, meaning an admin cannot edit just a name/email/role without also supplying a password; and the only current delete path (`DELETE /api/users/delete-user/{id}`) exists but is not admin-scoped or guarded for this use case. Each new endpoint should use a purpose-built request/response DTO (e.g. `AdminUserCreateRequest`, `AdminUserUpdateRequest`) rather than reusing `RegisterRequest`.

---

## Component Tree

```
AdminLayout
├── AdminTopbar                        [Must Be Created]
├── AdminSidebar                       [Must Be Created — pattern-reused from orphaned Sidebar.jsx]
├── AdminDashboard (page)              [Must Be Created]
│   ├── ModulePageShell                [Already Exists — Can Be Reused]
│   ├── AdminStatGrid                  [Must Be Created]
│   │   └── AdminStatCard × 8          [Must Be Created — pattern-reused from StatisticsCards.jsx]
│   ├── Loader                         [Already Exists — Can Be Reused]
│   └── (optional) RecentUsersPreview  [Must Be Created — client-derived from Users list]
│
├── AdminUsers (page)                  [Must Be Created]
│   ├── ModulePageShell                [Already Exists — Can Be Reused]
│   ├── UsersToolbar                   [Must Be Created]
│   │   ├── SearchInput (uses Input)   [Already Exists — Can Be Reused]
│   │   ├── RoleFilter (select)        [Must Be Created]
│   │   ├── StatusFilter (select)      [Must Be Created]
│   │   └── Button ("Create user")     [Already Exists — Can Be Reused]
│   ├── UsersTable                     [Must Be Created]
│   │   └── UsersTableRow × N          [Must Be Created]
│   │       └── UserStatusBadge        [Must Be Created]
│   ├── Pagination                     [Must Be Created]
│   ├── Loader                         [Already Exists — Can Be Reused]
│   └── ConfirmDialog (delete/deactivate) [Must Be Created]
│
├── AdminUserCreate (page)             [Must Be Created]
│   ├── ModulePageShell                [Already Exists — Can Be Reused]
│   ├── UserFormFields                 [Must Be Created — built from Input]
│   │   └── Input × N                  [Already Exists — Can Be Reused]
│   └── Button (Submit/Cancel)         [Already Exists — Can Be Reused]
│
└── AdminUserDetail (page)             [Must Be Created]
    ├── ModulePageShell                [Already Exists — Can Be Reused]
    ├── Card (read panel)              [Already Exists — Can Be Reused]
    ├── UserStatusBadge                [Must Be Created — shared with UsersTableRow]
    ├── UserFormFields (edit mode)     [Must Be Created — shared with AdminUserCreate]
    ├── Button (Edit/Save/Cancel/Delete) [Already Exists — Can Be Reused]
    └── ConfirmDialog (delete)         [Must Be Created — shared with AdminUsers]
```

---

## Folder Structure

Everything new lives under an `admin` namespace inside the existing `src/` tree, mirroring the project's current by-type-first, by-feature-second organization rather than introducing a new pattern:

```
src/
├── pages/
│   ├── admin/
│   │   ├── AdminDashboard.jsx        # Dashboard module page
│   │   ├── AdminUsers.jsx            # Users list page
│   │   ├── AdminUserDetail.jsx       # Single user view/edit page
│   │   └── AdminUserCreate.jsx       # Create user page
│   └── ...existing pages unchanged
│
├── components/
│   ├── admin/
│   │   ├── layout/
│   │   │   ├── AdminLayout.jsx       # Shell: AdminTopbar + AdminSidebar + <Outlet/>
│   │   │   ├── AdminTopbar.jsx       # Trimmed top bar (logo, user menu, logout)
│   │   │   └── AdminSidebar.jsx      # Left nav: Dashboard, Users (+ future modules)
│   │   ├── dashboard/
│   │   │   ├── AdminStatCard.jsx     # Single metric tile (reuses Card)
│   │   │   └── AdminStatGrid.jsx     # Grid wrapper, fed by AdminDashboardResponse
│   │   └── users/
│   │       ├── UsersTable.jsx        # Table shell: header, sorting, row rendering
│   │       ├── UsersTableRow.jsx     # Single row + row actions menu
│   │       ├── UsersToolbar.jsx      # Search input, role/status filters, "Create user" button
│   │       ├── UserFormFields.jsx    # Shared field set for create + edit forms
│   │       ├── UserStatusBadge.jsx   # Active/Inactive + role badges
│   │       ├── Pagination.jsx        # Client-side pagination control
│   │       └── ConfirmDialog.jsx     # Generic confirm modal (delete / deactivate)
│   └── ...existing components unchanged
│
├── routes/
│   ├── AdminRoute.jsx                 # New guard: authenticated AND role === "ADMIN"
│   └── ...existing routes unchanged (AppRoutes.jsx gains an admin route block)
│
├── services/
│   ├── adminApi.js                    # Calls to /api/admin/dashboard, /api/admin/users*
│   └── ...existing services unchanged
│
├── context/
│   └── AuthContext.jsx                # Extended, not replaced — role + persistence + real login
│
├── constants/
│   └── routes.js                      # Extended with ADMIN_* route constants
│
└── hooks/
    └── admin/
        └── useUsers.js                 # Encapsulates fetch/create/update/delete/activate/deactivate + local list state
```

Rationale:
- `pages/admin/*` stays consistent with the existing flat `src/pages/` convention (one file per route) rather than nesting a whole mini-app.
- `components/admin/*` follows the same grouping convention already used for `components/dashboard/*` (feature-named subfolder of `components/`).
- No new top-level directory (e.g. a separate `src/admin/`) is introduced — the existing project organizes by type-first, feature-second everywhere (`pages/`, `components/`, `hooks/`, `services/`), and this mirrors that.
- This structure is deliberately open-ended — see [Future Expansion](#future-expansion) for how later modules (Lessons, Reports, Roles, etc.) slot into the same tree without restructuring.

---

## Routing Structure

### New route constants

Add to `src/constants/routes.js` alongside the existing entries:

| Constant | Path |
|---|---|
| `ROUTES.ADMIN_DASHBOARD` | `/admin` |
| `ROUTES.ADMIN_USERS` | `/admin/users` |
| `ROUTES.ADMIN_USER_DETAIL` | `/admin/users/:id` |
| `ROUTES.ADMIN_USER_CREATE` | `/admin/users/new` |

### Registering the routes

In `AppRoutes.jsx`, add a new `<Route>` group parallel to the existing "Protected Pages" block, using a new `AdminLayout` element instead of `AppLayout`, with each child page wrapped in `<AdminRoute>` the same way current pages are wrapped in `<ProtectedRoute>`. This keeps the existing route tree completely untouched — the admin block is purely additive.

### Route protection

Introduce `src/routes/AdminRoute.jsx`, built the same way as the existing `ProtectedRoute.jsx` (same ~15-line shape), but checking both authentication *and* role:

- Not authenticated → redirect to `ROUTES.LOGIN` (identical to `ProtectedRoute`).
- Authenticated but `role !== "ADMIN"` → redirect to `ROUTES.DASHBOARD` (not `/login` — the user *is* logged in, just not privileged).
- Otherwise → render children.

This is client-side UX gating only, not security — see [Security](#security) for why the backend authorization gap must also be closed.

### Entry point into the admin area

Two realistic options — pick one during implementation, not necessarily both:
- Add an "Admin" link inside the existing `Navbar` profile dropdown, visible only when `role === "ADMIN"` (small change to `components/common/Navbar.jsx`).
- Redirect admins straight to `/admin` on login instead of `/dashboard` (change in `AuthContext.login()` / `Login.jsx`'s post-login navigation).

Recommendation: do both — a persistent link for switching back and forth, plus redirect-on-login for convenience.

---

## Data Flow

```
Backend API (Spring Boot, /api/admin/**)
       │  axios (adminApi.js)
       ▼
Service Layer (src/services/adminApi.js)
       │  async functions: getDashboard(), getUsers(), getUser(id), createUser(payload),
       │  updateUser(id, payload), deleteUser(id), activateUser(id), deactivateUser(id)
       ▼
Custom Hooks (src/hooks/admin/useUsers.js — Users module only; Dashboard calls adminApi directly or via a thin useDashboard hook)
       │  fetch-on-mount, local list state, optimistic updates for activate/deactivate,
       │  loading/error/success flags
       ▼
Pages (AdminDashboard.jsx, AdminUsers.jsx, AdminUserDetail.jsx, AdminUserCreate.jsx)
       │  own loading/error branching, pass data + handlers down as props
       ▼
Reusable Components (AdminStatGrid, UsersTable, UserFormFields, ConfirmDialog, etc.)
       │  pure presentation + local UI state (form inputs, dialog open/closed)
       ▼
UI (rendered DOM, Tailwind classes, Framer Motion transitions)
```

This mirrors the shape `dashboardMockData.js` already implies for the learner dashboard (a data object flowing down through page → typed widget components) — the difference for the Admin Panel is that the data source is a live `adminApi.js` call routed through a hook instead of a static import, which is the natural "swap the import for a fetch" migration path the project's mock-data comments (`dashboardMockData.js`'s own header comment) already anticipate.

---

## State Management

No global state library exists in this project (no Redux, Zustand, or React Query) — state stays local to hooks/components, consistent with the rest of the codebase. The Admin Panel should follow the same approach rather than introducing a new dependency.

| State | Where it lives | Convention |
|---|---|---|
| **Loading** | Local `useState(true)` per page/hook, mirroring the existing `isLoading` pattern already used by `Profile.jsx`, `Settings.jsx`, `SpeakingPractice.jsx`, etc. (currently simulated with `setTimeout`; for the Admin Panel this becomes a real "request in flight" flag) | `Loader` component renders while true |
| **Error** | Local `useState(null)` per hook (`useUsers`, dashboard fetch), holding a message string or error object | Inline error banner + "Retry" button — the convention to establish on `AdminDashboard.jsx` (first real network call in the app) and reuse on `AdminUsers.jsx` |
| **Success** | Transient — a toast/notification (new component, see [Component Tree](#component-tree)) fired after create/update/delete/activate/deactivate resolve | Auto-dismiss after a few seconds; the existing `toastVariants` in `animations/variants.js` is a ready-made animation fit |
| **Empty** | Explicit "no users match your filters" / "no users yet" state in `UsersTable` when the filtered/paginated list is length 0 | Distinct from the error state — this is a valid, non-error outcome |
| **API calls** | `adminApi.js` functions, called from `useUsers.js` (Users) or directly/via a thin hook (Dashboard) | All async/await wrapped in try/catch, consistent with the existing `ForgotPassword.jsx` pattern (`authService.forgotPassword(...)` in a try/catch updating local `error`/`message` state) — this is the one existing page that already demonstrates the target pattern |
| **Optimistic updates** | Activate/deactivate row actions update the local list state immediately, roll back on request failure | Delete removes the row from local state only after the `DELETE` call succeeds (not optimistically, given the destructive/irreversible nature) |
| **Caching** | None — no React Query/SWR in this project. Each page fetch is a fresh network call on mount; `useUsers.js` keeps an in-memory list for the current session so filter/sort/paginate don't refetch, but there is no cross-page or cross-session cache. Introducing a caching library is out of scope for V1 and should be a deliberate later decision, not an incidental one | Re-fetch on navigation back to `AdminUsers` (acceptable at V1 data volume) |

---

## Responsive Design

The existing app is responsive throughout (every page and dashboard widget already uses Tailwind's `sm:`/`md:`/`lg:` breakpoints) — the Admin Panel should not regress that.

| Element | Desktop | Tablet | Mobile |
|---|---|---|---|
| **Sidebar** | Persistent, `md:block`, fixed width (mirrors orphaned `Sidebar.jsx`'s `w-68`) | Same as desktop down to `md` | Hidden by default, slides in as a drawer via `sidebarVariants` (already defined in `animations/variants.js`), toggled from a hamburger in `AdminTopbar` |
| **Tables** (`UsersTable`) | Full column set (Name, Email, Role, Status, Joined, Actions) | Full column set, may drop a lower-priority column (e.g. Joined) if width is tight | Collapses to a stacked card-per-row layout (each `UsersTableRow` becomes a small `Card` with labeled fields) rather than a horizontally-scrolling table, consistent with how `Profile.jsx`'s "Account Details" list already stacks label/value pairs on narrow screens |
| **Charts** | N/A in V1 (see [Dashboard Module](#dashboard-module)) | N/A | N/A |
| **Cards** (`AdminStatCard`) | `lg:grid-cols-4` (2 rows of 4 for 8 tiles) | `sm:grid-cols-2` | `grid-cols-1`, full width, stacked — same breakpoint progression already used by `StatisticsCards.jsx` |
| **Forms** (`UserFormFields`) | Two-column field layout where sensible (matches `Profile.jsx`'s `lg:grid-cols-[1.1fr_0.9fr]` pattern) | Single column | Single column, full-width `Input`s (already the default `Input` behavior — no extra work needed) |

---

## Security

### Client-side (this frontend)

- `AdminRoute` (see [Routing Structure](#routing-structure)) gates the `/admin/*` route tree in the UI — necessary for UX, **not sufficient as actual security**.
- The current `AuthContext` has no `role` field and no persisted session — both must be fixed first (see [Existing Authentication](#existing-authentication)) before `AdminRoute` can mean anything.

### Backend (verified — blocking issue found)

**`SecurityConfig.java` was read directly and confirms a real, currently-shippable vulnerability:** the authorization rule set is `.anyRequest().authenticated()` for everything except the explicitly listed public auth/lesson-browse endpoints. There is **no role-based restriction anywhere in the codebase** — no `@PreAuthorize`, `@Secured`, or `@RolesAllowed` annotation exists on `AdminController` or anywhere else, and `requestMatchers("/api/admin/**")` is not present in `SecurityConfig`. This means **any authenticated learner account can currently call every `/api/admin/**` endpoint**, including deactivating other users and reading admin dashboard metrics.

Compounding this: `JwtUtil.generateToken(String email)` (verified directly) only encodes the user's email as the JWT subject — **no role claim is embedded in the token at all**, so even a hypothetical `hasRole("ADMIN")` check would have nothing to evaluate against without additional changes.

**This must be fixed before the Admin Panel ships, including internally/in staging:**
1. Add a role claim to the JWT (or a per-request lookup via the existing user-loading path) so Spring Security has something to authorize against.
2. Restrict `/api/admin/**` to `hasRole("ADMIN")` in `SecurityConfig.java` (or apply `@PreAuthorize("hasRole('ADMIN')")` at the controller level).
3. Decide the fate of `UserController`'s overlapping `get-all-users` / `get-user-by-id/{id}` / `update-user/{id}` / `delete-user/{id}` endpoints once admin-scoped equivalents exist — leaving two differently-guarded paths to the same data is itself a risk.

### JWT

Issued by `POST /api/users/login` (`AuthResponse`), 24-hour default expiration (`jwt.expiration=86400000`, `application.properties.example`), HMAC-SHA256 signed (verified in `JwtUtil.java`). The frontend does not currently store or attach this token anywhere — see [Existing Authentication](#existing-authentication) for the required `AuthContext` changes, and `adminApi.js` will need an axios interceptor (or manual header) to attach `Authorization: Bearer <token>` to every admin request once the token is actually persisted.

### Admin-only pages

Enforced client-side by `AdminRoute`, and — once the backend fix above ships — enforced server-side by `SecurityConfig`. Both layers are required; neither alone is sufficient. The QA pass before shipping must verify both independently (see [Development Roadmap](#development-roadmap), Phase 5).

---

## Development Roadmap

**Phase 0 — Backend prerequisites (blocking)**
- **Objectives:** close the verified security gap and the three verified API gaps before any frontend admin work is user-facing.
- **Backend dependencies:** add a JWT role claim; restrict `/api/admin/**` to `ADMIN` in `SecurityConfig`; add `POST /api/admin/users`, `PUT /api/admin/users/{id}`, `DELETE /api/admin/users/{id}`; reconcile `VITE_API_BASE_URL` vs. `server.port`.
- **Complexity:** Medium (security-sensitive, requires care).
- **Effort:** ~2–3 days.

**Phase 1 — Frontend auth foundation**
- **Objectives:** make `AuthContext` capable of gating an admin section at all.
- **Pages/components:** `AuthContext.jsx` (extended), `AdminRoute.jsx` (new).
- **Dependencies:** `useLocalStorage` (existing, unused today), `STORAGE_KEYS` constants (existing, unused today).
- **Reusable components:** `ProtectedRoute.jsx` as the direct template.
- **Backend dependencies:** real `POST /api/users/login` response including `role`.
- **Complexity:** Low–Medium.
- **Effort:** ~1 day.

**Phase 2 — Admin shell**
- **Objectives:** a navigable, empty admin area.
- **Pages/components:** `AdminLayout.jsx`, `AdminTopbar.jsx`, `AdminSidebar.jsx`; register the `/admin` route block in `AppRoutes.jsx` (pages can be stubs at this stage).
- **Dependencies:** new `ROUTES.ADMIN_*` constants.
- **Reusable components:** `AppLayout.jsx` as structural template, `sidebarVariants` from `animations/variants.js`.
- **Backend dependencies:** none.
- **Complexity:** Low.
- **Effort:** ~1 day.

**Phase 3 — Dashboard module**
- **Objectives:** first real network call in the app; establish loading/error conventions.
- **Pages/components:** `adminApi.js` (dashboard call), `AdminStatGrid.jsx`, `AdminStatCard.jsx`, `AdminDashboard.jsx`.
- **Dependencies:** `Card`, `Loader`, `ModulePageShell`.
- **Reusable components:** `StatisticsCards.jsx` pattern (copied).
- **Backend dependencies:** `GET /api/admin/dashboard` (already implemented — no new backend work).
- **Complexity:** Low.
- **Effort:** ~1–2 days.

**Phase 4 — Users Management module**
- **Objectives:** complete CRUD, the bulk of V1 effort.
- **Pages/components:** `useUsers.js`, `adminApi.js` (user calls), `AdminUsers.jsx`, `UsersTable.jsx`, `UsersTableRow.jsx`, `UsersToolbar.jsx`, `Pagination.jsx`, `AdminUserDetail.jsx`, `AdminUserCreate.jsx`, `UserFormFields.jsx`, `UserStatusBadge.jsx`, `ConfirmDialog.jsx`.
- **Dependencies:** `Input`, `Button`, `Card`, `formatDate`/other `formatters.js` helpers.
- **Reusable components:** all of [Existing Reusable Components](#existing-reusable-components).
- **Backend dependencies:** `GET /api/admin/users`, `GET /api/admin/users/{id}`, `PUT .../activate/{id}`, `PUT .../deactivate/{id}` (existing); `POST /api/admin/users`, `PUT /api/admin/users/{id}`, `DELETE /api/admin/users/{id}` (new, from Phase 0).
- **Complexity:** High (most net-new components: table, pagination, modal, form validation, three CRUD flows).
- **Effort:** ~4–6 days.

**Phase 5 — Polish & QA**
- **Objectives:** production-readiness pass.
- **Scope:** empty states, error states, toast/notification feedback for all mutations; confirm mobile/responsive behavior of sidebar + table; manual QA verifying non-admin accounts cannot reach `/admin/*` client-side **or** call `/api/admin/**` server-side (both, independently — see [Security](#security)).
- **Backend dependencies:** none beyond Phase 0 already being live.
- **Complexity:** Medium.
- **Effort:** ~2 days.

**Total estimated V1 effort: ~11–15 working days**, split roughly evenly between one backend-capable engineer (Phase 0) and one frontend engineer (Phases 1–5), with Phase 0 as a hard prerequisite gate before Phase 4's create/update/delete flows can be wired to anything real (Phases 1–3 can proceed against the existing/verified endpoints in parallel with Phase 0).

---

## Future Expansion

The folder structure in [Folder Structure](#folder-structure) is deliberately open-ended so the following can be added as sibling modules later **without restructuring**:

| Future module | Slots into | Backend readiness today |
|---|---|---|
| **Subscription Management** | `pages/admin/AdminSubscriptions.jsx`, `components/admin/subscriptions/` | No backend entity/controller found — net-new on both ends |
| **Lessons Management** | `pages/admin/AdminLessons.jsx`, `components/admin/lessons/` | Backend already has `LessonController`, `LessonRepository`, `LessonRequest` — dashboard already surfaces `totalLessons`/`activeLessons` counts, so a full admin CRUD UI is a comparatively short lift |
| **Reports** | `pages/admin/AdminReports.jsx` | No aggregation/reporting endpoints found — would need new backend work |
| **Analytics** | `pages/admin/AdminAnalytics.jsx` | Same gap as Reports — no time-series data exposed anywhere today (see [Dashboard Module](#dashboard-module) re: why V1 has no charts) |
| **Notifications** | `pages/admin/AdminNotifications.jsx` | Backend has `NotificationController`, `NotificationRequest`, and the dashboard already counts `totalNotifications` — a management UI is a plausible near-term follow-up |
| **Feedback** | `pages/admin/AdminFeedback.jsx` | No feedback entity/controller found — net-new |
| **Roles & Permissions** | `pages/admin/AdminRoles.jsx` | `Role` enum today is a hard-coded two-value (`USER`, `ADMIN`) — a real roles/permissions UI would need the enum promoted to a proper entity first, a bigger backend change than a simple new endpoint |
| **Activity Logs** | `pages/admin/AdminActivityLogs.jsx` | No audit-log entity/controller found — explains why V1's dashboard has no "Recent Activity" widget (see [Dashboard Module](#dashboard-module)) |
| **System Settings** | `pages/admin/AdminSettings.jsx` | Backend has a `SettingsController`/`SettingsRequest`, but scoped to per-user learner preferences today, not system-wide admin settings — would need new scope, not just a new UI |

Two structural cleanups worth doing whenever a future module gives the team a natural excuse (not urgent for V1, but noted so they aren't forgotten):
- Resolve the `components/layout/` vs. `components/layouts/` duplication (see [Existing Frontend Architecture](#existing-frontend-architecture)) — either delete the orphaned plural folder or finish wiring `ThemeProvider` and the CSS custom properties it depends on.
- Once nesting grows past two levels (e.g. `Users → Roles → Permission Detail`), add a real `Breadcrumb` component rather than continuing to rely on `ModulePageShell`'s title/badge alone.

---

## Risks

1. **Backend security gap is exploitable today, not just a future concern.** Verified directly in `SecurityConfig.java`: any authenticated learner can currently call `/api/admin/**`, including deactivating other users. This is a live risk in the current codebase independent of whether the Admin Panel frontend is ever built — flagged here because building a frontend on top of it would make the gap more visible/reachable, not because the frontend creates the gap.
2. **No server-side pagination on `GET /api/admin/users`.** Fine at current/expected data volume, but the client-side approach in V1 will degrade if the user base grows substantially — needs a follow-up decision (see [Future Expansion](#future-expansion) framing and the roadmap's Phase 4 scope note).
3. **Destructive delete with wide cascade.** The `User` entity cascades deletion across 10 related collections (verified in `User.java`). A UI bug in the delete flow (e.g. a missing confirmation, or a race condition on double-submit) has an unusually large blast radius compared to typical single-entity deletes. Mitigate with `ConfirmDialog` plus disabling the delete button during the in-flight request (standard, but worth calling out given the stakes here specifically).
4. **Two orphaned/inconsistent systems already exist in this codebase** (`components/layouts/` plural, undefined CSS custom properties, unmounted `ThemeProvider`). If a future contributor imports from the wrong `layout(s)` folder by mistake, they'll get a runtime `useTheme()` throw or silently-broken styling (undefined CSS vars render as unstyled/transparent, not an error). This document's recommendation to build on the *active* singular system reduces but doesn't eliminate this risk — a follow-up cleanup (delete the orphan, or finish it) would remove it entirely.
5. **Open product decisions block part of Phase 4.** The create-user password/invite-flow choice (see [User CRUD](#user-crud) → Create User) is not resolvable from the codebase alone — it needs a team decision before `AdminUserCreate.jsx` and its backend endpoint can be finalized. Treat this as a scheduling risk, not just a design detail: it can block a chunk of Phase 4 if left undecided until implementation starts.
6. **Environment configuration mismatch.** `.env.example`'s `VITE_API_BASE_URL` (port 8080) disagrees with the backend's `application.properties.example` (port 9091). Trivial to fix, but will silently produce "network error" failures during integration testing if missed.

---

## Recommendations

1. **Sequence Phase 0 (backend security + new endpoints) before any real integration testing of Phase 4**, even though frontend Phases 1–3 can be built in parallel against already-existing, already-verified endpoints. Do not point a staging Admin Panel at a backend that hasn't closed the `/api/admin/**` authorization gap, even for internal testing.
2. **Build the Admin Panel using the active design language** (Tailwind utility classes matching `components/common/*`, slate/indigo palette) and treat the orphaned `components/layouts/Sidebar.jsx` as a **pattern reference only**, not an import — see [Existing Frontend Architecture](#existing-frontend-architecture) for why importing it as-is would break.
3. **Reuse the single existing `/login` page with a role-based post-login redirect**, rather than building a second admin-only login surface — the backend has exactly one login endpoint regardless of role, and maintaining two auth UIs has no clear benefit at V1 scope.
4. **Resolve the create-user password/invite-flow decision early** (before Phase 4 implementation starts, ideally during Phase 0), since it determines both the new `POST /api/admin/users` request shape and the `AdminUserCreate.jsx` form — leaving it open mid-implementation will cause rework.
5. **Do not build charts or a "Recent Activity" dashboard widget in V1** — the backend has no time-series or activity-log data to back either honestly, and fabricating placeholder data would violate the "verify everything from the codebase" ground rule this document was built on. Revisit once a Lessons or Activity Logs module (see [Future Expansion](#future-expansion)) gives the backend a reason to expose that data.
6. **Treat `useLocalStorage` and the `STORAGE_KEYS` constants as already-designed-for-this-purpose**, not new infrastructure — they exist in the codebase today, unused, seemingly anticipating exactly the session-persistence work Phase 1 requires. Use them rather than introducing a new persistence approach.
7. **Leave the `components/layout/` vs. `components/layouts/` cleanup and the unmounted `ThemeProvider` out of V1 scope**, but track it as explicit follow-up work (see [Future Expansion](#future-expansion)) rather than letting it remain silently orphaned indefinitely — it's a source of confusion risk for any future contributor exploring the codebase.
=======
# admin-panel-frontend
Admin Panel
>>>>>>> 03b26da4ffb8b7fd3a455fc6223545b03ce39bc4
