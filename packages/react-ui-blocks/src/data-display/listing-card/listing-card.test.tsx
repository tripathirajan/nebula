import { MenuItem } from '@nebula/react-ui/menu';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { ListingCard } from './listing-card';

describe('ListingCard (block)', () => {
  it('renders the title, subtitle, and meta rows', () => {
    render(
      <ListingCard
        media={<div />}
        title="Senior Product Designer"
        subtitle="Posted 2 days ago"
        meta={[{ label: 'Full-time' }, { label: '$90k - $120k' }]}
      />,
    );
    expect(screen.getByText('Senior Product Designer')).toBeInTheDocument();
    expect(screen.getByText('Posted 2 days ago')).toBeInTheDocument();
    expect(screen.getByText('Full-time')).toBeInTheDocument();
    expect(screen.getByText('$90k - $120k')).toBeInTheDocument();
  });

  it('renders the description only when given (e.g. a blog post excerpt)', () => {
    const { rerender } = render(<ListingCard media={<div />} title="Post" />);
    expect(screen.queryByText('An excerpt.')).not.toBeInTheDocument();

    rerender(<ListingCard media={<div />} title="Post" description="An excerpt." />);
    expect(screen.getByText('An excerpt.')).toBeInTheDocument();
  });

  it('wraps the title in a link when href is given', () => {
    render(<ListingCard media={<div />} title="Senior Product Designer" href="/jobs/1" />);
    expect(screen.getByRole('link', { name: 'Senior Product Designer' })).toHaveAttribute('href', '/jobs/1');
  });

  it('renders the media badge only when given', () => {
    const { rerender } = render(<ListingCard media={<div />} title="Tour" />);
    expect(screen.queryByText('$420')).not.toBeInTheDocument();

    rerender(<ListingCard media={<div />} title="Tour" mediaBadge={<span>$420</span>} />);
    expect(screen.getByText('$420')).toBeInTheDocument();
  });

  it('renders no overflow trigger when actions is omitted', () => {
    render(<ListingCard media={<div />} title="Tour" />);
    expect(screen.queryByRole('button', { name: 'More actions' })).not.toBeInTheDocument();
  });

  it('opens the actions menu and shows its items', async () => {
    render(
      <ListingCard
        media={<div />}
        title="Senior Product Designer"
        actions={<MenuItem onSelect={() => {}}>View details</MenuItem>}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'More actions' }));
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'View details' })).toBeInTheDocument());
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <ListingCard
        media={<div />}
        title="Senior Product Designer"
        subtitle="Posted 2 days ago"
        meta={[{ label: 'Full-time' }]}
        mediaBadge={<span>Featured</span>}
        actions={<MenuItem onSelect={() => {}}>View details</MenuItem>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
