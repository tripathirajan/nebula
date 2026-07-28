import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Inline } from './inline';

describe('Inline (ui)', () => {
  it('renders a wrapping flex row by default', () => {
    render(<Inline data-testid="inline">content</Inline>);
    const inline = screen.getByTestId('inline');
    expect(inline.className).toContain('flex-row');
    expect(inline.className).toContain('flex-wrap');
  });

  it('can disable wrapping', () => {
    render(
      <Inline wrap={false} data-testid="inline">
        content
      </Inline>,
    );
    expect(screen.getByTestId('inline').className).not.toContain('flex-wrap');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Inline>content</Inline>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
