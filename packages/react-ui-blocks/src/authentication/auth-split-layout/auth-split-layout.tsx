import { cn } from '@nebula-lab/primitives/cn';
import { Heading } from '@nebula-lab/react-ui/heading';
import { Text } from '@nebula-lab/react-ui/text';
import * as React from 'react';

interface AuthSplitLayoutProps {
  /** The auth form itself — e.g. `<LoginForm />`/`<SignupForm />` — rendered centered in the right panel (the only panel shown below `lg`). */
  children: React.ReactNode;
  /** Rendered top-left of the left panel. */
  logo?: React.ReactNode;
  /** The left panel's illustration/artwork — deliberately a consumer-supplied slot, not a bundled image, since real marketing artwork is app-specific (and, unlike every other visual choice in this package, not something a neutral component library should ship an opinion on). */
  illustration?: React.ReactNode;
  /** Left panel headline, e.g. `"Hi, welcome back"`. */
  title?: React.ReactNode;
  /** Left panel supporting text under `title`. */
  description?: React.ReactNode;
  /** Rendered at the bottom of the left panel — e.g. a row of partner/trust logos. */
  footerSlot?: React.ReactNode;
  /** Rendered top-right of the right panel — e.g. a "Need help?" link or a language switcher. */
  topRightSlot?: React.ReactNode;
  className?: string;
}

/**
 * A two-panel auth shell: a left marketing panel (logo, headline, an
 * illustration slot) beside a right panel that centers `children` (the
 * actual form) — visible only at `lg` and above. Below `lg` the left panel
 * is hidden entirely and the form panel fills the full screen, centered,
 * the same "auth screen is the whole screen" pattern a native mobile app
 * uses, per the project owner's own reference screenshot.
 *
 * Deliberately does **not** own `ThemeProvider` or a portal root the way
 * the previous `AuthLayout` (removed) did — this is a pure layout
 * composition (`div`s + `Heading`/`Text`, two react-ui components), not a
 * page-level shell with its own state. A consumer already inside their
 * app's `ThemeProvider` (from their root layout) drops this in wherever
 * the sign-in route renders.
 *
 * @example
 * ```tsx
 * <AuthSplitLayout
 *   logo={<Logo />}
 *   title="Hi, welcome back"
 *   description="More effectively with optimized workflows."
 *   illustration={<img src="/auth-illustration.svg" alt="" />}
 *   topRightSlot={<a href="/help">Need help?</a>}
 * >
 *   <LoginForm onSubmit={signIn} />
 * </AuthSplitLayout>
 * ```
 */
function AuthSplitLayout(props: AuthSplitLayoutProps) {
  const { children, logo, illustration, title, description, footerSlot, topRightSlot, className } = props;

  return (
    <div className={cn('flex min-h-svh bg-[var(--color-base-100)]', className)}>
      <div className="hidden w-1/2 flex-col justify-between gap-12 bg-[var(--color-base-200)] p-12 lg:flex">
        <div>{logo}</div>
        <div className="flex flex-col items-center gap-8 text-center">
          {title || description ? (
            <div>
              {title ? (
                <Heading as="h1" level={2}>
                  {title}
                </Heading>
              ) : null}
              {description ? <Text className="mt-2 opacity-70">{description}</Text> : null}
            </div>
          ) : null}
          {illustration}
        </div>
        <div>{footerSlot}</div>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex justify-end p-6">{topRightSlot}</div>
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}

export { AuthSplitLayout };
export type { AuthSplitLayoutProps };
