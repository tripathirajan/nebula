import { expect, within } from '@storybook/test';

import { Breadcrumb } from './breadcrumb';
import { BreadcrumbItem } from './breadcrumb-item';
import { BreadcrumbLink } from './breadcrumb-link';
import { BreadcrumbList } from './breadcrumb-list';
import { BreadcrumbPage } from './breadcrumb-page';
import { BreadcrumbSeparator } from './breadcrumb-separator';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Styleless/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList style={{ display: 'flex', gap: 8, listStyle: 'none' }}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Profile</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    await expect(canvas.getByText('Profile')).toHaveAttribute('aria-current', 'page');
  },
};
