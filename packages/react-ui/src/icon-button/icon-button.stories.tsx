import { expect, within } from '@storybook/test';
import * as React from 'react';

import { IconButton } from './icon-button';

import type { Meta, StoryObj } from '@storybook/react';

const SettingsIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <circle cx={12} cy={12} r={3} />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

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

const meta: Meta<typeof IconButton> = {
  title: 'React UI/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { 'aria-label': 'Settings', children: <SettingsIcon /> },
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
            <IconButton
              key={`${variant}-${color}`}
              variant={variant}
              color={color}
              aria-label="Settings"
            >
              <SettingsIcon />
            </IconButton>
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
    await expect(canvas.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
  },
};
