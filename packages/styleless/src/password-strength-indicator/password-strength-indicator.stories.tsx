import { useState } from 'react';

import { PasswordStrengthIndicator } from './password-strength-indicator';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PasswordStrengthIndicator> = {
  title: 'Styleless/PasswordStrengthIndicator',
  component: PasswordStrengthIndicator,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Minimal borders/spacing only, via `classNames` — no design-system tokens,
// since this layer has zero visual opinion by design. `react-ui`'s own
// version is where the real themed look (colored segments per score) lives.
const demoClassNames = {
  root: 'flex items-center gap-2',
  track: 'flex gap-1',
  segment: 'h-1 w-8 rounded bg-gray-300 data-[filled]:bg-gray-800',
  label: 'text-xs text-gray-600',
};

export const VeryWeak: Story = {
  args: { password: 'abc', classNames: demoClassNames },
};

export const Fair: Story = {
  args: { password: 'abcdefgh12', classNames: demoClassNames },
};

export const VeryStrong: Story = {
  args: { password: 'Abcdefgh123!', classNames: demoClassNames },
};

function LiveDemo() {
  const [password, setPassword] = useState('');
  return (
    <div className="flex flex-col gap-2">
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Type a password…"
        className="border border-gray-300 rounded px-2 py-1"
      />
      <PasswordStrengthIndicator password={password} classNames={demoClassNames} />
    </div>
  );
}

export const Live: Story = {
  render: () => <LiveDemo />,
};
