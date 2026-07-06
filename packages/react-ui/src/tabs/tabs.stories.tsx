import { expect, userEvent, within } from '@storybook/test';

import { Tab } from './tab';
import { TabList } from './tab-list';
import { TabPanel } from './tab-panel';
import { Tabs } from './tabs';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Tabs> = {
  title: 'React UI/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

function SettingsTabs() {
  return (
    <Tabs defaultValue="account" className="max-w-md">
      <TabList>
        <Tab value="account">Account</Tab>
        <Tab value="password">Password</Tab>
      </TabList>
      <TabPanel value="account">Account settings.</TabPanel>
      <TabPanel value="password">Password settings.</TabPanel>
    </Tabs>
  );
}

export const Default: Story = {
  render: () => <SettingsTabs />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Account settings.')).toBeVisible();

    await userEvent.click(canvas.getByRole('tab', { name: 'Password' }));
    await expect(canvas.getByText('Password settings.')).toBeVisible();
  },
};
