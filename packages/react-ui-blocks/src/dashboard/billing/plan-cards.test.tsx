import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { PlanCards } from './plan-cards';

import type { PlanCardsPlan } from './plan-cards';

const plans: PlanCardsPlan[] = [
  { value: 'starter', name: 'Starter', price: '$0', period: '/month', features: ['1 project'] },
  { value: 'pro', name: 'Pro', price: '$29', period: '/month', badge: 'Most popular', features: ['Unlimited projects'] },
];

describe('PlanCards (block)', () => {
  it('renders one radio per plan with its name, price, and features', () => {
    render(<PlanCards aria-label="Choose a plan" plans={plans} defaultValue="starter" />);
    expect(screen.getByRole('radiogroup', { name: 'Choose a plan' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
    expect(screen.getByText('Starter')).toBeInTheDocument();
    expect(screen.getByText('$29')).toBeInTheDocument();
    expect(screen.getByText('Unlimited projects')).toBeInTheDocument();
  });

  it('renders the badge only for plans that have one', () => {
    render(<PlanCards aria-label="Choose a plan" plans={plans} defaultValue="starter" />);
    expect(screen.getByText('Most popular')).toBeInTheDocument();
  });

  it('marks the current value as checked and reports selection changes', () => {
    const onValueChange = vi.fn();
    render(<PlanCards aria-label="Choose a plan" plans={plans} value="pro" onValueChange={onValueChange} />);
    expect(screen.getByRole('radio', { name: /Pro/ })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: /Starter/ })).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(screen.getByRole('radio', { name: /Starter/ }));
    expect(onValueChange).toHaveBeenCalledWith('starter');
  });

  it('has no axe violations', async () => {
    const { container } = render(<PlanCards aria-label="Choose a plan" plans={plans} defaultValue="starter" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
