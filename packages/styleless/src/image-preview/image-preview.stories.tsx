import { expect, within } from '@storybook/test';

import { ImagePreview } from './image-preview';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ImagePreview> = {
  title: 'Styleless/ImagePreview',
  component: ImagePreview,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

// A tiny 1x1 red PNG, decoded to a real File so `URL.createObjectURL` has
// something real to wrap — same "no network/fixture dependency" approach
// this repo's other file-based stories use.
const samplePngBase64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

function base64ToFile(base64: string, filename: string, mimeType: string): File {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], filename, { type: mimeType });
}

export const Default: Story = {
  render: () => {
    const file = base64ToFile(samplePngBase64, 'swatch.png', 'image/png');
    return <ImagePreview file={file} alt="Preview of swatch.png" />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const img = await canvas.findByAltText('Preview of swatch.png');
    await expect(img).toBeInTheDocument();
    await expect(img).toHaveAttribute('src', expect.stringContaining('blob:'));
  },
};
