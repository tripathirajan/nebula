# `@nebula/react-ui-blocks` — Architecture & Planning

Research document for the top layer of the Nebula UI ecosystem — now a confirmed 5-tier pipeline (`primitives → headless → styleless → react-ui → react-ui-blocks`; `styleless` is a new, not-yet-built middle layer, see `LAYER_TAXONOMY.md`). Scope: architecture, organization, inventory, and process only — no implementation code.

## 0. Framing note — resolving a real tension with the existing package

`@nebula/react-ui-blocks` currently exists with an explicit, documented design decision: **domain-neutral, not ecommerce- or vertical-specific** (see its README — a dashboard shell and theme switcher should serve an expense tracker exactly as well as a storefront, and a prior request for an ecommerce-flavored `react-ui-store` layer was declined for this reason).

This research task asks for the opposite: ecommerce carts, checkout flows, SaaS dashboards, blog layouts, marketing pages — a comprehensive, vertical-spanning blocks library, the scope of Tailwind UI or shadcn's registry.

Both are right, for different reasons, and the architecture below reconciles them rather than picking one:

- **`@nebula/react-ui-blocks` stays domain-neutral.** It keeps exactly what it has today plus genuinely cross-domain primitives (shells, navigation chrome, generic form patterns, generic data display). This is the package every consumer installs.
- **Verticals become their own scoped sub-namespaces inside the same package** (`@nebula/react-ui-blocks/ecommerce`, `/marketing`, `/dashboard`, ...), not new top-level packages, and not mixed into the neutral core. A consumer building an expense tracker imports `@nebula/react-ui-blocks/dashboard` and never sees a `ProductCard`. A consumer building a storefront imports `@nebula/react-ui-blocks/ecommerce` and never sees `BlogLayout`.
- This is exactly the same resolution the package's own README already gestures at ("a good candidate for its own separate package built on top of this one later") — the difference is doing it as **subpath exports within one package + one Storybook + one version number** rather than a proliferation of `@nebula/react-ui-store`, `@nebula/react-ui-blog`, `@nebula/react-ui-saas` packages, which would fragment versioning, duplicate tooling config, and force consumers to manage N package.json entries for what is conceptually one "blocks" dependency.

Every deliverable below is written against this model: a domain-neutral core, plus first-class, separately-exported, separately-documented vertical categories, all inside one package.

---

## 1. Folder Structure

```text
packages/react-ui-blocks/
├── src/
│   ├── index.ts                      # barrel: re-exports the domain-neutral core only
│   │
│   ├── core/                         # domain-neutral — today's AppLayout/ThemeSwitcher live here
│   │   ├── app-shell/
│   │   ├── theme-switcher/
│   │   ├── error-boundary-page/      # 404/500/offline
│   │   └── empty-state/
│   │
│   ├── navigation/                   # cross-domain chrome — every vertical composes these
│   │   ├── headers/
│   │   ├── footers/
│   │   ├── sidebars/
│   │   ├── mobile-nav/
│   │   └── command-palette/
│   │
│   ├── layouts/                      # page-level shells (region composition, no page content)
│   │   ├── marketing-layout/
│   │   ├── app-layout/               # (renamed from today's single AppLayout — becomes one variant)
│   │   ├── dashboard-layout/
│   │   ├── auth-layout/
│   │   ├── docs-layout/
│   │   ├── blog-layout/
│   │   └── settings-layout/
│   │
│   ├── forms/                        # cross-domain form compositions (not auth-specific)
│   │   ├── contact-form/
│   │   ├── search-form/
│   │   └── filter-bar/
│   │
│   ├── data-display/                 # cross-domain block-level data presentation
│   │   ├── stat-cards/
│   │   ├── data-table-block/
│   │   └── activity-feed/
│   │
│   ├── marketing/                    # VERTICAL
│   │   ├── hero/
│   │   ├── features/
│   │   ├── pricing/
│   │   ├── testimonials/
│   │   ├── faq/
│   │   ├── cta/
│   │   ├── logo-cloud/
│   │   ├── stats/
│   │   └── newsletter/
│   │
│   ├── ecommerce/                    # VERTICAL
│   │   ├── product-discovery/
│   │   ├── product-detail/
│   │   ├── cart/
│   │   ├── checkout/
│   │   └── order/
│   │
│   ├── dashboard/                    # VERTICAL
│   │   ├── widgets/
│   │   ├── charts/
│   │   ├── tables/
│   │   └── activity/
│   │
│   ├── authentication/               # VERTICAL
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   ├── password/
│   │   └── mfa/
│   │
│   ├── saas/                         # VERTICAL
│   │   ├── onboarding/
│   │   ├── billing/
│   │   ├── team/
│   │   └── usage/
│   │
│   ├── documentation/                # VERTICAL
│   │   ├── article/
│   │   ├── api-reference/
│   │   └── changelog/
│   │
│   ├── blog/                         # VERTICAL
│   │   ├── listing/
│   │   ├── post/
│   │   └── author/
│   │
│   ├── social/                       # VERTICAL
│   │   ├── feed/
│   │   ├── profile/
│   │   └── messaging/
│   │
│   ├── settings/                     # VERTICAL (cross-cuts SaaS/dashboard, common enough to own its own top-level)
│   │   ├── account/
│   │   ├── team/
│   │   ├── billing/
│   │   └── danger-zone/
│   │
│   ├── portfolio/                    # VERTICAL
│   │   ├── hero/
│   │   ├── projects/
│   │   └── resume/
│   │
│   ├── enterprise/                   # VERTICAL
│   │   ├── admin/
│   │   ├── audit-log/
│   │   └── permissions/
│   │
│   └── mobile-commerce/              # VERTICAL (mobile-first patterns, distinct viewport contract)
│       ├── product-list/
│       ├── cart-sheet/
│       └── checkout-steps/
│
├── .storybook-overrides/             # per-package Storybook config fragments (see §9)
├── BLOCKS_ARCHITECTURE.md            # this document
└── package.json
```

### Why this is scalable

1. **Two-axis scaling, not one.** Most blocks libraries scale along a single axis (a flat, ever-growing `components/` folder, or a flat category list). This structure scales along *category* (marketing, ecommerce, dashboard, ...) and *block family* (hero, pricing, cart, ...) independently — adding a 40th marketing block never touches ecommerce, and adding an 8th vertical never touches marketing's internal structure. This is the same reasoning `component-library-architecture.md` §2 already uses for the primitives→headless→react-ui layering, applied one level up.
2. **Neutral core stays small and stable.** `core/`, `navigation/`, `layouts/`, `forms/`, `data-display/` are the only folders every consumer touches regardless of vertical. Freezing this list early (it should rarely grow) keeps the "what does every app need" surface reviewable, while verticals absorb all the growth.
3. **Every vertical folder is independently versionable in spirit** (even though shipped in one package) — each has its own subpath export (§6), so tree-shaking and mental model both scale to "one folder = one import path = one concern," matching this monorepo's existing file-per-component + subpath-export convention (`component-library-architecture.md` §9.1) rather than inventing a new one.
4. **New verticals are additive, not disruptive.** Adding `healthcare/` or `real-estate/` next year is: new top-level folder, new subpath export, new Storybook section. Nothing else in the tree changes. Compare to a flat `blocks/` folder with 400 components in it, where every addition makes the existing structure harder to navigate.
5. **Depth is capped at 3.** `category/family/block-name` — never deeper. Flowbite and HyperUI both suffer from either too-flat (impossible to browse at scale) or too-deep (over-nested, `blocks/marketing/hero/variants/centered/with-image/index.tsx`) structures; capping at 3 levels keeps every block reachable in at most two clicks/greps.

