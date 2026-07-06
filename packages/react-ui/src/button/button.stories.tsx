import { expect, fn, userEvent, within } from '@storybook/test';

import { Button } from './button';

import type { Meta, StoryObj } from '@storybook/react';

// Explicit `Meta<typeof Button>` annotation rather than `satisfies` — with
// `satisfies`, `tsc` has to infer and print `meta`'s full literal type
// (required since `declaration: true` is on repo-wide), and that type
// includes `ReturnType<typeof fn>` from `args.onClick`, which resolves to a
// duplicate `@vitest/spy` version living at an unexported pnpm store path
// (`.pnpm/@vitest+spy@2.0.5/...`) — TS2742 "cannot be named without a
// reference to [that path]". An explicit annotation sidesteps the problem
// entirely: `tsc` checks `meta` against the already-named `Meta<typeof
// Button>` type instead of inferring+printing a fresh one. (Compare
// `packages/primitives/src/form/form.stories.tsx`'s `Default: Story = {
// args: { onSubmit: fn() } }` — same `fn()`-inside-an-annotated-const
// pattern, same reason it doesn't hit this error.)
const meta: Meta<typeof Button> = {
  title: 'React UI/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    // theme.css must be loaded for the CSS-var-backed variants to render
    // meaningfully — see .storybook/preview.ts.
  },
  args: { onClick: fn() },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Save changes' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Cancel' },
};

export const Danger: Story = {
  args: { variant: 'danger', children: 'Delete account' },
};

export const Loading: Story = {
  args: { variant: 'primary', loading: true, children: 'Saving…' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute('aria-busy', 'true');
  },
};

export const Disabled: Story = {
  args: { variant: 'primary', disabled: true, children: "Can't click me" },
};

export const AsChildLink: Story = {
  name: 'asChild renders an anchor',
  render: (args) => (
    <Button {...args} asChild>
      <a href="#nebula">Link styled as a button</a>
    </Button>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link');
    await expect(link.tagName).toBe('A');
    await userEvent.click(link);
  },
};
