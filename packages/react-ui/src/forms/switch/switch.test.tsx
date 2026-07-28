import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Switch } from './switch';

describe('Switch (ui)', () => {
  it('renders the headless behavior unchanged (toggles on click)', () => {
    render(<Switch defaultChecked={false} aria-label="Enable notifications" />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  it('applies the track token class', () => {
    render(<Switch aria-label="Enable notifications" />);
    expect(screen.getByRole('switch').className).toContain('bg-[var(--switch-track-bg)]');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Switch aria-label="Enable notifications" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
