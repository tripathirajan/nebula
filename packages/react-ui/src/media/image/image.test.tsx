import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Image } from './image';

describe('Image (ui)', () => {
  it('renders an img with the given src/alt', () => {
    render(<Image src="/hero.png" alt="Hero" />);
    const image = screen.getByRole('img', { name: 'Hero' });
    expect(image).toHaveAttribute('src', '/hero.png');
  });

  it('is block-level with a max-width default', () => {
    render(<Image src="/hero.png" alt="Hero" />);
    const image = screen.getByRole('img', { name: 'Hero' });
    expect(image.className).toContain('block');
    expect(image.className).toContain('max-w-full');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Image src="/hero.png" alt="Hero" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
