import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { Kbd } from '../kbd/kbd';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

interface KbdShortcutOwnProps {
  /** Each key in the sequence, rendered as its own `Kbd` pill — e.g. `['⌘', 'K']` or `['Ctrl', 'Shift', 'P']`. */
  keys: React.ReactNode[];
  /** Rendered between consecutive keys. Pass `null` for tight symbol-style sequences (e.g. `⌘K`) instead of `Ctrl` `+` `K`. @default '+' */
  separator?: React.ReactNode;
}

type KbdShortcutProps = Omit<PrimitivePropsWithRef<'span'>, 'children'> & KbdShortcutOwnProps;

/**
 * A `Kbd` sequence renderer — same "no lower-layer counterpart" treatment
 * `Kbd` itself already documents (purely presentational, no ARIA pattern,
 * no state). `Kbd` already renders the correct native `<kbd>` semantics per
 * key; this only adds the separator and lays the sequence out inline, it
 * doesn't need its own ARIA role.
 *
 * @example
 * ```tsx
 * <KbdShortcut keys={['⌘', 'K']} separator={null} />
 * <KbdShortcut keys={['Ctrl', 'Shift', 'P']} />
 * ```
 */
const KbdShortcut = React.forwardRef<HTMLSpanElement, KbdShortcutProps>((props, forwardedRef) => {
  const { className, keys, separator = '+', ...rest } = props;
  return (
    <Primitive
      as="span"
      className={cn('inline-flex items-center gap-1', className)}
      {...rest}
      ref={forwardedRef}
    >
      {keys.map((key, index) => (
        <React.Fragment key={index}>
          {index > 0 && separator != null ? (
            <span aria-hidden="true" className="text-xs text-[var(--kbd-text)]">
              {separator}
            </span>
          ) : null}
          <Kbd>{key}</Kbd>
        </React.Fragment>
      ))}
    </Primitive>
  );
});

KbdShortcut.displayName = 'KbdShortcut';

export { KbdShortcut };
export type { KbdShortcutProps };