---

## 2. Categories

| Category | One-line scope | Neutral or Vertical? |
| --- | --- | --- |
| Core | App shell primitives every app needs (error pages, empty states, theme switching) | Neutral |
| Navigation | Headers, footers, sidebars, mobile nav, command palette | Neutral (composed by every vertical) |
| Layouts | Page-level region composition (no content opinions) | Neutral |
| Forms | Generic multi-field form compositions not tied to auth | Neutral |
| Data Display | Generic stat cards, table wrappers, activity feeds | Neutral |
| Marketing | Public-facing landing/product pages | Vertical |
| Ecommerce | Storefront, PDP, cart, checkout, order tracking | Vertical |
| Dashboard | Internal app home screens, widgets, charts | Vertical |
| Authentication | Sign-in/up, password reset, MFA, social auth | Vertical |
| SaaS / Application | Onboarding, billing, team management, usage/quota | Vertical |
| Documentation | API references, changelogs, guides | Vertical |
| Blog / Content | Post listing, article, author pages | Vertical |
| Social | Feeds, profiles, messaging, notifications | Vertical |
| Settings / Account | Account, team, billing, security, danger-zone panels | Vertical (shared by SaaS + Dashboard + Ecommerce) |
| Portfolio | Personal/agency sites, case studies, resumes | Vertical |
| Enterprise | Admin consoles, audit logs, permission matrices, org management | Vertical |
| Mobile Commerce | Mobile-first storefront/checkout patterns (distinct from desktop ecommerce) | Vertical |
| Onboarding *(new)* | Product tours, setup wizards, empty-state-to-first-value flows | Vertical |
| Communication *(new)* | Chat UIs, notification centers, inbox layouts | Vertical |
| Legal / Compliance *(new)* | Cookie consent, ToS/privacy acceptance flows, compliance banners | Vertical |
| AI / Chat Applications *(new, differentiator — see §12)* | Chat interfaces, prompt consoles, AI assistant panels | Vertical |
| Events *(new)* | Event landing pages, ticketing, schedules/agendas | Vertical |
| Real Estate / Listings *(new)* | Property/listing cards, search filters, map+list layouts | Vertical |
| Education / LMS *(new)* | Course cards, lesson layouts, progress tracking | Vertical |

Categories are not required to ship simultaneously (see the roadmap in §13) — this is the *complete* taxonomy the folder structure and naming convention need to accommodate, not a Phase 1 requirement.

---

## 3. Complete Block Inventory

Exhaustive per-category listing. Each entry is a *block family* — most families have multiple variants (cross-reference §5).

### 3.1 Core (Neutral)

- App Shell (single-region, portal-root + theme wiring)
- Error Page (404)
- Error Page (500 / generic error boundary fallback)
- Offline / No-Connection State
- Maintenance Mode Page
- Empty State (generic, composable icon/title/action)
- Loading Page (full-screen)
- Cookie Consent Banner
- Skip-to-Content Link Bar

### 3.2 Navigation (Neutral)

**Headers**
- Marketing Header (logo + links + CTA)
- SaaS App Header (logo + search + user menu + notifications)
- Ecommerce Header (logo + search + cart + account)
- Dashboard Header (breadcrumb + search + user menu)
- Documentation Header (logo + version switcher + search)
- Blog Header (logo + categories + search)
- Minimal Header (logo only, for auth/checkout flows)
- Sticky/Transparent-on-Scroll Header

**Footers**
- Marketing Footer (multi-column links + newsletter + social)
- Minimal Footer (copyright + legal links only)
- Ecommerce Footer (payment badges + links + newsletter)
- Documentation Footer (prev/next page nav)
- App Footer (status page link + version)

**Sidebars**
- Dashboard Sidebar (collapsible, icon + label)
- Documentation Sidebar (nested tree navigation)
- Settings Sidebar (flat section list)
- Ecommerce Filter Sidebar
- Mobile Drawer Sidebar

**Mobile Navigation**
- Bottom Tab Bar
- Hamburger Drawer Menu
- Mobile Search Overlay

**Other**
- Command Palette (⌘K global search/actions)
- Breadcrumb Bar
- Tab Navigation Bar
- Notification Bell + Dropdown
- User Account Menu (avatar dropdown)
- Language/Locale Switcher
- Announcement Bar (dismissible top banner)

### 3.3 Layouts (Neutral)

- Marketing Layout (header + content + footer)
- App/Dashboard Layout (sidebar + header + content)
- Auth Layout (centered card, optional side panel/illustration)
- Documentation Layout (sidebar + content + right-side TOC)
- Blog Layout (header + content + related-posts sidebar)
- Settings Layout (settings sidebar + content panel)
- Split Layout (50/50 content + visual, for onboarding/marketing)
- Full-Bleed Layout (no chrome, for checkout/focus flows)
- Two-Pane Layout (list + detail, e.g. inbox/settings)

### 3.4 Forms (Neutral)

- Contact Form
- Search Form (with filters)
- Filter Bar (chips + dropdowns)
- Multi-Step Form Wizard (generic shell)
- Feedback/Survey Form
- Newsletter Signup Inline Form
- File Upload Panel

### 3.5 Data Display (Neutral)

- Stat Cards Row
- KPI Summary Grid
- Generic Data Table Block (toolbar + table + pagination composed)
- Activity Feed / Timeline
- Comparison Table
- Progress Tracker (stepper visualization)
- Empty Table State

### 3.6 Marketing (Vertical)

- Hero — Centered
- Hero — Split (text + image)
- Hero — Video Background
- Hero — Product Screenshot
- Hero — Gradient/Animated Background
- Hero — Minimal (headline + single CTA)
- Logo Cloud
- Feature Grid (icon + title + description)
- Feature List (alternating image/text)
- Feature Comparison Table
- Feature Tabs (click to switch screenshot)
- CTA Banner (centered)
- CTA Banner (split with image)
- Pricing Cards (2-4 tier)
- Pricing Table (feature-by-feature comparison)
- Pricing Toggle (monthly/annual)
- FAQ Accordion
- FAQ Two-Column
- Testimonials — Single Quote
- Testimonials — Grid
- Testimonials — Carousel
- Testimonials — Video
- Statistics / Counter Section
- Trust Badges / Client Logos
- Newsletter Signup Section
- Team Section (grid of people)
- Timeline / Company History
- Integration Grid (third-party logos)
- Download/App Store CTA
- Bento Grid (mixed-size feature showcase)
- Comparison vs. Competitor Section

### 3.7 Ecommerce (Vertical)

**Product Discovery**
- Product Grid
- Product List (row layout)
- Product Card (default)
- Product Card (with quick-add)
- Product Carousel
- Category Grid
- Filter Sidebar (price/size/color/rating)
- Sort Dropdown Bar
- Search Results Page
- Recently Viewed Row
- Recommended Products Row

**Product Detail**
- Product Gallery (thumbnail + main image)
- Product Info Panel (title/price/variants/CTA)
- Size/Variant Selector
- Product Reviews Section
- Product Q&A Section
- Related Products Row
- Sticky Add-to-Cart Bar (mobile)

**Cart**
- Cart Drawer (slide-over)
- Cart Page (full page)
- Cart Line Item
- Cart Summary/Totals Panel
- Empty Cart State
- Save-for-Later List

