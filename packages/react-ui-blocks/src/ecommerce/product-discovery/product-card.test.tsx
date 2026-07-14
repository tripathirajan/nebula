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

  it('renders a rating row when rating is provided', () => {
    render(
      <ProductCard
        imageSrc="/sneaker.jpg"
        imageAlt="Sneaker"
        name="Cloud Runner"
        price="$89.00"
        rating={4.5}
        reviewCount={128}
      />,
    );
    expect(screen.getByText('(128)')).toBeInTheDocument();
  });

  it('renders a struck-through original price when provided', () => {
    render(
      <ProductCard
        imageSrc="/sneaker.jpg"
        imageAlt="Sneaker"
        name="Cloud Runner"
        price="$71.20"
        originalPrice="$89.00"
      />,
    );
    expect(screen.getByText('$89.00')).toBeInTheDocument();
  });

  it('renders a favorite toggle and calls onFavorite', () => {
    const onFavorite = vi.fn();
    render(
      <ProductCard
        imageSrc="/sneaker.jpg"
        imageAlt="Sneaker"
        name="Cloud Runner"
        price="$89.00"
        favorited={false}
        onFavorite={onFavorite}
      />,
    );
    const favoriteButton = screen.getByRole('button', { name: 'Add to favorites' });
    favoriteButton.click();
    expect(onFavorite).toHaveBeenCalledTimes(1);
  });

  it('flips the favorite button label when favorited is true', () => {
    render(
      <ProductCard
        imageSrc="/sneaker.jpg"
        imageAlt="Sneaker"
        name="Cloud Runner"
        price="$89.00"
        favorited
        onFavorite={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: 'Remove from favorites' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <ProductCard
        imageSrc="/sneaker.jpg"
        imageAlt="Sneaker"
        name="Cloud Runner"
        price="$71.20"
        originalPrice="$89.00"
        description="Breathable knit upper."
        rating={4.5}
        reviewCount={128}
        badge={{ label: 'Sale', color: 'danger' }}
        favorited={false}
        onFavorite={() => {}}
        action={{ label: 'Add to cart' }}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
