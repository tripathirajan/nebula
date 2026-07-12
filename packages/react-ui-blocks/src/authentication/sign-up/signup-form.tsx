import { Button } from '@nebula/react-ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@nebula/react-ui/card';
import { Checkbox } from '@nebula/react-ui/checkbox';
import { Field, FieldControl, FieldLabel } from '@nebula/react-ui/field';
import { Input } from '@nebula/react-ui/input';
import { PasswordField } from '@nebula/react-ui/password-field';
import * as React from 'react';

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
}

interface SignupFormProps {
  /** Called with the current field values on submit — same "block owns the UI, consumer owns the request" split `LoginForm` follows. */
  onSubmit?: (values: SignupFormValues) => void;
  isSubmitting?: boolean;
  error?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  submitLabel?: React.ReactNode;
  /** Rendered inline with the terms checkbox — a node (not a string) since it typically wraps `<a>` links to Terms/Privacy pages. */
  termsLabel?: React.ReactNode;
  /** Rendered below the submit button — e.g. "Already have an account? Sign in". */
  footer?: React.ReactNode;
  className?: string;
}

/**
 * A name/email/password sign-up card — deliberately mirrors `LoginForm`'s
 * structure and conventions (see `../sign-in/login-form.tsx`): no validation
 * of its own (including **no password-match check** between `password` and
 * `confirmPassword` — both raw values are handed to `onSubmit`, and
 * comparing them is left to the consumer, the same way `LoginForm` leaves
 * email-format checking to the consumer), local `useState` per field, a
 * single top-level `error` string rather than per-field errors.
 *
 * The terms checkbox is `required` (unlike `LoginForm`'s optional "remember
 * me") since a terms-acceptance gate is normally mandatory before signup can
 * proceed.
 *
 * @example
 * ```tsx
 * <SignupForm
 *   error={signupError}
 *   isSubmitting={pending}
 *   onSubmit={(values) => createAccount(values)}
 *   termsLabel={<>I agree to the <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a></>}
 *   footer={<a href="/sign-in">Already have an account? Sign in</a>}
 * />
 * ```
 */
function SignupForm(props: SignupFormProps) {
  const {
    onSubmit,
    isSubmitting = false,
    error,
    title = 'Create an account',
    description = 'Enter your details to get started.',
    submitLabel = 'Sign up',
    termsLabel = 'I agree to the Terms of Service and Privacy Policy',
    footer,
    className,
  } = props;

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.({ name, email, password, confirmPassword, acceptedTerms });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {error ? (
            <p role="alert" className="text-sm text-[var(--button-danger-bg)]">
              {error}
            </p>
          ) : null}
          <Field>
            <FieldLabel>Name</FieldLabel>
            <FieldControl asChild>
              <Input
                type="text"
                name="name"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </FieldControl>
          </Field>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <FieldControl asChild>
              <Input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </FieldControl>
          </Field>
          <Field>
            <FieldLabel>Password</FieldLabel>
            <FieldControl asChild>
              <PasswordField
                name="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </FieldControl>
          </Field>
          <Field>
            <FieldLabel>Confirm password</FieldLabel>
            <FieldControl asChild>
              <PasswordField
                name="confirmPassword"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </FieldControl>
          </Field>
          <div className="flex items-center gap-2 text-sm text-[var(--card-text)]">
            <Checkbox
              id="signup-form-terms"
              name="acceptedTerms"
              required
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
            />
            {/* `htmlFor`/`id` rather than nesting — see `LoginForm`'s identical
                "Remember me" comment for why this still gets real
                click-forwarding and accessible-name association. */}
            <label htmlFor="signup-form-terms">{termsLabel}</label>
          </div>
          <Button type="submit" loading={isSubmitting} className="w-full">
            {submitLabel}
          </Button>
          {footer}
        </form>
      </CardContent>
    </Card>
  );
}

export { SignupForm };
export type { SignupFormProps, SignupFormValues };
