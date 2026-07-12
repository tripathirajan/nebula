import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@nebula/react-ui';

import { AuthLayout } from './auth-layout';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/Layouts/Auth Layout',
  component: AuthLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AuthLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Acme',
    children: (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Use your email and password to sign in.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--color-base-content)]/80">
            This shell centers its content in a compact auth card.
          </p>
        </CardContent>
      </Card>
    ),
  },
};
