import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Label } from '../label/label';

import { Input } from './input';

describe('Input', () => {
  it('wires `invalid` to `aria-invalid` so screen readers announce the error state', () => {
    render(<Input aria-label="Email" invalid />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });

  it('omits `aria-invalid` entirely when not invalid, rather than setting it to "false"', () => {
    render(<Input aria-label="Email" />);
    expect(screen.getByLabelText('Email')).not.toHaveAttribute('aria-invalid');
  });

  it('forwards a ref to the underlying <input> DOM node', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input aria-label="Email" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('has no axe violations when properly labeled', async () => {
    const { container } = render(
      <>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
