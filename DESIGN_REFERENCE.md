# Project Nebula — Minimals UI/UX Design Reference

## Objective

Use the **Minimals Dashboard** as the primary **UI/UX reference and inspiration** for Project Nebula.

This is **not** a request to clone, copy, or recreate Minimals. Instead, use it as a benchmark for the overall user experience, interaction patterns, spacing, visual hierarchy, and design quality while implementing Nebula's own design system and architecture.

---

# Core Principles

Project Nebula has its own:

- Component Architecture
- Package Structure
- APIs
- Accessibility Standards
- **Color Scheme** (must be preserved)

The existing Nebula color palette is the source of truth and **must never be replaced**.

For all other design tokens, you are encouraged to design, refine, or introduce new values where appropriate, provided they align with Nebula's design philosophy and the visual quality inspired by Minimals.

This includes, but is not limited to:

- Typography
- Spacing
- Border Radius
- Elevation & Shadows
- Motion & Animations
- Border Styles
- Opacity
- Blur
- Icon Sizes
- Z-Index Scale
- Layout Constraints
- Transition Timing
- Component Density
- State Tokens (hover, active, disabled, focus)

The goal is to create a cohesive, scalable design system that feels modern, premium, and consistent while preserving Nebula's brand identity through its existing color scheme.

---

# Design Philosophy

Whenever implementing a page, layout, or component, follow the same level of design quality found in Minimals.

Focus on:

- Clean and modern interface
- Excellent whitespace
- Consistent spacing rhythm
- Strong visual hierarchy
- Balanced layouts
- Professional enterprise appearance
- Minimal visual noise
- Excellent readability
- Soft elevations
- Elegant borders
- Smooth interactions
- Responsive layouts
- Accessible keyboard navigation
- Mobile-first responsiveness

Every screen should feel polished, premium, and production-ready.

---

# Layout Guidelines

Use Minimals as inspiration for:

- Dashboard layouts
- Settings pages
- Authentication pages
- CRM layouts
- Analytics layouts
- Ecommerce layouts
- User profile layouts
- Forms
- Tables
- Detail pages
- Empty states
- Error pages
- Loading states

Preserve Nebula's own layout APIs and architecture.

---

# Component Inspiration

Use Minimals as the benchmark for the overall appearance, interaction quality, and usability of:

- Buttons
- Cards
- Inputs
- Selects
- Tables
- Sidebars
- Navigation
- Drawers
- Dialogs
- Popovers
- Tooltips
- Menus
- Breadcrumbs
- Tabs
- Accordions
- Pagination
- Charts
- Data Visualization
- Notifications
- Search
- Command Palette
- User Menus
- Profile Cards
- Statistic Cards
- Activity Feeds
- Dashboard Widgets

Do **not** copy component implementations.
If component already exists then use existing to apply the design.
Implement every component using Nebula's architecture, APIs, and design principles.

---

# Visual Language

Aim for:

- Comfortable spacing
- Rounded yet professional corners
- Clean typography
- Balanced padding
- Consistent icon sizing
- Soft shadows
- Subtle borders
- Elegant hover effects
- Smooth transitions
- Clear focus states
- High information density without visual clutter

Avoid unnecessary decoration.

The interface should feel lightweight, refined, and effortless.

---

# UX Expectations

Always optimize for:

- Fast visual scanning
- Low cognitive load
- Predictable interactions
- Clear call-to-actions
- Excellent accessibility
- Logical grouping
- Progressive disclosure
- Responsive behavior
- Consistent interaction patterns

Every interaction should feel intentional.

---

# Nebula Architecture Rules

Always respect Nebula's architecture.

Use:

- `@nebula/primitives`
- `@nebula/styleless`
- `@nebula/react-ui`
- `@nebula/react-ui-blocks`

Never bypass existing primitives.

Build higher-level components by composing lower-level building blocks.

---

# Styling Rules

- Preserve Nebula's existing color scheme.
- You may introduce or refine any **non-color design tokens** if they improve consistency, usability, accessibility, or visual quality.
- Every token must be systematic, reusable, and scalable.
- Avoid arbitrary or one-off values.
- Build a cohesive token system rather than styling individual components independently.

---

# Code Quality

Every component should be:

- Fully typed
- Accessible (WCAG AA minimum)
- Keyboard navigable
- Responsive
- Composable
- Reusable
- Tree-shakable
- Theme-aware
- Compatible with both Light and Dark modes

Prefer composition over inheritance.

---

# AI Implementation Rules

Whenever generating UI:

1. Use Minimals as the UX and visual design benchmark.
2. Recreate the same level of usability, polish, and interaction quality using Nebula's architecture.
3. Preserve Nebula's existing color scheme.
4. Design or refine all other design tokens where beneficial.
5. Build reusable components instead of page-specific implementations.
6. Follow Nebula's component architecture and package boundaries.
7. Prioritize consistency, scalability, maintainability, and accessibility over pixel-perfect imitation.

---

# What to Emulate from Minimals

Take inspiration from:

- Overall look and feel
- UI/UX patterns
- Information hierarchy
- Layout composition
- Component spacing
- Responsive behavior
- Card design
- Navigation experience
- Dashboard organization
- Forms and validation UX
- Tables and filters
- Empty states
- Loading states
- Micro-interactions
- Animation timing
- Visual consistency
- Enterprise-grade polish

---

# What Must Remain Unique to Nebula

Maintain Nebula's own identity by preserving:

- Existing color scheme
- Component APIs
- Design system architecture
- Package structure
- Accessibility standards
- Design token philosophy
- Implementation details
- Internal component composition
- Developer experience

---

# Success Criteria

A user familiar with Minimals should immediately recognize a similar level of polish, usability, visual rhythm, interaction quality, and overall experience, while clearly recognizing Project Nebula as its own design system with a unique brand identity, architecture, APIs, components, and design tokens.

Nebula should feel like a modern, enterprise-grade design system inspired by the quality of Minimals—not a replica.
