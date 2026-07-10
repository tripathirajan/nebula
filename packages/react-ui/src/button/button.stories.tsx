import { expect, fn, userEvent, within } from '@storybook/test';
import * as React from 'react';

import { Button } from './button';

import type { Meta, StoryObj } from '@storybook/react';

const VARIANTS = ['default', 'ghost', 'text', 'link'] as const;
const COLORS = [
  'primary',
  'secondary',
  'accent',
  'neutral',
  'info',
  'success',
  'warning',
  'danger',
] as const;

/** Row/column labels in the `AllVariants` matrix — all caps for a clear visual break from the rendered examples themselves. */
const GRID_HEADING_STYLE: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  textAlign: 'center',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

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
  args: { onClick: fn(), children: 'Button' },
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    color: { control: 'select', options: COLORS },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Every `variant` × `color` combination at a glance — rows are shape,
 * columns are hue. This is the reference for "what does X look like",
 * so individual variant/color combinations don't each need their own
 * story; use `Playground` below to try a specific combination interactively.
 */
export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `80px repeat(${COLORS.length}, max-content)`,
        gap: '12px 16px',
        alignItems: 'center',
      }}
    >
      <div />
      {COLORS.map((color) => (
        <div key={color} style={GRID_HEADING_STYLE}>
          {color}
        </div>
      ))}
      {VARIANTS.map((variant) => (
        <React.Fragment key={variant}>
          <div style={{ ...GRID_HEADING_STYLE, textAlign: 'left' }}>{variant}</div>
          {COLORS.map((color) => (
            <Button key={`${variant}-${color}`} variant={variant} color={color}>
              Button
            </Button>
          ))}
        </React.Fragment>
      ))}
    </div>
  ),
};

/** Try any `variant`/`color`/`size` combination via the Controls panel. */
export const Playground: Story = {
  args: { variant: 'default', color: 'primary' },
};

export const Loading: Story = {
  args: { color: 'primary', loading: true, children: 'Saving…' },
  parameters: { controls: { disable: true } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute('aria-busy', 'true');
  },
};

export const AsChildLink: Story = {
  name: 'asChild renders an anchor',
  parameters: { controls: { disable: true } },
  render: (args) => (
    <Button {...args} asChild>
      <a href="#">Link styled as a button</a>
    </Button>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link');
    await expect(link.tagName).toBe('A');
    await userEvent.click(link);
  },
};
