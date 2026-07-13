import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { ProductInfoPanel } from './product-info-panel';

const colors = [
  { value: 'white', label: 'White', swatch: '#ffffff' },
  { value: 'black', label: 'Black', swatch: '#111111' },
];

const sizes = [
  { value: '8', label: '8' },
  { value: '9', label: '9' },
  { value: '10', label: '10', disabled: true },
];

describe('ProductInfoPanel (block)', () => {
  it('renders name, price, and rating', () => {
    render(<ProductInfoPanel name="Cloud Runner" price="$89.00" rating={4.5} reviewCount={128} />);
    expect(screen.getByRole('heading', { name: 'Cloud Runner' })).toBeInTheDocument();
    expect(screen.getByText('$89.00')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '4.5 out of 5 stars' })).toBeInTheDocument();
    expect(screen.getByText('(128 reviews)')).toBeInTheDocument();
  });

  it('renders the original price struck through when provided', () => {
    render(<ProductInfoPanel name="Cloud Runner" price="$89.00" originalPrice="$110.00" />);
    expect(screen.getByText('$110.00')).toHaveClass('line-through');
  });

  it('reports color selection', () => {
    const onColorChange = vi.fn();
    render(<ProductInfoPanel name="Cloud Runner" price="$89.00" colors={colors} onColorChange={onColorChange} />);
    fireEvent.click(screen.getByRole('radio', { name: 'Black' }));
    expect(onColorChange).toHaveBeenCalledWith('black');
  });

  it('reports size selection and disables an unavailable size', () => {
    const onSizeChange = vi.fn();
    render(<ProductInfoPanel name="Cloud Runner" price="$89.00" sizes={sizes} onSizeChange={onSizeChange} />);
    fireEvent.click(screen.getByRole('button', { name: '9' }));
    expect(onSizeChange).toHaveBeenCalledWith('9');
    expect(screen.getByRole('button', { name: '10' })).toBeDisabled();
  });

  it('calls onSizeChartClick when the size chart link is clicked', () => {
    const onSizeChartClick = vi.fn();
    render(
      <ProductInfoPanel name="Cloud Runner" price="$89.00" sizes={sizes} onSizeChartClick={onSizeChartClick} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Size chart' }));
    expect(onSizeChartClick).toHaveBeenCalledTimes(1);
  });

  it('increments quantity via the stepper', () => {
    render(<ProductInfoPanel name="Cloud Runner" price="$89.00" />);
    const field = screen.getByRole('spinbutton', { name: 'Quantity' });
    expect(field).toHaveValue(1);
    fireEvent.click(screen.getByRole('button', { name: 'Increase quantity' }));
    expect(field).toHaveValue(2);
  });

  it('calls primary and secondary actions', () => {
    const onAddToCart = vi.fn();
    const onBuyNow = vi.fn();
    render(
      <ProductInfoPanel
        name="Cloud Runner"
        price="$89.00"
        primaryAction={{ label: 'Add to cart', onClick: onAddToCart }}
        secondaryAction={{ label: 'Buy now', onClick: onBuyNow }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Add to cart' }));
    fireEvent.click(screen.getByRole('button', { name: 'Buy now' }));
    expect(onAddToCart).toHaveBeenCalledTimes(1);
    expect(onBuyNow).toHaveBeenCalledTimes(1);
  });

  it('toggles the favorite action label based on the favorited state', () => {
    const onFavorite = vi.fn();
    const { rerender } = render(
      <ProductInfoPanel name="Cloud Runner" price="$89.00" favorited={false} onFavorite={onFavorite} />,
    );
    expect(screen.getByRole('button', { name: 'Add to favorites' })).toBeInTheDocument();
    rerender(<ProductInfoPanel name="Cloud Runner" price="$89.00" favorited onFavorite={onFavorite} />);
    expect(screen.getByRole('button', { name: 'Remove from favorites' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <ProductInfoPanel
        badge={{ label: 'Sale', color: 'danger' }}
        name="Cloud Runner"
        rating={4.5}
        reviewCount={128}
        price="$89.00"
        originalPrice="$110.00"
        description="Breathable knit upper."
        colors={colors}
        sizes={sizes}
        availability="In stock"
        primaryAction={{ label: 'Add to cart' }}
        secondaryAction={{ label: 'Buy now' }}
        onCompare={() => {}}
        onFavorite={() => {}}
        onShare={() => {}}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
