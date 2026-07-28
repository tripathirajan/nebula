import { useControllableState } from '@nebula-lab/hooks';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import {
  addDays,
  addMonths,
  formatMonthLabel,
  getCalendarWeeks,
  getWeekdayLabels,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isWithinRange,
  startOfDay,
} from './calendar-utils';

interface CalendarSharedProps {
  /** The currently displayed month (any `Date` within it — only year/month are read). */
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  /** Additional per-date disabling on top of `minDate`/`maxDate` — e.g. blocking weekends. */
  isDateDisabled?: (date: Date) => boolean;
  /** @default 0 (Sunday) */
  weekStartsOn?: 0 | 1;
  locale?: string;
  className?: string;
}

interface CalendarSingleProps extends CalendarSharedProps {
  mode: 'single';
  selected?: Date;
  defaultSelected?: Date;
  onSelect?: (date: Date | undefined) => void;
}

interface CalendarRangeValue {
  from?: Date;
  to?: Date;
}

interface CalendarRangeProps extends CalendarSharedProps {
  mode: 'range';
  selected?: CalendarRangeValue;
  defaultSelected?: CalendarRangeValue;
  onSelect?: (range: CalendarRangeValue) => void;
}

type CalendarProps = CalendarSingleProps | CalendarRangeProps;

/**
 * A month-grid date picker core — the WAI-ARIA
 * [Date Picker Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)
 * grid pattern: `role="grid"` over day `role="gridcell"`s, each a real
 * `<button>`, with a single roving tabindex (only the focused date is
 * `tabIndex={0}`; every other date is `-1`) and manual arrow-key handling
 * (`ArrowLeft`/`Right` ±1 day, `Up`/`Down` ±1 week, `Home`/`End` jump to the
 * week's start/end, `PageUp`/`PageDown` ±1 month) — not built on
 * `@nebula-lab/primitives`' `RovingFocusGroup`, since that component is only
 * ever 1-dimensional (a single row or column); a calendar grid's vertical
 * *and* horizontal arrow-key movement needs its own logic either way.
 *
 * Deliberately built with plain native `Date` arithmetic (`calendar-utils.ts`)
 * rather than a date library — there's no npm registry access in this
 * sandbox to add one, but more to the point nothing here needs timezone
 * parsing or locale-aware formatting beyond what `Intl.DateTimeFormat`
 * already provides for free (month/year labels, weekday abbreviations).
 * `DatePicker`/`DateRangePicker` are thin `Popover`-wrapped consumers of
 * this component, the same "build the primitive once, reuse it" strategy
 * `Select`→`Listbox` and `Menu`→`DropdownMenu` establish elsewhere in this
 * package.
 *
 * Discriminated on `mode`, same split `Listbox`/`ToggleGroup` use:
 * `"single"` selects one `Date`; `"range"` accumulates a `{from, to}` pair
 * over two clicks (first click starts a new range at `from`; second click
 * completes it at `to`, swapping if picked before `from`).
 *
 * @example
 * ```tsx
 * <Calendar mode="single" selected={date} onSelect={setDate} />
 * ```
 */
