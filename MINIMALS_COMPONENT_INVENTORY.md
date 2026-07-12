# Minimals.cc dashboard — component inventory & build plan

Live audit of `https://minimals.cc/dashboard` (Minimal UI's demo admin theme, the source of this project's "Minimals-inspired" design charter — see `DESIGN_REFERENCE.md`), cross-referenced against `BLOCKS_ARCHITECTURE.md`'s existing category/family taxonomy. Written to answer directly: *what does this theme actually contain, what does Nebula already have, and what's left to build.*

Method: navigated every top-level sidebar route live (not from memory/training data) and recorded the real component composition of each page. Colors/copy/illustrations are Minimals' own and are **not** replicated — per `DESIGN_REFERENCE.md`, Nebula's own `--color-*` tokens are locked and every block below gets built against them, not Minimals' green/black palette.

## 1. Site map

Sidebar has two sections:

**Overview** — App, Ecommerce, Analytics, Banking, Booking, File, Course (7 dashboard "home" pages, one widget composition each).

**Management** — User, Product, Order, Invoice, Blog, Job, Tour, File manager, Mail, Chat, Calendar, Kanban (12 sections; most of User/Product/Order/Invoice/Blog/Job/Tour expand into List/Details/Create/Edit/Profile/Cards sub-routes — the same CRUD shell repeated per entity).

## 2. Per-page component audit

### 2.1 App (default home)
Welcome banner (illustration + CTA) · promo carousel card · 4 stat cards (icon + number + trend chip) · donut chart card (current visits) · bar chart card (website visits, 2-series legend) · progress-list card (conversion rates) · "current subject" radar chart · traffic-by-site icon list · tasks widget.

### 2.2 Ecommerce
Welcome banner ("Congratulations", illustration) · promo carousel · 3 stat cards **with inline sparkline** (not just a trend chip — a full mini line chart per card) · donut chart ("sale by gender") · combined area+line chart with legend + year dropdown ("yearly sales") · progress-bar breakdown card ("sales overview": profit/income/expenses each with a labeled bar) · balance/quick-action card (balance + 3 line-item stats + two CTA buttons) · ranked mini-table ("best salesman": avatar + name + product + country + amount + rank badge) · ranked list-with-thumbnail ("latest products": image + name + price + trend badge).

### 2.3 Analytics
Same welcome banner + 4 stat cards pattern as App · donut chart (current visits) · **grouped bar chart, 2 series side-by-side per category** (website visits, Team A vs Team B) · progress-list card (conversion rates) · language/subject breakdown list.

### 2.4 Banking
Balance summary card + 3 action buttons (Send/Add card/Request) · income/expense mini-stat pair (icon + amount + trend chip) · line chart (balance over time) · **credit-card visual** (gradient card face, masked number, holder/expiry, carousel dots) · quick-transfer panel (avatar carousel + amount input + slider + balance + CTA) · progress-list card (balance statistics, 3 series) · grouped bar chart · contacts list (avatar + name, "View all").

### 2.5 Booking
3 stat cards with illustration icon (not a generic icon — a small character illustration per card) · dark "total incomes" card with embedded sparkline · booked-status breakdown (3 labeled progress bars: pending/canceled/sold) · 2 donut-style circular-progress stats side by side · "tours available" large donut with center label + legend · bar chart (booked vs canceled) · customer reviews list (avatar + name + timestamp + star rating + review text, paginated/carousel).

### 2.6 File
3 cloud-provider cards (icon + name + progress bar + usage) · stacked/grouped bar chart ("data activity", 4 series, year dropdown) · upload dropzone card (dashed border, icon, click target) · large arc/gauge chart (% used, center label) · storage-by-type breakdown list (icon + label + file count + size) · "folders" card grid (icon + name + size + file count + trend badge) · "recent files" list (thumbnail/icon + name + size + date + trend badge) · upsell banner ("upgrade your plan").

### 2.7 Course
Greeting header (no banner graphic, just text) · 3 icon-stat cards · line chart ("hours spent", year dropdown) · donut chart ("course progress": to-start/in-progress/completed) · "continue course" list (thumbnail + title + lesson-count + progress bar) · "featured course" card grid (duration + rating + title + price + Join CTA) · right-rail profile card (avatar + name + ID) · radar chart ("strength", 6 axes) · "reminders" list (title + date + progress bar).

### 2.8 Generic List page (User/Product/Order/Invoice/Blog/Job/Tour all share this shell)
Page header (title + breadcrumb + primary "Add X" button) · **status-tab bar** (All/Active/Pending/... each with a live count badge, underline-active) · filter toolbar (1-2 select dropdowns + search input + overflow "⋮" menu, or for Product: Columns/Filters/Export/Settings buttons) · data table (checkbox column, sortable column headers, avatar+name+subtext cell, badge-status cell, per-row "⋮" action menu) · pagination footer (rows-per-page select + "1–5 of 20" + prev/next).
Invoice's List additionally has a **stat-icon summary row** above the table (circular icon + label + count + $ amount, one per status).

### 2.9 Kanban
Fixed-column toggle · columns (count badge + title + add/menu/drag-handle icons) · draggable cards (optional cover image, title, priority-flag icon, comment-count, attachment-count, assignee avatar stack).

