import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { FocusScope } from './focus-scope';

describe('FocusScope', () => {
  it('moves focus to the first focusable descendant on mount', () => {
    render(
      <FocusScope>
        <button>First</button>
        <button>Second</button>
      </FocusScope>,
    );
    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
  });

  it('focuses the container itself when there are no focusable descendants', () => {
    render(<FocusScope data-testid="scope">just text, no controls</FocusScope>);
    expect(screen.getByTestId('scope')).toHaveFocus();
  });

  it('restores focus to whatever was focused before mount, on unmount', () => {
    const outside = document.createElement('button');
    outside.textContent = 'Outside trigger';
    document.body.appendChild(outside);
    outside.focus();
    expect(outside).toHaveFocus();

    const { unmount } = render(
      <FocusScope>
        <button>Inside</button>
      </FocusScope>,
    );
    expect(screen.getByRole('button', { name: 'Inside' })).toHaveFocus();

    unmount();
    expect(outside).toHaveFocus();
    outside.remove();
  });

  it('lets onMountAutoFocus.preventDefault() take over initial focusing', () => {
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    outside.focus();

    render(
      <FocusScope onMountAutoFocus={(event) => event.preventDefault()}>
        <button>Inside</button>
      </FocusScope>,
    );

    // Default auto-focus was prevented, so focus never moved into the scope.
    expect(outside).toHaveFocus();
    outside.remove();
  });

  describe('trapped', () => {
    it('wraps Tab from the last focusable element back to the first', () => {
      render(
        <FocusScope trapped data-testid="scope">
          <button>First</button>
          <button>Last</button>
        </FocusScope>,
      );
      const first = screen.getByRole('button', { name: 'First' });
      const last = screen.getByRole('button', { name: 'Last' });
      const scope = screen.getByTestId('scope');

      last.focus();
      fireEvent.keyDown(scope, { key: 'Tab' });
      expect(first).toHaveFocus();
    });

    it('wraps Shift+Tab from the first focusable element back to the last', () => {
      render(
        <FocusScope trapped data-testid="scope">
          <button>First</button>
          <button>Last</button>
        </FocusScope>,
      );
      const first = screen.getByRole('button', { name: 'First' });
      const last = screen.getByRole('button', { name: 'Last' });
      const scope = screen.getByTestId('scope');

      first.focus();
      fireEvent.keyDown(scope, { key: 'Tab', shiftKey: true });
      expect(last).toHaveFocus();
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });
});
