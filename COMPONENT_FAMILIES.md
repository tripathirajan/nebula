# Component Families — Generic Root + Named Variants

Some components aren't independent — they're the same underlying implementation reused under a different public name, because either (a) a real behavioral variant exists on top of a shared root, or (b) two component-library vocabularies (Radix/shadcn vs. Chakra/MUI naming) refer to the identical widget. This doc catalogs every such family found in the codebase, and — critically — differentiates **which kind each variant is**, since that distinction determines whether it's safe to ever delete one "duplicate" name.

Found by searching every `export { X as Y } from '../sibling/sibling'` and `const X = Y` re-export across `headless`/`primitives`/`react-ui` (not guessed) — see the bottom for how to re-verify.

---

## 1. `Menu` family

| Component | Root | Real difference from `Menu` | Role / when to reach for it |
|---|---|---|---|
| **`Menu`** | — (the generic) | — | Base compound: a button opens a floating list of items. |
| **`ContextMenu`** | `Menu` (literal re-export) | `ContextMenuTrigger` — right-click at a point, not a visible button | A surface (a row, a canvas, a file) that responds to right-click with a menu at the cursor. |
| **`DropdownMenu`** | `Menu` (literal re-export) | None at the Root — same behavior, different name for the same "click a visible button" case | The default, most common case: a "⋮" button opens a menu. Prefer this name over bare `Menu` for readability at call sites. |
| **`Menubar`** | *Not* a re-export — genuinely new Root | Coordinates "at most one of several `MenubarMenu`s open at once" across siblings, reusing `Menu`'s leaf parts (`MenuItem`, `MenuContent`, ...) but not its Root | A horizontal row of top-level menus (File/Edit/View), like a native app's menu bar. |

**Verdict**: `ContextMenu` is a real variant (different trigger mechanism). `DropdownMenu` and `Menu` are functionally identical — `DropdownMenu` is the name most consumers reach for first, `Menu` is what's actually implemented. Keep both; `Menubar` is not part of this "alias" story at all — it's a genuine composition.

## 2. `Dialog` family

