import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { HStack } from './hstack';

describe('HStack (ui)', () => {
  it('renders a single-line flex row (no wrap)', () => {
    render(<HStack data-testid="hstack">content</HStack>);
    const hstack = screen.getByTestId('hstack');
    expect(hstack.className).toContain('flex-row');
    expect(hstack.className).not.toContain('flex-wrap');
  });

  it('has no axe violations', async () => {
    const { container } = render(<HStack>content</HStack>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