**Checkout**
- Checkout Stepper (shipping → payment → review)
- Shipping Address Form
- Payment Method Form
- Order Summary Sidebar
- Promo Code Input
- Order Confirmation Page

**Order**
- Order History List
- Order Detail Page
- Order Tracking Timeline
- Return/Refund Request Form

**Merchandising**
- Wishlist Grid
- Flash Sale Banner
- Product Comparison Table

### 3.8 Dashboard (Vertical)

**Widgets**
- Stat Card (single metric + trend)
- Metric Card with Sparkline
- Quick Actions Card
- Recent Activity Widget
- To-Do / Task List Widget
- Calendar Mini Widget
- Weather/Status Widget

**Charts**
- Line Chart Card
- Bar Chart Card
- Pie/Donut Chart Card
- Area Chart Card
- Chart Card with Legend + Filters

**Tables**
- Data Table with Toolbar
- Sortable/Filterable Table
- Table with Row Actions
- Table with Bulk Selection Bar

**Activity**
- Notification Center Panel
- Activity Timeline
- Audit Trail List

**Layout**
- Dashboard Home Grid (widget composition)
- Analytics Overview Page

### 3.9 Authentication (Vertical)

**Sign In**
- Sign-In Form (email/password)
- Sign-In with Social Providers
- Sign-In Split Layout (form + illustration)
- Magic Link Sign-In

**Sign Up**
- Sign-Up Form
- Sign-Up with Terms Acceptance
- Sign-Up Multi-Step (progressive profiling)

**Password**
- Forgot Password Form
- Reset Password Form
- Password Strength Meter Panel

**MFA**
- OTP/Code Verification Form
- Authenticator App Setup Panel
- Recovery Codes Display

**Other**
- Account Locked / Suspicious Activity Notice
- Email Verification Prompt
- Session Expired Modal

### 3.10 SaaS / Application (Vertical)

**Onboarding**
- Welcome Screen
- Product Tour Overlay Steps
- Setup Checklist Widget
- Empty-State-to-First-Value CTA

**Billing**
- Plan Comparison Cards
- Billing Summary Panel
- Invoice List
- Payment Method Manager
- Usage-Based Billing Meter

**Team**
- Team Member List
- Invite Teammate Form
- Roles/Permissions Table

**Usage**
- Usage Quota Progress Bars
- API Key Management Panel
- Rate Limit Status Card

### 3.11 Documentation (Vertical)

- Article Layout (with TOC)
- API Reference Endpoint Card
- Code Example Tabs (multi-language)
- Changelog List
- Version Switcher Banner
- Search-as-You-Type Results Panel
- "Was this helpful?" Feedback Widget
- Prev/Next Page Navigation

### 3.12 Blog / Content (Vertical)

- Post Listing Grid
- Post Listing List (with excerpt)
- Featured Post Hero
- Post Detail Layout
- Author Bio Card
- Related Posts Row
- Category/Tag Filter Bar
- Comment Section
- Reading Progress Bar
- Newsletter CTA (inline, mid-article)

### 3.13 Social (Vertical)

- Feed (infinite-scroll post list)
- Post Composer
- Profile Header (cover + avatar + stats)
- Profile Tabs (posts/media/likes)
- Follower/Following List
- Direct Message Thread
- Conversation List
- Notification List
- Reaction/Like Bar

### 3.14 Settings / Account (Vertical)

- Account Profile Form
- Security Settings Panel (password/2FA)
- Notification Preferences Panel
- Connected Apps/Integrations List
- Team Settings Panel
- Billing Settings Panel
- API Keys Panel
- Danger Zone (delete account/org)
- Appearance/Theme Settings Panel

### 3.15 Portfolio (Vertical)

- Portfolio Hero (name + role + CTA)
- Project Grid
- Project Case Study Layout
- Resume/Experience Timeline
- Skills Grid
- Contact Section
- Testimonial/Recommendation Card

### 3.16 Enterprise (Vertical)

- Admin Console Home
- Organization Management Panel
- User Provisioning Table
- Permission Matrix Editor
- Audit Log Viewer
- SSO Configuration Panel
- Compliance Status Dashboard
- Multi-Tenant Switcher

### 3.17 Mobile Commerce (Vertical)

- Mobile Product List (single column, thumb-friendly)
- Mobile Cart Sheet (bottom sheet)
- Mobile Checkout Steps (full-screen stepper)
- Mobile Filter Sheet
- Sticky Mobile CTA Bar

### 3.18 Onboarding (Vertical, cross-cuts SaaS)

- Multi-Step Setup Wizard
- Interactive Product Tour
- Progress Checklist
- Sample-Data/Demo-Mode Banner

### 3.19 Communication (Vertical)

- Chat Window
- Inbox Layout (list + thread)
- Notification Center
- Toast/Alert Stack Composition

### 3.20 Legal / Compliance (Vertical)

- Cookie Consent Banner (detailed, category toggles)
- Terms Acceptance Modal
- Privacy Preference Center
- Compliance Badge Row (SOC2/GDPR/HIPAA)

### 3.21 AI / Chat Applications (Vertical — differentiator, see §12)

- Chat Conversation Panel
- Prompt Input Console (with model/parameter controls)
- Streaming Response Bubble
- Source/Citation Panel
- Conversation History Sidebar
- Model/Agent Switcher

### 3.22 Events (Vertical)

- Event Landing Hero (date/location/CTA)
- Schedule/Agenda Grid
- Speaker Grid
- Ticket Tier Cards
- Venue/Map Section

### 3.23 Real Estate / Listings (Vertical)

- Listing Card
- Listing Grid + Map Split View
- Listing Detail Gallery
- Search Filter Panel (price/beds/area)
- Agent Contact Card

### 3.24 Education / LMS (Vertical)

- Course Card
- Course Catalog Grid
- Lesson Layout (video + notes + progress)
- Progress Tracker Panel
- Quiz/Assessment Card
- Certificate Panel

---

## 4. Complexity Classification

| Tier | Definition | Composition depth |
| --- | --- | --- |
| **Small** | Single concern, 1-3 `react-ui` components, no internal state machine beyond what those components already manage | 1 level |
| **Medium** | Multiple sub-blocks or a small local state machine (open/closed, selected tab, filter state) | 2 levels |
| **Large** | Full page or multi-step flow; composes several Medium blocks, usually owns real application state (form wizard progress, cart contents) | 3+ levels |

### Small
Search Bar · User Menu (avatar dropdown) · Breadcrumb Bar · Notification Bell + Dropdown · Language Switcher · Stat Card (single metric) · CTA Banner (centered) · Trust Badges Row · Logo Cloud · Newsletter Inline Form · Product Card · Cart Line Item · OTP Verification Form · Empty State · Skip-to-Content Link Bar · Announcement Bar · Tag/Category Filter Chip Row · "Was this helpful?" Widget · Reading Progress Bar · Follow/Unfollow Button Row

### Medium
Marketing Header · Dashboard Sidebar · Product Grid (with filter interaction) · Profile Widget · Pricing Section (cards + toggle) · FAQ Accordion · Testimonials Carousel · Cart Drawer · Chart Card (with filters) · Sign-In Form · Team Member List + Invite Form · Notification Center Panel · Command Palette · Feature Tabs · Data Table with Toolbar · Comment Section · Multi-Step Setup Wizard (shell only) · Chat Window (single conversation) · Listing Card Grid

