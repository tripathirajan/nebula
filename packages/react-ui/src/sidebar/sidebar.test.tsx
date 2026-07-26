import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Sidebar } from './sidebar';

describe('Sidebar (ui)', () => {
  it('renders as a complementary landmark with its content', () => {
    render(
      <Sidebar>
        <nav>Primary nav</nav>
      </Sidebar>,
    );
    expect(screen.getByRole('complementary')).toHaveTextContent('Primary nav');
  });

  // The BottomNav pairing regression: without this, a consumer rendering
  // Sidebar (via DashboardLayout/SettingsLayout) alongside BottomNav for
  // phone-width nav got both simultaneously below `md`.
  it('is hidden below the md breakpoint by default', () => {
    render(
      <Sidebar>
        <nav>Primary nav</nav>
      </Sidebar>,
    );
    expect(screen.getByRole('complementary').className).toContain('hidden');
  });

  it('becomes visible at md and above', () => {
    render(
      <Sidebar>
        <nav>Primary nav</nav>
      </Sidebar>,
    );
    expect(screen.getByRole('complementary').className).toContain('md:flex');
  });

  it('borders the right edge by default (left-side placement)', () => {
    render(
      <Sidebar>
        <nav>Primary nav</nav>
      </Sidebar>,
    );
    expect(screen.getByRole('complementary').className).toContain('border-r');
  });

  it('borders the left edge when side="right"', () => {
    render(
      <Sidebar side="right">
        <nav>Primary nav</nav>
      </Sidebar>,
    );
    expect(screen.getByRole('complementary').className).toContain('border-l');
  });

  it('defaults to expanded: w-64 and data-state="expanded"', () => {
    render(
      <Sidebar>
        <nav>Primary nav</nav>
      </Sidebar>,
    );
    const aside = screen.getByRole('complementary');
    expect(aside.className).toContain('w-64');
    expect(aside).toHaveAttribute('data-state', 'expanded');
  });

  it('shrinks to w-16 and sets data-state="collapsed" when collapsed', () => {
    render(
      <Sidebar collapsed>
        <nav>Primary nav</nav>
      </Sidebar>,
    );
    const aside = screen.getByRole('complementary');
    expect(aside.className).toContain('w-16');
    expect(aside.className).not.toContain('w-64');
    expect(aside).toHaveAttribute('data-state', 'collapsed');
  });
});
