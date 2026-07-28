import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Flex } from './flex';

describe('Flex (ui)', () => {
  it('renders a flex row by default', () => {
    render(<Flex data-testid="flex">content</Flex>);
    expect(screen.getByTestId('flex').className).toContain('flex-row');
  });

  it('applies direction/align/justify/gap', () => {
    render(
      <Flex direction="column" align="center" justify="between" gap={12} data-testid="flex">
        content
      </Flex>,
    );
    const flex = screen.getByTestId('flex');
    expect(flex.className).toContain('flex-col');
    expect(flex.className).toContain('items-center');
    expect(flex.className).toContain('justify-between');
    expect(flex.style.gap).toBe('12px');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Flex>content</Flex>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
