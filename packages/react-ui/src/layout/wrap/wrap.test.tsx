import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Wrap } from './wrap';

describe('Wrap (ui)', () => {
  it('renders a wrapping flex row', () => {
    render(<Wrap data-testid="wrap">content</Wrap>);
    const wrap = screen.getByTestId('wrap');
    expect(wrap.className).toContain('flex-row');
    expect(wrap.className).toContain('flex-wrap');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Wrap>content</Wrap>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
