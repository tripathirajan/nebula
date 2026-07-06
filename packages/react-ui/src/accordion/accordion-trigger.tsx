import { cn } from '@nebula/primitives/cn';
import { AccordionTrigger as StylelessAccordionTrigger } from '@nebula/styleless/accordion';
import * as React from 'react';

import type { AccordionTriggerProps as StylelessAccordionTriggerProps } from '@nebula/styleless/accordion';

type AccordionTriggerProps = StylelessAccordionTriggerProps;

/**
 * Adds hover/focus styling and a chevron that rotates 180° off
 * `data-state="open"` (set by the underlying `@nebula/styleless` trigger) —
 * a plain CSS transform driven by a data attribute, no JS/animation library.
 * No external icon dependency — this package doesn't have one yet, so the
 * chevron is a small inline `<svg>` rather than pulling one in for a single
 * glyph.
 */
const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  (props, forwardedRef) => {
    const { className, children, ...rest } = props;
    return (
      <StylelessAccordionTrigger
        className={cn(
          'group flex flex-1 items-center justify-between gap-4 py-4 text-left text-sm font-medium text-[var(--accordion-text)] transition-colors hover:bg-[var(--accordion-trigger-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accordion-text)] focus-visible:ring-inset',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      >
        {children}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </StylelessAccordionTrigger>
    );
  },
);

AccordionTrigger.displayName = 'AccordionTrigger';

export { AccordionTrigger };
export type { AccordionTriggerProps };
