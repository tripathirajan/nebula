import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Center } from './center';

describe('Center (ui)', () => {
  it('centers both axes', () => {
    render(<Center data-testid="center">content</Center>);
    const center = screen.getByTestId('center');
    expect(center.className).toContain('items-center');
    expect(center.className).toContain('justify-center');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Center>content</Center>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
