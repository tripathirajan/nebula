
import { AspectRatio } from '../aspect-ratio/aspect-ratio';
import { Center } from '../center/center';
import { Container } from '../container/container';
import { Flex } from '../flex/flex';
import { Grid } from '../grid/grid';
import { Inline } from '../inline/inline';
import { Stack } from '../stack/stack';

import { Box } from './box';

import type { Meta, StoryObj } from '@storybook/react';

/**
 * `Box` alongside its `Flex`-family siblings (`Stack`, `Inline`, `Center`),
 * `Grid`, `Container`, and `AspectRatio` — one story per layout primitive
 * would be mostly-identical noise, so this shows them composed together
 * the way they're meant to be used.
 */
const meta = {
  title: 'Primitives/Layout',
  component: Box,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

const swatch = (label: string) => (
  <Box
    key={label}
    className="flex h-16 items-center justify-center rounded-md border bg-gray-50 text-xs"
  >
    {label}
  </Box>
);

export const StackAndInline: Story = {
  render: () => (
    <Stack gap={16} className="max-w-sm">
      <Inline gap={8}>{['React', 'TypeScript', 'Tailwind'].map(swatch)}</Inline>
      <Flex direction="row" justify="between" align="center" className="rounded-md border p-3">
        <span>Left</span>
        <span>Right</span>
      </Flex>
    </Stack>
  ),
};

export const GridExample: Story = {
  render: () => (
    <Grid columns={3} gap={12} className="max-w-lg">
      {['One', 'Two', 'Three', 'Four', 'Five', 'Six'].map(swatch)}
    </Grid>
  ),
};

export const ContainerAndCenter: Story = {
  render: () => (
    <Container size="sm" className="border">
      <Center style={{ height: 120 }}>Centered content inside a capped-width Container</Center>
    </Container>
  ),
};

export const AspectRatioExample: Story = {
  name: 'AspectRatio (16:9)',
  render: () => (
    <Box className="max-w-sm">
      <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-md bg-gray-200">
        <Center className="h-full w-full text-sm text-gray-500">16 / 9</Center>
      </AspectRatio>
    </Box>
  ),
};
