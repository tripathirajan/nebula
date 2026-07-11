import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Field,
  FieldControl,
  FieldLabel,
  Input,
  PasswordField,
} from '@nebula/react-ui';
import * as React from 'react';

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

interface LoginFormProps {
  /** Called with the current field values on submit — this component never calls an API itself, same "block owns the UI, consumer owns the request" split every block in this package follows. */
  onSubmit?: (values: LoginFormValues) => void;
  /** Shows the submit button's busy state and disables the form. */
  isSubmitting?: boolean;
  /** A server-side/auth error to display above the fields (e.g. "Invalid email or password") — distinct from per-field validation, which this component doesn't do itself (see the doc comment below). */
  error?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  submitLabel?: React.ReactNode;
  /** Rendered below the submit button — e.g. a "Forgot password?" link or a "Don't have an account? Sign up" line. Left to the consumer since routing/link components vary per app. */
  footer?: React.ReactNode;
  className?: string;
}

/**
 * A email/password sign-in card composed entirely from `@nebula/react-ui`
 * components (`Card`, `Field`, `Input`, `PasswordField`, `Checkbox`,
 * `Button`) — no new primitives, matching this package's own README rule
 * that everything here builds purely on the layer below.
 *
 * Deliberately does **no validation of its own** (required-field checks,
 * email format, password rules) — real validation rules vary too much
 * per-consumer (some apps validate email format client-side, some don't;
 * password rules are almost always backend-driven) to bake in here, so this
 * only wires the fields together and hands `{ email, password, remember }`
 * to `onSubmit` on submit; a consumer wanting client-side validation
 * composes it around `onSubmit` themselves (or swaps in a form library).
 * `error` is for a single top-level auth failure message, not
 * per-field errors — that's what real backend authentication returns
 * anyway (a login endpoint says "invalid credentials," never "which field").
 *
 * State is local `useState` (not read from `FormData` on native submit) so
 * every field — including `PasswordField`'s show/hide toggle, which doesn't
 * change this — stays a plain controlled value the consumer can also
 * pre-fill or reset from outside.
 *
 * @example
 * ```tsx
 * <LoginForm
 *   error={authError}
 *   isSubmitting={pending}
 *   onSubmit={(values) => signIn(values)}
 *   footer={<a href="/forgot-password">Forgot password?</a>}
 * />
 * ```
 */
function LoginForm(props: LoginFormProps) {
  const {
    onSubmit,
    isSubmitting = false,
    error,
    title = 'Sign in',
    description = 'Enter your email and password to continue.',
    submitLabel = 'Sign in',
    footer,
    className,
  } = props;

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [remember, setRemember] = React.useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.({ email, password, remember });
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
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </FieldControl>
          </Field>
          <div className="flex items-center gap-2 text-sm text-[var(--card-text)]">
            <Checkbox
              id="login-form-remember"
              name="remember"
              checked={remember}
              onCheckedChange={(checked) => setRemember(checked === true)}
            />
            {/* `htmlFor`/`id` rather than nesting the `Checkbox` inside this
                `<label>` — `Checkbox` renders a `role="checkbox"` `<button>`
                as its visible element (the real `<input type="checkbox">`
                is visually hidden inside it for native form participation),
                and `<button>` is one of the "labelable" native elements, so
                a real `<label htmlFor>` still gets genuine click-forwarding
                and accessible-name association here, unlike wrapping. */}
            <label htmlFor="login-form-remember">Remember me</label>
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

export { LoginForm };
export type { LoginFormProps, LoginFormValues };
