import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Box } from './box';

describe('Box (ui)', () => {
  it('renders a div by default', () => {
    render(<Box data-testid="box">content</Box>);
    expect(screen.getByTestId('box').tagName).toBe('DIV');
  });

  it('applies className with no other injected classes', () => {
    render(
      <Box data-testid="box" className="custom-class">
        content
      </Box>,
    );
    expect(screen.getByTestId('box').className).toBe('custom-class');
  });

  it('renders as a different tag via `as`', () => {
    render(<Box as="section" data-testid="box" />);
    expect(screen.getByTestId('box').tagName).toBe('SECTION');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Box>content</Box>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
