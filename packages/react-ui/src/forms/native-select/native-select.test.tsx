import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { NativeSelect } from './native-select';

describe('NativeSelect (ui)', () => {
  it('renders a native select with its options', () => {
    render(
      <NativeSelect aria-label="Country" defaultValue="ca">
        <option value="us">United States</option>
        <option value="ca">Canada</option>
      </NativeSelect>,
    );
    const select = screen.getByRole('combobox', { name: 'Country' }) as HTMLSelectElement;
    expect(select.value).toBe('ca');
  });

  it('matches Input styling via the shared inputVariants recipe', () => {
    render(
      <NativeSelect aria-label="Country">
        <option value="us">United States</option>
      </NativeSelect>,
    );
    expect(screen.getByRole('combobox').className).toContain('rounded-[var(--radius-field)]');
  });

  it('sets aria-invalid when invalid', () => {
    render(
      <NativeSelect aria-label="Country" invalid>
        <option value="us">United States</option>
      </NativeSelect>,
    );
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <NativeSelect aria-label="Country">
        <option value="us">United States</option>
      </NativeSelect>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
