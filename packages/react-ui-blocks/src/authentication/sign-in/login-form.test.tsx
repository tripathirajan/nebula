import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { LoginForm } from './login-form';

describe('LoginForm (block)', () => {
  it('renders default title, description, and fields', () => {
    render(<LoginForm />);
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByText('Enter your email and password to continue.')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Remember me')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('honors title/description/submitLabel overrides', () => {
    render(<LoginForm title="Welcome back" description="Custom copy" submitLabel="Log in" />);
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByText('Custom copy')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument();
  });

  it('calls onSubmit with the current field values', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Email'), 'jane@example.com');
    await user.type(screen.getByLabelText('Password'), 'hunter2');
    await user.click(screen.getByLabelText('Remember me'));
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'jane@example.com',
      password: 'hunter2',
      remember: true,
    });
  });

  it('shows the top-level error message with role="alert"', () => {
    render(<LoginForm error="Invalid email or password" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email or password');
  });

  it('disables the submit button while isSubmitting', () => {
    render(<LoginForm isSubmitting />);
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeDisabled();
  });

  it('renders the footer slot', () => {
    render(<LoginForm footer={<a href="/forgot-password">Forgot password?</a>} />);
    expect(screen.getByRole('link', { name: 'Forgot password?' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<LoginForm error="Invalid email or password" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
