# Component Coverage Audit

_Superseded 2026-07-19. The original audit (a checklist against a full "Radix + Chakra + Mantine combined" wishlist scope, ~270 line items across Primitive/Headless/react-ui) tracked its own progress via a "Highest-leverage gaps" section — by the end of that tracking, all seven gap batches were marked done, and cross-checking its last remaining claims (`Alert`, `EmptyState` "missing") against the actual `packages/react-ui/src` tree found both already exist. The checklist had fully served its purpose and gone stale in the process, so it's replaced here rather than kept as a 37KB doc requiring line-by-line re-verification._

## Current state

Primitive, Headless, and react-ui all cover their originally-scoped wishlist essentially completely — see `AGENTS.md`'s status table and each package's own `README.md` for the real, current component inventory (categorized, not a checkbox grid). The only components ever explicitly deferred:

- **`QRCode`** — deliberate, documented scope cut (out of scope for this library).
- A few small naming reconciliations rather than real gaps: `Separator` covers what the original wishlist called "Divider"; `Dialog` covers "Modal"; `react-ui-blocks`' `layouts` vertical (`AppLayout`/`AuthLayout`/`DashboardLayout`/`SettingsLayout`) covers "AppShell" at the composed-block level rather than as a single `react-ui` atom.

## Pending

The confirmed outstanding backlog is the `styleless` layer extraction (see `AGENTS.md`'s status table and `LAYER_TAXONOMY.md` §4) — not a gap in `react-ui`'s own component coverage. If a genuinely new, real component gap is found, add it here with a concrete example (not a checkbox grid that will only go stale again).
