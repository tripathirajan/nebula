import * as React from 'react';

const DEFAULT_LABELS = ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'] as const;
const MAX_SCORE = DEFAULT_LABELS.length - 1;

/**
 * Scores a password `0`–`4` from length and character-class variety (not a
 * full entropy/dictionary-attack estimate like zxcvbn — a lightweight
 * heuristic appropriate for a real-time typing indicator). Exported
 * separately so a form's own validation logic (e.g. "require Fair or
 * better") can reuse the same score the meter renders, without re-deriving it.
 */
function getPasswordStrength(password: string): number {
  if (password.length === 0) return 0;
  let points = 0;
  if (password.length >= 8) points++;
  if (password.length >= 12) points++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) points++;
  if (/\d/.test(password)) points++;
  if (/[^A-Za-z0-9]/.test(password)) points++;
  return Math.min(points, MAX_SCORE);
}

interface PasswordStrengthIndicatorClassNames {
  root?: string;
  track?: string;
  segment?: string;
  label?: string;
}

interface PasswordStrengthIndicatorProps {
  password: string;
  /** One label per score, `0`–`4`. @default ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'] */
  labels?: readonly string[];
  /** `role="meter"` requires an accessible name — the visible score label alone doesn't count as one. @default 'Password strength' */
  'aria-label'?: string;
  classNames?: PasswordStrengthIndicatorClassNames;
}

/**
 * `styleless`-tier password strength meter — `role="meter"` (the WAI-ARIA
 * Meter pattern: a value within a known range, not task-completion progress,
 * which is what `role="progressbar"` implies instead). Renders `MAX_SCORE`
 * segments as `data-filled` markers rather than a single filled bar, so
 * `react-ui` can style each segment as a discrete step (the common "4 bars
 * that light up" treatment) without recomputing the fill math itself.
 *
 * @example
 * ```tsx
 * <PasswordStrengthIndicator password={password} />
 * ```
 */
const PasswordStrengthIndicator = React.forwardRef<HTMLDivElement, PasswordStrengthIndicatorProps>(
  (props, forwardedRef) => {
    const { password, labels = DEFAULT_LABELS, 'aria-label': ariaLabel = 'Password strength', classNames } = props;
    const score = getPasswordStrength(password);
    const label = labels[score];

    return (
      <div ref={forwardedRef} className={classNames?.root}>
        <div
          role="meter"
          aria-label={ariaLabel}
          aria-valuemin={0}
          aria-valuemax={MAX_SCORE}
          aria-valuenow={score}
          aria-valuetext={label}
          data-score={score}
          className={classNames?.track}
        >
          {Array.from({ length: MAX_SCORE }, (_, index) => (
            <div key={index} data-filled={index < score ? '' : undefined} className={classNames?.segment} />
          ))}
        </div>
        <span className={classNames?.label}>{label}</span>
      </div>
    );
  },
);

PasswordStrengthIndicator.displayName = 'PasswordStrengthIndicator';

export { PasswordStrengthIndicator, getPasswordStrength };
export type { PasswordStrengthIndicatorProps, PasswordStrengthIndicatorClassNames };
