import { cn } from '@nebula-lab/primitives/cn';
import { Avatar, AvatarFallback, AvatarImage } from '@nebula-lab/react-ui/avatar';
import { Button } from '@nebula-lab/react-ui/button';
import { Card, CardContent } from '@nebula-lab/react-ui/card';
import { Switch } from '@nebula-lab/react-ui/switch';
import { Text } from '@nebula-lab/react-ui/text';
import * as React from 'react';

interface EntityFormLayoutToggle {
  key: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

interface EntityFormLayoutDangerAction {
  label: string;
  onClick: () => void;
}

interface EntityFormLayoutProps {
  avatarSrc?: string;
  /** Required — `AvatarFallback` always needs something to render when there's no image, or while one is loading. */
  avatarFallback: string;
  /** Called with the selected file when the avatar is clicked and a new image is chosen. Omit to make the avatar non-interactive (e.g. a read-only detail view). */
  onAvatarChange?: (file: File) => void;
  /** e.g. "Allowed *.jpeg, *.jpg, *.png max 3.1 MB". */
  helperText?: React.ReactNode;
  /** e.g. "Email verified". Rendered as a `Switch` + label row below the avatar. */
  toggles?: EntityFormLayoutToggle[];
  /** e.g. "Ban this user" / "Delete user" — rendered as `danger`-colored ghost buttons at the bottom of the left card. */
  dangerActions?: EntityFormLayoutDangerAction[];
  /** The right card's field grid — entirely left to the consumer, this component only owns the two-column shell and the avatar/toggle/danger-action left card. */
  children: React.ReactNode;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  submitLabel?: React.ReactNode;
  className?: string;
}

function CameraIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5 text-white">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h3l1.5-2h7L17 8h3a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z" />
      <circle cx="12" cy="14" r="3.5" />
    </svg>
  );
}

/**
 * The avatar-card + field-grid entity form shell — Minimals' User
 * Create/Edit page, generalized to any entity (§3.14 *Account Profile
 * Form*, the same shell this session's inventory also flags as reused
 * unchanged for the Account → General settings tab). This owns only the
 * two-column layout and the left card (avatar upload, helper text,
 * toggles, danger actions) — the right card's actual field grid is
 * entirely the consumer's `children`, since every entity's fields differ
 * (a user's `name`/`email`/`phone` vs. a product's `sku`/`category`) and
 * hand-coding a generic field-schema API here would be more indirection
 * than just letting the consumer compose their own `Field`s directly.
 *
 * @example
 * ```tsx
 * <EntityFormLayout
 *   avatarFallback="J"
 *   helperText="Allowed *.jpeg, *.jpg, *.png max 3.1 MB"
 *   toggles={[{ key: 'verified', label: 'Email verified', checked: true, onCheckedChange: () => {} }]}
 *   dangerActions={[{ label: 'Delete user', onClick: () => {} }]}
 *   onSubmit={(e) => { e.preventDefault(); }}
 * >
 *   <Field><FieldLabel>Name</FieldLabel><FieldControl asChild><Input name="name" /></FieldControl></Field>
 *   <Field><FieldLabel>Email</FieldLabel><FieldControl asChild><Input name="email" type="email" /></FieldControl></Field>
 * </EntityFormLayout>
 * ```
 */
function EntityFormLayout(props: EntityFormLayoutProps) {
  const {
    avatarSrc,
    avatarFallback,
    onAvatarChange,
    helperText,
    toggles,
    dangerActions,
    children,
    onSubmit,
    submitLabel = 'Save changes',
    className,
  } = props;

  return (
    <form onSubmit={onSubmit} className={cn('grid gap-6 md:grid-cols-[280px_1fr]', className)}>
      <Card variant="outlined">
        <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
          {onAvatarChange ? (
            <label className="group relative cursor-pointer rounded-full">
              <Avatar className="h-24 w-24">
                {avatarSrc ? <AvatarImage src={avatarSrc} alt="" /> : null}
                <AvatarFallback className="text-2xl">{avatarFallback}</AvatarFallback>
              </Avatar>
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <CameraIcon />
              </span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                aria-label="Change avatar"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) onAvatarChange(file);
                }}
              />
            </label>
          ) : (
            <Avatar className="h-24 w-24">
              {avatarSrc ? <AvatarImage src={avatarSrc} alt="" /> : null}
              <AvatarFallback className="text-2xl">{avatarFallback}</AvatarFallback>
            </Avatar>
          )}
          {helperText ? <Text className="text-xs opacity-70">{helperText}</Text> : null}
          {toggles && toggles.length > 0 ? (
            <div className="flex w-full flex-col gap-3 border-t border-[var(--card-border)] pt-4 text-left">
              {toggles.map((toggle) => (
                <div key={toggle.key} className="flex items-center justify-between gap-3">
                  <Text className="text-sm">{toggle.label}</Text>
                  <Switch checked={toggle.checked} onCheckedChange={toggle.onCheckedChange} aria-label={toggle.label} />
                </div>
              ))}
            </div>
          ) : null}
          {dangerActions && dangerActions.length > 0 ? (
            <div className="flex w-full flex-col gap-1 border-t border-[var(--card-border)] pt-4">
              {dangerActions.map((action) => (
                <Button key={action.label} type="button" variant="ghost" color="danger" size="sm" onClick={action.onClick}>
                  {action.label}
                </Button>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
      <Card variant="outlined">
        <CardContent className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2">{children}</div>
          <div className="flex justify-end">
            <Button type="submit">{submitLabel}</Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

export { EntityFormLayout };
export type { EntityFormLayoutProps, EntityFormLayoutToggle, EntityFormLayoutDangerAction };
