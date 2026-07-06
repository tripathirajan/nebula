import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { RadioGroup } from './radio-group';
import { RadioGroupItem } from './radio-group-item';

function DemoGroup() {
  return (
    <RadioGroup defaultValue="comfortable" aria-label="Density">
      <RadioGroupItem value="compact">Compact</RadioGroupItem>
      <RadioGroupItem value="comfortable">Comfortable</RadioGroupItem>
      <RadioGroupItem value="spacious">Spacious</RadioGroupItem>
    </RadioGroup>
  );
}

describe('RadioGroup (ui)', () => {
  it('renders the styleless behavior unchanged (selects on click)', () => {
    render(<DemoGroup />);
    const compact = screen.getByRole('radio', { name: 'Compact' });

    fireEvent.click(compact);
    expect(compact).toHaveAttribute('aria-checked', 'true');
  });

  it('applies the indicator token class', () => {
    render(<DemoGroup />);
    const compact = screen.getByRole('radio', { name: 'Compact' });
    expect(compact.querySelector('span')?.className).toContain('border-[var(--radio-border)]');
  });

  it('has no axe violations', async () => {
    const { container } = render(<DemoGroup />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
