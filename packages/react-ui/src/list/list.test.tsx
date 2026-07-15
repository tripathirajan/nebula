import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
} from './list';

describe('List', () => {
  it('renders as ul by default, ol when ordered', () => {
    const { rerender } = render(
      <List data-testid="list">
        <ListItem>Item</ListItem>
      </List>,
    );
    expect(screen.getByTestId('list').tagName).toBe('UL');

    rerender(
      <List ordered data-testid="list">
        <ListItem>Item</ListItem>
      </List>,
    );
    expect(screen.getByTestId('list').tagName).toBe('OL');
  });

  it('reflects dense as data-dense on the root', () => {
    render(
      <List dense data-testid="list">
        <ListItem>Item</ListItem>
      </List>,
    );
    expect(screen.getByTestId('list')).toHaveAttribute('data-dense', '');
  });

  it('ListItemText renders primary/secondary lines', () => {
    render(
      <List>
        <ListItem>
          <ListItemText primary="Jane Cooper" secondary="jane@example.com" />
        </ListItem>
      </List>,
    );
    expect(screen.getByText('Jane Cooper')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('ListItemText renders children when primary is omitted', () => {
    render(
      <List>
        <ListItem>
          <ListItemText>Plain label</ListItemText>
        </ListItem>
      </List>,
    );
    expect(screen.getByText('Plain label')).toBeInTheDocument();
  });

  it('ListItemButton is a real button and reflects selected via data-selected', () => {
    render(
      <List>
        <ListItem disablePadding>
          <ListItemButton selected>
            <ListItemText primary="Overview" />
          </ListItemButton>
        </ListItem>
      </List>,
    );
    const button = screen.getByRole('button', { name: 'Overview' });
    expect(button).toHaveAttribute('data-selected', '');
  });

  it('ListItemButton calls onClick and supports disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={onClick}>
            <ListItemText primary="Click me" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton disabled onClick={onClick}>
            <ListItemText primary="Disabled" />
          </ListItemButton>
        </ListItem>
      </List>,
    );

    await user.click(screen.getByRole('button', { name: 'Click me' }));
    expect(onClick).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Disabled' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('ListItemIcon is aria-hidden', () => {
    render(
      <List>
        <ListItem>
          <ListItemIcon data-testid="icon">
            <svg />
          </ListItemIcon>
          <ListItemText primary="Row" />
        </ListItem>
      </List>,
    );
    expect(screen.getByTestId('icon')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders ListItemAvatar/ListItemSecondaryAction/ListSubheader content', () => {
    render(
      <List>
        <ListSubheader>Contacts</ListSubheader>
        <ListItem>
          <ListItemAvatar>
            <span data-testid="avatar" />
          </ListItemAvatar>
          <ListItemText primary="Row" />
          <ListItemSecondaryAction>
            <button type="button">Remove</button>
          </ListItemSecondaryAction>
        </ListItem>
      </List>,
    );
    expect(screen.getByText('Contacts')).toBeInTheDocument();
    expect(screen.getByTestId('avatar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <List>
        <ListSubheader>Section</ListSubheader>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <svg />
            </ListItemIcon>
            <ListItemText primary="Home" secondary="Dashboard overview" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <span />
          </ListItemAvatar>
          <ListItemText primary="Jane Cooper" secondary="jane@example.com" />
          <ListItemSecondaryAction>
            <button type="button" aria-label="Remove Jane Cooper">
              ×
            </button>
          </ListItemSecondaryAction>
        </ListItem>
      </List>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
