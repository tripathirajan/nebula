import * as React from 'react';

import { componentTokens } from './component';
import { primitiveTokens } from './primitive';
import { semanticTokens } from './semantic';

type TokenTree = { readonly [key: string]: string | number | TokenTree };

/** Mirrors `generate.ts`'s own `toKebabCase` — kept as a small local copy rather than importing `generate.ts` directly, since that file's top-level `writeFileSync` call is a Node-only side effect that would crash if pulled into this browser-rendered docs page. */
function toKebabCase(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/** Same traversal `generate.ts`'s `flatten` does, but collecting just the resulting `--custom-property` names — walking the real `primitiveTokens`/`semanticTokens`/`componentTokens` objects means a token added to those files shows up here automatically, with no second list to keep in sync. */
function flattenNames(tree: TokenTree, prefix: string[] = []): string[] {
  const names: string[] = [];
  for (const [key, value] of Object.entries(tree)) {
    const path = [...prefix, toKebabCase(key)];
    if (typeof value === 'string' || typeof value === 'number') {
      names.push(`--${path.join('-')}`);
    } else {
      names.push(...flattenNames(value as TokenTree, path));
    }
  }
  return names;
}

const colorNames = flattenNames(semanticTokens.light.color, ['color']);
const shadowNames = flattenNames(semanticTokens.light.elevation, ['shadow']);
const radiusNames = flattenNames(primitiveTokens.radius, ['radius']);
const sizeNames = flattenNames(primitiveTokens.size, ['size']);
const fontNames = flattenNames(primitiveTokens.fontStack, ['font']);
const motionNames = flattenNames(primitiveTokens.motion, ['motion']);
const zIndexNames = flattenNames(primitiveTokens.zIndex, ['z']);
const componentNames = flattenNames(componentTokens);

/**
 * Reads a CSS custom property's live, resolved value off `element` (or
 * `document.documentElement` by default) — the *actual* rendered value,
 * not the token source string, so this page catches a real `generate.ts`
 * bug the same way `contrast-audit.ts` catches a real color bug: by
 * checking what ships, not what the `.ts` file merely claims.
 */
function useLiveVar(name: string, element: HTMLElement | null, themeKey: string): string {
  const [value, setValue] = React.useState('');
  React.useEffect(() => {
    const target = element ?? document.documentElement;
    setValue(getComputedStyle(target).getPropertyValue(name).trim());
    // themeKey forces a re-read when the local theme toggle below flips —
    // getComputedStyle has no subscription API of its own.
  }, [name, element, themeKey]);
  return value;
}

function Swatch({
  name,
  scopeRef,
  themeKey,
  preview,
}: {
  name: string;
  scopeRef: React.RefObject<HTMLElement | null>;
  themeKey: string;
  preview: (value: string) => React.ReactNode;
}) {
  const value = useLiveVar(name, scopeRef.current, themeKey);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0' }}>
      {preview(value)}
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <code style={{ fontSize: 13 }}>{name}</code>
        <span style={{ fontSize: 11, opacity: 0.6, wordBreak: 'break-all' }}>{value || '(unset)'}</span>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h3 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '.05em', opacity: 0.6, marginBottom: 12 }}>
        {title}
      </h3>
      {children}
    </section>
  );
}

/**
 * Live reference for every CSS custom property nebula's token layer emits
 * to `theme.css` — grouped the same way `generate.ts` groups them (color,
 * shadow, radius, size, font, motion, z-index, then every per-component
 * `--<component>-*` token), each row showing the real computed value read
 * off the DOM, plus a light/dark toggle scoped to this page (sets
 * `data-theme` on a local wrapper, not the whole Storybook UI, since
 * `.dark`/`[data-theme]` are plain selectors that cascade from wherever
 * they're applied — not only `:root`).
 *
 * Built in response to a real gap: nothing in this repo answered "what CSS
 * vars exist" or "what's the actual color scheme" short of reading
 * `theme.css` by hand — Storybook's per-component autodocs cover props/
 * usage, not the token layer those components are all built on.
 *
 * @example
 * ```tsx
 * <TokenReference />
 * ```
 */
function TokenReference() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const scopeRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button
          type="button"
          onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
          style={{
            padding: '6px 14px',
            borderRadius: 6,
            border: '1px solid currentColor',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          Theme: {theme}
        </button>
      </div>
      <div
        ref={scopeRef}
        data-theme={theme}
        style={{
          background: 'var(--color-base-200)',
          color: 'var(--color-base-content)',
          padding: 24,
          borderRadius: 8,
        }}
      >
        <Section title={`Color — ${colorNames.length} tokens`}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 4 }}>
            {colorNames.map((name) => (
              <Swatch
                key={name}
                name={name}
                scopeRef={scopeRef}
                themeKey={theme}
                preview={(value) => (
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      background: value || 'transparent',
                      border: '1px solid var(--color-base-300)',
                      flexShrink: 0,
                    }}
                  />
                )}
              />
            ))}
          </div>
        </Section>

        <Section title={`Shadow / elevation — ${shadowNames.length} tokens`}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {shadowNames.map((name) => (
              <Swatch
                key={name}
                name={name}
                scopeRef={scopeRef}
                themeKey={theme}
                preview={(value) => (
                  <span
                    style={{
                      width: 40,
                      height: 32,
                      borderRadius: 8,
                      background: 'var(--color-base-100)',
                      boxShadow: value || 'none',
                      flexShrink: 0,
                    }}
                  />
                )}
              />
            ))}
          </div>
        </Section>

        <Section title={`Radius — ${radiusNames.length} tokens`}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 4 }}>
            {radiusNames.map((name) => (
              <Swatch
                key={name}
                name={name}
                scopeRef={scopeRef}
                themeKey={theme}
                preview={(value) => (
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: value || 0,
                      border: '2px solid var(--color-primary)',
                      flexShrink: 0,
                    }}
                  />
                )}
              />
            ))}
          </div>
        </Section>

        <Section title={`Font — ${fontNames.length} tokens`}>
          {fontNames.map((name) => (
            <Swatch
              key={name}
              name={name}
              scopeRef={scopeRef}
              themeKey={theme}
              preview={() => null}
            />
          ))}
        </Section>

        <Section title={`Size — ${sizeNames.length} tokens`}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 4 }}>
            {sizeNames.map((name) => (
              <Swatch
                key={name}
                name={name}
                scopeRef={scopeRef}
                themeKey={theme}
                preview={(value) => (
                  <span
                    style={{ width: value || 0, height: 12, background: 'var(--color-primary)', flexShrink: 0 }}
                  />
                )}
              />
            ))}
          </div>
        </Section>

        <Section title={`Motion — ${motionNames.length} tokens`}>
          {motionNames.map((name) => (
            <Swatch key={name} name={name} scopeRef={scopeRef} themeKey={theme} preview={() => null} />
          ))}
        </Section>

        <Section title={`Z-index — ${zIndexNames.length} tokens`}>
          {zIndexNames.map((name) => (
            <Swatch key={name} name={name} scopeRef={scopeRef} themeKey={theme} preview={() => null} />
          ))}
        </Section>

        <Section title={`Per-component — ${componentNames.length} tokens`}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 4 }}>
            {componentNames.map((name) => (
              <Swatch key={name} name={name} scopeRef={scopeRef} themeKey={theme} preview={() => null} />
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

export { TokenReference };
