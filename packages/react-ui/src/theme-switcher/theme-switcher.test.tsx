import { ThemeProvider } from '@nebula-lab/react-ui/theme-provider';
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
  // `ThemeProvider` persists via `useLocalStorage` — a test that selects a
  // theme leaves that choice in jsdom's shared `localStorage`, which would
  // otherwise leak into whichever test runs next and default it away from
  // "System".
  localStorage.clear();
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

  it('renders an icon-only toggle group with variant="icon"', () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher variant="icon" />
      </ThemeProvider>,
    );
    expect(screen.getByRole('group', { name: 'Theme' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Light' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dark' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'System' })).toBeInTheDocument();
  });

  it('icon variant moves the pressed state on click', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeSwitcher variant="icon" />
      </ThemeProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Dark' }));
    expect(screen.getByRole('button', { name: 'Dark' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('icon variant has no axe violations', async () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeSwitcher variant="icon" />
      </ThemeProvider>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders a single trigger button naming the current theme with variant="dropdown"', () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher variant="dropdown" />
      </ThemeProvider>,
    );
    expect(screen.getByRole('button', { name: 'Theme: System' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Light' })).not.toBeInTheDocument();
  });

  it('dropdown variant opens a Light/Dark/System menu with the current theme checked', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeSwitcher variant="dropdown" />
      </ThemeProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Theme: System' }));
    expect(await screen.findByRole('menuitemradio', { name: 'System' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByRole('menuitemradio', { name: 'Light' })).toHaveAttribute('aria-checked', 'false');
  });

  it('dropdown variant selecting an option updates the trigger label and closes the menu', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeSwitcher variant="dropdown" />
      </ThemeProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Theme: System' }));
    await user.click(await screen.findByRole('menuitemradio', { name: 'Dark' }));
    expect(await screen.findByRole('button', { name: 'Theme: Dark' })).toBeInTheDocument();
    expect(screen.queryByRole('menuitemradio')).not.toBeInTheDocument();
  });

  it('dropdown variant has no axe violations', async () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeSwitcher variant="dropdown" />
      </ThemeProvider>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
