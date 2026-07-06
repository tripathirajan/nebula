import { useControllableState } from '@nebula/hooks';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import { Calendar } from '../calendar/calendar';
import { Popover } from '../popover/popover';
import { PopoverContent } from '../popover/popover-content';
import { PopoverPortal } from '../popover/popover-portal';
import { PopoverTrigger } from '../popover/popover-trigger';

import type { CalendarRangeValue } from '../calendar/calendar';

interface DateRangePickerProps {
  value?: CalendarRangeValue;
  defaultValue?: CalendarRangeValue;
  onValueChange?: (range: CalendarRangeValue) => void;
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
 * `DatePicker`'s two-endpoint sibling — same self-contained (not compound)
 * shape and same reasoning for why: the trigger and popup content are both
 * fixed, nothing here is consumer-composed. The only real difference from
 * `DatePicker` is that the popover stays open after the first click (only
 * closing once *both* `from` and `to` are picked — `Calendar`'s own
 * `mode="range"` selection logic already tracks which endpoint comes next,
 * this only decides *when* to close based on whether `to` just became
 * defined) and the trigger displays `"{from} – {to}"` instead of a single
 * formatted date.
 *
 * @example
 * ```tsx
 * <DateRangePicker value={range} onValueChange={setRange} placeholder="Pick a date range" />
 * ```
 */
function DateRangePicker(props: DateRangePickerProps) {
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
    placeholder = 'Pick a date range',
    formatDate = (date: Date) => date.toLocaleDateString(),
    weekStartsOn,
    locale,
    className,
  } = props;

  const [value, setValue] = useControllableState<CalendarRangeValue>({
    prop: valueProp,
    defaultProp: defaultValue ?? {},
    onChange: onValueChange,
  });

  const [open, setOpen] = useControllableState<boolean>({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  const summary = React.useMemo(() => {
    if (!value?.from) return placeholder;
    if (!value.to) return formatDate(value.from);
    return `${formatDate(value.from)} – ${formatDate(value.to)}`;
  }, [value, placeholder, formatDate]);

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
          <span className="truncate">{summary}</span>
        </button>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent align="start" className="w-auto p-3">
          <Calendar
            mode="range"
            selected={value}
            onSelect={(range) => {
              setValue(range);
              if (range.from && range.to) setOpen(false);
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

export { DateRangePicker };
export type { DateRangePickerProps };
