import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Command } from './command';
import { CommandEmpty } from './command-empty';
import { CommandGroup } from './command-group';
import { CommandInput } from './command-input';
import { CommandItem } from './command-item';
import { CommandList } from './command-list';
import { CommandSeparator } from './command-separator';

const ACTIONS = ['New File', 'New Folder', 'Open Settings'];

function DemoCommand({ onSelect }: { onSelect?: (label: string) => void }) {
  const [inputValue, setInputValue] = React.useState('');
  const filtered = ACTIONS.filter((label) =>
    label.toLowerCase().includes(inputValue.toLowerCase()),
  );

  return (
    <Command inputValue={inputValue} onInputValueChange={setInputValue}>
      <CommandInput aria-label="Command" />
      <CommandList>
        {filtered.length === 0 ? <CommandEmpty>No results found.</CommandEmpty> : null}
        <CommandGroup heading="Actions">
          {filtered.map((label) => (
            <CommandItem key={label} value={label} onSelect={() => onSelect?.(label)}>
              {label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
      </CommandList>
    </Command>
  );
}

describe('Command', () => {
  it('renders role="combobox" input wired to a role="listbox" list', () => {
    render(<DemoCommand />);
    const input = screen.getByRole('combobox', { name: 'Command' });
    const list = screen.getByRole('listbox');
    expect(input).toHaveAttribute('aria-controls', list.id);
    expect(input).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders every item as role="option"', () => {
    render(<DemoCommand />);
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('typing filters via consumer-controlled rendering', async () => {
    const user = userEvent.setup();
    render(<DemoCommand />);
    await user.type(screen.getByRole('combobox', { name: 'Command' }), 'folder');

    expect(screen.getByRole('option', { name: 'New Folder' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'New File' })).not.toBeInTheDocument();
  });

  it('shows CommandEmpty when the consumer filters down to zero results', async () => {
    const user = userEvent.setup();
    render(<DemoCommand />);
    await user.type(screen.getByRole('combobox', { name: 'Command' }), 'nonexistent');

    expect(screen.getByText('No results found.')).toBeInTheDocument();
    expect(screen.queryAllByRole('option')).toHaveLength(0);
  });

  it('ArrowDown/ArrowUp move aria-activedescendant across visible options', async () => {
    const user = userEvent.setup();
    render(<DemoCommand />);
    const input = screen.getByRole('combobox', { name: 'Command' });

    await user.type(input, '{ArrowDown}');
    const first = screen.getByRole('option', { name: 'New File' });
    expect(input).toHaveAttribute('aria-activedescendant', first.id);

    await user.type(input, '{ArrowDown}');
    const second = screen.getByRole('option', { name: 'New Folder' });
    expect(input).toHaveAttribute('aria-activedescendant', second.id);

    await user.type(input, '{ArrowUp}');
    expect(input).toHaveAttribute('aria-activedescendant', first.id);
  });

  it('Enter runs the highlighted item onSelect', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<DemoCommand onSelect={onSelect} />);
    const input = screen.getByRole('combobox', { name: 'Command' });

    await user.type(input, '{ArrowDown}{Enter}');
    expect(onSelect).toHaveBeenCalledWith('New File');
  });

  it('clicking an item runs its onSelect', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<DemoCommand onSelect={onSelect} />);

    await user.click(screen.getByRole('option', { name: 'Open Settings' }));
    expect(onSelect).toHaveBeenCalledWith('Open Settings');
  });

  it('a CommandGroup with a heading wires up aria-labelledby', () => {
    render(<DemoCommand />);
    const group = screen.getByRole('group');
    const heading = screen.getByText('Actions');
    expect(group).toHaveAttribute('aria-labelledby', heading.id);
  });

  it('has no axe violations', async () => {
    const { container } = render(<DemoCommand />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