### Large
Checkout Page (full flow: shipping → payment → review → confirmation) · Admin Dashboard (composed widget grid + charts + tables) · Documentation Layout (sidebar + content + TOC + search + version switcher) · Landing Page (hero + features + pricing + testimonials + FAQ + CTA assembled) · Product Detail Page (gallery + info + reviews + Q&A + related) · Settings Layout (full multi-panel account/team/billing/security) · Onboarding Flow (multi-step wizard with per-step content + progress persistence) · Order Tracking Page (timeline + line items + support CTA) · AI Chat Application Shell (conversation history + chat window + prompt console + citations)

---

## 5. Variants

Not every block family needs variants — only ones whose *content model* changes meaningfully by domain, not just its skin. The rule of thumb: **if two verticals would need genuinely different props/data shapes (not just different copy), it's a variant family; if only the copy/imagery differs, it's one block with different Storybook args.**

### Header
| Variant | Distinguishing content |
| --- | --- |
| Marketing | Logo, nav links, CTA button |
| SaaS App | Logo, global search, notifications, user menu |
| Ecommerce | Logo, search, cart icon+count, account menu |
| Dashboard | Breadcrumb, search, user menu (no marketing nav) |
| Documentation | Logo, version switcher, search, GitHub link |
| Blog | Logo, category nav, search |
| Mobile | Logo, hamburger trigger only |
| Enterprise | Org switcher, logo, admin-only nav |

### Footer
Marketing (multi-column + newsletter) · Minimal (legal-only) · Ecommerce (payment badges + newsletter) · Documentation (prev/next nav) · App (status + version, no marketing links)

### Hero
Centered · Split (text/image) · Video Background · Product Screenshot · Minimal · Portfolio (name/role) · Event (date/location)

### Sidebar
Dashboard (icon+label, collapsible) · Documentation (nested tree) · Settings (flat sections) · Ecommerce Filter (facets) · Admin/Enterprise (org-aware)

### Card (generic pattern, several families)
Product Card · Stat Card · Pricing Card · Team Member Card · Blog Post Card · Course Card · Listing Card · Project Card — all share a "media/icon + title + meta + action" skeleton but genuinely differ in data shape, so each is its own family, not args on one `<Card>` block.

### Auth Form
Sign-In · Sign-Up · Forgot Password · Reset Password · MFA/OTP · Magic Link — same visual shell (`AuthLayout`), different field sets and submit semantics; modeled as separate block families sharing one layout, not one form with a `mode` prop (mirrors why `component-library-architecture.md` keeps `Dialog`/`AlertDialog` conceptually distinct even when visually similar).

### Table Block
Generic Data Table · Order History Table · Team Member Table · Audit Log Table · Invoice List — same underlying `react-ui` `Table`/`DataGrid` primitive, different column schemas and row actions per vertical.

### Empty State
Generic · No Search Results · Empty Cart · Empty Inbox · No Team Members Yet · Zero Data (dashboard, pre-onboarding) — one visual pattern (icon/illustration + title + description + action), parameterized per vertical via Storybook args rather than separate components, since only copy/icon changes.

### Layout
Marketing · App/Dashboard · Auth · Documentation · Blog · Settings · Full-Bleed — the layouts inventory in §3.3 *is* the variant set for "Layout" as a family.

---

## 6. Directory Naming Convention

```text
navigation/
    headers/
    footers/
    sidebars/
    mobile-nav/
    command-palette/

marketing/
    hero/
    features/
    pricing/
    testimonials/
    faq/
    cta/
    logo-cloud/
    stats/
    newsletter/

ecommerce/
    product-discovery/
    product-detail/
    cart/
    checkout/
    order/

dashboard/
    widgets/
    charts/
    tables/
    activity/
```

Rules:

