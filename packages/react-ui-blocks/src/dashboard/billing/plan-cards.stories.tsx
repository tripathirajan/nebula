import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';

import { PlanCards } from './plan-cards';

import type { PlanCardsPlan } from './plan-cards';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/Dashboard/Billing/Plan Cards',
  component: PlanCards,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PlanCards>;

export default meta;
type Story = StoryObj<typeof meta>;

const plans: PlanCardsPlan[] = [
  {
    value: 'starter',
    name: 'Starter',
    price: '$0',
    period: '/month',
    description: 'For individuals trying things out',
    features: ['1 project', 'Community support', '1 GB storage'],
  },
  {
    value: 'pro',
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For growing teams',
    badge: 'Most popular',
    features: ['Unlimited projects', 'Priority support', '50 GB storage', 'Custom domains'],
  },
  {
    value: 'enterprise',
    name: 'Enterprise',
    price: '$99',
    period: '/month',
    description: 'For large organizations',
    features: ['Unlimited everything', 'Dedicated support', '1 TB storage', 'SSO'],
  },
];

function PlanCardsDemo() {
  const [value, setValue] = useState('pro');
  return <PlanCards aria-label="Choose a plan" plans={plans} value={value} onValueChange={setValue} />;
}

export const Default: Story = {
  // `args` is unused by `render` below (the demo wrapper owns its own
  // selection state) but still required — `PlanCardsProps['aria-label']`
  // has no default, so `Story['args']` isn't optional for this component.
  args: { plans, 'aria-label': 'Choose a plan' },
  render: () => <PlanCardsDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const starter = canvas.getByRole('radio', { name: /Starter/ });
    const pro = canvas.getByRole('radio', { name: /Pro/ });

    expect(pro).toHaveAttribute('aria-checked', 'true');
    expect(starter).toHaveAttribute('aria-checked', 'false');

    await userEvent.click(starter);
    expect(starter).toHaveAttribute('aria-checked', 'true');
  },
};
