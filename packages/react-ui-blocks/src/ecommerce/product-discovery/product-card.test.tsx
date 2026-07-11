import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { ProductCard } from './product-card';

describe('ProductCard (block)', () => {
  it('renders name, price, and image', () => {
    render(<ProductCard imageSrc="/sneaker.jpg" imageAlt="Sneaker" name="Cloud Runner" price="$89.00" />);
    expect(screen.getByRole('heading', { name: 'Cloud Runner' })).toBeInTheDocument();
    expect(screen.getByText('$89.00')).toBeInTheDocument();
    expect(screen.getByAltText('Sneaker')).toHaveAttribute('src', '/sneaker.jpg');
  });

  it('does not render a badge or action by default', () => {
    render(<ProductCard imageSrc="/sneaker.jpg" imageAlt="Sneaker" name="Cloud Runner" price="$89.00" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders the badge label when provided', () => {
    render(
      <ProductCard
        imageSrc="/sneaker.jpg"
        imageAlt="Sneaker"
        name="Cloud Runner"
        price="$89.00"
        badge={{ label: 'Sale', color: 'danger' }}
      />,
    );
    expect(screen.getByText('Sale')).toBeInTheDocument();
  });

  it('renders a default "Add to cart" label and calls onClick', () => {
    const onClick = vi.fn();
    render(
      <ProductCard
        imageSrc="/sneaker.jpg"
        imageAlt="Sneaker"
        name="Cloud Runner"
        price="$89.00"
        action={{ onClick }}
      />,
    );
    const button = screen.getByRole('button', { name: 'Add to cart' });
    button.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <ProductCard
        imageSrc="/sneaker.jpg"
        imageAlt="Sneaker"
        name="Cloud Runner"
        price="$89.00"
        description="Breathable knit upper."
        badge={{ label: 'Sale', color: 'danger' }}
        action={{ label: 'Add to cart' }}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
