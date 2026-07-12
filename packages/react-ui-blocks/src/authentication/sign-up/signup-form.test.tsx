import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { SignupForm } from './signup-form';

describe('SignupForm (block)', () => {
  it('renders default title, description, and fields', () => {
    render(<SignupForm />);
    expect(screen.getByText('Create an account')).toBeInTheDocument();
    expect(screen.getByText('Enter your details to get started.')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
    expect(screen.getByLabelText('I agree to the Terms of Service and Privacy Policy')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign up' })).toBeInTheDocument();
  });

  it('honors title/description/submitLabel overrides', () => {
    render(<SignupForm title="Join us" description="Custom copy" submitLabel="Create account" />);
    expect(screen.getByText('Join us')).toBeInTheDocument();
    expect(screen.getByText('Custom copy')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create account' })).toBeInTheDocument();
  });

  it('calls onSubmit with the current field values, including mismatched passwords unvalidated', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SignupForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Name'), 'Jane Cooper');
    await user.type(screen.getByLabelText('Email'), 'jane@example.com');
    await user.type(screen.getByLabelText('Password'), 'hunter2');
    await user.type(screen.getByLabelText('Confirm password'), 'different');
    await user.click(screen.getByLabelText('I agree to the Terms of Service and Privacy Policy'));
    await user.click(screen.getByRole('button', { name: 'Sign up' }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Jane Cooper',
      email: 'jane@example.com',
      password: 'hunter2',
      confirmPassword: 'different',
      acceptedTerms: true,
    });
  });

  it('shows the top-level error message with role="alert"', () => {
    render(<SignupForm error="Email already in use" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Email already in use');
  });

  it('disables the submit button while isSubmitting', () => {
    render(<SignupForm isSubmitting />);
    expect(screen.getByRole('button', { name: 'Sign up' })).toBeDisabled();
  });

  it('renders the footer slot', () => {
    render(<SignupForm footer={<a href="/sign-in">Already have an account?</a>} />);
    expect(screen.getByRole('link', { name: 'Already have an account?' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<SignupForm error="Email already in use" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
