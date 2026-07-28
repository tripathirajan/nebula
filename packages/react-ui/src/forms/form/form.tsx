import { cn } from '@nebula-lab/primitives/cn';
import { Form as PrimitiveForm } from '@nebula-lab/primitives/form';
import * as React from 'react';

import type { FormProps as PrimitiveFormProps } from '@nebula-lab/primitives/form';

/**
 * Styled `Form` — wraps `@nebula-lab/primitives`' unstyled `Form` (which
 * already defaults `noValidate` and calls `event.preventDefault()` before
 * your `onSubmit` runs) with the vertical-stack field layout most forms in
 * this design system already reach for by hand (`flex flex-col gap-4`).
 *
 * @example
 * ```tsx
 * <Form onSubmit={(event) => { const data = new FormData(event.currentTarget); ... }}>
 *   <Field>
 *     <FieldLabel>Email</FieldLabel>
 *     <FieldControl asChild><Input type="email" /></FieldControl>
 *   </Field>
 *   <Button type="submit">Submit</Button>
 * </Form>
 * ```
 */
const Form = React.forwardRef<HTMLFormElement, PrimitiveFormProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return <PrimitiveForm className={cn('flex flex-col gap-4', className)} {...rest} ref={forwardedRef} />;
});

Form.displayName = 'Form';

export { Form };
export type { PrimitiveFormProps as FormProps };
