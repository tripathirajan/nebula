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

### 2.13 User Profile (`/user` — social-profile variant)
Cover-image banner + overlapping circular avatar + name/role · tab nav (Profile/Followers/Friends/Gallery) · follower/following stat pair · "About" card (bio, location, email, job, education, social links) · post composer (textarea + image/streaming attach buttons + Post button) · post feed (author + date + text + optional image + like-count + top-comments preview) — the full §3.13 Social pattern set (Feed, Post Composer, Profile Header, Profile Tabs).

### 2.14 User Cards (`/user/cards`)
Grid of team-member cards: gray cover placeholder + overlapping avatar + name/role + row of 4 social-platform icon links + follower/following/total-post stat triple. Matches §3.10 Team → *Team Member List* card variant.

### 2.15 User Create/Edit (`/user/new`, `/user/{id}/edit`)
Two-column form: left card (circular avatar-upload dropzone + helper text + "Email verified" toggle, Edit mode adds a "Banned"/"Delete user" danger action) · right card (2-column field grid: name/email/phone-with-country-flag-prefix/country-select/state/city/address/zip/company/role) + primary submit button. Matches §3.14 *Account Profile Form* generalized to any entity.

### 2.16 Product Details (`/product/{id}`)
Back link + status-dropdown + edit-pencil actions · image gallery (thumbnail strip + main image + counter + prev/next) · info panel (status badge, title, star-rating + review count, price with strikethrough original, description, color swatches, size select + "Size chart" link, quantity stepper, availability text) · action row (Add to cart / Buy now / Compare / Favorite / Share) · 3 trust-badge features (icon + title + description) · tabs (Description/Reviews/Specifications) · specs key-value table · rich description with sub-headings. Exactly §3.7 Product Detail's full family list (Gallery, Info Panel, Size/Variant Selector, Reviews Section).

### 2.17 Product Create/Edit (`/product/new`, `/product/{id}/edit`)
Long-form, **collapsible-section** editor, each section its own `Card`: **Details** (name, sub-description, full rich-text editor with formatting toolbar, image dropzone) · **Properties** (code, SKU, quantity, category select, color picker, size multi-select, tags input, gender radio group, sale/new label toggles) · **Pricing** (regular price + currency prefix, sale price, "price includes taxes" toggle, tax %) · **Publish** action. The richest form pattern in the whole product — effectively a multi-section wizard-without-steps.

