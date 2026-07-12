import { Field, FieldControl, FieldLabel } from '@nebula/react-ui/field';
import { Input } from '@nebula/react-ui/input';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { EntityFormLayout } from './entity-form-layout';

function Fields() {
  return (
    <Field>
      <FieldLabel>Name</FieldLabel>
      <FieldControl asChild>
        <Input name="name" />
      </FieldControl>
    </Field>
  );
}

describe('EntityFormLayout (block)', () => {
  it('renders the avatar fallback, helper text, and children field grid', () => {
    render(
      <EntityFormLayout avatarFallback="J" helperText="Max 3.1 MB">
        <Fields />
      </EntityFormLayout>,
    );
    expect(screen.getByText('J')).toBeInTheDocument();
    expect(screen.getByText('Max 3.1 MB')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });

  it('renders no file input when onAvatarChange is omitted', () => {
    render(
      <EntityFormLayout avatarFallback="J">
        <Fields />
      </EntityFormLayout>,
    );
    expect(screen.queryByLabelText('Change avatar')).not.toBeInTheDocument();
  });

  it('renders a file input and calls onAvatarChange when a file is picked', () => {
    const onAvatarChange = vi.fn();
    render(
      <EntityFormLayout avatarFallback="J" onAvatarChange={onAvatarChange}>
        <Fields />
      </EntityFormLayout>,
    );
    const file = new File(['x'], 'avatar.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText('Change avatar'), { target: { files: [file] } });
    expect(onAvatarChange).toHaveBeenCalledWith(file);
  });

  it('renders a switch per toggle and reports changes', () => {
    const onCheckedChange = vi.fn();
    render(
      <EntityFormLayout
        avatarFallback="J"
        toggles={[{ key: 'verified', label: 'Email verified', checked: true, onCheckedChange }]}
      >
        <Fields />
      </EntityFormLayout>,
    );
    const toggle = screen.getByRole('switch', { name: 'Email verified' });
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(toggle);
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it('renders a button per danger action and calls its onClick', () => {
    const onClick = vi.fn();
    render(
      <EntityFormLayout avatarFallback="J" dangerActions={[{ label: 'Delete user', onClick }]}>
        <Fields />
      </EntityFormLayout>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Delete user' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit when the form is submitted', () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <EntityFormLayout avatarFallback="J" onSubmit={onSubmit}>
        <Fields />
      </EntityFormLayout>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <EntityFormLayout
        avatarFallback="J"
        helperText="Max 3.1 MB"
        onAvatarChange={() => {}}
        toggles={[{ key: 'verified', label: 'Email verified', checked: true, onCheckedChange: () => {} }]}
        dangerActions={[{ label: 'Delete user', onClick: () => {} }]}
      >
        <Fields />
      </EntityFormLayout>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
