import { expect, within } from '@storybook/test';

import { Paper } from './paper';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Paper> = {
  title: 'React UI/Paper',
  component: Paper,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['elevation', 'outlined'] },
    elevation: { control: 'select', options: [0, 1, 2, 3] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Every distinct look at a glance — use `Playground` to try one interactively. */
export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      {(
        [
          { label: 'Outlined', props: { variant: 'outlined' as const } },
          { label: 'Elevation 0', props: { elevation: 0 as const } },
          { label: 'Elevation 1', props: { elevation: 1 as const } },
          { label: 'Elevation 2', props: { elevation: 2 as const } },
          { label: 'Elevation 3', props: { elevation: 3 as const } },
        ]
      ).map(({ label, props }) => (
        <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {label}
          </div>
          <Paper {...props} className="w-40 p-4 text-sm">
            {label}
          </Paper>
        </div>
      ))}
    </div>
  ),
};

/** Try any `variant`/`elevation` combination via the Controls panel. */
export const Playground: Story = {
  args: { variant: 'elevation', elevation: 1 },
  render: (args) => (
    <Paper {...args} className="w-80 p-4">
      Panel content.
    </Paper>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Panel content.')).toBeInTheDocument();
  },
};
