# Implementation Task: Build `@nebula/react-ui-blocks`

You are acting as a senior UI library developer with experience building large-scale design systems such as Tailwind UI, shadcn/ui, Mantine, Chakra UI, MUI, Ant Design, Ark UI, and React Aria.

## Context

The Nebula UI ecosystem is built on this package architecture:

```text
@nebula/primitives
    ↓
@nebula/styleless & @nebula/headless
    ↓
@nebula/react-ui
    ↓
@nebula/react-ui-blocks
```

`@nebula/react-ui-blocks` is the package that composes `@nebula/react-ui` components into ready-to-use page sections, pages, and interface patterns.

This task is implementation-first: add real UI block components, Storybook stories, and tests.

---

## What to Build

Implement a scalable block library inside `packages/react-ui-blocks` that includes:

- A clear folder structure for block categories
- Reusable block components built from `@nebula/react-ui`
- Responsive Tailwind-based layouts
- Attractive, production-ready visuals
- Storybook stories for each block
- Tests covering rendering and basic accessibility

Use existing `@nebula/react-ui` components whenever possible.

If a needed component is missing, add it in the appropriate package layer first:

- `@nebula/primitives` for low-level DOM abstractions
- `@nebula/headless` for behavior/ARIA patterns
- `@nebula/styleless` for unstyled reusable UI shells
- `@nebula/react-ui` for styled components

Then use that component inside `@nebula/react-ui-blocks`.

---

## Block Scope

Build actual example blocks in these categories first:

- Marketing
- Dashboard
- Authentication
- Ecommerce
- Navigation
- Layouts

Each block should be:

- Responsive across mobile, tablet, and desktop
- Theme-aware where possible (light/dark)
- Built from reusable UI components, not raw HTML
- Simple to customize via props

---

## Implementation Requirements

For each block you add, include:

- `src/blocks/<category>/<BlockName>/<BlockName>.tsx`
- `src/blocks/<category>/<BlockName>/index.ts`
- `src/blocks/<category>/<BlockName>/<BlockName>.stories.tsx`
- `src/blocks/<category>/<BlockName>/<BlockName>.test.tsx`

Use a one-component-per-folder convention.

Write Storybook stories that demonstrate:

- Block default appearance
- Responsive breakpoints
- Variant examples if applicable
- Light/Dark theme preview

Write tests that verify:

- The component renders without crashing
- Key text and structure exist
- Basic accessibility attributes are present

---

## Example Blocks to Implement

Start by delivering at least one complete block in each category:

- Marketing: `MarketingHero`
- Dashboard: `DashboardOverview`
- Authentication: `AuthCard`
- Ecommerce: `ProductFeature`
- Navigation: `AppHeader`
- Layouts: `PageSection`

Each block should use `@nebula/react-ui` components such as `Button`, `Card`, `Heading`, `Text`, `Badge`, `Input`, etc.

If a styled wrapper or UI component is missing in `@nebula/react-ui`, add it there before using it.

---

## Folder Structure

Create a scalable block folder structure such as:

```text
packages/react-ui-blocks/src/blocks/
  marketing/
  dashboard/
  authentication/
  ecommerce/
  navigation/
  layouts/
```

This structure should support hundreds of blocks and keep related patterns grouped by category.

---

## Storybook & Tests

Integrate each block into Storybook and include dedicated stories.

Add tests using Vitest and React Testing Library for every block implemented.

If Storybook or testing support is not already configured in `packages/react-ui-blocks`, add the minimal files required to make stories and tests work.

---

## Output Requirements

- Use **Markdown only** for this prompt file.
- Focus on implementation code, not architecture research.
- Add real components, stories, and tests.
- Reuse `@nebula/react-ui` components.
- Add missing UI components in the correct package layer when needed.
- Build attractive, responsive block designs.

---

## Implementation Checklist

- [ ] Add block folder structure under `packages/react-ui-blocks/src/blocks`
- [ ] Implement at least one block in each target category
- [ ] Add Storybook stories for each block
- [ ] Add tests for each block
- [ ] Add any missing UI components in `@nebula/react-ui` or lower layers
- [ ] Ensure all new code is TypeScript and uses existing Nebula conventions
- [ ] Keep the package layer dependency direction correct

# Deliverable 7 — Naming Convention

Recommend naming conventions for blocks.

Examples:

- MarketingHeader
- DashboardHeader
- EcommerceHeader
- ProductGrid
- ProductCarousel
- CheckoutSummary
- ProfileSidebar
- StatisticsCards

Avoid ambiguous names.

---

# Deliverable 8 — Metadata Model

Design a metadata model for every block.

Include recommendations such as:

- Name
- Category
- Subcategory
- Variant
- Complexity
- Responsive
- Theme Support
- Accessibility Status
- Dependencies
- Tags
- Preview Image
- Description
- Keywords

Recommend any additional metadata that improves discoverability.

---

# Deliverable 9 — Storybook Organization

Recommend how Storybook should be organized.

Include:

- Story hierarchy
- Folder organization
- Story naming conventions
- Variant stories
- Responsive stories
- Theme stories
- Accessibility stories
- Composition stories
- Interactive examples
- Best practices

Recommendations should scale to hundreds of blocks.

---

# Deliverable 10 — Documentation Standards

Recommend how every block should be documented.

Each block should include:

- Description
- Preview
- Anatomy
- Responsive Behavior
- Accessibility Notes
- Customization Guide
- Usage Examples
- Do's & Don'ts
- Best Practices
- Related Blocks

---

# Deliverable 11 — Benchmark

Benchmark the proposed architecture against existing ecosystems.

Compare with:

- Tailwind UI
- shadcn/ui
- Aceternity UI
- Flowbite
- Preline
- HyperUI
- Mantine
- Chakra UI
- MUI

Identify:

- Strengths
- Weaknesses
- Missing Categories
- Opportunities

---

# Deliverable 12 — Differentiators

Recommend features that would make `@nebula/react-ui-blocks` unique.

Examples:

- Industry-specific block collections
- AI application layouts
- Mobile-first commerce patterns
- Enterprise dashboard widgets
- Theme-aware blocks
- Responsive presets
- Accessibility-first layouts
- Copy-and-paste examples
- Opinionated best-practice implementations

Focus on ideas that existing UI libraries do not commonly provide.

---

# Deliverable 13 — Future Roadmap

Recommend a phased roadmap.

Example:

- Phase 1 — Essential Blocks
- Phase 2 — Application Blocks
- Phase 3 — Industry-specific Blocks
- Phase 4 — Premium/Advanced Patterns

Prioritize blocks based on real-world developer demand.

---

# Output Requirements

- Use **Markdown only**.
- Generate implementation code.
- Storybook component
- tests
- Reuse react-ui to build the responsive and attractive ui blocks
- If any ui component is missing then first add it in either primitive/headless/styleless/react-ui based on need. then add in ui blocks
