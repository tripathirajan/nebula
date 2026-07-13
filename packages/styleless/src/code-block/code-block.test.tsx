import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { CodeBlock } from './code-block';

// `navigator.clipboard` is a read-only getter in jsdom — plain
// `Object.assign` throws ("only a getter"); overriding the property
// descriptor directly is the standard workaround, same technique this
// repo already uses for jsdom's read-only `window.scrollY`. Must run
// *after* `userEvent.setup()`, not in a `beforeEach` — `userEvent.setup()`
// installs its own clipboard polyfill (for its `.copy()`/`.paste()`
// simulation) that clobbers whatever `navigator.clipboard` was set to
// beforehand, silently swapping a `beforeEach`-installed mock back out for
// a real (non-spy) `AsyncFunction` by the time a test's own click fires.
function mockClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    writable: true,
    configurable: true,
  });
}

describe('CodeBlock (styleless)', () => {
  it('renders the code and a language label', () => {
    render(<CodeBlock code="const x = 1;" language="tsx" />);
    expect(screen.getByText('const x = 1;')).toBeInTheDocument();
    expect(screen.getByText('tsx')).toBeInTheDocument();
  });

  it('defaults the language label to "text" when omitted', () => {
    render(<CodeBlock code="plain" />);
    expect(screen.getByText('text')).toBeInTheDocument();
  });

  it('hides the header entirely when hideHeader is set', () => {
    render(<CodeBlock code="const x = 1;" hideHeader />);
    expect(screen.queryByRole('button', { name: 'Copy' })).not.toBeInTheDocument();
  });

  it('renders one row per line when showLineNumbers is set', () => {
    render(<CodeBlock code={'line one\nline two\nline three'} showLineNumbers />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('line two')).toBeInTheDocument();
  });

  it('copies the code and flips the button label back after the timeout', async () => {
    // Real timers, not fake ones — `userEvent`'s own internal delays and
    // the component's `await navigator.clipboard.writeText(...)` promise
    // don't resolve reliably under `vi.useFakeTimers()` here; the 1.5s
    // real-time wait below is short enough not to matter for suite speed.
    const user = userEvent.setup();
    mockClipboard(vi.fn().mockResolvedValue(undefined));
    render(<CodeBlock code="const x = 1;" />);

    await user.click(screen.getByRole('button', { name: 'Copy' }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('const x = 1;');
    expect(await screen.findByRole('button', { name: 'Copied!' })).toBeInTheDocument();

    expect(await screen.findByRole('button', { name: 'Copy' }, { timeout: 2000 })).toBeInTheDocument();
  });

  it('silently no-ops when clipboard access is denied', async () => {
    const user = userEvent.setup();
    mockClipboard(vi.fn().mockRejectedValue(new Error('denied')));
    render(<CodeBlock code="const x = 1;" />);

    await user.click(screen.getByRole('button', { name: 'Copy' }));
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
  });

  it('applies per-part classNames', () => {
    render(
      <CodeBlock
        code="const x = 1;"
        language="tsx"
        classNames={{ root: 'root-class', header: 'header-class', language: 'language-class' }}
      />,
    );
    expect(screen.getByText('tsx').className).toBe('language-class');
  });
});
