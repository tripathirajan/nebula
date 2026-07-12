import { expect, within } from '@storybook/test';

import { ImagePreview } from './image-preview';

import type { Meta, StoryObj } from '@storybook/react';

/**
 * `ImagePreviewProps` extends `Omit<ImageProps, 'src'>`, and `ImageProps<E>`
 * is `PolymorphicComponentPropsWithRef<E>` — a generic/conditional type.
 * `react-docgen-typescript` (see `.storybook/main.ts`) can't expand that
 * shape, so it can't auto-derive controls for the inherited `<img>` props
 * (`alt`, `className`, `as`, ...) the way it does for a component with a
 * flat, non-generic prop interface. `argTypes` below spells them out by
 * hand instead. `file` gets `control: false` — there's no Controls widget
 * for a real browser `File` object (no text/number/select/etc. maps onto
 * it), so it can only ever come from `render`, never from the Controls
 * panel, regardless of how docgen resolves its type.
 */
const meta: Meta<typeof ImagePreview> = {
  title: 'Styleless/ImagePreview',
  component: ImagePreview,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    file: { control: false, description: 'Not controllable — supply a real `File` via `render`.' },
    alt: { control: 'text' },
    className: { control: 'text' },
  },
  args: {
    alt: 'Preview of swatch.png',
  },
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
  // Spreads `args` onto the real element (unlike the previous version,
  // which hardcoded `alt` and ignored `args` entirely) so `alt`/`className`
  // edits in the Controls panel actually take effect — only `file` stays
  // fixed, since it isn't controllable (see the `meta.argTypes` comment).
  render: (args) => {
    const file = base64ToFile(samplePngBase64, 'swatch.png', 'image/png');
    return <ImagePreview {...args} file={file} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const img = await canvas.findByAltText('Preview of swatch.png');
    await expect(img).toBeInTheDocument();
    await expect(img).toHaveAttribute('src', expect.stringContaining('blob:'));
  },
};
