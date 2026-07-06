import { expect, fireEvent, waitFor, within } from '@storybook/test';

import { NavigationMenu } from './navigation-menu';
import { NavigationMenuContent } from './navigation-menu-content';
import { NavigationMenuItem } from './navigation-menu-item';
import { NavigationMenuLink } from './navigation-menu-link';
import { NavigationMenuList } from './navigation-menu-list';
import { NavigationMenuPortal } from './navigation-menu-portal';
import { NavigationMenuTrigger } from './navigation-menu-trigger';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Styleless/NavigationMenu',
  component: NavigationMenu,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { openDelay: 0, closeDelay: 0 },
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <NavigationMenu openDelay={args.openDelay} closeDelay={args.closeDelay} aria-label="Main">
      <NavigationMenuList style={{ display: 'flex', gap: 16, listStyle: 'none' }}>
        <NavigationMenuItem value="products">
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuPortal>
            <NavigationMenuContent>
              <a href="/products/a">Product A</a>
              <a href="/products/b">Product B</a>
            </NavigationMenuContent>
          </NavigationMenuPortal>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/docs">Docs</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
    const trigger = canvas.getByRole('button', { name: 'Products' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.pointerEnter(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
    await expect(canvas.getByText('Product A')).toBeInTheDocument();
  },
};
