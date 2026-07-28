import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Grid } from './grid';

describe('Grid (ui)', () => {
  it('renders display: grid', () => {
    render(<Grid data-testid="grid">content</Grid>);
    expect(screen.getByTestId('grid').className).toContain('grid');
  });

  it('maps a numeric columns count to repeat(n, minmax(0, 1fr))', () => {
    render(
      <Grid columns={3} data-testid="grid">
        content
      </Grid>,
    );
    expect(screen.getByTestId('grid').style.gridTemplateColumns).toBe('repeat(3, minmax(0, 1fr))');
  });

  it('passes through a raw track string', () => {
    render(
      <Grid columns="200px 1fr" data-testid="grid">
        content
      </Grid>,
    );
    expect(screen.getByTestId('grid').style.gridTemplateColumns).toBe('200px 1fr');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Grid>content</Grid>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
