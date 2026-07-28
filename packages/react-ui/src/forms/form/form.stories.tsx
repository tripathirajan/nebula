import { expect, fireEvent, fn, within } from '@storybook/test';

import { Button } from '../../actions/button/button';
import { Field } from '../field/field';
import { FieldControl } from '../field/field-control';
import { FieldLabel } from '../field/field-label';
import { Input } from '../input/input';

import { Form } from './form';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Form> = {
  title: 'React UI/Forms/Form',
  component: Form,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { onSubmit: fn() },
  render: (args) => (
    <Form {...args} className="w-64">
      <Field>
        <FieldLabel htmlFor="email-form-story">Email</FieldLabel>
        <FieldControl asChild>
          <Input id="email-form-story" type="email" />
        </FieldControl>
      </Field>
      <Button type="submit">Submit</Button>
    </Form>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    fireEvent.click(canvas.getByRole('button', { name: 'Submit' }));
    await expect(args.onSubmit).toHaveBeenCalledTimes(1);
  },
};
