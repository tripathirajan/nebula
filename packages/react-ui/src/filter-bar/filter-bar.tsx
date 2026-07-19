import { cn } from '@nebula-lab/primitives/cn';
import { Button } from '@nebula-lab/react-ui/button';
import { Chip } from '@nebula-lab/react-ui/chip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from '@nebula-lab/react-ui/dropdown-menu';
import * as React from 'react';

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-3.5 w-3.5"
    {...props}
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

interface FilterBarFilter {
  id: string;
  label: React.ReactNode;
}

interface FilterBarAddOption {
  id: string;
  label: React.ReactNode;
}

interface FilterBarProps {
  /** No sensible default — pass `[]` for an empty (but still usable, if `addOptions` is given) bar. */
  filters: FilterBarFilter[];
  onRemoveFilter?: (id: string) => void;
  onClearAll?: () => void;
  /** Options offered in the "Add filter" dropdown — omit entirely to hide that control (e.g. a read-only filter summary). */
  addOptions?: FilterBarAddOption[];
  onAddFilter?: (id: string) => void;
  className?: string;
}

/**
 * A row of active filter chips (`Chip`'s own built-in `onDismiss`, no
 * custom dismiss-button logic needed here) plus an optional "Add filter"
 * dropdown and a "Clear all" action. Generic/domain-neutral by design —
 * the same bar filters a product grid, a data table, or an activity feed
 * equally well; this component has no opinion on what a "filter" means in
 * a consumer's app, only how to display and manage the active set.
 * Originally shipped in `react-ui-blocks`' `forms` category; moved here
 * since its own doc comment already argued it has no domain knowledge of
 * its own — this package, not `react-ui-blocks`, is where domain-neutral
 * molecules belong. (`DataTableBlock` composes its own status-tab
 * filtering and search inline rather than reusing this — a different,
 * more specific shape than this generic chip-row pattern, not an
 * oversight.)
 *
 * @example
 * ```tsx
 * <FilterBar
 *   filters={[{ id: 'status', label: 'Status: Active' }, { id: 'team', label: 'Team: Design' }]}
 *   onRemoveFilter={(id) => removeFilter(id)}
 *   onClearAll={clearAllFilters}
 *   addOptions={[{ id: 'owner', label: 'Owner' }, { id: 'priority', label: 'Priority' }]}
 *   onAddFilter={(id) => openFilterEditor(id)}
 * />
 * ```
 */
function FilterBar(props: FilterBarProps) {
  const { filters, onRemoveFilter, onClearAll, addOptions, onAddFilter, className } = props;

  if (filters.length === 0 && (!addOptions || addOptions.length === 0)) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {filters.map((filter) => (
        <Chip
          key={filter.id}
          color="neutral"
          onDismiss={onRemoveFilter ? () => onRemoveFilter(filter.id) : undefined}
          dismissLabel={typeof filter.label === 'string' ? `Remove ${filter.label} filter` : 'Remove filter'}
        >
          {filter.label}
        </Chip>
      ))}

      {addOptions && addOptions.length > 0 ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" color="neutral" size="sm" className="gap-1.5">
              <PlusIcon />
              Add filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent align="start">
              {addOptions.map((option) => (
                <DropdownMenuItem key={option.id} onSelect={() => onAddFilter?.(option.id)}>
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      ) : null}

      {filters.length > 0 && onClearAll ? (
        <Button variant="text" color="neutral" size="sm" onClick={onClearAll}>
          Clear all
        </Button>
      ) : null}
    </div>
  );
}

export { FilterBar };
export type { FilterBarProps, FilterBarFilter, FilterBarAddOption };