1. **Category folders are the vertical/neutral-domain name, always plural-neutral, lowercase-kebab** (`ecommerce/`, not `Ecommerce/` or `e-commerce/`) — matches this monorepo's existing `packages/*` convention exactly (`kebab-case` folder names throughout).
2. **Subfolders are the block *family*, not the individual variant** (`hero/`, not `hero-centered/` + `hero-split/` as siblings) — variants live as files *within* the family folder (`hero/hero-centered.tsx`, `hero/hero-split.tsx`, `hero/index.ts` barrel), mirroring this repo's existing "one component, one folder, subparts as files" rule (`component-library-architecture.md`'s file-per-component convention) one level up: here, one *family*, one folder, variants as files.
3. **No `variants/` or `examples/` intermediate folders.** A block family folder is flat: the variant files, an `index.ts` barrel, `*.stories.tsx`, and (optionally) an `*.mdx` doc page. Depth stays capped at 3 from `src/` (category/family/file), which is what makes hundreds of blocks navigable — Preline and HyperUI both add a 4th+ level in places and it measurably slows down "find the thing" in their own repos.
4. **Neutral categories sort first alphabetically-independent of verticals** by convention (`core`, `navigation`, `layouts`, `forms`, `data-display` before any vertical) — not enforced by tooling, just a documented convention so contributors always know where "is this neutral or vertical" gets decided (§0's rule: does the data shape/content model change meaningfully by domain?).
5. **Every category folder that's a vertical gets its own subpath export** (`@nebula/react-ui-blocks/ecommerce`), matching `packages/*/tsup.config.ts`'s existing one-entry-per-subpath convention already used by every other package in this workspace — so this isn't a new convention, it's the existing one applied to a new package.

Why this is maintainable: it's the *same* convention already proven at three other layers of this monorepo (file-per-component, subpath exports, `no-restricted-imports` layer boundaries), just applied one level up to "family" instead of "component" and "category" instead of "package." A contributor who already knows how to add a component to `react-ui` needs zero new mental model to add a block here.

---

## 7. Naming Convention

**Pattern:** `<Domain><Family><Variant?>` in PascalCase for the exported component, kebab-case for the file/folder.

| Good | Why | Avoid |
| --- | --- | --- |
| `MarketingHeader` | Domain prefix disambiguates from `EcommerceHeader` immediately, even out of import context | `Header` (ambiguous — which one?) |
| `DashboardHeader` | Same | `AppHeader` (which app context?) |
| `EcommerceProductGrid` | Domain + family, unambiguous | `ProductGrid` (fine *within* the ecommerce subpath import, since the import path already disambiguates — see rule below) |
| `ProductCarousel` | Family name alone is fine once already inside an ecommerce-scoped import | `EcommerceProductCarousel` (redundant — see rule below) |
| `CheckoutSummary` | Family name, unambiguous within `ecommerce/checkout` | — |
| `ProfileSidebar` | Family + slot | `Sidebar` (too generic — collides with `navigation/sidebars`) |
| `StatisticsCards` | Plural, matches "a row of them" | `Stats` (too terse, collides with data concept elsewhere) |

**Disambiguation rule:** domain-prefix the *exported component name* only when it would otherwise collide across categories in the flat barrel (`index.ts`) or in Storybook's global search. Since every vertical also gets its own subpath export (§6), a consumer importing from `@nebula/react-ui-blocks/ecommerce` never needs the `Ecommerce` prefix to know what they're looking at — but the *root* barrel (`@nebula/react-ui-blocks`, which only re-exports the neutral core per §0) never has this collision problem in the first place, since verticals aren't re-exported there at all. Practically: **components default to their short family name (`ProductGrid`, `Hero`, `CheckoutSummary`); the domain prefix is reserved for the rare family name that's ambiguous even within its own vertical** (e.g. `dashboard/` has both a generic `Header` concept and needs `DashboardHeader` specifically because `navigation/headers/` already exports a family called `Header` with per-variant sub-exports, and both could theoretically be imported side-by-side in one file).

**File naming:** kebab-case matching the exported name (`marketing-header.tsx` exports `MarketingHeader`), identical to the convention already used for every `react-ui`/`headless` component in this repo — again, not a new rule, the existing one extended upward.

**Variant suffixing:** `<Family>-<variant>.tsx` as the filename, `<Family><Variant>` as a *named export from the family's barrel*, with the un-suffixed name reserved for whichever variant is the recommended default (e.g. `hero/hero-centered.tsx` exports `HeroCentered`; `hero/index.ts` additionally re-exports `HeroCentered as Hero` as the default pick, exactly the same "no default exports, but one named export acts as the sensible default" pattern this repo already uses).

---

## 8. Metadata Model

Every block ships a co-located metadata object (e.g. `hero-centered.meta.ts`) — not just JSDoc, but a real, statically-analyzable object Storybook's autodocs, a future registry site, and search tooling can all consume without parsing prose.

```ts
interface BlockMetadata {
  /** PascalCase export name — must match the component's actual export. */
  name: string;
  /** Top-level folder, e.g. 'marketing' | 'ecommerce' | 'dashboard' | ... */
  category: string;
  /** Family folder within the category, e.g. 'hero' | 'cart' | 'checkout' */
  subcategory: string;
  /** This block's variant name within its family, or undefined if it's the only one. */
  variant?: string;
  complexity: 'small' | 'medium' | 'large';
  /** Breakpoints this block has an explicitly designed layout for, not just "doesn't break." */
  responsive: Array<'mobile' | 'tablet' | 'desktop'>;
  /** Whether it's been visually verified in both themes, not just "inherits tokens so it should work." */
  themeSupport: {
    light: 'verified' | 'inherited' | 'unsupported';
    dark: 'verified' | 'inherited' | 'unsupported';
  };
  /** Real, run status — not aspirational. See §10 for what "passing" requires. */
  accessibilityStatus: 'passing' | 'known-issues' | 'unaudited';
  /** @nebula/react-ui and @nebula/react-ui-blocks components this block composes — enables "what breaks if I change X" queries. */
  dependencies: string[];
  /** External runtime deps beyond @nebula/*, if any (e.g. a charting library for Dashboard/Charts) — should be rare/zero, flagged loudly when present. */
  externalDependencies?: string[];
  tags: string[];
  /** Relative path to a static preview screenshot, generated (see §9), not hand-maintained. */
  previewImage: string;
  description: string;
  /** Free-text search terms beyond what name/tags already cover (synonyms, competitor-block names for discoverability — e.g. a `CheckoutStepper` might list "checkout flow", "multi-step form"). */
  keywords: string[];
  /** Related block families (cross-links for "see also" in docs — §10). */
  relatedBlocks?: string[];
  /** semver-independent stability signal, since blocks iterate faster than the underlying react-ui API. */
  status: 'stable' | 'beta' | 'experimental' | 'deprecated';
  /** If deprecated/renamed, what to use instead — never a dead end. */
  supersededBy?: string;
  /** ISO date, driven by git, not hand-updated — ties into "recently updated" sorting in a future registry UI. */
  lastUpdated: string;
  /** Whether this block owns non-trivial local/external state (cart contents, wizard step) vs. being purely presentational — important for consumers deciding how much to copy-paste vs. wire up. */
  statefulness: 'presentational' | 'local-state' | 'requires-integration';
}
```

Additional discoverability fields worth adding beyond the prompt's list:

- **`industryFit?: string[]`** — e.g. `['b2b-saas', 'consumer-marketplace']` for blocks whose design language leans toward a specific industry (ties into §12's industry-specific collections).
- **`figmaUrl?: string`** — if/when a companion design-file exists, so design and code never drift silently out of sync.
- **`a11yNotes?: string`** — short-form pointer into the full accessibility documentation (§10), surfaced directly in Storybook's addon panel rather than requiring a doc-page jump for the common case.
- **`minReactUiVersion?: string`** — since blocks depend on `react-ui` components, a block using a component that shipped in `react-ui@0.4.0` shouldn't silently break a consumer pinned to `0.3.x`.

---

## 9. Storybook Organization

### Story hierarchy

```text
Blocks/
├── Core/
│   └── App Shell
├── Navigation/
│   ├── Headers/
│   │   ├── Marketing Header
│   │   ├── SaaS App Header
│   │   └── ...
│   ├── Footers/
│   └── Sidebars/
├── Layouts/
│   └── ...
├── Marketing/
│   ├── Hero/
│   │   ├── Centered
│   │   ├── Split
│   │   └── Video Background
│   ├── Pricing/
│   └── ...
├── Ecommerce/
│   ├── Product Discovery/
│   ├── Cart/
│   └── Checkout/
└── ... (one top-level group per category from §2)
```

This mirrors the folder structure exactly (`title` in each `.stories.tsx` is derived mechanically from the file's path, not hand-typed per file — see "naming conventions" below) — Storybook's own sidebar becomes a live mirror of §1's folder tree, so there is never a separate "how do I organize Storybook" decision to make per block.

### Folder organization
Storybook config itself lives at the repo root (`.storybook/`, per `AGENTS.md`'s existing note) with **no changes needed** for this package — stories are discovered via the existing `packages/*/src/**/*.stories.tsx` glob, which already covers `react-ui-blocks`. The `.storybook-overrides/` folder in §1 is reserved for viewport presets and MDX templates specific to blocks (see below), not a second Storybook instance.

### Story naming conventions
- `title` = `Blocks/<Category>/<Family>/<Variant>` — mechanically derived, e.g. `marketing/hero/hero-centered.stories.tsx` → `'Blocks/Marketing/Hero/Centered'`.
- Every family with 2+ variants gets a **family-level MDX overview page** (`hero/hero.mdx`, `title: 'Blocks/Marketing/Hero'`) that renders all variants side-by-side for comparison before drilling into any one variant's own story — solves the "hundreds of blocks" navigation problem Tailwind UI's own docs site solves with its category landing pages.
- Default export per variant file follows the existing repo convention (`Meta<typeof HeroCentered>`, `parameters: { layout: 'fullscreen' }` for page-level blocks vs. `'padded'` for card-level ones).

### Variant stories
One `.stories.tsx` per variant file (not one file with a `variant` arg switching entirely different JSX) — matches this repo's existing "file per component" rule; a `variant` control (Storybook `argTypes`) is reserved for props that are genuinely just data/config (a `Hero`'s heading text, a `PricingCards`' tier count), never for swapping structurally different markup, which stays a separate file/component per §5's rule.

### Responsive stories
Every block's default story includes a **Storybook `viewport` parameter set to the block's `responsive` metadata array** (§8) rather than relying on manually resizing the preview — `parameters: { viewport: { defaultViewport: 'mobile1' } }` for mobile-first blocks (Mobile Commerce, bottom sheets), `'responsive'` (the default, resizable) for the rest. A **`chromatic.viewports` array** (see Visual Regression below) additionally captures mobile/tablet/desktop snapshots for every "large" complexity block regardless of its default story viewport.

### Theme stories
A **global Storybook toolbar item** (already the standard pattern for `@storybook/addon-themes` or a custom `globalTypes` toolbar entry) toggles `data-theme`/`.dark` exactly the way this repo's own `ThemeProvider` does — no per-block "dark mode story" needed, since every block should render correctly under the same global toggle. The exception: blocks whose `themeSupport` metadata (§8) is `'unverified'` get an explicit **paired light/dark story** during their audit period, retired once verified and folded back into relying on the global toggle.

### Accessibility stories
`@storybook/addon-a11y` (already installed per `AGENTS.md`) runs on every story automatically — no opt-in needed. Blocks with `accessibilityStatus: 'known-issues'` (§8) get an **explicit story-level comment documenting the specific violation and why it's tracked-not-blocking** (e.g. a third-party embed inside a block that Storybook's axe run can't reach), so the addon panel's failure is never a silent, unexplained red mark.

### Composition stories
Beyond individual blocks, **"Assembled Page" stories** compose a full page out of several blocks (`Blocks/Compositions/Marketing Landing Page`, `Blocks/Compositions/SaaS Dashboard Home`) — these live in a dedicated `Blocks/Compositions/` Storybook group (not nested under any one category), demonstrating real end-to-end usage the way a consumer would actually assemble a page, and doubling as the source for this doc's own "copy this whole page" use case.

### Interactive examples
Every Medium/Large block ships a `play` function (matching this repo's existing convention — every component built so far has one, per `AGENTS.md`'s Storybook row) covering its primary interaction: opening a cart drawer, submitting a sign-in form (mocked), advancing a checkout stepper. Small/presentational blocks are exempt (nothing to interact with).

### Visual regression
Recommend wiring **Chromatic** (or an equivalent, e.g. Percy) keyed off the existing Storybook build — at hundreds-of-blocks scale, manual visual review doesn't scale, and this repo's `play`-function convention already gives Chromatic real interaction states to snapshot, not just static renders. Every "Large" complexity block and every family's default variant get a Chromatic baseline; full variant coverage is a stretch goal, not a Phase 1 requirement (see §13).

### Source code preview
`@storybook/addon-docs`' automatic source panel already shows the story's JSX — the higher-value addition for a *blocks* library specifically is a **"Copy" button surfacing the block's actual `.tsx` source** (not just the story wrapper), since the entire point of a blocks library (unlike a component library) is copy-paste-and-customize, matching shadcn/ui's registry UX. This is a custom Storybook addon/panel, flagged as a Phase 2+ differentiator investment in §12/§13 rather than a Phase 1 requirement.

### Controls (Args)
Every block's props that are genuinely data/config (not structural variant switches — see above) get full `argTypes` control coverage, so a consumer can preview "what if this heading were longer" or "what if there were 6 pricing tiers instead of 3" live, matching the existing convention.

### Autodocs / MDX
`tags: ['autodocs']` on every family's default export generates the baseline docs page; the family-level MDX overview (above) supplements it with the comparison view and the documentation content from §10 (anatomy, responsive behavior, a11y notes, customization guide) that autodocs alone can't express.

---

## 10. Documentation Standards

Every block family's MDX page includes, in this order:

1. **Description** — one paragraph: what it's for, when to reach for it over a sibling variant.
2. **Preview** — live, interactive Storybook canvas embed (via `<Canvas>`/`<Story>` MDX components), not a static screenshot.
3. **Anatomy** — an annotated diagram (can be an SVG or a simple bordered-region overlay on the live preview) naming each region/slot (e.g. a `Hero`'s "eyebrow text / headline / subheadline / CTA group / visual") so customization instructions below can refer to named parts instead of "the second div."
4. **Responsive Behavior** — explicit prose per breakpoint from the `responsive` metadata field: what reflows, what hides, what changes emphasis (e.g. "Mobile Cart Sheet's line-item thumbnails drop from 64px to 40px below `sm`; quantity steppers become full-width tap targets").
5. **Accessibility Notes** — landmark roles used, keyboard interaction map (for anything Medium+), color-contrast confirmation, and — critically — **which `@nebula/headless`/`react-ui` ARIA guarantees this block inherits vs. what it's responsible for itself** (e.g. "Checkout Stepper inherits `Tabs`' roving-tabindex; the block itself is responsible for announcing step-validation errors via `aria-live`, verified in `checkout-stepper.test.tsx`").
6. **Customization Guide** — which CSS variables (per-component tokens, `component-library-architecture.md` §7's 3-layer system) this block's constituent `react-ui` components read, and the two-line override example (matching the existing "Custom theming" pattern in `packages/react-ui/README.md`) — never assume the consumer will grep for it themselves.
7. **Usage Examples** — the copy-paste source (same one surfaced by the Storybook source panel in §9), plus one "integrated" example showing it wired to real data-fetching (a comment showing where an API call would go, not a live call).
8. **Do's & Don'ts** — a short bulleted comparison (e.g. "Do keep pricing tiers to 3-4 — do not exceed what fits without horizontal scroll on tablet"), sourced from real design review feedback once the block ships, not invented speculatively.
9. **Best Practices** — cross-cutting guidance beyond this one block (e.g. a `Hero`'s best-practices section links to the marketing category's overall "keep above-the-fold content to one primary CTA" guidance).
10. **Related Blocks** — mechanically generated from the `relatedBlocks` metadata field (§8), e.g. `Checkout Summary` links to `Cart Summary Panel` and `Order Confirmation Page`.

This is intentionally the same shape `packages/react-ui/README.md`'s "Custom theming" section and `CONTRAST_AUDIT.md` already model for individual components — extended to block-scale with the two block-specific additions (Anatomy, Related Blocks) that don't apply to a single atomic component.

---

## 11. Benchmark

| Ecosystem | Strength | Weakness | Missing categories (vs. §2/§3) | Opportunity for Nebula |
| --- | --- | --- | --- | --- |
| **Tailwind UI** | Very deep marketing/ecommerce/application-shell inventory; excellent visual polish; paid, so quality bar is consistently high | Not a real component library underneath — every block is a one-off copy of raw Tailwind markup, no shared behavior layer, no accessibility guarantees enforced by a lower layer | Weak on AI/chat, weak on documentation-site blocks, no enterprise/admin depth | Nebula's blocks compose real `headless` ARIA-complete behavior underneath — a Tailwind UI dropdown menu is just markup; a Nebula one is `headless`'s `Menu` for free |
| **shadcn/ui (registry)** | Copy-paste-first DX (the CLI-install model), excellent DX precedent for our "Copy" Storybook addon idea (§9) | "Blocks" is a newer, thinner part of shadcn's surface — mostly dashboard/auth examples, not marketing/ecommerce depth; no formal metadata/registry model like §8 | Thin on marketing, ecommerce, portfolio, education | Nebula can out-execute shadcn specifically on *blocks* breadth (§3) while matching its copy-paste DX via the same Storybook source-panel investment |
| **Aceternity UI** | Best-in-class for animated/visual-effect hero and landing sections | Narrow — almost entirely marketing/animation-focused, no dashboard/ecommerce/auth depth at all; accessibility is an afterthought (many effects trap focus or rely on decorative motion with no reduced-motion fallback) | Everything except marketing | Nebula's `Presence` primitive already has a documented `prefers-reduced-motion` safety net (see its own doc comment) — differentiator: "Aceternity-quality visual polish with accessibility guarantees Aceternity doesn't have" |
| **Flowbite** | Very broad category coverage (close to what §2/§3 propose), multi-framework (not React-only) | Breadth over depth — many blocks are minimally-styled and require heavy customization; Tailwind-plugin-based, not composed from a real component library underneath (same criticism as Tailwind UI) | Reasonably complete category-wise; weak specifically on AI/chat and mobile-commerce-specific patterns | Match Flowbite's breadth, beat its depth via the same `headless`-composition advantage |
| **Preline** | Clean, professional dashboard/admin theme quality | jQuery-era interaction patterns ported to Tailwind, no real React component model; discovery/search across its (large) block library is weak | Weak on social, weak on portfolio | Discoverability (§8 metadata + a future registry search) is a clear differentiator opportunity |
| **HyperUI** | Free, huge raw inventory, good for quick reference | Zero framework integration (pure HTML/Tailwind snippets), zero accessibility guarantees, zero interactivity/state | Essentially everything requiring real behavior (forms, dropdowns, steppers) | Low bar to clear — any block with real keyboard/ARIA behavior already beats HyperUI's static snippets |
| **Mantine** | Full component library *and* has an "App Shell"-style layout system with good defaults | Not really a *blocks* library — strong at the `react-ui` layer's job, not this layer's; landing/marketing page blocks are minimal | Marketing, ecommerce, blog, portfolio depth | Reinforces that `react-ui-blocks` is solving a real gap even relative to full-featured component libraries like Mantine |
| **Chakra UI** | Excellent theming/composition primitives (conceptually close to Nebula's own token layers) | Same as Mantine — component library, not a blocks library; official "Pro" blocks are paid and comparatively narrow | Same as Mantine | Same opportunity — token-driven theming (already built, `component-library-architecture.md` §7) is a natural strength to lean on for "blocks that re-theme instantly," which none of the free competitors do well |
| **MUI** | Enterprise/admin template ecosystem (MUI X, dashboard templates) is genuinely strong | Material Design look is hard to de-brand for consumers who don't want that aesthetic; templates are often separately-licensed products, not part of the open component library | Reasonably deep on dashboard/enterprise; weak everywhere else | Enterprise/admin (§3.16) is worth investing in specifically to compete here, since it's MUI's strongest category and everyone else's weakest |

### Summary
No single competitor covers the full breadth in §2/§3 *and* sits on top of a real accessible-behavior layer *and* has a formal discoverability/metadata model. That combination — not any single feature — is Nebula's actual competitive position.

---

## 12. Differentiators

Ranked by leverage (how much existing Nebula infrastructure it reuses vs. requiring new investment):

1. **Real accessibility guarantees, inherited not re-implemented.** Every block's interactive parts (menus, dialogs, steppers, tabs) compose `@nebula/headless` primitives that already have full keyboard/ARIA behavior and passing axe audits — no other blocks library in §11 can make this claim as a *structural* guarantee rather than a per-block best-effort. This should be the headline differentiator in any marketing of the package itself.
2. **Theme-aware blocks by construction.** Every block reads colors through `react-ui`'s component-token layer (`component-library-architecture.md` §7) — re-skinning an entire block library to a brand color is a two-line CSS override (already documented for individual components; §10 extends the same story to blocks). Tailwind UI/Flowbite/HyperUI all require find-and-replace across raw class strings to rebrand.
3. **Copy-and-paste examples with a real source panel** (§9) — matching shadcn's best DX idea, applied across a much broader block inventory than shadcn currently has.
4. **Formal metadata + discoverability model (§8)** — none of the benchmarked competitors have a structured, machine-readable metadata model; this unlocks a future searchable registry site ("show me all Medium-complexity, mobile-responsive, dark-mode-verified ecommerce blocks") that's currently a manual-browsing problem everywhere else.
5. **AI/Chat application layouts** (§3.21) — a category barely served by any 2024-era blocks library (most predate the current wave of AI product UIs); low competitive density, rising real demand.
6. **Accessibility-first motion** — leaning on `Presence`'s already-documented `prefers-reduced-motion` handling as a structural guarantee for every animated block (hero video backgrounds, testimonial carousels, onboarding tour overlays), directly countering Aceternity's biggest weakness.
7. **Industry-specific collections as a discoverability layer, not separate packages** — the `industryFit` metadata field (§8) lets one `ProductGrid` block surface itself to both a generic ecommerce search and a "B2B SaaS" curated collection without duplicating code, something no competitor's flat category model supports.
8. **Responsive presets as first-class metadata, not just "it happens to work."** The `responsive` field (§8) plus mandatory viewport stories (§9) make "is this actually verified on mobile" a queryable fact instead of an assumption — most competitors' mobile support is "we didn't test it but Tailwind's responsive utilities are in there somewhere."
9. **Opinionated best-practice defaults with an explicit escape hatch.** Every block ships with real UX best practices baked into its default args (e.g. `PricingCards` defaults to 3 tiers with the middle one visually emphasized, matching well-established conversion research) rather than a neutral blank slate — while remaining fully overridable via props, unlike a locked-down "opinionated framework" that fights the consumer.
10. **Mobile-first commerce as its own vertical** (§3.17), not an afterthought bolted onto desktop ecommerce blocks via media queries — a real gap even Tailwind UI (arguably the deepest ecommerce blocks library) treats as secondary.

---

## 13. Future Roadmap

Phased by real-world developer demand (landing pages and dashboards are asked for immediately by almost every consumer; enterprise/industry-specific patterns are asked for by a narrower, later-stage audience) and by leverage (what's cheapest to ship well given the existing `react-ui` component inventory today vs. what requires new lower-layer components first — cross-reference the still-substantial `headless`/`react-ui` backlog tracked separately in this project).

### Phase 1 — Essential Blocks (highest demand, lowest dependency risk)
Core (all) · Navigation (Headers, Footers, Sidebars — the "every app needs one" set) · Layouts (all) · Marketing (Hero, Features, Pricing, FAQ, CTA, Testimonials, Logo Cloud) · Authentication (Sign-In, Sign-Up, Forgot/Reset Password) · Forms (Contact, Search) · Data Display (Stat Cards, generic Data Table Block)

*Rationale:* this is the set nearly every consumer needs on day one regardless of vertical, and it's buildable entirely from `react-ui` components that already exist (per `AGENTS.md`'s status table) plus the ones already queued (`Menu`, `Progress`/`Spinner`/`Skeleton` — see this project's own active backlog) — no new lower-layer primitives required beyond what's already planned.

### Phase 2 — Application Blocks (high demand, some new lower-layer dependencies)
Dashboard (Widgets, Charts, Tables, Activity) · Ecommerce (Product Discovery, Product Detail, Cart, Checkout) · SaaS (Onboarding, Billing, Team) · Settings/Account (all) · Blog (all) · Documentation (all)

*Rationale:* second-tier demand (dashboards and storefronts are extremely common but not universal the way a header/footer is), and some blocks here depend on `react-ui`/`headless` components not yet built (a real `DataGrid`/chart-card needs the `Table`/`DataGrid` work still queued at the `react-ui` layer, per the project's own tracked backlog) — sequencing Phase 2 after that lower-layer work lands avoids building blocks on top of components that don't exist yet.

### Phase 3 — Industry-Specific Blocks (moderate demand, differentiator investment)
Social · Portfolio · Events · Real Estate/Listings · Education/LMS · Enterprise (Admin, Audit Log, Permissions) · Legal/Compliance · Communication

*Rationale:' narrower audiences per category, but each is a clear differentiation opportunity per §12 (especially Enterprise, per §11's benchmark showing it as competitors' collective weak point outside MUI). Ship these once Phase 1/2 core patterns are stable enough that industry variants aren't rebuilding shared plumbing.

### Phase 4 — Premium / Advanced Patterns
AI/Chat Applications · Mobile Commerce (as a fully-distinct, mobile-first-designed vertical rather than responsive variants of desktop Ecommerce blocks) · Assembled full-page Compositions (§9) as a documented, first-class deliverable · Chromatic visual-regression coverage across the full inventory · The "Copy" Storybook source-panel addon (§9/§12) · A searchable registry site built on the §8 metadata model

*Rationale:* these either require net-new tooling investment (the source-panel addon, the registry site, Chromatic wiring) or target the newest/most specialized demand (AI product UIs) — correctly sequenced last, as genuine differentiators built once the foundational breadth from Phases 1-3 already makes Nebula credible as a blocks library, not before.

---

## 14. Bundle-Size Plan

No bundle-size measurement or budget exists anywhere in this repo today — confirmed via a full sweep: no `size-limit`/`bundlesize`/`rollup-plugin-visualizer` in any `package.json`, no size-checking step in `.github/workflows/ci.yml`. This section is the plan to close that gap, grounded in real measurements taken against the current `packages/react-ui-blocks` build (all figures unminified ESM, matching this repo's actual `tsup.config.ts` settings for both `react-ui` and `react-ui-blocks` — neither sets `minify: true`).

### Baseline (measured, current build)

`react-ui-blocks` output size **excludes** `@nebula/react-ui`/`@nebula/primitives` (both declared `external` in `tsup.config.ts` — a consumer's bundler resolves them separately):

| Entry | Blocks | Raw | Gzip |
| --- | --- | --- | --- |
| `.` (root barrel) | 7 neutral blocks | 20.2 KB | 4.6 KB |
| `./authentication` | `LoginForm`, `SignupForm` | 7.0 KB | 1.3 KB |
| `./marketing` | `Hero` | 1.9 KB | 0.7 KB |
| `./ecommerce` | `ProductCard` | 1.5 KB | 0.7 KB |
| `./dashboard` | `DashboardOverview` | 1.3 KB | 0.6 KB |

For comparison, `@nebula/react-ui`'s own **root barrel** (all ~100 components) is 215.5 KB raw / 33.8 KB gzip, while a **single subpath** (`@nebula/react-ui/button`) is 8.5 KB raw / 1.6 KB gzip — a >25x difference.

### Finding 1 (highest impact): blocks import `@nebula/react-ui`'s root barrel, not per-component subpaths

Every block does `import { Button, Card, ... } from '@nebula/react-ui'` rather than `from '@nebula/react-ui/button'`, `'@nebula/react-ui/card'`, etc. `react-ui`'s `package.json` already declares `"sideEffects": ["*.css"]`, so a sufficiently capable bundler (Vite/esbuild/Rollup, Webpack 5+) *can* tree-shake a barrel import down to only the named exports actually used — but that's relying on the consumer's bundler doing full cross-module dead-code elimination correctly, which isn't guaranteed in every setup (older Webpack 4/CRA configs, some Metro/React Native pipelines). Switching every block's `@nebula/react-ui` import to its specific subpath(s) guarantees minimal bundle impact regardless of consumer tooling — the same subpath-export philosophy this package already applies to itself, just threaded one layer down into how it consumes its own dependency. **Applied this session** across all 13 block source files (test/story files intentionally left importing from the root barrel — they're excluded from `dist` via `tsconfig.build.json`, so they don't affect a consumer's bundle at all).

**Load-bearing caveat found while applying this — since fixed structurally**: `react-ui`'s `tsup.config.ts` had `splitting: false`, so every subpath entry was bundled *independently* — no shared chunk. Any component pair built on React Context (`ThemeProvider`/`useTheme`, but also `multi-select`/`carousel`/`sortable`/`data-table` — every component in `react-ui` with its own `React.createContext()` call, confirmed via a full-package grep) had this same latent bug: since the root barrel does `export * from './X'` for every subpath, each of those five components was reachable from *two* separate public entry points (its own subpath and the root barrel), and mixing which entry point a `Provider` vs. its consuming hook came from produced two distinct context instances — a real "must be used within Provider" runtime failure despite a clean typecheck. Hit this exact bug converting `ThemeSwitcher`, worked around it by convention (keeping every call site on `@nebula/react-ui/theme-provider`) — then fixed it structurally by flipping `react-ui`'s `tsup.config.ts` to `splitting: true` (see that file's own comment), matching the precedent `packages/headless/tsup.config.ts` already set for its own, differently-shaped version of this exact bug class (cross-folder relative imports rather than root-barrel re-exports). Verified: `dist/index.js` and `dist/theme-provider/index.js` now both import from the same shared chunk file; a regression test (`theme-provider/theme-provider.test.tsx`) imports `ThemeProvider`/`useTheme` from the two different entry points via package specifier against the built `dist/` output and passes; full monorepo build/typecheck/lint/test all clean.

### Finding 2: tree-shaking infrastructure at the `react-ui-blocks` layer is already correct

- `"sideEffects": false` in `react-ui-blocks/package.json` ✓
- Per-vertical subpath exports mean importing one vertical never pulls in another — confirmed by the baseline table above (each vertical subpath is independently small).
- `tsup.config.ts`'s `treeshake: true` + `splitting: false` (one file per entry, no shared-chunk fragmentation a consumer's bundler has to resolve) is the right call at this package's current size.

### Finding 3: no minification — correct as-is, not a gap

Shipping unminified, readable ESM and letting the *consumer's* bundler minify once in their final app build (with full knowledge of what's actually reachable) is standard library best practice — double-minifying wastes build time for zero runtime benefit and can hurt some bundlers' own dead-code elimination. No change recommended here.

### Recommendation: `size-limit` CI budget

Add `@size-limit/preset-small-lib` at the repo root with one budget entry per `react-ui-blocks` subpath, sized off the baseline gzip figures above plus ~25% headroom (root barrel 6 KB, `./authentication` 2 KB, `./marketing`/`./ecommerce`/`./dashboard` 1 KB each), wired into `.github/workflows/ci.yml` as a new job — so a regression (e.g. an accidental root-barrel import creeping into a block) fails CI instead of surfacing only after publish.

### Priority order

1. **`size-limit` CI tooling** — cheap to add, and makes every subsequent change to this section measured rather than assumed.
2. **Switch blocks' `@nebula/react-ui` imports to per-component subpaths** (Finding 1) — mechanical, guarantees the tree-shaking story independent of consumer bundler.
3. Re-baseline and set final CI budgets once both land.

---

## Appendix — Summary Decision Log

| Decision | Rationale (short) |
| --- | --- |
| Keep one package, use subpath exports for verticals | Avoids fragmenting version/tooling across N packages; reconciles "domain-neutral core" with "comprehensive vertical coverage" (§0) |
| Cap folder depth at 3 (`category/family/file`) | Matches this repo's existing "cap complexity" instinct (file-per-component, one layer of scoping); deeper nesting measurably hurts navigability at scale |
| Variants are files within a family folder, not sibling folders | Mirrors the existing file-per-component convention one level up |
| Domain-prefix component names only when ambiguous | Keeps names short inside their own scoped import context; avoids `EcommerceEcommerceProductGrid`-style redundancy |
| Formal metadata object per block, not just JSDoc | Makes discoverability/search/registry tooling possible later without a rewrite |
| Storybook hierarchy mirrors folder structure exactly | Zero separate "how do we organize Storybook" decision as the inventory grows |
| Enterprise/Admin prioritized in Phase 3 over some other verticals | Explicitly identified in the benchmark (§11) as the clearest competitive gap outside of MUI |
| AI/Chat and full registry tooling deferred to Phase 4 | Correctly weighted as genuine differentiators that need the foundational breadth in place first, not corners cut |