function Calendar(props: CalendarProps) {
  const {
    mode,
    month: monthProp,
    defaultMonth,
    onMonthChange,
    minDate,
    maxDate,
    isDateDisabled,
    weekStartsOn = 0,
    locale,
    className,
  } = props;

  const selectedSingle = mode === 'single' ? props.selected : undefined;
  const defaultSelectedSingle = mode === 'single' ? props.defaultSelected : undefined;
  const selectedRange = mode === 'range' ? props.selected : undefined;
  const defaultSelectedRange = mode === 'range' ? props.defaultSelected : undefined;

  const [month, setMonth] = useControllableState<Date>({
    prop: monthProp,
    defaultProp: defaultMonth ?? selectedSingle ?? selectedRange?.from ?? new Date(),
    onChange: onMonthChange,
  });

  const [singleValue, setSingleValue] = useControllableState<Date | undefined>({
    prop: selectedSingle,
    defaultProp: defaultSelectedSingle,
    onChange: mode === 'single' ? props.onSelect : undefined,
  });

  const [rangeValue, setRangeValue] = useControllableState<CalendarRangeValue>({
    prop: selectedRange,
    defaultProp: defaultSelectedRange ?? {},
    onChange: mode === 'range' ? props.onSelect : undefined,
  });

  // Memoized on `month` alone (not recreated fresh every render) so the
  // `weeks`/`weekdayLabels` `useMemo`s below don't recompute on every
  // render just because `new Date()` produces a new object identity each
  // time `month` is uncontrolled/undefined.
  const activeMonth = React.useMemo(() => month ?? new Date(), [month]);
  const [focusedDate, setFocusedDate] = React.useState<Date>(
    () => singleValue ?? rangeValue?.from ?? activeMonth,
  );

  const buttonRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());
  const dateKey = (date: Date) => date.toISOString().slice(0, 10);

  const isDisabled = React.useCallback(
    (date: Date) => {
      if (minDate && isBefore(date, minDate)) return true;
      if (maxDate && isAfter(date, maxDate)) return true;
      return isDateDisabled?.(date) ?? false;
    },
    [minDate, maxDate, isDateDisabled],
  );

  const weeks = React.useMemo(
    () => getCalendarWeeks(activeMonth, weekStartsOn),
    [activeMonth, weekStartsOn],
  );
  const weekdayLabels = React.useMemo(
    () => getWeekdayLabels(weekStartsOn, locale),
    [weekStartsOn, locale],
  );

  const focusDate = (date: Date) => {
    setFocusedDate(date);
    if (!isSameMonth(date, activeMonth)) setMonth(date);
    // Deferred so the target cell exists (possibly after a month-change
    // re-render) before we try to move real DOM focus onto it.
    requestAnimationFrame(() => buttonRefs.current.get(dateKey(date))?.focus());
  };

  const selectDate = (date: Date) => {
    if (isDisabled(date)) return;
    if (mode === 'single') {
      setSingleValue((current) => (current && isSameDay(current, date) ? undefined : date));
      return;
    }
    setRangeValue((current) => {
      const from = current?.from;
      const to = current?.to;
      if (!from || to) return { from: date, to: undefined };
      if (isBefore(date, from)) return { from: date, to: from };
      return { from, to: date };
    });
  };

  const onGridKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const deltas: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };
    if (event.key in deltas) {
      event.preventDefault();
      focusDate(addDays(focusedDate, deltas[event.key]!));
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      focusDate(addDays(focusedDate, -((focusedDate.getDay() - weekStartsOn + 7) % 7)));
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      focusDate(addDays(focusedDate, 6 - ((focusedDate.getDay() - weekStartsOn + 7) % 7)));
      return;
    }
    if (event.key === 'PageUp') {
      event.preventDefault();
      focusDate(addMonths(focusedDate, event.shiftKey ? -12 : -1));
      return;
    }
    if (event.key === 'PageDown') {
      event.preventDefault();
      focusDate(addMonths(focusedDate, event.shiftKey ? 12 : 1));
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectDate(focusedDate);
    }
  };

  return (
    <div className={cn('w-64 text-[var(--calendar-text)]', className)}>
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setMonth(addMonths(activeMonth, -1))}
          className="grid h-7 w-7 place-items-center rounded-[var(--radius-selector)] text-[var(--calendar-text)] hover:bg-[var(--calendar-nav-hover-bg)]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
            <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="text-sm font-medium" aria-live="polite">
          {formatMonthLabel(activeMonth, locale)}
        </div>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setMonth(addMonths(activeMonth, 1))}
          className="grid h-7 w-7 place-items-center rounded-[var(--radius-selector)] text-[var(--calendar-text)] hover:bg-[var(--calendar-nav-hover-bg)]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
            <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 pb-1 text-center text-xs text-[var(--calendar-weekday-text)]">
        {weekdayLabels.map((label, index) => (
          <div key={index}>{label}</div>
        ))}
      </div>
      <div
        role="grid"
        aria-label={formatMonthLabel(activeMonth, locale)}
        // Not a real tab stop (roving tabindex lives on the day buttons
        // below) — `tabIndex={-1}` only exists so this element counts as
        // "focusable" for `onKeyDown`'s a11y-lint purposes; keydown events
        // from a focused day button bubble up to this handler regardless.
        tabIndex={-1}
        onKeyDown={onGridKeyDown}
      >
        {weeks.map((week) => (
          <div role="row" key={dateKey(week[0]!)} className="grid grid-cols-7 gap-1">
            {week.map((date) => {
              const outsideMonth = !isSameMonth(date, activeMonth);
              const disabled = isDisabled(date);
              const selected =
                mode === 'single'
                  ? singleValue !== undefined && isSameDay(date, singleValue)
                  : Boolean(
                      (rangeValue?.from && isSameDay(date, rangeValue.from)) ||
                        (rangeValue?.to && isSameDay(date, rangeValue.to)),
                    );
              const inRange =
                mode === 'range' &&
                rangeValue?.from !== undefined &&
                rangeValue.to !== undefined &&
                isWithinRange(date, rangeValue.from, rangeValue.to);
              const isFocusTarget = isSameDay(date, focusedDate);
              const today = isSameDay(date, startOfDay(new Date()));

              return (
                // `aria-selected` belongs on the `gridcell` per the WAI-ARIA
                // grid pattern, not on the `<button>` inside it — a plain
                // `role="button"` doesn't support `aria-selected` at all
                // (that's `DataTableRow`'s `data-state="selected"` styling
                // hook's job for a *table* row; a grid *cell*'s selectedness
                // is a real ARIA state, not just a CSS hook).
                <div role="gridcell" aria-selected={selected} key={dateKey(date)}>
                  <button
                    ref={(element) => {
                      if (element) buttonRefs.current.set(dateKey(date), element);
                      else buttonRefs.current.delete(dateKey(date));
                    }}
                    type="button"
                    disabled={disabled}
                    aria-current={today ? 'date' : undefined}
                    tabIndex={isFocusTarget ? 0 : -1}
                    data-outside-month={outsideMonth ? '' : undefined}
                    data-selected={selected ? '' : undefined}
                    data-in-range={inRange ? '' : undefined}
                    onClick={() => {
                      setFocusedDate(date);
                      selectDate(date);
                    }}
                    onFocus={() => setFocusedDate(date)}
                    className={cn(
                      'h-8 w-8 rounded-[var(--radius-selector)] text-sm outline-none',
                      'hover:bg-[var(--calendar-day-hover-bg)] focus-visible:ring-2 focus-visible:ring-[var(--calendar-day-selected-bg)]',
                      'disabled:cursor-not-allowed disabled:opacity-40',
                      outsideMonth && 'text-[var(--calendar-outside-month-text)]',
                      inRange && 'bg-[var(--calendar-in-range-bg)]',
                      selected &&
                        'bg-[var(--calendar-day-selected-bg)] text-[var(--calendar-day-selected-text)] hover:bg-[var(--calendar-day-selected-bg)]',
                    )}
                  >
                    {date.getDate()}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export { Calendar };
export type { CalendarProps, CalendarSingleProps, CalendarRangeProps, CalendarRangeValue };
