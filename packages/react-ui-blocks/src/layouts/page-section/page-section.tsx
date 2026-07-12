import { cn } from '@nebula/primitives/cn';
import { Heading, Section, Text } from '@nebula/react-ui';
import * as React from 'react';

interface PageSectionProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Rendered top-right, alongside the title — e.g. an "Add new" action `Button`. */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * A generic content-section wrapper: optional title/description/actions
 * header row above `children`, built on `Section`'s vertical-rhythm
 * treatment. Distinct from `AppLayout`/`AuthLayout`/`DashboardLayout`/
 * `SettingsLayout` — those are full-page shells (own `ThemeProvider`,
 * header, portal root); this is a smaller building block meant to be used
 * *inside* a page built from one of those shells, the same relationship
 * `Section` already has to `Main` one layer down.
 *
 * @example
 * ```tsx
 * <PageSection title="Billing" description="Manage your plan and payment method." actions={<Button>Upgrade</Button>}>
 *   <BillingSummary />
 * </PageSection>
 * ```
 */
function PageSection(props: PageSectionProps) {
  const { children, title, description, actions, className } = props;
  const headingId = React.useId();

  return (
    <Section className={cn('space-y-6', className)} aria-labelledby={title ? headingId : undefined}>
      {title || description || actions ? (
        <div className="flex items-start justify-between gap-4">
          <div>
            {title ? (
              <Heading as="h2" level={3} id={headingId}>
                {title}
              </Heading>
            ) : null}
            {description ? <Text className="mt-1 opacity-70">{description}</Text> : null}
          </div>
          {actions}
        </div>
      ) : null}
      {children}
    </Section>
  );
}

export { PageSection };
export type { PageSectionProps };
