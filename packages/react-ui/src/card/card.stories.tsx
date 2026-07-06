import { expect, within } from '@storybook/test';

import { Button } from '../button/button';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Card> = {
  title: 'React UI/Card',
  component: Card,
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
