import { expect, userEvent, within } from '@storybook/test';

import { Field } from './field';
import { FieldControl } from './field-control';
import { FieldDescription } from './field-description';
import { FieldError } from './field-error';
import { FieldLabel } from './field-label';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Headless/Field',
  component: Field,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Field>
      <FieldLabel>Email</FieldLabel>
      <FieldControl asChild>
        <input type="email" />
      </FieldControl>
      <FieldDescription>We&apos;ll never share your email.</FieldDescription>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');
    const label = canvas.getByText('Email');

    await expect(label).toHaveAttribute('for', input.id);
    await expect(input).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining(`${input.id}-description`),
    );
  },
};

export const Invalid: Story = {
  render: () => (
    <Field invalid required>
      <FieldLabel>Email</FieldLabel>
      <FieldControl asChild>
        <input type="email" />
      </FieldControl>
      <FieldError>A valid email is required.</FieldError>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');

    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAttribute('aria-required', 'true');
    await expect(canvas.getByRole('alert')).toHaveTextContent('A valid email is required.');
    await userEvent.click(input);
    await expect(input).toHaveFocus();
  },
};
