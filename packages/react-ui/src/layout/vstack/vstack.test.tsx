import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { VStack } from './vstack';

describe('VStack (ui)', () => {
  it('renders a flex column', () => {
    render(<VStack data-testid="vstack">content</VStack>);
    expect(screen.getByTestId('vstack').className).toContain('flex-col');
  });

  it('has no axe violations', async () => {
    const { container } = render(<VStack>content</VStack>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
