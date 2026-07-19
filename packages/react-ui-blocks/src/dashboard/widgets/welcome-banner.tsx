import { cn } from '@nebula-lab/primitives/cn';
import { Button } from '@nebula-lab/react-ui/button';
import { Card, CardContent } from '@nebula-lab/react-ui/card';
import { Heading } from '@nebula-lab/react-ui/heading';
import { Text } from '@nebula-lab/react-ui/text';
import * as React from 'react';

interface WelcomeBannerAction {
  label: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

interface WelcomeBannerProps {
  /** e.g. "Welcome back, Jane 👋" — no sensible default, every app's greeting differs. */
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: WelcomeBannerAction;
  /** A decorative graphic rendered on the right — hidden below `md` to keep the banner compact on narrow screens. `aria-hidden` is applied automatically; pass a purely visual node. */
  illustration?: React.ReactNode;
  className?: string;
}

/**
 * A dashboard-home greeting banner — the "welcome back" card that typically
 * sits above the metrics/chart grid on a dashboard's landing screen (the
 * counterpart `Hero`'s marketing-page role plays one vertical over).
 * Colored with `--color-primary`/`--color-primary-content` rather than the
 * neutral `Card` surface, so it reads as the page's one deliberately
 * emphasized element — re-themes for free like every other block in this
 * package, never a hardcoded brand color.
 *
 * @example
 * ```tsx
 * <WelcomeBanner
 *   title="Welcome back, Jane 👋"
 *   description="Here's what's happening with your projects today."
 *   action={{ label: 'View reports', href: '/reports' }}
 * />
 * ```
 */
function WelcomeBanner(props: WelcomeBannerProps) {
  const { title, description, action, illustration, className } = props;

  return (
    <Card
      variant="elevation"
      elevation={0}
      className={cn(
        'overflow-hidden border-none bg-[var(--color-primary)] text-[var(--color-primary-content)]',
        className,
      )}
    >
      <CardContent className="flex items-center justify-between gap-6">
        <div className="flex flex-col items-start gap-3">
          <Heading as="h2" level={3} className="text-[var(--color-primary-content)]">
            {title}
          </Heading>
          {description ? (
            <Text className="max-w-md text-sm text-[var(--color-primary-content)] opacity-90">
              {description}
            </Text>
          ) : null}
          {action ? (
            action.href ? (
              <Button asChild color="neutral" size="sm" className="mt-1">
                <a href={action.href}>{action.label}</a>
              </Button>
            ) : (
              <Button color="neutral" size="sm" className="mt-1" onClick={action.onClick}>
                {action.label}
              </Button>
            )
          ) : null}
        </div>
        {illustration ? (
          <span aria-hidden="true" className="hidden shrink-0 md:block">
            {illustration}
          </span>
        ) : null}
      </CardContent>
    </Card>
  );
}

export { WelcomeBanner };
export type { WelcomeBannerProps, WelcomeBannerAction };
