import * as React from 'react';
import type { PrimitivePropsWithRef } from '../primitive/primitive';
/** Props accepted by {@link Button}. */
type ButtonProps = PrimitivePropsWithRef<'button'>;
/**
 * Unstyled `button` — the one meaningful behavior difference from a bare
 * `<button>` is defaulting `type="button"` instead of the native default
 * (`"submit"`), which silently submits the nearest `<form>` and is almost
 * never what you want for a button that isn't literally a submit button.
 * Pass `type="submit"` explicitly when you do want that. See `@nebula/react-ui`'s
 * `Button` for the themed/`cva`-variant version built on this.
 *
 * @example
 * ```tsx
 * <Button onClick={() => console.log('clicked')}>Click me</Button>
 *
 * // Doesn't submit an ancestor form unless you opt in:
 * <Button type="submit">Save</Button>
 *
 * // asChild for a link that should look/behave like this button:
 * <Button asChild><a href="/pricing">See pricing</a></Button>
 * ```
 */
declare const Button: React.ForwardRefExoticComponent<Omit<ButtonProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;
export { Button };
export type { ButtonProps };
//# sourceMappingURL=button.d.ts.map