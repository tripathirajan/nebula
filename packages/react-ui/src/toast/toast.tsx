import { cn } from '@nebula/primitives/cn';
import { Toast as StylelessToast } from '@nebula/styleless/toast';
import * as React from 'react';

import type { ToastProps as StylelessToastProps } from '@nebula/styleless/toast';

type ToastProps = StylelessToastProps;

/**
 * A single notification card — reads `--toast-bg`/`-text`/`-border`
 * (`neutral`/`neutral-content`, same "pop off the page" reasoning
 * `tooltipTokens` uses — see `../tokens/component.ts`). Slides/fades via
 * `data-[state=open]`/`data-[state=closed]`, left to the consumer's
 * `ToastViewport` stacking context to actually position; this card itself
 * only owns its own visual chrome.
 */
const Toast = React.forwardRef<HTMLLIElement, ToastProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <StylelessToast
      className={cn(
        'flex w-full items-start gap-3 rounded-[var(--radius-box)] border border-[var(--toast-border)] bg-[var(--toast-bg)] p-4 text-sm text-[var(--toast-text)] shadow-lg transition-all data-[state=closed]:translate-x-full data-[state=closed]:opacity-0',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Toast.displayName = 'Toast';

export { Toast };
export type { ToastProps };
