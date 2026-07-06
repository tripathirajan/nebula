import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Label } from '../label/label';

import { NativeSelect } from './native-select';

describe('NativeSelect', () => {
  it('wires `invalid` to `aria-invalid`', () => {
    render(
      <NativeSelect aria-label="Country" invalid>
        <option value="us">United States</option>
      </NativeSelect>,
    );
    expect(screen.getByLabelText('Country')).toHaveAttribute('aria-invalid', 'true');
  });

  it('omits `aria-invalid` entirely when not invalid, rather than setting it to "false"', () => {
    render(
      <NativeSelect aria-label="Country">
        <option value="us">United States</option>
      </NativeSelect>,
    );
    expect(screen.getByLabelText('Country')).not.toHaveAttribute('aria-invalid');
  });

  it('forwards a ref to the underlying <select> DOM node', () => {
    const ref = React.createRef<HTMLSelectElement>();
    render(
      <NativeSelect aria-label="Country" ref={ref}>
        <option value="us">United States</option>
      </NativeSelect>,
    );
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  it('has no axe violations when properly labeled', async () => {
    const { container } = render(
      <>
        <Label htmlFor="country">Country</Label>
        <NativeSelect id="country">
          <option value="us">United States</option>
        </NativeSelect>
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
