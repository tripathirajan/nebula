import { Button, useTheme } from '@nebula/react-ui';

import type { ButtonProps, Theme } from '@nebula/react-ui';

const OPTIONS: Array<{ value: Theme; label: string }> = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

interface ThemeSwitcherProps {
  size?: ButtonProps['size'];
}

/**
 * A three-way light/dark/system switcher — the first `react-ui-blocks`
 * component, demonstrating the intended composition for this layer:
 * domain-neutral, ready-to-use UI built purely from `@nebula/react-ui`
 * (components, tokens, and `ThemeProvider` all live in that one package),
 * no new primitives. Must be rendered inside a `ThemeProvider`.
 *
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <ThemeSwitcher size="md" />
 * </ThemeProvider>
 * ```
 */
function ThemeSwitcher({ size = 'sm' }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div role="group" aria-label="Theme" className="inline-flex gap-1">
      {OPTIONS.map((option) => (
        <Button
          key={option.value}
          type="button"
          size={size}
          variant={theme === option.value ? 'primary' : 'secondary'}
          aria-pressed={theme === option.value}
          onClick={() => setTheme(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}

export { ThemeSwitcher };
export type { ThemeSwitcherProps };
