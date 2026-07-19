import { Button } from '@nebula-lab/react-ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@nebula-lab/react-ui/dropdown-menu';
import { IconButton } from '@nebula-lab/react-ui/icon-button';
import { useTheme } from '@nebula-lab/react-ui/theme-provider';
import * as React from 'react';

import type { ButtonProps } from '@nebula-lab/react-ui/button';
import type { Theme } from '@nebula-lab/react-ui/theme-provider';

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

interface ThemeOption {
  value: Theme;
  label: string;
  icon: React.ReactNode;
}

// A `Record`, not an array — indexing `OPTION_BY_THEME[theme]` with a
// value already known to be `Theme` returns a `ThemeOption` directly, not
// `ThemeOption | undefined` the way `OPTIONS.find(...)`/an array index
// would, so the `dropdown` variant's current-selection lookup below needs
// no fallback-or-assert for a case that can never actually happen (`theme`
// is always one of these three values). `OPTIONS` (for iterating the full
// list) is derived from this, not hand-duplicated.
const OPTION_BY_THEME: Record<Theme, ThemeOption> = {
  light: { value: 'light', label: 'Light', icon: <SunIcon /> },
  dark: { value: 'dark', label: 'Dark', icon: <MoonIcon /> },
  system: { value: 'system', label: 'System', icon: <MonitorIcon /> },
};

const OPTIONS: ThemeOption[] = Object.values(OPTION_BY_THEME);

interface ThemeSwitcherProps {
  size?: ButtonProps['size'];
  /** `'button'` — labeled buttons (original look). `'icon'` — a compact icon-only toggle group (sun/moon/monitor), same behavior, less horizontal space. `'dropdown'` — a single icon button (its icon tracks the current selection) that opens a Light/Dark/System menu — the least horizontal space of the three, since only one control is ever on screen at once. @default 'button' */
  variant?: 'button' | 'icon' | 'dropdown';
}

/**
 * A three-way light/dark/system switcher — built purely from this
 * package's own `Button`/`IconButton`/`DropdownMenu` and `ThemeProvider`,
 * no new primitives. Originally shipped as `react-ui-blocks`' first
 * component (a demonstration of composing domain-neutral UI purely from
 * `@nebula-lab/react-ui`); moved here since it has no domain knowledge of its
 * own — exactly the "atoms and molecules belong in `react-ui`" rule
 * `react-ui-blocks` is supposed to sit on top of, not include. Must be
 * rendered inside a `ThemeProvider`.
 *
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <ThemeSwitcher size="md" />
 *   <ThemeSwitcher variant="icon" />
 *   <ThemeSwitcher variant="dropdown" />
 * </ThemeProvider>
 * ```
 */
function ThemeSwitcher({ size = 'sm', variant = 'button' }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();

  if (variant === 'dropdown') {
    const current = OPTION_BY_THEME[theme];
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton
            type="button"
            size={size}
            variant="ghost"
            color="neutral"
            aria-label={`Theme: ${current.label}`}
          >
            {current.icon}
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as Theme)}>
              {OPTIONS.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  <span className="flex items-center gap-2">
                    {option.icon}
                    {option.label}
                  </span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    );
  }

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
