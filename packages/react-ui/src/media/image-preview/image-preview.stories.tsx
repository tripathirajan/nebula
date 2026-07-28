import { ImagePreview } from './image-preview';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ImagePreview> = {
  title: 'React UI/Media/ImagePreview',
  component: ImagePreview,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const demoFile = new File([new Blob()], 'photo.png', { type: 'image/png' });

export const Default: Story = {
  render: () => <ImagePreview file={demoFile} alt="Selected photo" className="h-24 w-24" />,
};
