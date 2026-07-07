import { Switch as HeadlessSwitch } from '@nebula/headless/switch';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { SwitchProps as HeadlessSwitchProps } from '@nebula/headless/switch';

type SwitchProps = HeadlessSwitchProps;

/**
 * Styled wrapper around `@nebula/headless`'s `Switch` — on/off behavior,
 * `role="switch"`, and hidden-native-input form participation all come
 * from there unchanged. This layer only adds the track's styling
 * (`--switch-track-*` tokens, see `../tokens/component.ts`) and a thumb
 * `<span>` that slides via `data-state`, using the same `group`/
 * `group-data-*` technique `Checkbox`'s indicator icons use — the thumb
 * isn't a separate `@nebula/headless` part, just a purely visual child.
 *
 * @example
 * ```tsx
 * const [enabled, setEnabled] = useState(false);
 * <Switch checked={enabled} onCheckedChange={setEnabled} aria-label="Enable notifications" />
 * ```
 */
const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <HeadlessSwitch
      className={cn(
        'group relative inline-flex h-5 w-9 shrink-0 items-center rounded-[var(--radius-selector)] bg-[var(--switch-track-bg)] transition-colors data-[state=checked]:bg-[var(--switch-track-checked-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--switch-track-checked-bg)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none block h-4 w-4 translate-x-0.5 rounded-full bg-[var(--switch-thumb-bg)] shadow transition-transform duration-150 group-data-[state=checked]:translate-x-4"
      />
    </HeadlessSwitch>
  );
});

Switch.displayName = 'Switch';

export { Switch };
export type { SwitchProps };
