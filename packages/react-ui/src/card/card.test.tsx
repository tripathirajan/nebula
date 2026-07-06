import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';

describe('Card (ui)', () => {
  it('renders the full compound with correct heading level', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your preferences.</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByText('Manage your preferences.')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('applies the card token classes', () => {
    render(<Card data-testid="card">content</Card>);
    expect(screen.getByTestId('card').className).toContain('bg-[var(--card-bg)]');
  });

  it('renders a dashed bottom border on CardHeader by default', () => {
    render(
      <CardHeader data-testid="header">
        <CardTitle>Settings</CardTitle>
      </CardHeader>,
    );
    expect(screen.getByTestId('header').className).toContain('border-dashed');
  });

  it('omits the border when bordered={false}', () => {
    render(
      <CardHeader bordered={false} data-testid="header">
        <CardTitle>Settings</CardTitle>
      </CardHeader>,
    );
    expect(screen.getByTestId('header').className).not.toContain('border-dashed');
  });

  it('renders the icon beside the title/description stack when provided', () => {
    render(
      <CardHeader icon={<span data-testid="icon">*</span>}>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Preferences</CardDescription>
      </CardHeader>,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByText('Preferences')).toBeInTheDocument();
  });

  it('the icon wrapper is aria-hidden (decorative, name comes from CardTitle)', () => {
    render(
      <CardHeader icon={<span>*</span>} data-testid="header">
        <CardTitle>Settings</CardTitle>
      </CardHeader>,
    );
    const iconWrapper = screen.getByTestId('header').querySelector('[aria-hidden="true"]');
    expect(iconWrapper).not.toBeNull();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>Body</CardContent>
      </Card>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
