import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Button } from './button';

describe('Button', () => {
  it('defaults to type="button" so it never silently submits an ancestor form', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toHaveAttribute('type', 'button');
  });

  it('respects an explicit type="submit"', () => {
    render(<Button type="submit">Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'submit');
  });

  it('renders asChild onto the given element without adding a wrapper', () => {
    render(
      <Button asChild>
        <a href="/pricing">See pricing</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'See pricing' });
    expect(link.tagName).toBe('A');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Button>Click me</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
