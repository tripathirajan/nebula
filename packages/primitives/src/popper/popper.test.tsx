import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Popper } from './popper';
import { PopperAnchor } from './popper-anchor';
import { computePosition } from './popper-content';
import { PopperContent } from './popper-content';

function rect(overrides: Partial<DOMRect> = {}) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
    ...overrides,
  } as DOMRect;
}

describe('computePosition', () => {
  const anchor = rect({ top: 100, bottom: 120, left: 50, right: 150, width: 100, height: 20 });
  const content = rect({ width: 60, height: 30 });
  const viewport = { width: 800, height: 600 };

  it('places bottom+center directly under the anchor, horizontally centered', () => {
    const result = computePosition(anchor, content, {
      side: 'bottom',
      sideOffset: 0,
      align: 'center',
      alignOffset: 0,
      avoidCollisions: true,
      collisionPadding: 8,
      viewport,
    });

    expect(result.side).toBe('bottom');
    expect(result.top).toBe(120);
    expect(result.left).toBe(50 + (100 - 60) / 2);
  });

  it('applies sideOffset as a gap along the primary axis', () => {
    const result = computePosition(anchor, content, {
      side: 'bottom',
      sideOffset: 8,
      align: 'center',
      alignOffset: 0,
      avoidCollisions: true,
      collisionPadding: 8,
      viewport,
    });

    expect(result.top).toBe(128);
  });

  it('aligns start/end to the anchor edges plus alignOffset', () => {
    const start = computePosition(anchor, content, {
      side: 'bottom',
      sideOffset: 0,
      align: 'start',
      alignOffset: 4,
      avoidCollisions: true,
      collisionPadding: 8,
      viewport,
    });
    expect(start.left).toBe(50 + 4);

    const end = computePosition(anchor, content, {
      side: 'bottom',
      sideOffset: 0,
      align: 'end',
      alignOffset: -4,
      avoidCollisions: true,
      collisionPadding: 8,
      viewport,
    });
    expect(end.left).toBe(150 - 60 - 4);
  });

  it('flips to the opposite side when the preferred side does not fit and the opposite does', () => {
    // Anchor near the bottom of a short viewport — "bottom" placement would
    // overflow, "top" has room.
    const lowAnchor = rect({ top: 550, bottom: 580, left: 50, right: 150, width: 100, height: 30 });
    const result = computePosition(lowAnchor, content, {
      side: 'bottom',
      sideOffset: 0,
      align: 'center',
      alignOffset: 0,
      avoidCollisions: true,
      collisionPadding: 8,
      viewport: { width: 800, height: 600 },
    });

    expect(result.side).toBe('top');
    expect(result.top).toBe(550 - 30);
  });

  it('does not flip when avoidCollisions is false, even if it overflows', () => {
    const lowAnchor = rect({ top: 550, bottom: 580, left: 50, right: 150, width: 100, height: 30 });
    const result = computePosition(lowAnchor, content, {
      side: 'bottom',
      sideOffset: 0,
      align: 'center',
      alignOffset: 0,
      avoidCollisions: false,
      collisionPadding: 8,
      viewport: { width: 800, height: 600 },
    });

    expect(result.side).toBe('bottom');
    expect(result.top).toBe(580);
  });

  it('clamps the cross axis within the viewport instead of letting content overflow off-screen', () => {
    const edgeAnchor = rect({ top: 100, bottom: 120, left: -20, right: 10, width: 30, height: 20 });
    const result = computePosition(edgeAnchor, content, {
      side: 'bottom',
      sideOffset: 0,
      align: 'center',
      alignOffset: 0,
      avoidCollisions: true,
      collisionPadding: 8,
      viewport,
    });

    expect(result.left).toBe(8);
  });
});

describe('Popper', () => {
  it('positions PopperContent using the anchor element measured via PopperAnchor', async () => {
    render(
      <Popper>
        <PopperAnchor asChild>
          <button
            ref={(node) => {
              if (node) {
                node.getBoundingClientRect = () =>
                  rect({ top: 100, bottom: 120, left: 50, right: 150, width: 100, height: 20 });
              }
            }}
          >
            Anchor
          </button>
        </PopperAnchor>
        <PopperContent
          ref={(node) => {
            if (node) {
              node.getBoundingClientRect = () => rect({ width: 60, height: 30 });
            }
          }}
          data-testid="content"
        >
          Content
        </PopperContent>
      </Popper>,
    );

    const content = screen.getByTestId('content');
    await waitFor(() => expect(content).toHaveStyle({ visibility: 'visible' }));
    expect(content).toHaveAttribute('data-side', 'bottom');
  });
});
