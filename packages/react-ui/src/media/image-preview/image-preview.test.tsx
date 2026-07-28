import { render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { ImagePreview } from './image-preview';

const demoFile = new File([new Blob()], 'photo.png', { type: 'image/png' });

describe('ImagePreview (ui)', () => {
  // jsdom doesn't implement the Blob URL APIs real browsers do (confirmed:
  // `URL.createObjectURL is not a function` without this) — a minimal stub
  // is enough here since this test is about this component's styling/
  // rendering, not re-verifying `@nebula-lab/styleless`'s `ImagePreview`
  // create/revoke lifecycle, which is a `styleless`-tier test's job.
  beforeAll(() => {
    URL.createObjectURL = () => 'blob:mock-url';
    URL.revokeObjectURL = () => {};
  });


  it('renders an image once the object URL resolves', async () => {
    render(<ImagePreview file={demoFile} alt="Selected photo" />);
    expect(await screen.findByRole('img', { name: 'Selected photo' })).toBeInTheDocument();
  });

  it('applies the thumbnail treatment', async () => {
    render(<ImagePreview file={demoFile} alt="Selected photo" />);
    const image = await screen.findByRole('img', { name: 'Selected photo' });
    expect(image.className).toContain('rounded-[var(--radius-selector)]');
    expect(image.className).toContain('object-cover');
  });

  it('has no axe violations', async () => {
    const { container } = render(<ImagePreview file={demoFile} alt="Selected photo" />);
    await screen.findByRole('img', { name: 'Selected photo' });
    expect(await axe(container)).toHaveNoViolations();
  });
});
