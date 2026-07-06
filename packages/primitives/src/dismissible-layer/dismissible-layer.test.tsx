import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DismissibleLayer } from './dismissible-layer';

describe('DismissibleLayer', () => {
  it('calls onDismiss on Escape keydown', () => {
    const onDismiss = vi.fn();
    render(
      <DismissibleLayer onDismiss={onDismiss} data-testid="layer">
        content
      </DismissibleLayer>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not call onDismiss for a non-Escape key', () => {
    const onDismiss = vi.fn();
    render(<DismissibleLayer onDismiss={onDismiss}>content</DismissibleLayer>);
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('lets onEscapeKeyDown.preventDefault() stop onDismiss from also firing', () => {
    const onDismiss = vi.fn();
    render(
      <DismissibleLayer
        onDismiss={onDismiss}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        content
      </DismissibleLayer>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('calls onDismiss on pointerdown outside the layer', () => {
    const onDismiss = vi.fn();
    render(
      <>
        <DismissibleLayer onDismiss={onDismiss} data-testid="layer">
          content
        </DismissibleLayer>
        <button data-testid="outside">outside</button>
      </>,
    );
    fireEvent.pointerDown(screen.getByTestId('outside'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not call onDismiss on pointerdown inside the layer', () => {
    const onDismiss = vi.fn();
    render(
      <DismissibleLayer onDismiss={onDismiss}>
        <button data-testid="inside">inside</button>
      </DismissibleLayer>,
    );
    fireEvent.pointerDown(screen.getByTestId('inside'));
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('only dismisses the topmost layer when layers are nested (e.g. a popover inside a dialog)', () => {
    const onDismissOuter = vi.fn();
    const onDismissInner = vi.fn();
    render(
      <DismissibleLayer onDismiss={onDismissOuter} data-testid="outer">
        outer
        <DismissibleLayer onDismiss={onDismissInner} data-testid="inner">
          inner
        </DismissibleLayer>
      </DismissibleLayer>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onDismissInner).toHaveBeenCalledTimes(1);
    expect(onDismissOuter).not.toHaveBeenCalled();
  });
});
