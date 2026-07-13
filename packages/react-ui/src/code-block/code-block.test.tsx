import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { CodeBlock } from './code-block';

function mockClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    writable: true,
    configurable: true,
  });
}

describe('CodeBlock', () => {
  it('renders the code and a language label', () => {
    render(<CodeBlock code="const x = 1;" language="tsx" />);
    expect(screen.getByText('const x = 1;')).toBeInTheDocument();
    expect(screen.getByText('tsx')).toBeInTheDocument();
  });

  it('renders one row per line when showLineNumbers is set', () => {
    render(<CodeBlock code={'line one\nline two'} showLineNumbers />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('line two')).toBeInTheDocument();
  });

  it('copies the code to the clipboard on click', async () => {
    const user = userEvent.setup();
    mockClipboard(vi.fn().mockResolvedValue(undefined));
    render(<CodeBlock code="const x = 1;" />);

    await user.click(screen.getByRole('button', { name: 'Copy' }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('const x = 1;');
    expect(await screen.findByRole('button', { name: 'Copied!' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<CodeBlock code="const x = 1;" language="tsx" showLineNumbers />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
