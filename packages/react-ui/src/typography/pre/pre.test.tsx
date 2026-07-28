import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Pre } from './pre';

describe('Pre (ui)', () => {
  it('renders a pre by default', () => {
    render(<Pre data-testid="pre">const x = 1;</Pre>);
    expect(screen.getByTestId('pre').tagName).toBe('PRE');
  });

  it('applies theme-token background/border instead of the primitive default hardcoded gray', () => {
    render(<Pre data-testid="pre">const x = 1;</Pre>);
    const el = screen.getByTestId('pre');
    expect(el.className).toContain('bg-[var(--code-block-bg)]');
    expect(el.className).toContain('border-[var(--code-block-border)]');
    expect(el.className).not.toContain('bg-gray-100');
  });

  it('merges a custom className with the default styling', () => {
    render(
      <Pre data-testid="pre" className="max-h-40">
        const x = 1;
      </Pre>,
    );
    const el = screen.getByTestId('pre');
    expect(el.className).toContain('bg-[var(--code-block-bg)]');
    expect(el.className).toContain('max-h-40');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Pre>const x = 1;</Pre>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
