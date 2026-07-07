import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Spinner } from './spinner';

describe('Spinner', () => {
  it('renders role="status"', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('announces the default "Loading..." label', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading...');
  });

  it('announces a custom label', () => {
    render(<Spinner label="Loading search results" />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading search results');
  });

  it('keeps the label in the accessibility tree even though it is visually hidden', () => {
    render(<Spinner label="Loading" />);
    const status = screen.getByRole('status');
    const label = status.querySelector('span');
    expect(label).not.toBeNull();
    expect(label).toHaveStyle({ position: 'absolute' });
  });

  it('renders visual children (e.g. an icon) alongside the hidden label', () => {
    render(
      <Spinner>
        <svg data-testid="icon" />
      </Spinner>,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Loading...');
  });
});
