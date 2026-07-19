# nebula — Accessibility & Compliance Reference

_Last updated 2026-07-19. The original "Part 1 — Build checklist" (dated 2026-07-05, an early ~13-item snapshot) has been dropped — it described a project state from before almost everything in the library existed. Current package/component inventory lives in `AGENTS.md`'s status table and each package's own `README.md`._

## Which standards apply here

This is a UI component library, not a network service, so IETF RFCs (HTTP, TLS, etc.) aren't really in play. The two standards bodies that matter are:

- **W3C WAI-ARIA 1.2** — roles, states, and properties (`role`, `aria-*`).
- **W3C WCAG 2.2** (October 2023; adopted as **ISO/IEC 40500:2025** in October 2025) — the actual testable success criteria that "accessible" gets measured against. WCAG 2.0/2.1/2.2 are backward-compatible, so conforming to 2.2 also satisfies 2.1 and 2.0.

Component **libraries** don't get certified against WCAG directly — conformance is evaluated on the finished product built with the library — but a library can make conformance easy or hard to achieve.

## Current state

- **Automated a11y testing:** Wired and in active use — Vitest + Testing Library + `vitest-axe` across every package, `toHaveNoViolations()` in test suites, plus Storybook's `addon-a11y` panel on every story.
- **`prefers-reduced-motion`:** Handled — `primitives`' `Presence` (`packages/primitives/src/presence/presence.tsx`) checks `matchMedia('(prefers-reduced-motion: reduce)')` and skips the animation wait entirely when set (WCAG 2.3.3), with a test covering it. `Carousel`'s `autoSwipeInterval` also respects it.
- **Color contrast:** Audited — see `packages/react-ui/CONTRAST_AUDIT.md` for the current pass/fail state of every semantic color pairing; re-run it after any token color change (`pnpm --filter @nebula-lab/react-ui contrast-audit`).
- **Real install/build/typecheck/test execution:** Routine — the monorepo has been built, typechecked, linted, and tested end-to-end many times over the course of development, not just statically reviewed.
- **WAI-ARIA pattern conformance:** Every interactive `headless` component follows its named APG pattern (roving-tabindex, correct roles/states, full keyboard support) per `AGENTS.md`'s non-negotiable rule #4 — this is enforced by convention and by the `new-component` skill, not by a separate audit doc trying to re-verify every one of ~100+ components by hand.

## Pending

- No open compliance gaps identified as of this writing. If you find one, add it here rather than in a separate stale-prone doc.
- **Standing recommendation, not a task:** if this library ships into an EU-facing product, target **EN 301 549** conformance explicitly (it incorporates WCAG 2.1 AA and creates a legal presumption of EAA compliance) — see the legal landscape below for why.

## International legal compliance landscape (as of mid-2026)

Accessibility law almost universally routes through WCAG rather than defining its own criteria, so the library's WCAG posture above is the thing that actually matters everywhere. Current state by region:

- **European Union — European Accessibility Act (EAA).** Enforcement began **June 28, 2025**; all 27 member states have transposed it into national law. It covers websites, apps, e-commerce, banking, and self-service terminals, and applies to **any company selling into the EU, including non-EU companies**. Conforming to **EN 301 549** (which itself incorporates WCAG 2.1 AA) creates a legal presumption of EAA compliance. Penalties are member-state-specific — from roughly €60,000 (Ireland) up to ~€900,000 (Sweden) — usually with a 30–90 day cure window before fines escalate. First lawsuits were filed in France in November 2025; more enforcement is expected through 2026.
- **United States — ADA + Section 508.** Section 508 (federal agencies/vendors) requires **WCAG 2.0/2.1 Level A+AA** per the 2018 Access Board refresh. A 2024 DOJ rule under **ADA Title II** now explicitly requires state/local government web content and apps to meet **WCAG 2.1 AA**, with compliance deadlines recently extended (large entities to April 2027, smaller/special-district entities to April 2028). ADA Title III (private businesses open to the public) has no codified technical standard, but courts overwhelmingly cite WCAG 2.1 AA in the >5,000 digital accessibility lawsuits filed in 2025 (a ~20% YoY increase). Accessibility overlay widgets are explicitly called out as **not** a defensible substitute for actually-accessible markup — relevant since this library's approach (real ARIA roles, real keyboard handling) is the kind that holds up, unlike an overlay bolted on after the fact.
- **United Kingdom.** Public Sector Bodies Accessibility Regulations require **WCAG 2.1 AA** for public-sector sites/apps; the private sector is covered more loosely under the Equality Act 2010, but WCAG 2.1 AA is the de facto benchmark referenced in guidance and litigation.
- **Canada.** AODA (Ontario) requires **WCAG 2.0 AA**; the federal **Accessible Canada Act**, updated via new regulations in December 2025, expands digital accessibility duties for federally-regulated organizations, standardizing on **CAN/ASC – EN 301 549** (itself WCAG 2.1-based).
- **Australia.** The Disability Discrimination Act covers all sectors with no separate technical regulation, but the Australian Human Rights Commission's guidance and consistent tribunal outcomes point to **WCAG 2.0/2.1 AA** as the practical bar.

**Bottom line:** every jurisdiction that matters converges on the same target — **WCAG 2.1 AA (2.2 AA if you want to be ahead of the curve)**. There's no separate "compliance issue to use this in country X" the way there might be for, say, a payments library and PCI-DSS. The relevant risk is entirely about whether **apps built with nebula** ship WCAG 2.1 AA-conforming UI — and the library's own automated a11y testing (above) is what backs that up in practice, not a one-time manual read-through.

## Sources

- [WCAG 2.2 (W3C)](https://www.w3.org/TR/WCAG22/)
- [WCAG 2 Overview (W3C WAI)](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [European Accessibility Act guide (Level Access)](https://www.levelaccess.com/compliance-overview/european-accessibility-act-eaa/)
- [European Accessibility Act Goes Live (Davis Wright Tremaine)](https://www.dwt.com/insights/2025/07/european-accessibility-act-digital-products)
- [European Accessibility Act (European Commission)](https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/disability/european-accessibility-act-eaa_en)
- [2026 ADA Web Accessibility Standards & Requirements](https://www.accessibility.works/blog/wcag-ada-website-compliance-standards-requirements/)
- [ADA.gov — Web/Mobile App Accessibility Rule Fact Sheet](https://www.ada.gov/resources/2024-03-08-web-rule/)
- [Extension of ADA Title II Compliance Dates (Federal Register)](https://www.federalregister.gov/documents/2026/04/20/2026-07663/extension-of-compliance-dates-for-nondiscrimination-on-the-basis-of-disability-accessibility-of-web)
- [Global Accessibility Regulation Timeline (TestParty)](https://testparty.ai/blog/global-accessibility-regulations)
- [Canadian Web Accessibility Laws: AODA and the Accessible Canada Act](https://achecker.ca/blog/canadian-accessibility-laws-aoda-aca)
