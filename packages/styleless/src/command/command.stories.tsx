import { expect, fn, userEvent, within } from '@storybook/test';
import * as React from 'react';

import { Command } from './command';
import { CommandEmpty } from './command-empty';
import { CommandGroup } from './command-group';
import { CommandInput } from './command-input';
import { CommandItem } from './command-item';
import { CommandList } from './command-list';
import { CommandSeparator } from './command-separator';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Styleless/Command',
  component: Command,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

const ACTIONS = ['New File', 'New Folder', 'Open Settings'];
const RECENT = ['report.pdf', 'notes.md'];

function CommandPalette({ onRun }: { onRun: (label: string) => void }) {
  const [inputValue, setInputValue] = React.useState('');
  const matches = (label: string) => label.toLowerCase().includes(inputValue.toLowerCase());
  const filteredActions = ACTIONS.filter(matches);
  const filteredRecent = RECENT.filter(matches);

  return (
    <Command inputValue={inputValue} onInputValueChange={setInputValue}>
      <CommandInput aria-label="Command" placeholder="Type a command…" />
      <CommandList>
        {filteredActions.length === 0 && filteredRecent.length === 0 ? (
          <CommandEmpty>No results found.</CommandEmpty>
        ) : null}
        {filteredActions.length > 0 ? (
          <CommandGroup heading="Actions">
            {filteredActions.map((label) => (
              <CommandItem key={label} value={label} onSelect={() => onRun(label)}>
                {label}
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}
        {filteredActions.length > 0 && filteredRecent.length > 0 ? <CommandSeparator /> : null}
        {filteredRecent.length > 0 ? (
          <CommandGroup heading="Recent">
            {filteredRecent.map((label) => (
              <CommandItem key={label} value={label} onSelect={() => onRun(label)}>
                {label}
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}
      </CommandList>
    </Command>
  );
}

export const Default: Story = {
  render: () => <CommandPalette onRun={fn()} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox', { name: 'Command' });

    await expect(canvas.getByRole('option', { name: 'New File' })).toBeInTheDocument();
    await expect(canvas.getByRole('option', { name: 'report.pdf' })).toBeInTheDocument();

    await userEvent.type(input, 'new');
    await expect(canvas.getByRole('option', { name: 'New File' })).toBeInTheDocument();
    await expect(canvas.queryByRole('option', { name: 'report.pdf' })).not.toBeInTheDocument();
  },
};

export const KeyboardSelect: Story = {
  render: () => {
    function Demo() {
      const [last, setLast] = React.useState<string | undefined>(undefined);
      return (
        <div>
          <CommandPalette onRun={setLast} />
          <p data-testid="last-run">{last ?? 'nothing run yet'}</p>
        </div>
      );
    }
    return <Demo />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox', { name: 'Command' });

    await userEvent.type(input, '{ArrowDown}{Enter}');
    await expect(canvas.getByTestId('last-run')).toHaveTextContent('New File');
  },
};
