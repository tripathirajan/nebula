import { LoginForm } from './login-form';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/LoginForm',
  component: LoginForm,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: (values) => console.log(values),
    footer: (
      <a className="text-sm text-[var(--color-primary)]" href="#">
        Forgot password?
      </a>
    ),
  },
};

export const WithError: Story = {
  args: {
    error: 'Invalid email or password.',
    onSubmit: (values) => console.log(values),
  },
};

export const Submitting: Story = {
  args: {
    isSubmitting: true,
    onSubmit: (values) => console.log(values),
  },
};
