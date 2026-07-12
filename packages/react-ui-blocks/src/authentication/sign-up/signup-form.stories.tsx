import { SignupForm } from './signup-form';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/Authentication/Sign Up/Signup Form',
  component: SignupForm,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof SignupForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    error: 'Email already in use',
  },
};
