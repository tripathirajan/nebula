import { expect, userEvent, within } from '@storybook/test';


import { Tab } from './tab';
import { TabList } from './tab-list';
import { TabPanel } from './tab-panel';
import { Tabs } from './tabs';

import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';

/**
 * Headless — no styling, only behavior + ARIA. `@nebula/react-ui` will wrap this
 * in a themed `Tabs` once it exists; these stories exist to prove the
 * keyboard/ARIA contract, not to look good.
 */
const meta = {
  title: 'Styleless/Tabs',
  component: Tabs,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

function DemoTabs(props: ComponentProps<typeof Tabs>) {
  return (
    <Tabs defaultValue="account" style={{ width: 320 }} {...props}>
      <TabList style={{ display: 'flex', gap: 4, borderBottom: '1px solid #e5e7eb' }}>
        <Tab value="account" style={{ padding: '8px 12px' }}>
          Account
        </Tab>
        <Tab value="password" style={{ padding: '8px 12px' }}>
          Password
        </Tab>
        <Tab value="billing" disabled style={{ padding: '8px 12px', opacity: 0.5 }}>
          Billing (disabled)
        </Tab>
      </TabList>
      <TabPanel value="account" style={{ padding: 12 }}>
        Account panel content.
      </TabPanel>
      <TabPanel value="password" style={{ padding: 12 }}>
        Password panel content.
      </TabPanel>
      <TabPanel value="billing" style={{ padding: 12 }}>
        Billing panel content.
      </TabPanel>
    </Tabs>
  );
}

export const Default: Story = {
  render: () => <DemoTabs />,
};

export const KeyboardNavigation: Story = {
  render: () => <DemoTabs />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const accountTab = canvas.getByRole('tab', { name: 'Account' });
    const passwordTab = canvas.getByRole('tab', { name: 'Password' });

    await expect(accountTab).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByText('Account panel content.')).toBeVisible();

    accountTab.focus();
    await userEvent.keyboard('{ArrowRight}');

    await expect(passwordTab).toHaveFocus();
    await expect(passwordTab).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByText('Password panel content.')).toBeVisible();
  },
};

export const ManualActivation: Story = {
  render: () => <DemoTabs activationMode="manual" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const accountTab = canvas.getByRole('tab', { name: 'Account' });
    const passwordTab = canvas.getByRole('tab', { name: 'Password' });

    accountTab.focus();
    await userEvent.keyboard('{ArrowRight}');

    // Manual mode: focus moves but selection doesn't follow until activated.
    await expect(passwordTab).toHaveFocus();
    await expect(passwordTab).toHaveAttribute('aria-selected', 'false');

    await userEvent.keyboard('{Enter}');
    await expect(passwordTab).toHaveAttribute('aria-selected', 'true');
  },
};
