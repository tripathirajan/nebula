import { ThemeProvider } from '@nebula/react-ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { ThemeSwitcher } from './theme-switcher';

// `useTheme`'s `useMediaQuery('(prefers-color-scheme: dark)')` call needs
// `window.matchMedia(...).addEventListener`, which jsdom's stub doesn't
// implement — same mock used in packages/primitives/src/presence/presence.test.tsx.
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

describe('ThemeSwitcher (block)', () => {
  it('renders a labeled group with Light/Dark/System buttons', () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>,
    );
    expect(screen.getByRole('group', { name: 'Theme' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Light' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dark' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'System' })).toBeInTheDocument();
  });

  it('defaults to System pressed', () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>,
    );
    expect(screen.getByRole('button', { name: 'System' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Light' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('moves the pressed state when a different option is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Dark' }));
    expect(screen.getByRole('button', { name: 'Dark' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'System' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
