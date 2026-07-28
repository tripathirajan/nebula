import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Paragraph } from './paragraph';

describe('Paragraph (ui)', () => {
  it('renders a p by default', () => {
    render(<Paragraph data-testid="p">Body copy.</Paragraph>);
    expect(screen.getByTestId('p').tagName).toBe('P');
  });

  it('applies the comfortable-reading line-height class', () => {
    render(<Paragraph data-testid="p">Body copy.</Paragraph>);
    expect(screen.getByTestId('p').className).toContain('leading-relaxed');
  });

  it('merges a custom className with the default styling', () => {
    // `max-w-prose` (not a `text-*` size, which bundles its own line-height
    // and would legitimately conflict/override `leading-relaxed` via
    // tailwind-merge) — a genuinely non-conflicting class to confirm the
    // merge itself works.
    render(
      <Paragraph data-testid="p" className="max-w-prose">
        Body copy.
      </Paragraph>,
    );
    const el = screen.getByTestId('p');
    expect(el.className).toContain('leading-relaxed');
    expect(el.className).toContain('max-w-prose');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Paragraph>Body copy.</Paragraph>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
