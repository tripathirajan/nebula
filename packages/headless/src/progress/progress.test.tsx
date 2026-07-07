import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Progress } from './progress';
import { ProgressIndicator } from './progress-indicator';

describe('Progress', () => {
  it('renders role="progressbar"', () => {
    render(
      <Progress value={40}>
        <ProgressIndicator />
      </Progress>,
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('defaults to indeterminate when no value is given', () => {
    render(
      <Progress>
        <ProgressIndicator />
      </Progress>,
    );
    const bar = screen.getByRole('progressbar');
    expect(bar).not.toHaveAttribute('aria-valuenow');
    expect(bar).toHaveAttribute('data-state', 'indeterminate');
  });

  it('sets aria-valuenow/min/max for a determinate value', () => {
    render(
      <Progress value={40} max={80}>
        <ProgressIndicator />
      </Progress>,
    );
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '40');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '80');
    expect(bar).toHaveAttribute('data-state', 'loading');
  });

  it('marks complete when value equals max', () => {
    render(
      <Progress value={100}>
        <ProgressIndicator />
      </Progress>,
    );
    expect(screen.getByRole('progressbar')).toHaveAttribute('data-state', 'complete');
  });

  it('formats aria-valuetext via getValueLabel', () => {
    render(
      <Progress value={2} max={4} getValueLabel={(value, max) => `${value} of ${max} steps`}>
        <ProgressIndicator />
      </Progress>,
    );
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '2 of 4 steps');
  });

  it('omits aria-valuetext when no getValueLabel is given', () => {
    render(
      <Progress value={2} max={4}>
        <ProgressIndicator />
      </Progress>,
    );
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuetext');
  });

  it('falls back to null (indeterminate) and warns on an out-of-range value', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <Progress value={200} max={100}>
        <ProgressIndicator />
      </Progress>,
    );
    const bar = screen.getByRole('progressbar');
    expect(bar).not.toHaveAttribute('aria-valuenow');
    expect(bar).toHaveAttribute('data-state', 'indeterminate');
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('falls back to the default max and warns on a non-positive max', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <Progress value={10} max={0}>
        <ProgressIndicator />
      </Progress>,
    );
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '100');
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('mirrors state/value/max onto ProgressIndicator via data attributes', () => {
    render(
      <Progress value={40} max={80}>
        <ProgressIndicator data-testid="indicator" />
      </Progress>,
    );
    const indicator = screen.getByTestId('indicator');
    expect(indicator).toHaveAttribute('data-state', 'loading');
    expect(indicator).toHaveAttribute('data-value', '40');
    expect(indicator).toHaveAttribute('data-max', '80');
  });
});