### 2.10 Mail
3-pane layout: folder nav (icon + label + unread count, All/Inbox/Sent/Drafts/Trash/Spam/Important/Starred/Social/Promotions/Forums) + "Compose" button · message list (avatar + sender + snippet + relative time, search bar) · message detail (subject + reply/forward/reply-all icons + sender/recipients + body + rich-text reply composer with formatting toolbar).

### 2.11 Chat
Contact list (avatar + presence dot + name + last-message snippet + relative time + unread dot, search, collapse toggle) · empty conversation state (illustration + prompt) · recipient picker ("To: +Recipients") · message composer (emoji/image/attachment/voice icons).

### 2.12 Calendar
View-switcher (month/week/day/agenda icons) · month/prev/next/"Today" nav · filter icon · month grid with color-coded, time-labeled event chips · "Add event" button (opens a create/edit event form, not audited in depth — standard title/date-range/color/guests/location fields per Minimals' known shape).

## 3. Cross-reference against `BLOCKS_ARCHITECTURE.md`

| Minimals pattern | Existing taxonomy slot | Status in this repo |
| --- | --- | --- |
| Stat card (icon/trend/sparkline) | §3.8 Dashboard → Widgets → *Stat Card*, *Metric Card with Sparkline* | `DashboardOverview` covers the plain stat-grid case; **sparkline variant doesn't exist yet** |
| Donut/bar/line/area chart card | §3.8 Dashboard → Charts | `ChartCard` covers bar + donut; **line/area/radar/gauge variants don't exist yet** |
| Welcome banner | (bespoke, not in taxonomy — closest: §3.6 Marketing Hero — Minimal) | `WelcomeBanner` exists |
| Progress-list / breakdown card | §3.5 Data Display (no exact family named) | **new** |
| Balance / quick-action card | §3.10 SaaS → Billing → *Billing Summary Panel* | **new** |
| Ranked mini-table, list-with-thumbnail | §3.5 Data Display → *Comparison Table*; §3.8 Dashboard → Activity | **new** |
| Credit-card visual | (bespoke, not in taxonomy) | **new** |
| Generic List page (tabs + filter toolbar + table + pagination) | §3.5 Data Display → *Generic Data Table Block*; §5 Table Block variant set | `FilterBar` (chip row) exists; **the actual table-with-toolbar block doesn't exist yet — highest-leverage gap, reused by ~7 Minimals pages** |
| Stat-icon summary row (Invoice) | §3.5 Data Display → *Stat Cards Row* | **new** |
| Reviews list (avatar+rating+text) | §3.12 Blog → *Comment Section* (closest analog) | **new** |
| Cloud-provider / storage cards | (bespoke) | **new** |
| Upload dropzone | (bespoke; distinct from `FileUpload` primitive-layer input) | **new (block-level wrapper)** |
| Kanban board | **not in taxonomy** — genuinely out of scope for a "blocks library" (owns real drag-and-drop state, not a presentational composition) | out of scope for now |
| Mail 3-pane client | §3.19 Communication → *Inbox Layout (list + thread)*, classified **Large** in §4 | out of scope for now (real app shell, not a block) |
| Chat window | §3.19 Communication → *Chat Window*, §3.21 AI/Chat, classified **Medium/Large** | `NotificationCenter` is the closest existing analog; **full chat window not built** |
| Calendar | **not in taxonomy** | out of scope for now |

## 4. What "build all of it" actually means

Everything with a ✗ below needs the *entity CRUD shell* (List + Details + Create + Edit), which — per §5's own "Table Block" variant note — is one generic table block reused with a different column schema per entity, not 7×4 bespoke pages. Realistic unit of work is therefore **blocks**, not **pages**:

| Phase | Blocks | Unlocks |
| --- | --- | --- |
| **1 — Data Display primitives** | `StatCardsRow` (icon/trend, + sparkline variant), `DataTable` (toolbar: tabs+filters+search, sortable columns, row actions, pagination — the §3.5 "Generic Data Table Block") | User/Product/Order/Invoice/Blog/Job/Tour List pages all become one afternoon of column-schema wiring each, not new components |
| **2 — Chart variants** | `ChartCard` line + area + radar + gauge types (extends the existing discriminated union) | Course/Booking/File/Banking home pages |
| **3 — Billing/finance widgets** | `BalanceCard` (quick-action panel), `BillingSummaryCard` (progress-list breakdown), stat-icon summary row | Banking, Ecommerce, Invoice homes |
| **4 — Ranked/activity lists** | `RankedList` (mini-table with rank badges), `ThumbnailList` (item + trend), `ReviewsList` | Ecommerce, Booking, Course homes |
| **5 — Flagship pages** | Compose Phase 1-4 into `Blocks/Compositions` stories: Analytics Overview, Banking Home, User List, Invoice List (matching the exact pages you screenshotted) | Visual parity with the screenshots |
| **6 — Chat window (Medium)** | `ChatWindow` per §3.19 — contact list + message thread + composer, no real-time backend | Closest remaining gap to a full "app" page |
| **Out of scope** | Kanban, Calendar, Mail 3-pane, File manager grid | Genuine mini-apps (drag-and-drop state, date math, message threading) — not blocks-library material; flag if you want these as a separate, dedicated effort later |

Starting Phase 1 now: `StatCardsRow` and `DataTable` are the two highest-leverage blocks — nearly everything else in Phases 2-5 either composes them or sits beside them.
