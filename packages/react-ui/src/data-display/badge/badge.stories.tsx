import * as React from 'react';

import { Badge } from './badge';

import type { Meta, StoryObj } from '@storybook/react';

const VARIANTS = ['default', 'outline'] as const;
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

const meta = {
  title: 'React UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { children: 'Badge' },
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    color: { control: 'select', options: COLORS },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every `variant` × `color` combination at a glance — use `Playground` to try one interactively. */
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
            <Badge key={`${variant}-${color}`} variant={variant} color={color}>
              Badge
            </Badge>
          ))}
        </React.Fragment>
      ))}
    </div>
  ),
};

/** Try any `variant`/`color` combination via the Controls panel. */
export const Playground: Story = {
  args: { variant: 'default', color: 'primary' },
};
