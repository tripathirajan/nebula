import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Tab } from './tab';
import { TabList } from './tab-list';
import { TabPanel } from './tab-panel';
import { Tabs } from './tabs';

function DemoTabs() {
  return (
    <Tabs defaultValue="account">
      <TabList>
        <Tab value="account">Account</Tab>
        <Tab value="password">Password</Tab>
      </TabList>
      <TabPanel value="account">Account settings.</TabPanel>
      <TabPanel value="password">Password settings.</TabPanel>
    </Tabs>
  );
}

describe('Tabs (ui)', () => {
  it('renders the styleless behavior unchanged (switches panel on click)', () => {
    render(<DemoTabs />);
    expect(screen.getByText('Account settings.')).toBeVisible();

    fireEvent.click(screen.getByRole('tab', { name: 'Password' }));
    expect(screen.getByText('Password settings.')).toBeVisible();
  });

  it('applies the active-state token classes', () => {
    render(<DemoTabs />);
    expect(screen.getByRole('tab', { name: 'Account' }).className).toContain(
      'data-[state=active]:border-[var(--tabs-trigger-active-border)]',
    );
  });

  it('has no axe violations', async () => {
    const { container } = render(<DemoTabs />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
