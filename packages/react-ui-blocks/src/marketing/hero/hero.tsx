import { cn } from '@nebula-lab/primitives/cn';
import { Button } from '@nebula-lab/react-ui/button';
import { Heading } from '@nebula-lab/react-ui/heading';
import { Text } from '@nebula-lab/react-ui/text';
import * as React from 'react';

interface HeroAction {
  label: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

interface HeroProps {
  eyebrow?: React.ReactNode;
  /** No sensible default copy — this is the one thing every hero needs. */
  headline: React.ReactNode;
  subheadline?: React.ReactNode;
  primaryAction?: HeroAction;
  /** Rendered with `variant="text"` to visually subordinate it to `primaryAction`. */
  secondaryAction?: HeroAction;
  /** Optional right-column visual (an `Image`, illustration, or any node) — the layout collapses to a single centered column when omitted. */
  media?: React.ReactNode;
  className?: string;
}

function renderAction(action: HeroAction, variant?: 'text') {
  if (action.href) {
    return (
      <Button asChild color="primary" variant={variant}>
        <a href={action.href}>{action.label}</a>
      </Button>
    );
  }
  return (
    <Button color="primary" variant={variant} onClick={action.onClick}>
      {action.label}
    </Button>
  );
}

/**
 * A marketing landing-page hero — headline/subheadline/CTA(s), with an
 * optional media slot that switches the layout from a single centered
 * column to a two-column split once supplied. Built purely from
 * `@nebula-lab/react-ui` (`Heading`, `Text`, `Button`) — no marketing-specific
 * primitive exists below this layer, so this block owns the whole
 * composition, matching every other block in this package.
 *
 * @example
 * ```tsx
 * <Hero
 *   eyebrow="New"
 *   headline="Ship your design system faster"
 *   subheadline="Composable, accessible, themeable — build UI once."
 *   primaryAction={{ label: 'Get started', href: '/docs' }}
 *   secondaryAction={{ label: 'View on GitHub', href: 'https://github.com' }}
 * />
 * ```
 */
function Hero(props: HeroProps) {
  const { eyebrow, headline, subheadline, primaryAction, secondaryAction, media, className } = props;

  return (
    <section className={cn('px-6 py-16 md:py-24', className)}>
      <div
        className={
          media
            ? 'mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-2'
            : 'mx-auto grid max-w-3xl grid-cols-1 items-center gap-10 text-center'
        }
      >
        <div className={media ? 'flex flex-col gap-4' : 'flex flex-col items-center gap-4'}>
          {eyebrow ? (
            <Text className="text-sm font-medium text-[var(--color-primary)]">{eyebrow}</Text>
          ) : null}
          <Heading as="h1" level={1}>
            {headline}
          </Heading>
          {subheadline ? <Text className="text-lg opacity-70">{subheadline}</Text> : null}
          {primaryAction || secondaryAction ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              {primaryAction ? renderAction(primaryAction) : null}
              {secondaryAction ? renderAction(secondaryAction, 'text') : null}
            </div>
          ) : null}
        </div>
        {media ? <div>{media}</div> : null}
      </div>
    </section>
  );
}

export { Hero };
export type { HeroProps, HeroAction };
