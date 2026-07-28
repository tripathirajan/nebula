// Deliberately import from two *different* public entry points via the
// package specifier (not a relative path) — `ThemeProvider` from the root
// barrel, `useTheme` from its own subpath. This is a regression test for a
// real bug: this package's build (`tsup.config.ts`, `splitting: false`) can
// compile theme-provider.tsx into more than one physical `dist/` output, and
// a plain module-scope `createContext()` call would run once per copy,
// producing distinct Context objects depending on which entry point a
// consumer reached this through — `useTheme` would throw "must be used
// within ThemeProvider" despite a correctly-nested tree and a clean
// typecheck. Fixed by registering the Context on `globalThis` via
// `Symbol.for` (see `theme-provider.tsx`'s own comment) instead of a plain
// const, so every copy of the module resolves the same shared object. This
// test only means something against the *built* `dist/` output, since
// source-file imports would trivially share one module regardless.
import { ThemeProvider } from '@nebula-lab/react-ui';
import { useTheme } from '@nebula-lab/react-ui/theme-provider';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

beforeEach(() => {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches: false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }) as unknown as MediaQueryList,
  );
});

function ThemeReader() {
  const { theme } = useTheme();
  return <div data-testid="theme">{theme}</div>;
}

describe('ThemeProvider / useTheme across entry points', () => {
  it('shares one Context instance whether ThemeProvider comes from the root barrel or useTheme from its own subpath', () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <ThemeReader />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });
});
