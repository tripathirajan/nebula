import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Hero } from './hero';

describe('Hero (block)', () => {
  it('renders the headline as an h1', () => {
    render(<Hero headline="Ship your design system faster" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Ship your design system faster' })).toBeInTheDocument();
  });

  it('renders eyebrow and subheadline when provided', () => {
    render(<Hero eyebrow="New" headline="Headline" subheadline="Subheadline copy" />);
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('Subheadline copy')).toBeInTheDocument();
  });

  it('renders primaryAction as a link when href is given', () => {
    render(<Hero headline="Headline" primaryAction={{ label: 'Get started', href: '#start' }} />);
    expect(screen.getByRole('link', { name: 'Get started' })).toHaveAttribute('href', '#start');
  });

  it('renders primaryAction as a button when only onClick is given', () => {
    const onClick = vi.fn();
    render(<Hero headline="Headline" primaryAction={{ label: 'Get started', onClick }} />);
    screen.getByRole('button', { name: 'Get started' }).click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders the media slot as-is when provided', () => {
    render(<Hero headline="Headline" media={<img src="/hero.png" alt="Product screenshot" />} />);
    expect(screen.getByAltText('Product screenshot')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Hero
        eyebrow="New"
        headline="Headline"
        subheadline="Subheadline"
        primaryAction={{ label: 'Get started', href: '#start' }}
        secondaryAction={{ label: 'Learn more', href: '#learn' }}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
