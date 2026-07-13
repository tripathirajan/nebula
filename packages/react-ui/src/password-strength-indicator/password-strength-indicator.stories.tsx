import { useState } from 'react';

import { PasswordStrengthIndicator } from './password-strength-indicator';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'React UI/PasswordStrengthIndicator',
  component: PasswordStrengthIndicator,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof PasswordStrengthIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VeryWeak: Story = {
  args: { password: 'abc' },
};

export const Fair: Story = {
  args: { password: 'abcdefgh12' },
};

export const VeryStrong: Story = {
  args: { password: 'Abcdefgh123!' },
};

function LiveDemo() {
  const [password, setPassword] = useState('');
  return (
    <div className="flex w-64 flex-col gap-2">
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Type a password…"
        aria-label="Password"
        className="rounded border border-[var(--input-border)] bg-[var(--input-bg)] px-2 py-1 text-sm"
      />
      <PasswordStrengthIndicator password={password} />
    </div>
  );
}

export const Live: Story = {
  args: { password: '' },
  render: () => <LiveDemo />,
};
