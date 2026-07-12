import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { FilterBar } from './filter-bar';

const filters = [
  { id: 'status', label: 'Status: Active' },
  { id: 'team', label: 'Team: Design' },
];

describe('FilterBar (block)', () => {
  it('renders a chip per active filter', () => {
    render(<FilterBar filters={filters} />);
    expect(screen.getByText('Status: Active')).toBeInTheDocument();
    expect(screen.getByText('Team: Design')).toBeInTheDocument();
  });

  it('renders nothing when there are no filters and no addOptions', () => {
    const { container } = render(<FilterBar filters={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('calls onRemoveFilter when a chip is dismissed', async () => {
    const user = userEvent.setup();
    const onRemoveFilter = vi.fn();
    render(<FilterBar filters={filters} onRemoveFilter={onRemoveFilter} />);
    await user.click(screen.getByRole('button', { name: 'Remove Status: Active filter' }));
    expect(onRemoveFilter).toHaveBeenCalledWith('status');
  });

  it('does not render "Clear all" without onClearAll', () => {
    render(<FilterBar filters={filters} />);
    expect(screen.queryByRole('button', { name: 'Clear all' })).not.toBeInTheDocument();
  });

  it('calls onClearAll when clicked', async () => {
    const user = userEvent.setup();
    const onClearAll = vi.fn();
    render(<FilterBar filters={filters} onClearAll={onClearAll} />);
    await user.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });

  it('does not render "Add filter" without addOptions', () => {
    render(<FilterBar filters={filters} />);
    expect(screen.queryByRole('button', { name: 'Add filter' })).not.toBeInTheDocument();
  });

  it('opens the add-filter menu and calls onAddFilter for a selected option', async () => {
    const user = userEvent.setup();
    const onAddFilter = vi.fn();
    render(
      <FilterBar
        filters={filters}
        addOptions={[{ id: 'owner', label: 'Owner' }]}
        onAddFilter={onAddFilter}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Add filter' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Owner' }));
    expect(onAddFilter).toHaveBeenCalledWith('owner');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <FilterBar
        filters={filters}
        onRemoveFilter={vi.fn()}
        onClearAll={vi.fn()}
        addOptions={[{ id: 'owner', label: 'Owner' }]}
        onAddFilter={vi.fn()}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
