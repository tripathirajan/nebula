import * as React from 'react';

import { composeEventHandlers } from '../compose-event-handlers/compose-event-handlers';
import { Primitive } from '../primitive/primitive';

import type { PrimitivePropsWithRef } from '../primitive/primitive';

/** Props accepted by {@link Form}. */
type FormProps = PrimitivePropsWithRef<'form'>;

/**
 * Unstyled `form`. Defaults `noValidate` to `true` (most apps wire their own
 * validation via `react-hook-form`/`zod`/etc. rather than the browser's
 * built-in validation UI — pass `noValidate={false}` to opt back into
 * native validation) and always calls `event.preventDefault()` on submit
 * before your `onSubmit` runs, since "the browser navigates away" is
 * essentially never the desired behavior for a form wired up to React state.
 *
 * @example
 * ```tsx
 * <Form onSubmit={(event) => { const data = new FormData(event.currentTarget); ... }}>
 *   <Label htmlFor="email">Email</Label>
 *   <Input id="email" name="email" type="email" />
 *   <Button type="submit">Submit</Button>
 * </Form>
 * ```
 */
const Form = React.forwardRef<HTMLFormElement, FormProps>((props, forwardedRef) => {
  const { noValidate = true, onSubmit, ...rest } = props;
  return (
    <Primitive
      as="form"
      noValidate={noValidate}
      {...rest}
      ref={forwardedRef}
      onSubmit={composeEventHandlers(
        (event: React.FormEvent<HTMLFormElement>) => event.preventDefault(),
        onSubmit,
        { checkForDefaultPrevented: false },
      )}
    />
  );
});

Form.displayName = 'Form';

export { Form };
export type { FormProps };
