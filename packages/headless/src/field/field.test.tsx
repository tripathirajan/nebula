import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Field } from './field';
import { FieldControl } from './field-control';
import { FieldDescription } from './field-description';
import { FieldError } from './field-error';
import { FieldLabel } from './field-label';

describe('Field', () => {
  it('links FieldLabel to FieldControl via generated ids', () => {
    render(
      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldControl asChild>
          <input type="email" />
        </FieldControl>
      </Field>,
    );

    const input = screen.getByRole('textbox');
    const label = screen.getByText('Email');
    expect(label).toHaveAttribute('for', input.id);
  });

  it('sets aria-describedby to the description id when present', () => {
    render(
      <Field>
        <FieldControl asChild>
          <input type="email" />
        </FieldControl>
        <FieldDescription>Helper text</FieldDescription>
      </Field>,
    );

    const input = screen.getByRole('textbox');
    const description = screen.getByText('Helper text');
    expect(input.getAttribute('aria-describedby')).toContain(description.id);
  });

  it('reflects invalid/required/disabled from Field onto FieldControl', () => {
    render(
      <Field invalid required disabled>
        <FieldControl asChild>
          <input type="email" />
        </FieldControl>
      </Field>,
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(input).toBeDisabled();
  });

  it('renders FieldError with role="alert"', () => {
    render(
      <Field invalid>
        <FieldControl asChild>
          <input type="email" />
        </FieldControl>
        <FieldError>Required</FieldError>
      </Field>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });

  it('lets an explicit prop on a sub-part override the context default', () => {
    render(
      <Field required>
        <FieldLabel required={false}>Email</FieldLabel>
        <FieldControl asChild>
          <input type="email" />
        </FieldControl>
      </Field>,
    );

    expect(screen.queryByText('(required)')).not.toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Field invalid required>
        <FieldLabel>Email</FieldLabel>
        <FieldControl asChild>
          <input type="email" />
        </FieldControl>
        <FieldDescription>We&apos;ll never share this.</FieldDescription>
        <FieldError>A valid email is required.</FieldError>
      </Field>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
