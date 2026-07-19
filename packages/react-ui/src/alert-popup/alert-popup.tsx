import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../alert-dialog';

import type { AlertDialogOverlayProps } from '../alert-dialog';

/** Same severity vocabulary `Alert`'s `color` prop uses, plus `question` — a neutral confirm-prompt icon `Alert` has no equivalent for, since `Alert` only ever reports a status, never asks something. */
type AlertPopupIcon = 'success' | 'warning' | 'danger' | 'info' | 'question';

const ICON_KEYWORDS = new Set<string>(['success', 'warning', 'danger', 'info', 'question']);

// A user-defined type guard rather than `typeof icon === 'string'`: `icon`'s
// declared type unions `AlertPopupIcon` with arbitrary `ReactNode` (for a
// custom element), and *any* string is also valid `ReactNode` — so a plain
// `typeof` check can't tell "one of the 5 keywords" apart from "a custom
// node that happens to be a string" at the type level. Checking real
// membership in the known keyword set sidesteps that ambiguity entirely.
function isIconKeyword(icon: unknown): icon is AlertPopupIcon {
  return typeof icon === 'string' && ICON_KEYWORDS.has(icon);
}

interface AlertPopupAction {
  label: React.ReactNode;
  onClick?: () => void;
}

function iconColorVar(icon: AlertPopupIcon): string {
  if (icon === 'question') return 'var(--color-primary)';
  return `var(--color-${icon === 'danger' ? 'error' : icon})`;
}

// `--button-{role}-bg`/`-text` — not just `-bg` — since `primaryAction`
// is a solid filled button: overriding only its background while leaving
// `AlertDialogAction`'s default danger-tuned text color in place would be a
// real contrast bug for every icon except `danger` (each role's `-text`
// counterpart is individually contrast-checked against its own `-bg`, not
// interchangeable). `question` maps to `primary`, matching `iconColorVar`.
function actionButtonClassName(icon: AlertPopupIcon): string {
  const role = icon === 'question' ? 'primary' : icon === 'danger' ? 'danger' : icon;
  return `bg-[var(--button-${role}-bg)] text-[var(--button-${role}-text)]`;
}

const ICONS: Record<AlertPopupIcon, React.ReactNode> = {
  success: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 5 5L20 7" />
    </svg>
  ),
  danger: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 9v4M12 17h.01" />
      <path d="m10.29 3.86-8.18 14.14A2 2 0 0 0 3.82 21h16.36a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    </svg>
  ),
  info: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
  question: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 9a2.5 2.5 0 1 1 3.4 2.32c-.86.34-1.4 1.15-1.4 2.18v.5M12 17h.01" />
    </svg>
  ),
};

interface AlertPopupProps {
  /** Element that opens the popup, e.g. a `Button` — rendered `asChild` via `AlertDialogTrigger`. Omit when you drive `open` externally instead (e.g. firing this after a form submit succeeds). */
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * One of the 5 built-in severity icons, a custom node, or `null` for no
   * icon at all — see `isIconKeyword` above for how a custom node that
   * happens to be a plain string is still told apart from the 5 keywords.
   * @default 'info'
   */
  icon?: AlertPopupIcon | React.ReactNode | null;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Always closes the popup on click, same as `AlertDialogAction`'s own contract — filled, colored to match `icon`'s severity. */
  primaryAction: AlertPopupAction;
  /** Plain bordered button beside `primaryAction` — omit for a single-button ("OK") popup. */
  secondaryAction?: AlertPopupAction;
  /** Passed straight through to the overlay — see `AlertDialogOverlay`'s own `backdrop` doc. @default 'solid' */
  backdrop?: AlertDialogOverlayProps['backdrop'];
  /** Passed straight through to the overlay — see `AlertDialogOverlay`'s own `blurIntensity` doc; ignored when `backdrop="solid"`. @default 'regular' */
  blurIntensity?: AlertDialogOverlayProps['blurIntensity'];
  className?: string;
}

/**
 * A ready-to-use confirmation/status popup — a ["SweetAlert"](https://sweetalert2.github.io/)-style
 * centered icon, title, message, and action button(s) — versus `AlertDialog`,
 * which is the same underlying primitive but requires assembling the title/
 * description/action layout yourself. Reach for `AlertDialog` directly when
 * you need a layout this component doesn't offer (e.g. a form inside the
 * prompt); reach for `AlertPopup` for the common "tell the user something
 * happened, get one explicit acknowledgement" case.
 *
 * Built entirely from this package's own `AlertDialog` parts — no new
 * dismissal/focus-trap/escape behavior, just a fixed icon+title+description+
 * actions layout on top of it. `icon`'s color and `primaryAction`'s fill
 * both read the same severity token (`var(--color-{icon})`), so the two stay
 * visually in sync without a separate `color` prop to keep in agreement.
 *
 * @example
 * ```tsx
 * <AlertPopup
 *   trigger={<Button color="danger">Delete account</Button>}
 *   icon="danger"
 *   title="Delete your account?"
 *   description="This can't be undone — all your data will be permanently removed."
 *   primaryAction={{ label: 'Delete', onClick: deleteAccount }}
 *   secondaryAction={{ label: 'Cancel' }}
 * />
 * ```
 */
function AlertPopup(props: AlertPopupProps) {
  const {
    trigger,
    open,
    defaultOpen,
    onOpenChange,
    icon = 'info',
    title,
    description,
    primaryAction,
    secondaryAction,
    backdrop,
    blurIntensity,
    className,
  } = props;

  const resolvedIcon = isIconKeyword(icon) ? ICONS[icon] : icon;
  const iconColor = isIconKeyword(icon) ? iconColorVar(icon) : undefined;

  return (
    <AlertDialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger ? <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger> : null}
      <AlertDialogPortal>
        <AlertDialogOverlay backdrop={backdrop} blurIntensity={blurIntensity} />
        <AlertDialogContent className={cn('text-center', className)}>
          {resolvedIcon ? (
            <div
              aria-hidden="true"
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full [&_svg]:h-8 [&_svg]:w-8"
              style={{
                backgroundColor: iconColor ? `color-mix(in oklch, ${iconColor} 15%, transparent)` : undefined,
                color: iconColor,
              }}
            >
              {resolvedIcon}
            </div>
          ) : null}
          <AlertDialogTitle className="text-lg font-semibold">{title}</AlertDialogTitle>
          {description ? (
            <AlertDialogDescription className="mt-2 text-sm opacity-80">{description}</AlertDialogDescription>
          ) : null}
          <div className="mt-6 flex justify-center gap-2">
            {secondaryAction ? (
              <AlertDialogCancel onClick={secondaryAction.onClick}>{secondaryAction.label}</AlertDialogCancel>
            ) : null}
            <AlertDialogAction
              onClick={primaryAction.onClick}
              className={isIconKeyword(icon) ? actionButtonClassName(icon) : undefined}
            >
              {primaryAction.label}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
}

export { AlertPopup };
export type { AlertPopupProps, AlertPopupIcon, AlertPopupAction };
