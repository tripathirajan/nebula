import { expect, within } from '@storybook/test';

import { Button } from '../button/button';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Card> = {
  title: 'React UI/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Project settings</CardTitle>
        <CardDescription>Manage your project&apos;s configuration.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Everything here is scoped to the current workspace.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Save changes</Button>
      </CardFooter>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'Project settings' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Save changes' })).toBeInTheDocument();
  },
};

export const ContentOnly: Story = {
  render: () => (
    <Card className="w-80">
      <CardContent className="pt-6">Just body content, no header/footer.</CardContent>
    </Card>
  ),
};

export const WithIcon: Story = {
  name: 'Header with icon',
  render: () => (
    <Card className="w-80">
      <CardHeader
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="9" strokeWidth="2" />
          </svg>
        }
      >
        <CardTitle>Project settings</CardTitle>
        <CardDescription>Manage your project&apos;s configuration.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">The icon sits beside the title/description stack.</p>
      </CardContent>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'Project settings' })).toBeInTheDocument();
  },
};

export const NoBorder: Story = {
  name: 'Header without the dashed border',
  render: () => (
    <Card className="w-80">
      <CardHeader bordered={false}>
        <CardTitle>Project settings</CardTitle>
        <CardDescription>Manage your project&apos;s configuration.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">No divider between the header and this content.</p>
      </CardContent>
    </Card>
  ),
};

export const TitleOnly: Story = {
  name: 'Title only, no CardHeader',
  render: () => (
    <Card className="w-80">
      <CardTitle className="p-6 pb-0">Just a title</CardTitle>
      <CardContent>
        <p className="text-sm">Skips CardHeader entirely — no border, no icon layout.</p>
      </CardContent>
    </Card>
  ),
};
