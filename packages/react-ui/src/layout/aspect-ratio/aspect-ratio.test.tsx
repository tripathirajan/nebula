import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { AspectRatio } from './aspect-ratio';

describe('AspectRatio (ui)', () => {
  it('defaults to a 1:1 ratio', () => {
    render(<AspectRatio data-testid="ratio" />);
    expect(screen.getByTestId('ratio').style.aspectRatio).toBe('1');
  });

  it('applies a custom ratio', () => {
    render(<AspectRatio ratio={16 / 9} data-testid="ratio" />);
    expect(screen.getByTestId('ratio').style.aspectRatio).toBe(String(16 / 9));
  });

  it('has no axe violations', async () => {
    const { container } = render(<AspectRatio />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
