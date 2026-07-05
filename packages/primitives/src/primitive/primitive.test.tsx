import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it } from 'vitest';

import { Primitive } from './primitive';

describe('Primitive', () => {
  it('renders its default tag (div) when `as` is omitted', () => {
    render(<Primitive data-testid="el">content</Primitive>);
    expect(screen.getByTestId('el').tagName).toBe('DIV');
  });

  it('swaps the rendered tag via `as`', () => {
    render(
      <Primitive as="section" data-testid="el">
        content
      </Primitive>,
    );
    expect(screen.getByTestId('el').tagName).toBe('SECTION');
  });

  it('merges onto a single child via `asChild` instead of adding a wrapper element', () => {
    render(
      <Primitive asChild data-testid="el" className="a">
        <a href="/somewhere" className="b">
          link
        </a>
      </Primitive>,
    );
    const el = screen.getByTestId('el');
    // No extra wrapper — the rendered element is the <a> itself.
    expect(el.tagName).toBe('A');
    expect(el).toHaveAttribute('href', '/somewhere');
    // classNames from both `Primitive` and the child are preserved (merged, not overridden).
    expect(el.className).toContain('a');
    expect(el.className).toContain('b');
  });

  it('forwards a ref to the concrete underlying DOM node for the resolved tag', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <Primitive as="button" ref={ref}>
        click
      </Primitive>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
