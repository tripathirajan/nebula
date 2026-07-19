import { Backdrop } from './backdrop';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Backdrop> = {
  title: 'React UI/Backdrop',
  component: Backdrop,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const colors = ['#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#2563eb', '#7c3aed', '#db2777', '#0891b2'];

function BackgroundContent() {
  return (
    <div className="grid grid-cols-4 gap-2 p-6">
      {colors.map((color) => (
        <div key={color} style={{ backgroundColor: color }} className="flex h-32 items-center justify-center rounded-xl text-sm font-medium text-white">
          Content
        </div>
      ))}
    </div>
  );
}

export const Solid: Story = {
  render: () => (
    <div className="relative h-[420px] overflow-hidden">
      <BackgroundContent />
      <Backdrop className="absolute" />
    </div>
  ),
};

export const Blur: Story = {
  name: 'Blur (real frosted-glass — blur + saturation, not just a blurred tint)',
  render: () => (
    <div className="relative h-[420px] overflow-hidden">
      <BackgroundContent />
      <Backdrop variant="blur" className="absolute" />
    </div>
  ),
};

export const BlurIntensity: Story = {
  name: 'Blur intensity (subtle / regular / strong)',
  render: () => (
    <div className="grid grid-cols-3 gap-4 p-4">
      {(['subtle', 'regular', 'strong'] as const).map((intensity) => (
        <div key={intensity} className="relative h-64 overflow-hidden rounded-xl">
          <BackgroundContent />
          <Backdrop variant="blur" blurIntensity={intensity} className="absolute" />
          <p className="absolute bottom-2 left-2 text-xs font-medium text-white">blurIntensity=&quot;{intensity}&quot;</p>
        </div>
      ))}
    </div>
  ),
};

export const SideBySide: Story = {
  name: 'Solid vs. blur, side by side',
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-4">
      <div className="relative h-64 overflow-hidden rounded-xl">
        <BackgroundContent />
        <Backdrop className="absolute" />
        <p className="absolute bottom-2 left-2 text-xs font-medium text-white">variant=&quot;solid&quot;</p>
      </div>
      <div className="relative h-64 overflow-hidden rounded-xl">
        <BackgroundContent />
        <Backdrop variant="blur" className="absolute" />
        <p className="absolute bottom-2 left-2 text-xs font-medium text-white">variant=&quot;blur&quot;</p>
      </div>
    </div>
  ),
};