| Component | Root | Real difference from `Dialog` | Role / when to reach for it |
|---|---|---|---|
| **`Dialog`** | — (the generic) | — | Base compound: modal or non-modal overlay, focus-trapped when modal, Escape/outside-click dismiss. |
| **`AlertDialog`** | `Dialog` (forces `modal={true}`, not exposed as a prop) | 2 real differences: `modal` can't be turned off; `AlertDialogContent` is `role="alertdialog"` and doesn't dismiss on outside-click | A destructive-action confirmation ("Delete this item?") that must force a yes/no answer — never accidentally dismissible. |
| **`Drawer`** | `Dialog` (`const Drawer = Dialog` — literally the same object) | 0 differences at the Root; only `DrawerContent`'s `side` prop (which edge it slides from) differs | Any edge-anchored panel — a cart, a filter panel, a mobile nav — that's *behaviorally* a dialog (modal, focus-trapped, dismissible) but visually slides in from an edge instead of centering. |
| **`Sheet`** (react-ui only) | `Drawer` (pure re-export, shadcn/Radix naming vs. Chakra/MUI's "Drawer") | 0 differences | Use whichever name matches your team's naming background — they're identical. |

**Your proposed `ConfirmBox` idea**: this is exactly where a *new*, real variant would slot in — e.g. a `ConfirmBox` that's `AlertDialog` plus a built-in "Cancel"/"Confirm" button pair and a `message` prop (skipping the manual `AlertDialogTitle`/`Description`/`Cancel`/`Action` composition) would be a legitimate 3rd tier: **`Dialog` → `AlertDialog` → `ConfirmBox`** (increasingly opinionated). That doesn't exist today — nothing currently sits above `AlertDialog` in this family.

## 3. `Combobox` family

| Component | Root | Real difference | Role |
|---|---|---|---|
| **`Combobox`** | — (the generic) | — | Free-text entry that does **not** require matching a listed option — `inputValue` and the eventual selection are decoupled state. |
| **`Autocomplete`** | `Combobox` (literal re-export) | None | Pure vocabulary alias — "Autocomplete" is what most component-library taxonomies call this exact free-text-with-suggestions shape. |

**Verdict**: pure alias, like `Tree`/`TreeView` below — no behavioral distinction at all.

## 4. `Tree` family

| Component | Root | Real difference | Role |
|---|---|---|---|
| **`Tree`** | — (the generic) | — | WAI-ARIA Tree View pattern: nested, expandable, selectable items. |
| **`TreeView`** | `Tree` (literal re-export) | None | Pure vocabulary alias — the original component wishlist listed the identical widget under both "Navigation → Tree" (a docs sidebar) and "Collections → TreeView" (a file browser). |

**Verdict**: pure alias, same category as `Combobox`/`Autocomplete`.

## 5. `Flex` family (primitives layer — layout, not overlays)

A different kind of family: not re-exports of one Root, but increasingly-specific **presets** layered on top of `Flex`'s fully-configurable API.

| Component | Built from | Preset | Role |
|---|---|---|---|
| **`Flex`** | — (the generic) | fully configurable `direction`/`align`/`justify`/`wrap`/`gap` | Reach for this when you need a combination none of the presets below cover. |
| **`Stack`** | `Flex` | `direction="column"` | A vertical list of children with consistent spacing — the single most common layout need. |
| **`VStack`** | `Stack` (pure alias) | same as `Stack` | Chakra-UI-familiar naming for the exact same thing as `Stack`. |
| **`HStack`** | `Flex` | `direction="row"`, `align="center"`, no wrap | A horizontal row that stays on one line (overflows/scrolls rather than wrapping) — a toolbar, a button row. |
| **`Inline`** | `Flex` | `direction="row"`, `wrap` on by default, `align="center"` | A horizontal run that **should** wrap onto multiple lines when it runs out of room — tag lists, chip groups. |
| **`Wrap`** | `Inline` (pure alias) | same as `Inline` | Chakra-UI-familiar naming for the exact same thing as `Inline`. |

**Verdict**: `Stack`/`HStack`/`Inline` are real, distinct presets (different flex-direction/wrap combinations). `VStack` and `Wrap` are pure vocabulary aliases of `Stack`/`Inline` respectively — same pattern as `Autocomplete`/`TreeView`, just for layout instead of overlays.

---

## Summary: which pairs are "real variants" vs. "pure aliases"

**Real behavioral variants** (keep both names, they mean different things):
- `Menu` → `ContextMenu` (different trigger)
- `Dialog` → `AlertDialog` (forced modal + different Content role/dismissal)
- `Flex` → `Stack` / `HStack` / `Inline` (different direction/wrap presets)

**Pure vocabulary aliases** (zero behavioral difference — exist only so two naming conventions both resolve):
- `Menu` ≡ `DropdownMenu`
- `Dialog` ≡ `Drawer` (Root only — `DrawerContent`'s `side` prop *is* a real addition) ≡ `Sheet`
- `Combobox` ≡ `Autocomplete`
- `Tree` ≡ `TreeView`
- `Stack` ≡ `VStack`
- `Inline` ≡ `Wrap`

The pure-alias ones are all already documented individually in their own source files with nearly identical reasoning ("same widget, different vocabulary, no reason to reimplement") — this doc's value is having them in **one place**, so the pattern is visible as a pattern rather than six separate one-off decisions that happen to look alike.

## How this was verified

```bash
grep -rn "^export { [A-Za-z]* as [A-Za-z]* } from" packages/headless/src packages/react-ui/src --include="*.tsx" --include="*.ts"
grep -rn "^const [A-Za-z]* = [A-Za-z]*;$" packages/headless/src --include="*.tsx"
```

Re-run before trusting this doc if any of these components have been touched since — this is a manually-curated write-up (the "role/usage" differentiation needs real reasoning, not just grep), not an auto-regenerated one like `COMPONENT_INVENTORY.md`/`LAYER_ARCHITECTURE_MAP.md`, so it can drift if a family changes and nobody updates this file.
