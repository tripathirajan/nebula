import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Stack } from './stack';

describe('Stack (ui)', () => {
  it('renders a flex column', () => {
    render(<Stack data-testid="stack">content</Stack>);
    expect(screen.getByTestId('stack').className).toContain('flex-col');
  });

  it('applies gap', () => {
    render(
      <Stack gap={16} data-testid="stack">
        content
      </Stack>,
    );
    expect(screen.getByTestId('stack').style.gap).toBe('16px');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Stack>content</Stack>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
