import { MenuItem } from '@nebula-lab/react-ui/menu';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { CardListItem } from './card-list-item';

describe('CardListItem (block)', () => {
  it('renders title and description', () => {
    render(<CardListItem title="Jane Cooper" description="jane@example.com" />);
    expect(screen.getByText('Jane Cooper')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('renders trailing content', () => {
    render(<CardListItem title="Invoice #1024" trailing={<span>$240.00</span>} />);
    expect(screen.getByText('$240.00')).toBeInTheDocument();
  });

  it('renders icon only when avatar is not given', () => {
    render(<CardListItem title="Row" avatar={<span data-testid="avatar" />} icon={<span data-testid="icon" />} />);
    expect(screen.getByTestId('avatar')).toBeInTheDocument();
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
  });

  it('is not interactive (no role/tabIndex) when onClick is omitted', () => {
    render(<CardListItem title="Row" />);
    expect(screen.queryByRole('button', { name: 'Row' })).not.toBeInTheDocument();
  });

  it('calls onClick on click and on Enter/Space when interactive', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<CardListItem title="Row" onClick={onClick} />);
    const row = screen.getByRole('button', { name: 'Row' });

    await user.click(row);
    expect(onClick).toHaveBeenCalledTimes(1);

    row.focus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(2);

    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('renders no overflow trigger when actions is omitted', () => {
    render(<CardListItem title="Row" />);
    expect(screen.queryByRole('button', { name: 'Row actions' })).not.toBeInTheDocument();
  });

  it('opens the actions menu and shows its items without triggering row onClick', () => {
    const onClick = vi.fn();
    render(
      <CardListItem title="Row" onClick={onClick} actions={<MenuItem onSelect={() => {}}>Edit</MenuItem>} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Row actions' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <CardListItem
        title="Jane Cooper"
        description="jane@example.com"
        avatar={<span aria-hidden="true" />}
        trailing={<span>Active</span>}
        onClick={() => {}}
        actions={<MenuItem onSelect={() => {}}>Edit</MenuItem>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
