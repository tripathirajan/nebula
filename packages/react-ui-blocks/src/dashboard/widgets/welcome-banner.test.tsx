import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { WelcomeBanner } from './welcome-banner';

describe('WelcomeBanner (block)', () => {
  it('renders the title and description', () => {
    render(<WelcomeBanner title="Welcome back, Jane" description="Here's your summary." />);
    expect(screen.getByRole('heading', { name: 'Welcome back, Jane' })).toBeInTheDocument();
    expect(screen.getByText("Here's your summary.")).toBeInTheDocument();
  });

  it('renders the action as a link when href is given', () => {
    render(<WelcomeBanner title="Welcome back" action={{ label: 'View reports', href: '#reports' }} />);
    expect(screen.getByRole('link', { name: 'View reports' })).toHaveAttribute('href', '#reports');
  });

  it('renders the action as a button when only onClick is given', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<WelcomeBanner title="Welcome back" action={{ label: 'View reports', onClick }} />);
    await user.click(screen.getByRole('button', { name: 'View reports' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not render an action when omitted', () => {
    render(<WelcomeBanner title="Welcome back" />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders the illustration as decorative', () => {
    render(
      <WelcomeBanner
        title="Welcome back"
        illustration={<svg data-testid="illustration" role="presentation" />}
      />,
    );
    expect(screen.getByTestId('illustration')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <WelcomeBanner
        title="Welcome back, Jane"
        description="Here's your summary."
        action={{ label: 'View reports', href: '#reports' }}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
