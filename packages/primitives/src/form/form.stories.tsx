import { expect, fn, userEvent, within } from '@storybook/test';

import { Button } from '../button/button';
import { Input } from '../input/input';
import { Label } from '../label/label';
import { Stack } from '../stack/stack';
import { Textarea } from '../textarea/textarea';

import { Form } from './form';

import type { Meta, StoryObj } from '@storybook/react';

/** `Form`, `Label`, `Input`, `Textarea`, and `Button` composed as a real (unstyled) form. */
const meta = {
  title: 'Primitives/Form',
  component: Form,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { onSubmit: fn() },
  render: (args) => (
    <Form {...args} style={{ maxWidth: 320 }}>
      <Stack gap={12}>
        <Stack gap={4}>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required style={{ border: '1px solid', padding: 6 }} />
        </Stack>
        <Stack gap={4}>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            autoResize
            style={{ border: '1px solid', padding: 6 }}
          />
        </Stack>
        <Button type="submit" style={{ border: '1px solid', padding: '6px 12px' }}>
          Submit
        </Button>
      </Stack>
    </Form>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Name'), 'Ada Lovelace');
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
    await expect(args.onSubmit).toHaveBeenCalled();
  },
};
