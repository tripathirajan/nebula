import { expect, within } from '@storybook/test';
import * as React from 'react';

import { FAB } from './fab';

import type { Meta, StoryObj } from '@storybook/react';

const PlusIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const VARIANTS = ['default', 'ghost'] as const;
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

const meta: Meta<typeof FAB> = {
  title: 'React UI/FAB',
  component: FAB,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { 'aria-label': 'Compose', children: <PlusIcon /> },
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    color: { control: 'select', options: COLORS },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

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
            <FAB key={`${variant}-${color}`} variant={variant} color={color} aria-label="Compose">
              <PlusIcon />
            </FAB>
          ))}
        </React.Fragment>
      ))}
    </div>
  ),
};

/** Try any `variant`/`color`/`size` combination via the Controls panel. */
export const Playground: Story = {
  args: { variant: 'default', color: 'primary' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Compose' })).toBeInTheDocument();
  },
};
