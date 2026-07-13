import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { ProductGallery } from './product-gallery';

const images = [
  { src: '/sneaker-1.jpg', alt: 'Sneaker, side view' },
  { src: '/sneaker-2.jpg', alt: 'Sneaker, top view' },
  { src: '/sneaker-3.jpg', alt: 'Sneaker, sole view' },
];

describe('ProductGallery (block)', () => {
  it('renders every slide and a thumbnail per image', () => {
    render(<ProductGallery images={images} />);
    expect(screen.getAllByAltText(/Sneaker/)).toHaveLength(images.length);
    expect(screen.getAllByRole('tab')).toHaveLength(images.length);
    expect(screen.getByRole('tab', { name: 'View image 1 of 3' })).toHaveAttribute('aria-selected', 'true');
  });

  it('does not render a thumbnail strip or counter for a single image', () => {
    render(<ProductGallery images={images.slice(0, 1)} />);
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /next slide/i })).not.toBeInTheDocument();
  });

  it('jumps to a slide when its thumbnail is clicked', () => {
    render(<ProductGallery images={images} />);
    fireEvent.click(screen.getByRole('tab', { name: 'View image 3 of 3' }));
    expect(screen.getByRole('tab', { name: 'View image 3 of 3' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'View image 1 of 3' })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByText('3 / 3')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<ProductGallery images={images} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
