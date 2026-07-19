import { useControllableState } from '@nebula-lab/hooks';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import { Calendar } from '../calendar/calendar';
import { Popover } from '../popover/popover';
import { PopoverContent } from '../popover/popover-content';
import { PopoverPortal } from '../popover/popover-portal';
import { PopoverTrigger } from '../popover/popover-trigger';

interface DatePickerProps {
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date | undefined) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  disabled?: boolean;
  placeholder?: React.ReactNode;
  /** @default (date) => date.toLocaleDateString() */
  formatDate?: (date: Date) => string;
  weekStartsOn?: 0 | 1;
  locale?: string;
  className?: string;
}

/**
 * A single self-contained component — not a compound (`DatePickerTrigger`/
 * `DatePickerContent`/etc.) — because unlike `MultiSelect`'s items or
 * `AlertDialog`'s title/actions, there's no arbitrary consumer content to
 * compose here: the trigger is always "a button showing the formatted date
 * or a placeholder" and the popup is always a `Calendar`. Internally mints
 * its own ambient `Popover` (the same "mint one ambient instance" reuse
 * `ColorPicker`/`MultiSelect` make) and a `Calendar` in `mode="single"`;
 * selecting a date both updates `value` and closes the popover (unlike
 * `Calendar` alone, which never closes anything itself — that's a
 * `DatePicker`-level UX decision, not `Calendar`'s to make).
 *
 * @example
 * ```tsx
 * <DatePicker value={date} onValueChange={setDate} placeholder="Pick a date" />
 * ```
 */
function DatePicker(props: DatePickerProps) {
  const {
    value: valueProp,
    defaultValue,
    onValueChange,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    minDate,
    maxDate,
    isDateDisabled,
    disabled = false,
    placeholder = 'Pick a date',
    formatDate = (date: Date) => date.toLocaleDateString(),
    weekStartsOn,
    locale,
    className,
  } = props;

  const [value, setValue] = useControllableState<Date | undefined>({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  const [open, setOpen] = useControllableState<boolean>({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'flex w-full items-center gap-2 rounded-[var(--radius-field)] border border-[var(--date-picker-trigger-border)] bg-[var(--date-picker-trigger-bg)] px-3 py-2 text-left text-sm text-[var(--date-picker-trigger-text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--date-picker-trigger-text)] disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 shrink-0 opacity-60"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          <span className="truncate">{value ? formatDate(value) : placeholder}</span>
        </button>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent align="start" className="w-auto p-3">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              setValue(date);
              setOpen(false);
            }}
            minDate={minDate}
            maxDate={maxDate}
            isDateDisabled={isDateDisabled}
            weekStartsOn={weekStartsOn}
            locale={locale}
          />
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
}

export { DatePicker };
export type { DatePickerProps };
