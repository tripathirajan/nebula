// No chrome of its own — wraps whatever control is passed `asChild` (an
// `Input`/`TextArea`/custom widget, which each already carry their own
// styling), same reasoning `DialogTrigger`'s no-wrapper treatment uses.
export { FieldControl } from '@nebula/headless/field';
export type { FieldControlProps } from '@nebula/headless/field';
