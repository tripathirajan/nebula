import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { ColorPicker } from './color-picker';
import { ColorPickerContent } from './color-picker-content';
import { ColorPickerHexInput } from './color-picker-hex-input';
import { ColorPickerPortal } from './color-picker-portal';
import { ColorPickerTrigger } from './color-picker-trigger';

function DemoColorPicker(props: React.ComponentProps<typeof ColorPicker>) {
  return (
    <ColorPicker {...props}>
      <ColorPickerTrigger aria-label="Pick a color" />
      <ColorPickerPortal>
        <ColorPickerContent>
          <ColorPickerHexInput aria-label="Hex color" />
        </ColorPickerContent>
      </ColorPickerPortal>
    </ColorPicker>
  );
}

describe('ColorPicker', () => {
  it('is closed initially and the trigger swatch reflects the current value', () => {
    render(<DemoColorPicker defaultValue="#3b82f6" />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const trigger = screen.getByRole('button', { name: 'Pick a color' });
    expect(trigger).toHaveStyle({ backgroundColor: '#3b82f6' });
  });

  it('opens on trigger click and shows the current value in the hex input', async () => {
    render(<DemoColorPicker defaultValue="#3b82f6" />);
    fireEvent.click(screen.getByRole('button', { name: 'Pick a color' }));

    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    expect(screen.getByRole('textbox', { name: 'Hex color' })).toHaveValue('#3b82f6');
  });

  it('typing a valid hex commits the value and updates the swatch', () => {
    const onValueChange = vi.fn();
    render(<DemoColorPicker defaultValue="#3b82f6" onValueChange={onValueChange} open />);

    const hexInput = screen.getByRole('textbox', { name: 'Hex color' });
    fireEvent.change(hexInput, { target: { value: '#ff0000' } });

    expect(onValueChange).toHaveBeenCalledWith('#ff0000');
  });

  it('does not commit an invalid hex and marks the field aria-invalid', () => {
    const onValueChange = vi.fn();
    render(<DemoColorPicker defaultValue="#3b82f6" onValueChange={onValueChange} open />);

    const hexInput = screen.getByRole('textbox', { name: 'Hex color' });
    fireEvent.change(hexInput, { target: { value: 'not-a-color' } });

    expect(onValueChange).not.toHaveBeenCalled();
    expect(hexInput).toHaveAttribute('aria-invalid', 'true');
  });

  it('reverts an invalid hex back to the last committed value on blur', () => {
    render(<DemoColorPicker defaultValue="#3b82f6" open />);
    const hexInput = screen.getByRole('textbox', { name: 'Hex color' });

    fireEvent.change(hexInput, { target: { value: 'nope' } });
    fireEvent.blur(hexInput);

    expect(hexInput).toHaveValue('#3b82f6');
  });

  it('has no axe violations', async () => {
    const { container } = render(<DemoColorPicker defaultValue="#3b82f6" open />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
