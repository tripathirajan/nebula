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

  it('does not dismiss an outer layer on pointerdown inside a sibling-portaled inner layer (e.g. a Select listbox portaled to document.body from inside a Dialog)', () => {
    // Regression test: `Dialog`'s content and a `Select`'s listbox are each
    // portaled to `document.body` independently, landing as DOM siblings —
    // not nested — even though the Select is logically "inside" the
    // Dialog from the user's point of view. A pointerdown on a Select
    // option previously read as an outside click on the Dialog (DOM
    // containment found nothing), closing the whole Dialog the moment a
    // user picked any dropdown option inside it — confirmed as a real,
    // reproduced bug in exactly this composition (a form's account/category
    // `Select` inside a `Dialog`).
    const onDismissOuter = vi.fn();
    const onDismissInner = vi.fn();
    render(
      <>
        <DismissibleLayer onDismiss={onDismissOuter} data-testid="outer">
          outer
        </DismissibleLayer>
        <DismissibleLayer onDismiss={onDismissInner} data-testid="inner">
          <button data-testid="inner-option">option</button>
        </DismissibleLayer>
      </>,
    );

    fireEvent.pointerDown(screen.getByTestId('inner-option'));

    expect(onDismissOuter).not.toHaveBeenCalled();
  });
});
