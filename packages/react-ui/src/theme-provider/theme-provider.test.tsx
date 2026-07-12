// Deliberately import from two *different* public entry points via the
// package specifier (not a relative path) — `ThemeProvider` from the root
// barrel, `useTheme` from its own subpath. This is a regression test for a
// real bug: under `splitting: false`, tsup bundled each entry fully
// self-contained, so `dist/index.js` and `dist/theme-provider/index.js`
// each re-ran their own `React.createContext()` call, producing two
// distinct Context objects — a consumer mixing entry points this way threw
// "useTheme must be used within ThemeProvider" despite a correctly-nested
// tree and a clean typecheck. `tsup.config.ts`'s `splitting: true` (see its
// own comment) fixes this by extracting the shared context module into one
// chunk every entry references — this test only means something against
// the *built* `dist/` output, since source-file imports would trivially
// share one module regardless.
import { ThemeProvider } from '@nebula/react-ui';
import { useTheme } from '@nebula/react-ui/theme-provider';
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
