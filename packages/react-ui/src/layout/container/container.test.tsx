import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Container } from './container';

describe('Container (ui)', () => {
  it('defaults to size="lg"', () => {
    render(<Container data-testid="container">content</Container>);
    expect(screen.getByTestId('container').className).toContain('max-w-screen-lg');
  });

  it('applies a different size', () => {
    render(
      <Container size="sm" data-testid="container">
        content
      </Container>,
    );
    expect(screen.getByTestId('container').className).toContain('max-w-screen-sm');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Container>content</Container>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
