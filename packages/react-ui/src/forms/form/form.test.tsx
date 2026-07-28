import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Form } from './form';

describe('Form (ui)', () => {
  it('applies a vertical-stack layout by default', () => {
    render(<Form data-testid="form" />);
    const form = screen.getByTestId('form');
    expect(form.className).toContain('flex-col');
    expect(form.className).toContain('gap-4');
  });

  it('defaults noValidate and prevents the native submit navigation', () => {
    const onSubmit = vi.fn();
    render(
      <Form onSubmit={onSubmit} data-testid="form">
        <button type="submit">Submit</button>
      </Form>,
    );
    const form = screen.getByTestId('form');
    expect(form).toHaveAttribute('novalidate');
    fireEvent.submit(form);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    const [event] = onSubmit.mock.calls[0] ?? [];
    expect(event?.defaultPrevented).toBe(true);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Form />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
