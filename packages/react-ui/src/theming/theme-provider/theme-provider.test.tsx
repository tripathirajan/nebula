// Both from the *same* public entry point (this package's own subpath) —
// deliberately, not the root barrel. This used to also assert that mixing
// `ThemeProvider` from the root barrel with `useTheme` from this subpath
// shared one Context instance, which required `tsup.config.ts`'s
// `splitting: true` to hold (a shared chunk across every entry that
// reaches this module). That guarantee was deliberately dropped when this
// package switched to `splitting: false` (see that config's own comment)
// to cut ~160 chunk files out of the published package — with it off,
// `dist/index.js` and `dist/theme-provider/index.js` each run their own
// `React.createContext()` call, so mixing entry-point styles for
// `ThemeProvider`/`useTheme`/`ThemeSwitcher` specifically can now produce
// two distinct Context instances (documented on `ThemeProvider`'s own
// JSDoc). This test covers the still-guaranteed case instead: one
// consistent entry-point style always shares one instance.
import { ThemeProvider, useTheme } from '@nebula-lab/react-ui/theme-provider';
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

describe('ThemeProvider / useTheme from a single, consistent entry point', () => {
  it('shares one Context instance', () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <ThemeReader />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });
});
