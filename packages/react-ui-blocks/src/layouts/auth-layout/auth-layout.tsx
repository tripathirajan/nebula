import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import { AppLayout } from '../app-layout/app-layout';

import type { Theme } from '@nebula/react-ui/theme-provider';

interface AuthLayoutProps {
  /** Typically a `LoginForm`/a sign-up form/a password-reset form — this component only provides the centered-card page frame, not any form content itself. */
  children: React.ReactNode;
  title?: React.ReactNode;
  /** @default 'system' */
  defaultTheme?: Theme;
  className?: string;
}

/**
 * Centered-card page shell for sign-in/sign-up/password-reset flows —
 * composes on top of `AppLayout` with `hideHeader` (an auth screen's whole
 * point is to be the *first* thing a user sees, before any app chrome makes
 * sense to show) and centers its `children` in a capped-width column rather
 * than letting a form stretch full-bleed across a wide viewport.
 *
 * Deliberately content-agnostic about what's centered — pair with
 * `LoginForm` for the common case, or any other card-shaped content
 * (a sign-up form, an MFA code entry panel) for the others `BLOCKS_ARCHITECTURE.md`
 * §3.9 lists as sharing this same visual shell.
 *
 * @example
 * ```tsx
 * <AuthLayout title="Acme">
 *   <LoginForm onSubmit={signIn} />
 * </AuthLayout>
 * ```
 */
function AuthLayout(props: AuthLayoutProps) {
  const { children, title, defaultTheme, className } = props;

  return (
    <AppLayout title={title} defaultTheme={defaultTheme} hideHeader>
      <div className={cn('flex min-h-full flex-1 items-center justify-center p-6', className)}>
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </AppLayout>
  );
}

export { AuthLayout };
export type { AuthLayoutProps };
