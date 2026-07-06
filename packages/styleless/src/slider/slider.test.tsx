import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Slider } from './slider';
import { SliderRange } from './slider-range';
import { SliderThumb } from './slider-thumb';
import { SliderTrack } from './slider-track';

function DemoSlider(props: React.ComponentProps<typeof Slider>) {
  return (
    <Slider {...props}>
      <SliderTrack>
        <SliderRange />
        <SliderThumb index={0} aria-label="Volume" />
      </SliderTrack>
    </Slider>
  );
}

describe('Slider', () => {
  it('renders a single thumb with correct aria-value*', () => {
    render(<DemoSlider defaultValue={[30]} min={0} max={100} />);
    const thumb = screen.getByRole('slider', { name: 'Volume' });
    expect(thumb).toHaveAttribute('aria-valuemin', '0');
    expect(thumb).toHaveAttribute('aria-valuemax', '100');
    expect(thumb).toHaveAttribute('aria-valuenow', '30');
  });

  it('ArrowRight/ArrowLeft adjust by step', () => {
    render(<DemoSlider defaultValue={[30]} min={0} max={100} step={5} />);
    const thumb = screen.getByRole('slider', { name: 'Volume' });

    fireEvent.keyDown(thumb, { key: 'ArrowRight' });
    expect(thumb).toHaveAttribute('aria-valuenow', '35');

    fireEvent.keyDown(thumb, { key: 'ArrowLeft' });
    fireEvent.keyDown(thumb, { key: 'ArrowLeft' });
    expect(thumb).toHaveAttribute('aria-valuenow', '25');
  });

  it('Home/End jump to min/max', () => {
    render(<DemoSlider defaultValue={[30]} min={0} max={100} />);
    const thumb = screen.getByRole('slider', { name: 'Volume' });

    fireEvent.keyDown(thumb, { key: 'End' });
    expect(thumb).toHaveAttribute('aria-valuenow', '100');

    fireEvent.keyDown(thumb, { key: 'Home' });
    expect(thumb).toHaveAttribute('aria-valuenow', '0');
  });

  it('PageUp/PageDown move by 10 steps', () => {
    render(<DemoSlider defaultValue={[30]} min={0} max={100} step={1} />);
    const thumb = screen.getByRole('slider', { name: 'Volume' });

    fireEvent.keyDown(thumb, { key: 'PageUp' });
    expect(thumb).toHaveAttribute('aria-valuenow', '40');
  });

  it('clamps to min/max', () => {
    render(<DemoSlider defaultValue={[98]} min={0} max={100} step={5} />);
    const thumb = screen.getByRole('slider', { name: 'Volume' });
    fireEvent.keyDown(thumb, { key: 'ArrowRight' });
    expect(thumb).toHaveAttribute('aria-valuenow', '100');
  });

  it('supports a two-thumb range with independent values', () => {
    render(
      <Slider defaultValue={[20, 80]} min={0} max={100}>
        <SliderTrack>
          <SliderRange />
          <SliderThumb index={0} aria-label="Min" />
          <SliderThumb index={1} aria-label="Max" />
        </SliderTrack>
      </Slider>,
    );
    expect(screen.getByRole('slider', { name: 'Min' })).toHaveAttribute('aria-valuenow', '20');
    expect(screen.getByRole('slider', { name: 'Max' })).toHaveAttribute('aria-valuenow', '80');

    fireEvent.keyDown(screen.getByRole('slider', { name: 'Min' }), { key: 'ArrowRight' });
    expect(screen.getByRole('slider', { name: 'Min' })).toHaveAttribute('aria-valuenow', '21');
    expect(screen.getByRole('slider', { name: 'Max' })).toHaveAttribute('aria-valuenow', '80');
  });

  it('calls onValueChange with the full values array', () => {
    const onValueChange = vi.fn();
    render(<DemoSlider defaultValue={[30]} onValueChange={onValueChange} />);
    fireEvent.keyDown(screen.getByRole('slider', { name: 'Volume' }), { key: 'ArrowRight' });
    expect(onValueChange).toHaveBeenCalledWith([31]);
  });

  it('ignores keyboard input when disabled', () => {
    render(<DemoSlider defaultValue={[30]} disabled />);
    const thumb = screen.getByRole('slider', { name: 'Volume' });
    expect(thumb).toHaveAttribute('tabindex', '-1');
    fireEvent.keyDown(thumb, { key: 'ArrowRight' });
    expect(thumb).toHaveAttribute('aria-valuenow', '30');
  });

  it('has no axe violations', async () => {
    const { container } = render(<DemoSlider defaultValue={[30]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
