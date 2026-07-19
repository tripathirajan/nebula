import { Field, FieldControl, FieldLabel } from '@nebula-lab/react-ui/field';
import { Input } from '@nebula-lab/react-ui/input';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';

import { EntityFormLayout } from './entity-form-layout';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/Forms/Entity Form Layout',
  component: EntityFormLayout,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof EntityFormLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

function UserEditDemo() {
  const [verified, setVerified] = useState(true);

  return (
    <EntityFormLayout
      avatarFallback="J"
      helperText="Allowed *.jpeg, *.jpg, *.png, *.gif max 3.1 MB"
      onAvatarChange={() => {}}
      toggles={[{ key: 'verified', label: 'Email verified', checked: verified, onCheckedChange: setVerified }]}
      dangerActions={[
        { label: 'Ban this user', onClick: () => {} },
        { label: 'Delete user', onClick: () => {} },
      ]}
      onSubmit={(event) => event.preventDefault()}
    >
      <Field>
        <FieldLabel>Full name</FieldLabel>
        <FieldControl asChild>
          <Input name="name" defaultValue="Jayvion Simon" />
        </FieldControl>
      </Field>
      <Field>
        <FieldLabel>Email address</FieldLabel>
        <FieldControl asChild>
          <Input name="email" type="email" defaultValue="jayvion@example.com" />
        </FieldControl>
      </Field>
      <Field>
        <FieldLabel>Phone number</FieldLabel>
        <FieldControl asChild>
          <Input name="phone" defaultValue="+1 416-555-0132" />
        </FieldControl>
      </Field>
      <Field>
        <FieldLabel>Country</FieldLabel>
        <FieldControl asChild>
          <Input name="country" defaultValue="Canada" />
        </FieldControl>
      </Field>
    </EntityFormLayout>
  );
}

export const UserEdit: Story = {
  name: 'User edit (avatar + toggles + danger actions)',
  // `args` is unused by `render` below (the demo wrapper owns its own
  // toggle state) but still required — `avatarFallback`/`children` have
  // no default, so `Story['args']` isn't optional for this component.
  args: { avatarFallback: 'J', children: null },
  render: () => <UserEditDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText('Full name')).toHaveValue('Jayvion Simon');
    await expect(canvas.getByRole('switch', { name: 'Email verified' })).toHaveAttribute('aria-checked', 'true');

    await userEvent.click(canvas.getByRole('switch', { name: 'Email verified' }));
    await expect(canvas.getByRole('switch', { name: 'Email verified' })).toHaveAttribute('aria-checked', 'false');
  },
};

export const Minimal: Story = {
  name: 'No toggles or danger actions (read-only avatar)',
  args: { avatarFallback: 'P', children: null },
  render: () => (
    <EntityFormLayout avatarFallback="P" onSubmit={(event) => event.preventDefault()}>
      <Field>
        <FieldLabel>Product name</FieldLabel>
        <FieldControl asChild>
          <Input name="name" />
        </FieldControl>
      </Field>
    </EntityFormLayout>
  ),
};
