import { NativeSelect } from './native-select';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof NativeSelect> = {
  title: 'React UI/Forms/NativeSelect',
  component: NativeSelect,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <NativeSelect defaultValue="us" aria-label="Country" className="w-48">
      <option value="us">United States</option>
      <option value="ca">Canada</option>
      <option value="mx">Mexico</option>
    </NativeSelect>
  ),
};

export const Invalid: Story = {
  render: () => (
    <NativeSelect invalid defaultValue="" aria-label="Country" className="w-48">
      <option value="" disabled>
        Choose a country
      </option>
      <option value="us">United States</option>
    </NativeSelect>
  ),
};