### 2.18 Order Details (`/order/{id}`)
Status-dropdown + Print + Edit actions · "Details" card (line items + subtotal/shipping/discount/taxes/total breakdown, each row editable via pencil icon) · "History" card (**order-status timeline**: placed → payment → delivery → completion, "Show more" to expand) · right rail: "Customer" card (avatar + IP + "Add to blacklist" action), "Delivery" card (ship-by/carrier/tracking#), "Shipping" card (address/phone), "Payment" card. Matches §3.7 exactly (Order Detail Page, Order Tracking Timeline).

### 2.19 Blog List (`/post`) & Post Detail (`/post/{slug}`)
List is a **card grid**, not a table (genuinely different shell from §2.8): search + "Sort by" dropdown + status tabs (All/Published/Draft) · cards (status badge + date + author avatar, title, excerpt, comment/view/share counts + overflow menu, cover image). Detail page: full-bleed hero image with title overlaid, floating share FAB, status-dropdown + edit actions. Matches §3.12 Blog exactly (Post Listing Grid, Featured Post Hero, Post Detail Layout).

### 2.20 Job List (`/job`)
Card grid: company-logo tile + overflow menu, title, "Posted date" + candidate-count, 4 icon+label meta rows (experience level, employment type, salary, seniority/role) · search + Filters + "Sort by" toolbar. Not explicitly named in the taxonomy — closest analog is §3.23 Real Estate's *Listing Card*, generalized.

### 2.21 Tour List (`/tour`)
Card grid: **mosaic gallery** (1 large + 2 stacked thumbnails) with an overlaid price badge (strikethrough original + sale price) and a star-rating badge · below: location pin + row, date-range, "N Booked" count, overflow menu · search + Filters + "Sort by" toolbar. Another *Listing Card* variant — same family as Job, different meta fields.

### 2.22 File manager (`/file-manager`, distinct from the §2.6 "File" dashboard widget page)
Toolbar: "Upload" button + date-range filter + type filter · sortable table (Name — with folder/file-type icon, Size, Type, Modified, **Shared** — overlapping avatar stack with a "+N" overflow count) · pagination footer with the exact pattern needed everywhere else in this audit: **"Rows per page: [10 ▾] · 1–10 of 30 · [Dense toggle]"**.

### 2.23 Account settings (`/user/account`)
Tab bar: General / Billing / Notifications / Social links / Security.
- **General**: same left-card/right-form-grid shell as §2.15's user edit (avatar upload, "Public profile" toggle, "Delete user" danger button; name/email/phone/address/country/state/city/zip/about fields).
- **Billing**: 3-tier plan-selector card row (icon + name + price + "Current" badge) + billing-details list (name/address/phone/payment-method, each with an edit chevron) + Cancel/Upgrade actions · right rail "Invoice history" list (invoice# + date + amount + PDF link, "Show more") · "Payment method" card list (card-network icon + masked number + "Default" badge + overflow menu, "Add card"). Matches §3.10 Billing exactly (Plan Comparison Cards, Payment Method Manager).
- **Security**: old/new/confirm-password fields with show/hide toggles + helper text + Save button.

### 2.24 Kanban task detail (click any card → slide-over drawer)
Status-dropdown + like/delete/overflow actions · tabs (Overview/Subtasks/Comments, with live comment count) · reporter + assignee avatars (assignee has an inline "+" add-more control) · labels chip · due-date range · priority segmented control (Low/Medium/High, each with its own icon) · description textarea · attachments grid (thumbnail + remove-× per item) + upload dropzone tile. A genuinely rich "task detail panel" — the deepest single component in the whole audit.

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
| Kanban board + task detail drawer | **not in taxonomy** — genuinely out of scope for a "blocks library" (owns real drag-and-drop state, not a presentational composition) | out of scope for now |
| Mail 3-pane client | §3.19 Communication → *Inbox Layout (list + thread)*, classified **Large** in §4 | out of scope for now (real app shell, not a block) |
| Chat window | §3.19 Communication → *Chat Window*, §3.21 AI/Chat, classified **Medium/Large** | `NotificationCenter` is the closest existing analog; **full chat window not built** |
| Calendar | **not in taxonomy** | out of scope for now |
| Profile header + tabs + feed (§2.13) | §3.13 Social → *Profile Header*, *Profile Tabs*, *Feed*, *Post Composer* | **new** |
| Team member card grid (§2.14) | §3.10 Team → *Team Member List* | **new** |
| Entity create/edit form shell (§2.15) | §3.14 Settings → *Account Profile Form*, generalized | **new — reused by User/Account edit, and the shell (not fields) by every other entity's edit page** |
| Product gallery + info panel (§2.16) | §3.7 Product Detail (full family) | **new** |
| Collapsible multi-section entity editor (§2.17) | §3.7 Product Detail (implied, not separately named) | **new — the richest form pattern audited; needed for Product, and by extension Blog Post editor** |
| Order detail + status timeline (§2.18) | §3.7 Order → *Order Detail Page*, *Order Tracking Timeline* | **new** |
| Post listing grid + detail hero (§2.19) | §3.12 Blog (full family) | **new** |
| Listing card (Job/Tour variants, §2.20-2.21) | §3.23 Real Estate → *Listing Card*, generalized | **new** |
| File manager table + "Shared" avatar stack (§2.22) | §3.5 Data Display (same table-with-toolbar family as §2.8, different columns) | covered by the Phase 1 `DataTable` block once built |
| Plan-selector cards + payment method list (§2.23 Billing) | §3.10 Billing (full family) | **new** |
| Danger-zone / password-change panel (§2.23 Security) | §3.14 Settings → *Security Settings Panel*, *Danger Zone* | **new (small)** |

## 4. What "build all of it" actually means

Everything marked **new** above needs the *entity CRUD shell* (List + Details + Create + Edit), which — per §5's own "Table Block" variant note — is one generic table/form block reused with a different column/field schema per entity, not 7×4 bespoke pages. Realistic unit of work is therefore **blocks**, not **pages**:

| Phase | Blocks | Unlocks |
| --- | --- | --- |
| **1 — Data Display primitives** | `StatCardsRow` (icon/trend, + sparkline variant), `DataTableBlock` (toolbar: tabs+filters+search, sortable columns, row actions, pagination — the §3.5 "Generic Data Table Block") | User/Product/Order/Invoice/Blog(if table)/Job/Tour/File-manager List pages all become column-schema wiring, not new components |
| **2 — Chart variants** | `ChartCard` line + area + radar + gauge types (extends the existing discriminated union) | Course/Booking/File/Banking home pages |
| **3 — Billing/finance widgets** | `BalanceCard` (quick-action panel), `BillingSummaryCard` (progress-list breakdown), stat-icon summary row, `PlanCards` + `PaymentMethodList` | Banking, Ecommerce, Invoice homes, Account → Billing tab |
| **4 — Ranked/activity lists** | `RankedList` (mini-table with rank badges), `ThumbnailList` (item + trend), `ReviewsList` | Ecommerce, Booking, Course homes |
| **5 — Entity forms & detail pages** | `EntityFormLayout` (avatar-card + field-grid shell from §2.15), collapsible multi-section editor (§2.17), `ProductGallery`+`ProductInfoPanel` (§2.16), `OrderDetail`+`OrderTimeline` (§2.18), listing cards (§2.20-2.21) | Every entity's Create/Edit/Details page, Job/Tour lists |
| **6 — Social/content pages** | Profile header+tabs+feed (§2.13), team-member card grid (§2.14), post listing grid + post detail hero (§2.19) | User Profile/Cards, Blog |
| **7 — Flagship compositions** | Compose Phases 1-6 into `Blocks/Compositions` stories: Analytics Overview, Banking Home, User List, Invoice List, Product Details (matching the exact pages you screenshotted) | Visual parity with the screenshots |
| **8 — Chat window (Medium)** | `ChatWindow` per §3.19 — contact list + message thread + composer, no real-time backend | Closest remaining gap to a full "app" page |
| **Out of scope** | Kanban (board + drag-drop + task drawer), Calendar, Mail 3-pane | Genuine mini-apps (drag-and-drop state, date math, message threading) — not blocks-library material; flag if you want these as a separate, dedicated effort later |

Starting Phase 1 now: `StatCardsRow` and `DataTableBlock` are the two highest-leverage blocks — reused directly or as a pattern by nearly everything in Phases 2-7.
