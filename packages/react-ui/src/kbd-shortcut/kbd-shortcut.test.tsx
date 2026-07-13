import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { KbdShortcut } from './kbd-shortcut';

describe('KbdShortcut', () => {
  it('renders each key as its own kbd element', () => {
    render(<KbdShortcut keys={['Ctrl', 'Shift', 'P']} />);
    expect(screen.getByText('Ctrl').tagName).toBe('KBD');
    expect(screen.getByText('Shift').tagName).toBe('KBD');
    expect(screen.getByText('P').tagName).toBe('KBD');
  });

  it('renders a "+" separator between keys by default', () => {
    render(<KbdShortcut keys={['Ctrl', 'K']} />);
    expect(screen.getByText('+')).toBeInTheDocument();
  });

  it('renders no separator when separator is null', () => {
    const { container } = render(<KbdShortcut keys={['⌘', 'K']} separator={null} />);
    expect(container.querySelectorAll('kbd')).toHaveLength(2);
    expect(screen.queryByText('+')).not.toBeInTheDocument();
  });

  it('renders no separator before the first key', () => {
    render(<KbdShortcut keys={['Ctrl', 'K']} />);
    expect(screen.getAllByText('+')).toHaveLength(1);
  });

  it('has no axe violations', async () => {
    const { container } = render(<KbdShortcut keys={['Ctrl', 'Shift', 'P']} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
