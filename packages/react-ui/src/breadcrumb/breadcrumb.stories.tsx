import { expect, within } from '@storybook/test';

import { Breadcrumb } from './breadcrumb';
import { BreadcrumbItem } from './breadcrumb-item';
import { BreadcrumbLink } from './breadcrumb-link';
import { BreadcrumbList } from './breadcrumb-list';
import { BreadcrumbPage } from './breadcrumb-page';
import { BreadcrumbSeparator } from './breadcrumb-separator';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'React UI/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
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

export const CustomSeparator: Story = {
  name: 'Custom separator text (overrides the default chevron)',
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Docs</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Getting started</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};
