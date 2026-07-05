import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DismissableLayer } from './dismissable-layer';

describe('DismissableLayer', () => {
  it('calls onDismiss on Escape keydown', () => {
    const onDismiss = vi.fn();
    render(
      <DismissableLayer onDismiss={onDismiss} data-testid="layer">
        content
      </DismissableLayer>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not call onDismiss for a non-Escape key', () => {
    const onDismiss = vi.fn();
    render(<DismissableLayer onDismiss={onDismiss}>content</DismissableLayer>);
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('lets onEscapeKeyDown.preventDefault() stop onDismiss from also firing', () => {
    const onDismiss = vi.fn();
    render(
      <DismissableLayer
        onDismiss={onDismiss}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        content
      </DismissableLayer>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('calls onDismiss on pointerdown outside the layer', () => {
    const onDismiss = vi.fn();
    render(
      <>
        <DismissableLayer onDismiss={onDismiss} data-testid="layer">
          content
        </DismissableLayer>
        <button data-testid="outside">outside</button>
      </>,
    );
    fireEvent.pointerDown(screen.getByTestId('outside'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not call onDismiss on pointerdown inside the layer', () => {
    const onDismiss = vi.fn();
    render(
      <DismissableLayer onDismiss={onDismiss}>
        <button data-testid="inside">inside</button>
      </DismissableLayer>,
    );
    fireEvent.pointerDown(screen.getByTestId('inside'));
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('only dismisses the topmost layer when layers are nested (e.g. a popover inside a dialog)', () => {
    const onDismissOuter = vi.fn();
    const onDismissInner = vi.fn();
    render(
      <DismissableLayer onDismiss={onDismissOuter} data-testid="outer">
        outer
        <DismissableLayer onDismiss={onDismissInner} data-testid="inner">
          inner
        </DismissableLayer>
      </DismissableLayer>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onDismissInner).toHaveBeenCalledTimes(1);
    expect(onDismissOuter).not.toHaveBeenCalled();
  });
});
