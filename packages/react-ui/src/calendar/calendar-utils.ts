/**
 * Pure date-math helpers backing `Calendar` — plain `Date` arithmetic, no
 * date library dependency (there's no npm registry access in this sandbox
 * to add one, but more importantly nothing here needs timezone-aware
 * parsing or formatting beyond what `Intl.DateTimeFormat` already gives for
 * free — see `Calendar`'s own doc comment). Every function is pure and
 * side-effect free so `Calendar` itself stays easy to reason about.
 */

/** Midnight-normalized copy of `date` — comparisons below assume no time-of-day component ever matters. */
function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, amount: number): Date {
  const result = startOfDay(date);
  result.setDate(result.getDate() + amount);
  return result;
}

function addMonths(date: Date, amount: number): Date {
  const result = startOfDay(date);
  result.setMonth(result.getMonth() + amount, 1);
  return result;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function isBefore(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}

function isAfter(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() > startOfDay(b).getTime();
}

function isWithinRange(date: Date, from: Date, to: Date): boolean {
  const time = startOfDay(date).getTime();
  return time >= startOfDay(from).getTime() && time <= startOfDay(to).getTime();
}

/**
 * The full set of calendar weeks needed to display `month` — starts on the
 * `weekStartsOn`-aligned day on or before the 1st, ends on the aligned day
 * on or after the last day of the month, so every row is a complete
 * 7-day week (some leading/trailing days belong to the adjacent month —
 * `Calendar` renders those dimmed via `data-outside-month`, still real,
 * clickable dates rather than blank cells, matching how every mainstream
 * native calendar UI fills the grid).
 */
function getCalendarWeeks(month: Date, weekStartsOn: 0 | 1): Date[][] {
  const firstOfMonth = startOfMonth(month);
  const firstWeekday = firstOfMonth.getDay();
  const leadingDays = (firstWeekday - weekStartsOn + 7) % 7;
  const gridStart = addDays(firstOfMonth, -leadingDays);

  const lastOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const lastWeekday = lastOfMonth.getDay();
  const trailingDays = (weekStartsOn - lastWeekday - 1 + 7) % 7;
  const gridEnd = addDays(lastOfMonth, trailingDays);

  const weeks: Date[][] = [];
  let cursor = gridStart;
  while (cursor.getTime() <= gridEnd.getTime()) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i += 1) {
      week.push(cursor);
      cursor = addDays(cursor, 1);
    }
    weeks.push(week);
  }
  return weeks;
}

/** Short weekday labels, reordered to start on `weekStartsOn` — from `Intl.DateTimeFormat` rather than a hardcoded English array, so this reads correctly under the consumer's own locale. */
function getWeekdayLabels(weekStartsOn: 0 | 1, locale?: string): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'narrow' });
  // 2023-01-01 was a Sunday — a stable, arbitrary reference week.
  const reference = new Date(2023, 0, 1 + weekStartsOn);
  return Array.from({ length: 7 }, (_, i) => formatter.format(addDays(reference, i)));
}

function formatMonthLabel(month: Date, locale?: string): string {
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(month);
}

export {
  startOfDay,
  addDays,
  addMonths,
  startOfMonth,
  isSameDay,
  isSameMonth,
  isBefore,
  isAfter,
  isWithinRange,
  getCalendarWeeks,
  getWeekdayLabels,
  formatMonthLabel,
};
