import { expect, userEvent, within } from '@storybook/test';
import * as React from 'react';

import { Stepper } from './stepper';
import { StepperDescription } from './stepper-description';
import { StepperIndicator } from './stepper-indicator';
import { StepperItem } from './stepper-item';
import { StepperList } from './stepper-list';
import { StepperSeparator } from './stepper-separator';
import { StepperTitle } from './stepper-title';
import { StepperTrigger } from './stepper-trigger';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Headless/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

const steps = [
  { title: 'Account', description: 'Personal details' },
  { title: 'Payment', description: 'Billing address' },
  { title: 'Review', description: 'Confirm order' },
];

function StepperDemo() {
  const [step, setStep] = React.useState(1);

  return (
    <Stepper step={step} onStepChange={setStep}>
      <StepperList style={{ display: 'flex', gap: 8, listStyle: 'none' }}>
        {steps.map((s, index) => (
          <React.Fragment key={s.title}>
            {index > 0 ? <StepperSeparator /> : null}
            <StepperItem index={index}>
              <StepperTrigger>
                <StepperIndicator>{index + 1}</StepperIndicator>
                <StepperTitle>{s.title}</StepperTitle>
                <StepperDescription>{s.description}</StepperDescription>
              </StepperTrigger>
            </StepperItem>
          </React.Fragment>
        ))}
      </StepperList>
    </Stepper>
  );
}

export const Default: Story = {
  render: () => <StepperDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('navigation', { name: 'progress' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: /Payment/ })).toHaveAttribute(
      'aria-current',
      'step',
    );
    // Ahead-of-current step 3 is disabled since allowSkipAhead defaults to false.
    await expect(canvas.getByRole('button', { name: /Review/ })).toBeDisabled();

    await userEvent.click(canvas.getByRole('button', { name: /Account/ }));
    await expect(canvas.getByRole('button', { name: /Account/ })).toHaveAttribute(
      'aria-current',
      'step',
    );
  },
};

export const AllowSkipAhead: Story = {
  render: () => {
    function Demo() {
      const [step, setStep] = React.useState(0);
      return (
        <Stepper step={step} onStepChange={setStep} allowSkipAhead>
          <StepperList style={{ display: 'flex', gap: 8, listStyle: 'none' }}>
            {steps.map((s, index) => (
              <React.Fragment key={s.title}>
                {index > 0 ? <StepperSeparator /> : null}
                <StepperItem index={index}>
                  <StepperTrigger>
                    <StepperIndicator>{index + 1}</StepperIndicator>
                    <StepperTitle>{s.title}</StepperTitle>
                  </StepperTrigger>
                </StepperItem>
              </React.Fragment>
            ))}
          </StepperList>
        </Stepper>
      );
    }
    return <Demo />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: /Review/ })).not.toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: /Review/ }));
    await expect(canvas.getByRole('button', { name: /Review/ })).toHaveAttribute(
      'aria-current',
      'step',
    );
  },
};

export const VerticalOrientation: Story = {
  render: () => (
    <Stepper defaultStep={0} orientation="vertical">
      <StepperList style={{ display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none' }}>
        {steps.map((s, index) => (
          <StepperItem index={index} key={s.title}>
            <StepperTrigger>
              <StepperIndicator>{index + 1}</StepperIndicator>
              <StepperTitle>{s.title}</StepperTitle>
            </StepperTrigger>
          </StepperItem>
        ))}
      </StepperList>
    </Stepper>
  ),
};
