
import { useLocalStorage, useMediaQuery } from '@nebula/hooks';
import { createContext } from '@nebula/primitives/create-context-scope';
import * as React from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  /** The user's preference — may be `'system'`. */
  theme: Theme;
  /** `theme` with `'system'` resolved to the OS preference; always `'light'` or `'dark'`. */
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const [ThemeContextProvider, useThemeContext] = createContext<ThemeContextValue>('ThemeProvider');

interface ThemeProviderProps {
  children: React.ReactNode;
  /** @default 'system' */
  defaultTheme?: Theme;
  /** localStorage key the resolved preference is persisted under. */
  storageKey?: string;
}

/**
 * Wraps the app, persists the user's light/dark/system preference, and
 * reflects it as a single `data-theme` attribute on `<html>` — every token
 * in `theme.css` keys off that one attribute (see `tokens/generate.ts`), so
 * switching it repaints the whole app with no class-list juggling.
 *
 * Note on hydration flicker: this component resolves and applies the theme
 * in an effect (after mount), which is correct for SPA navigation but will
 * still flash on a fresh SSR load. For a zero-flicker SSR app, inline a
 * small blocking script in your document `<head>` that reads `storageKey`
 * and sets `data-theme` before React hydrates — `theme.css`'s
 * `[data-theme="system"]` `@media (prefers-color-scheme)` fallback covers
 * everyone else acceptably in the meantime.
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <ThemeProvider defaultTheme="system" storageKey="acme-theme">
 *       <Dashboard />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 */
function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'nebula-theme',
}: ThemeProviderProps) {
  const [theme, setTheme] = useLocalStorage<Theme>(storageKey, defaultTheme);
  const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  const resolvedTheme: ResolvedTheme =
    theme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : theme;

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'system' ? 'system' : theme);
  }, [theme]);

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return <ThemeContextProvider {...value}>{children}</ThemeContextProvider>;
}

/**
 * Reads the current theme + resolved theme, and lets you change it. Must be
 * used within a `ThemeProvider`.
 *
 * @returns The current `theme` preference, the OS-resolved `resolvedTheme`, and `setTheme`.
 *
 * @example
 * ```tsx
 * function ThemeToggle() {
 *   const { resolvedTheme, setTheme } = useTheme();
 *   return (
 *     <button onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
 *       Switch to {resolvedTheme === 'dark' ? 'light' : 'dark'} mode
 *     </button>
 *   );
 * }
 * ```
 */
function useTheme(): ThemeContextValue {
  return useThemeContext('useTheme');
}

export { ThemeProvider, useTheme };
export type { Theme, ResolvedTheme, ThemeContextValue };
