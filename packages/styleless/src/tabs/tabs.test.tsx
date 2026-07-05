import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Tab } from './tab';
import { TabList } from './tab-list';
import { TabPanel } from './tab-panel';
import { Tabs } from './tabs';

import type { ComponentProps } from 'react';

function DemoTabs(props: ComponentProps<typeof Tabs>) {
  return (
    <Tabs defaultValue="account" {...props}>
      <TabList>
        <Tab value="account">Account</Tab>
        <Tab value="password">Password</Tab>
        <Tab value="billing" disabled>
          Billing
        </Tab>
      </TabList>
      <TabPanel value="account">Account panel content.</TabPanel>
      <TabPanel value="password">Password panel content.</TabPanel>
      <TabPanel value="billing">Billing panel content.</TabPanel>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('wires up role="tablist"/"tab"/"tabpanel" with matching aria-controls/aria-labelledby', () => {
    render(<DemoTabs />);
    const tablist = screen.getByRole('tablist');
    const accountTab = screen.getByRole('tab', { name: 'Account' });
    const accountPanel = screen.getByText('Account panel content.');

    expect(tablist).toBeInTheDocument();
    expect(accountTab).toHaveAttribute('aria-controls', accountPanel.id);
    expect(accountPanel).toHaveAttribute('aria-labelledby', accountTab.id);
  });

  it('selects the defaultValue tab initially and shows only its panel', () => {
    render(<DemoTabs />);
    expect(screen.getByRole('tab', { name: 'Account' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Account panel content.')).toBeVisible();
    expect(screen.getByText('Password panel content.')).not.toBeVisible();
  });

  it('automatic activation: ArrowRight moves focus and selects the newly-focused tab', () => {
    render(<DemoTabs />);
    const accountTab = screen.getByRole('tab', { name: 'Account' });
    const passwordTab = screen.getByRole('tab', { name: 'Password' });

    accountTab.focus();
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' });

    expect(passwordTab).toHaveFocus();
    expect(passwordTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Password panel content.')).toBeVisible();
  });

  it('manual activation mode: arrow keys move focus without selecting until Enter/Space', () => {
    render(<DemoTabs activationMode="manual" />);
    const accountTab = screen.getByRole('tab', { name: 'Account' });
    const passwordTab = screen.getByRole('tab', { name: 'Password' });

    accountTab.focus();
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' });

    expect(passwordTab).toHaveFocus();
    expect(passwordTab).toHaveAttribute('aria-selected', 'false');

    fireEvent.click(passwordTab);
    expect(passwordTab).toHaveAttribute('aria-selected', 'true');
  });

  it('excludes disabled tabs from arrow-key navigation', () => {
    render(<DemoTabs />);
    const passwordTab = screen.getByRole('tab', { name: 'Password' });
    const billingTab = screen.getByRole('tab', { name: 'Billing' });

    expect(billingTab).toHaveAttribute('data-disabled', '');

    passwordTab.focus();
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' });

    // Billing is disabled and excluded from the query selector TabList uses,
    // so focus should not land on it.
    expect(billingTab).not.toHaveFocus();
  });

  it('has no axe violations', async () => {
    const { container } = render(<DemoTabs />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
