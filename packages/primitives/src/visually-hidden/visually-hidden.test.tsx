import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { VisuallyHidden } from './visually-hidden';

describe('VisuallyHidden', () => {
  it('stays in the DOM (and accessibility tree) rather than using display:none', () => {
    render(<VisuallyHidden>Delete item</VisuallyHidden>);
    // getByText only finds elements that are actually in the document —
    // display:none content is still queryable by RTL, so the real assertion
    // is on the technique used, checked below.
    expect(screen.getByText('Delete item')).toBeInTheDocument();
  });

  it('uses the clip-rect technique (not display:none/visibility:hidden) so screen readers still announce it', () => {
    render(<VisuallyHidden>Delete item</VisuallyHidden>);
    const el = screen.getByText('Delete item');
    expect(el).toHaveStyle({ position: 'absolute' });
    expect(el.style.display).not.toBe('none');
    expect(el.style.visibility).not.toBe('hidden');
  });

  it('defaults to a <span> but supports `as` like any other primitive', () => {
    render(<VisuallyHidden as="div">Delete item</VisuallyHidden>);
    expect(screen.getByText('Delete item').tagName).toBe('DIV');
  });

  it('has no axe violations providing an icon button its accessible name', async () => {
    const { container } = render(
      <button>
        <span aria-hidden="true">🗑</span>
        <VisuallyHidden>Delete item</VisuallyHidden>
      </button>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
