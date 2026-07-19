import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { PromoBanner } from './promo-banner';

describe('PromoBanner (block)', () => {
  it('renders the headline as a heading', () => {
    render(<PromoBanner headline="Premium plans, up to 50% off" />);
    expect(screen.getByRole('heading', { name: 'Premium plans, up to 50% off' })).toBeInTheDocument();
  });

  it('renders logo, subheadline, and badge when provided', () => {
    render(
      <PromoBanner headline="Headline" logo="Acme" subheadline="Limited time offer" badge="Ad" />,
    );
    expect(screen.getByText('Acme')).toBeInTheDocument();
    expect(screen.getByText('Limited time offer')).toBeInTheDocument();
    expect(screen.getByText('Ad')).toBeInTheDocument();
  });

  it('renders the media slot as aria-hidden decoration', () => {
    render(<PromoBanner headline="Headline" media={<img src="/promo.png" alt="Product" />} />);
    const img = screen.getByAltText('Product');
    expect(img.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <PromoBanner
        headline="Premium plans, up to 50% off"
        logo="Acme"
        subheadline="Limited time offer"
        badge="Ad"
        color="info"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
