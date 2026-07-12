import { Button } from '@nebula/react-ui/button';
import { IconButton } from '@nebula/react-ui/icon-button';
import { useTheme } from '@nebula/react-ui/theme-provider';
import * as React from 'react';

import type { ButtonProps } from '@nebula/react-ui/button';
import type { Theme } from '@nebula/react-ui/theme-provider';

const SunIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    {...props}
  >
    <circle cx={12} cy={12} r={4} />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const MoonIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    {...props}
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
  </svg>
);

const MonitorIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    {...props}
  >
    <rect x={2} y={3} width={20} height={14} rx={2} />
    <path d="M8 21h8M12 17v4" />
  </svg>
);

const OPTIONS: Array<{ value: Theme; label: string; icon: React.ReactNode }> = [
  { value: 'light', label: 'Light', icon: <SunIcon /> },
  { value: 'dark', label: 'Dark', icon: <MoonIcon /> },
  { value: 'system', label: 'System', icon: <MonitorIcon /> },
];

interface ThemeSwitcherProps {
  size?: ButtonProps['size'];
  /** `'button'` — labeled buttons (original look). `'icon'` — a compact icon-only toggle group (sun/moon/monitor), same behavior, less horizontal space. @default 'button' */
  variant?: 'button' | 'icon';
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
 *   <ThemeSwitcher variant="icon" />
 * </ThemeProvider>
 * ```
 */
function ThemeSwitcher({ size = 'sm', variant = 'button' }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();

  if (variant === 'icon') {
    return (
      <div role="group" aria-label="Theme" className="inline-flex gap-1">
        {OPTIONS.map((option) => (
          <IconButton
            key={option.value}
            type="button"
            size={size}
            variant={theme === option.value ? 'default' : 'ghost'}
            color={theme === option.value ? 'primary' : 'neutral'}
            aria-label={option.label}
            aria-pressed={theme === option.value}
            onClick={() => setTheme(option.value)}
          >
            {option.icon}
          </IconButton>
        ))}
      </div>
    );
  }

  return (
    <div role="group" aria-label="Theme" className="inline-flex gap-1">
      {OPTIONS.map((option) => (
        <Button
          key={option.value}
          type="button"
          size={size}
          color={theme === option.value ? 'primary' : 'secondary'}
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
