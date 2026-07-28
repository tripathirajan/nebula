import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Badge } from './badge';

describe('Badge (ui)', () => {
  it('defaults to the default variant / primary color', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New').className).toContain('bg-[var(--badge-primary-bg)]');
  });

  it('applies the requested color', () => {
    render(<Badge color="success">Active</Badge>);
    expect(screen.getByText('Active').className).toContain('bg-[var(--badge-success-bg)]');
  });

  it('outline variant renders a colored border/text with no filled background', () => {
    render(
      <Badge variant="outline" color="danger">
        Failed
      </Badge>,
    );
    const classes = screen.getByText('Failed').className.split(' ');
    expect(classes).toContain('border-[var(--badge-danger-bg)]');
    expect(classes).toContain('text-[var(--badge-danger-bg)]');
    expect(classes).not.toContain('bg-[var(--badge-danger-bg)]');
  });

  it('renders as a span, not an interactive element', () => {
    render(<Badge>Static</Badge>);
    expect(screen.getByText('Static').tagName).toBe('SPAN');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Badge color="warning">3 pending</Badge>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
