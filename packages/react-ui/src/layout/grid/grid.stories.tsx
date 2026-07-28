import { Grid } from './grid';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Grid> = {
  title: 'React UI/Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

function Cell(props: { children: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius-selector)] bg-[var(--color-base-200)] p-4 text-center">
      {props.children}
    </div>
  );
}

export const ThreeColumns: Story = {
  render: () => (
    <Grid columns={3} gap={16}>
      <Cell>1</Cell>
      <Cell>2</Cell>
      <Cell>3</Cell>
      <Cell>4</Cell>
      <Cell>5</Cell>
      <Cell>6</Cell>
    </Grid>
  ),
};

export const CustomTracks: Story = {
  render: () => (
    <Grid columns="200px 1fr" gap="1rem">
      <Cell>Sidebar</Cell>
      <Cell>Content</Cell>
    </Grid>
  ),
};
