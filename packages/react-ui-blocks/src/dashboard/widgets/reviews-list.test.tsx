import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { ReviewsList } from './reviews-list';

const reviews = [
  { id: '1', author: 'Jane Cooper', rating: 5, date: '2 days ago', content: 'Great course!' },
  { id: '2', author: 'Wade Warren', rating: 3.5, content: 'Pretty good.' },
];

describe('ReviewsList (block)', () => {
  it('renders the title and one entry per review', () => {
    render(<ReviewsList title="Reviews" reviews={reviews} />);
    expect(screen.getByText('Reviews')).toBeInTheDocument();
    expect(screen.getByText('Jane Cooper')).toBeInTheDocument();
    expect(screen.getByText('Great course!')).toBeInTheDocument();
    expect(screen.getByText('2 days ago')).toBeInTheDocument();
  });

  it('exposes each rating as an accessible "x out of 5 stars" label, rounding to the nearest star', () => {
    render(<ReviewsList reviews={reviews} />);
    expect(screen.getByRole('img', { name: '5 out of 5 stars' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '3.5 out of 5 stars' })).toBeInTheDocument();
  });

  it('falls back to the author initial when no avatarSrc is given', () => {
    render(<ReviewsList reviews={[{ id: '1', author: 'Jane Cooper', rating: 5, content: 'Hi' }]} />);
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<ReviewsList title="Reviews" reviews={reviews} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
