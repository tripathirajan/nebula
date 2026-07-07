import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Stepper } from './stepper';
import { StepperIndicator } from './stepper-indicator';
import { StepperItem } from './stepper-item';
import { StepperList } from './stepper-list';
import { StepperSeparator } from './stepper-separator';
import { StepperTitle } from './stepper-title';
import { StepperTrigger } from './stepper-trigger';

const titles = ['Account', 'Payment', 'Review'];

function DemoStepper(props: {
  step?: number;
  defaultStep?: number;
  onStepChange?: (step: number) => void;
  allowSkipAhead?: boolean;
}) {
  return (
    <Stepper {...props}>
      <StepperList>
        {titles.map((title, index) => (
          <React.Fragment key={title}>
            {index > 0 ? <StepperSeparator /> : null}
            <StepperItem index={index}>
              <StepperTrigger>
                <StepperIndicator>{index + 1}</StepperIndicator>
                <StepperTitle>{title}</StepperTitle>
              </StepperTrigger>
            </StepperItem>
          </React.Fragment>
        ))}
      </StepperList>
    </Stepper>
  );
}

describe('Stepper', () => {
  it('renders a nav landmark labelled "progress" by default', () => {
    render(<DemoStepper defaultStep={0} />);
    expect(screen.getByRole('navigation', { name: 'progress' })).toBeInTheDocument();
  });

  it('allows overriding the aria-label', () => {
    render(
      <Stepper aria-label="Checkout steps" defaultStep={0}>
        <StepperList>
          <StepperItem index={0}>
            <StepperTrigger>
              <StepperTitle>Account</StepperTitle>
            </StepperTrigger>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByRole('navigation', { name: 'Checkout steps' })).toBeInTheDocument();
  });

  it('marks the current step with aria-current="step"', () => {
    render(<DemoStepper defaultStep={1} />);
    expect(screen.getByRole('button', { name: /Payment/ })).toHaveAttribute(
      'aria-current',
      'step',
    );
    expect(screen.getByRole('button', { name: /Account/ })).not.toHaveAttribute('aria-current');
  });

  it('disables steps ahead of the current one by default', () => {
    render(<DemoStepper defaultStep={0} />);
    expect(screen.getByRole('button', { name: /Payment/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Review/ })).toBeDisabled();
  });

  it('allows navigating back to a completed step', async () => {
    const user = userEvent.setup();
    const onStepChange = vi.fn();
    render(<DemoStepper step={2} onStepChange={onStepChange} />);

    await user.click(screen.getByRole('button', { name: /Account/ }));
    expect(onStepChange).toHaveBeenCalledWith(0);
  });

  it('allowSkipAhead lets every step be clickable', async () => {
    const user = userEvent.setup();
    const onStepChange = vi.fn();
    render(<DemoStepper step={0} onStepChange={onStepChange} allowSkipAhead />);

    expect(screen.getByRole('button', { name: /Review/ })).not.toBeDisabled();
    await user.click(screen.getByRole('button', { name: /Review/ }));
    expect(onStepChange).toHaveBeenCalledWith(2);
  });

  it('has no axe violations', async () => {
    const { container } = render(<DemoStepper defaultStep={1} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
