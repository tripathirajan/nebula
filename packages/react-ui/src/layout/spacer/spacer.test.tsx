import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Spacer } from './spacer';

describe('Spacer (ui)', () => {
  it('is aria-hidden and flex-grows by default', () => {
    render(<Spacer data-testid="spacer" />);
    const spacer = screen.getByTestId('spacer');
    expect(spacer).toHaveAttribute('aria-hidden');
    expect(spacer.style.flexGrow).toBe('1');
  });

  it('accepts a custom grow factor', () => {
    render(<Spacer grow={2} data-testid="spacer" />);
    expect(screen.getByTestId('spacer').style.flexGrow).toBe('2');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Spacer />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
