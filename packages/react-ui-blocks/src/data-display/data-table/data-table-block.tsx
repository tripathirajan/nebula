import { useMediaQuery } from '@nebula/hooks';
import { cn } from '@nebula/primitives/cn';
import { Badge } from '@nebula/react-ui/badge';
import { Card } from '@nebula/react-ui/card';
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeader,
  DataTableRow,
  DataTableSelectAllCell,
  DataTableSelectionCell,
} from '@nebula/react-ui/data-table';
import { EmptyState, EmptyStateDescription, EmptyStateTitle } from '@nebula/react-ui/empty-state';
import { IconButton } from '@nebula/react-ui/icon-button';
import { Menu, MenuContent, MenuPortal, MenuTrigger } from '@nebula/react-ui/menu';
import { Pagination, PaginationNext, PaginationPrevious } from '@nebula/react-ui/pagination';
import { SearchField } from '@nebula/react-ui/search-field';
import { SegmentedControl, SegmentedControlItem } from '@nebula/react-ui/segmented-control';
import * as React from 'react';

import type { SortDirection } from '@nebula/react-ui/data-table';

interface DataTableBlockColumn<TRow> {
  key: string;
  header: React.ReactNode;
  /** Enables sorting on this column — clicking its header toggles `sortKey`/`sortDirection` through the same controlled/uncontrolled convention as `page`/`selected` below. */
  sortable?: boolean;
  render: (row: TRow) => React.ReactNode;
  className?: string;
}

interface DataTableBlockTab {
  value: string;
  label: React.ReactNode;
  count?: number;
}

interface DataTableBlockProps<TRow> {
  columns: DataTableBlockColumn<TRow>[];
  rows: TRow[];
  getRowId: (row: TRow) => string;

  /** Status filter row (e.g. All/Active/Pending/Banned) — omit entirely for a table with no status concept. Filtering `rows` to the active tab is the consumer's job, same "consumer owns the data" convention `onSearchChange`/`onSortChange` below follow. */
  tabs?: DataTableBlockTab[];
  activeTab?: string;
  defaultActiveTab?: string;
  onActiveTabChange?: (value: string) => void;

  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  /** Extra domain-specific filter controls (a role `Select`, a date-range picker, ...) rendered after the search field — this block has no opinion on what a given entity is filterable by. */
  filters?: React.ReactNode;
  /** Trailing toolbar controls (Product's "Columns/Filters/Export/Settings" buttons, or a plain overflow menu) — rendered at the toolbar's far end. */
  toolbarActions?: React.ReactNode;

  selectable?: boolean;
  selected?: string[];
  defaultSelected?: string[];
  onSelectedChange?: (ids: string[]) => void;

  sortKey?: string;
  defaultSortKey?: string;
  sortDirection?: SortDirection;
  defaultSortDirection?: SortDirection;
  onSortChange?: (key: string, direction: SortDirection) => void;

  /** Returns this row's "⋮" menu content (`MenuItem`s) — omit to skip the actions column entirely. */
  rowActions?: (row: TRow) => React.ReactNode;
  /** Accessible label for each row's actions trigger — `row` is passed so it can include the row's own identity, e.g. `(row) => \`Actions for ${row.name}\`\`. @default () => 'Row actions' */
  rowActionsLabel?: (row: TRow) => string;

  /**
   * Renders one row as a card (typically a `CardListItem`) instead of a
   * `<tr>` — when given, the block switches from the table to a stacked
   * list of these below `cardBreakpoint`, since a `<table>`'s fixed columns
   * don't reflow onto a narrow viewport the way a stacked list of cards
   * does. Omit to always render the table regardless of viewport (the
   * existing, backward-compatible behavior).
   */
  renderCard?: (row: TRow) => React.ReactNode;
  /** The media query at and above which the table renders instead of `renderCard`'s card list — matches Tailwind's `md` breakpoint by default ("table on medium screens and up, a stacked card list on small screens"). Ignored when `renderCard` is omitted. @default '(min-width: 768px)' */
  cardBreakpoint?: string;

  /** Omit `page`/`totalCount` entirely for a table with no pagination footer. */
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  /** Total row count across every page — required to compute the page count and the "1–10 of 30" range text. */
  totalCount?: number;

  emptyState?: React.ReactNode;
  className?: string;
}

const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 25];

/**
 * The `BLOCKS_ARCHITECTURE.md` §3.5 "Generic Data Table Block" — status
 * tabs + filter toolbar + sortable/selectable table + pagination footer,
 * composed entirely from `@nebula/react-ui`'s own `DataTable` compound
 * (sort/selection state already lives there) rather than re-implementing
 * any of that. One block, reused with a different `columns` schema per
 * entity (User/Product/Order/Invoice/Job/Tour/File-manager lists all share
 * this exact shell in the `minimals.cc` audit this was built from — see
 * `MINIMALS_COMPONENT_INVENTORY.md` §2.8) rather than a bespoke table per
 * page, matching §5's own "Table Block" variant note: same underlying
 * primitive, different column schemas and row actions per vertical.
 *
 * Every stateful concern (`activeTab`, `search`, `selected`, `sort`,
 * `page`/`pageSize`) is controlled-or-uncontrolled via the same
 * `value`/`defaultValue`/`onChange` convention every other stateful
 * component in this repo uses — this block never filters/sorts/paginates
 * `rows` itself (same "consumer owns the data" rule `DataTable` itself
 * documents), it only owns the chrome and reports intent upward.
 *
 * @example
 * ```tsx
 * <DataTableBlock
 *   columns={[
 *     { key: 'name', header: 'Name', sortable: true, render: (u) => u.name },
 *     { key: 'status', header: 'Status', render: (u) => <Badge color={u.status === 'active' ? 'success' : 'neutral'}>{u.status}</Badge> },
 *   ]}
 *   rows={users}
 *   getRowId={(u) => u.id}
 *   tabs={[{ value: 'all', label: 'All', count: 20 }, { value: 'active', label: 'Active', count: 12 }]}
 *   activeTab={activeTab}
 *   onActiveTabChange={setActiveTab}
 *   searchValue={search}
 *   onSearchChange={setSearch}
 *   selectable
 *   rowActions={(u) => <MenuItem onSelect={() => editUser(u.id)}>Edit</MenuItem>}
 *   page={page}
 *   onPageChange={setPage}
 *   totalCount={filteredUsers.length}
 * />
 * ```
 */
function DataTableBlock<TRow>(props: DataTableBlockProps<TRow>) {
  const {
    columns,
    rows,
    getRowId,
    tabs,
    activeTab,
    defaultActiveTab,
    onActiveTabChange,
    searchPlaceholder = 'Search…',
    searchValue,
    onSearchChange,
    filters,
    toolbarActions,
    selectable = false,
    selected,
    defaultSelected,
    onSelectedChange,
    sortKey,
    defaultSortKey,
    sortDirection,
    defaultSortDirection,
    onSortChange,
    rowActions,
    rowActionsLabel = () => 'Row actions',
    renderCard,
    cardBreakpoint = '(min-width: 768px)',
    page,
    defaultPage,
    onPageChange,
    pageSize,
    defaultPageSize = DEFAULT_PAGE_SIZE_OPTIONS[0] ?? 5,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    onPageSizeChange,
    totalCount,
    emptyState,
    className,
  } = props;

  // Always called (rules of hooks) even when `renderCard` is omitted, so
  // this component's hook order never changes across renders — its result
  // is simply unused in that case, since `isTableView` short-circuits to
  // `true` first.
  const isAboveCardBreakpoint = useMediaQuery(cardBreakpoint);
  const isTableView = renderCard === undefined || isAboveCardBreakpoint;

  const [uncontrolledPageSize, setUncontrolledPageSize] = React.useState(defaultPageSize);
  const resolvedPageSize = pageSize ?? uncontrolledPageSize;
  const resolvedPage = page ?? defaultPage ?? 1;
  const paginated = totalCount !== undefined;
  const pageCount = paginated ? Math.max(1, Math.ceil(totalCount / resolvedPageSize)) : 1;
  const rangeStart = paginated && totalCount > 0 ? (resolvedPage - 1) * resolvedPageSize + 1 : 0;
  const rangeEnd = paginated ? Math.min(resolvedPage * resolvedPageSize, totalCount) : 0;

  const handlePageSizeChange = (nextSize: number) => {
    setUncontrolledPageSize(nextSize);
    onPageSizeChange?.(nextSize);
  };

  return (
    <Card variant="outlined" className={cn('overflow-hidden', className)}>
      {tabs && tabs.length > 0 ? (
        <div className="border-b border-[var(--card-border)] p-3">
          <SegmentedControl
            aria-label="Filter by status"
            value={activeTab}
            defaultValue={defaultActiveTab}
            onValueChange={(value) => {
              // A status filter always has exactly one active tab —
              // `ToggleGroup`'s single-select mode allows deselecting to
              // `undefined` by clicking the active item again, which this
              // block doesn't have a meaningful state for, so it's ignored.
              if (value) onActiveTabChange?.(value);
            }}
          >
            {tabs.map((tab) => (
              <SegmentedControlItem key={tab.value} value={tab.value}>
                {tab.label}
                {tab.count !== undefined ? (
                  <Badge color="neutral" className="ml-1.5">
                    {tab.count}
                  </Badge>
                ) : null}
              </SegmentedControlItem>
            ))}
          </SegmentedControl>
        </div>
      ) : null}

      {onSearchChange || filters || toolbarActions ? (
        <div className="flex flex-wrap items-center gap-3 border-b border-[var(--card-border)] p-3">
          {onSearchChange ? (
            <SearchField
              aria-label="Search"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              className="max-w-xs flex-1"
            />
          ) : null}
          {filters}
          {toolbarActions ? <div className="ml-auto flex items-center gap-2">{toolbarActions}</div> : null}
        </div>
      ) : null}

      {rows.length === 0 ? (
        emptyState ?? (
          <EmptyState>
            <EmptyStateTitle>No results found</EmptyStateTitle>
            <EmptyStateDescription>Try adjusting your search or filters.</EmptyStateDescription>
          </EmptyState>
        )
      ) : !isTableView && renderCard ? (
        <div role="list" className="flex flex-col gap-2 p-3">
          {rows.map((row) => (
            <div role="listitem" key={getRowId(row)}>
              {renderCard(row)}
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <DataTable
            sortKey={sortKey}
            defaultSortKey={defaultSortKey}
            sortDirection={sortDirection}
            defaultSortDirection={defaultSortDirection}
            onSortChange={onSortChange}
            selected={selected}
            defaultSelected={defaultSelected}
            onSelectedChange={onSelectedChange}
          >
            <DataTableHeader>
              <DataTableRow>
                {selectable ? <DataTableSelectAllCell ids={rows.map(getRowId)} /> : null}
                {columns.map((column) => (
                  <DataTableHead
                    key={column.key}
                    sortKey={column.sortable ? column.key : undefined}
                    className={column.className}
                  >
                    {column.header}
                  </DataTableHead>
                ))}
                {rowActions ? (
                  <DataTableHead>
                    <span className="sr-only">Actions</span>
                  </DataTableHead>
                ) : null}
              </DataTableRow>
            </DataTableHeader>
            <DataTableBody>
              {rows.map((row) => {
                const rowId = getRowId(row);
                return (
                  <DataTableRow key={rowId} id={rowId}>
                    {selectable ? <DataTableSelectionCell id={rowId} /> : null}
                    {columns.map((column) => (
                      <DataTableCell key={column.key} className={column.className}>
                        {column.render(row)}
                      </DataTableCell>
                    ))}
                    {rowActions ? (
                      <DataTableCell className="w-10">
                        <Menu>
                          <MenuTrigger asChild>
                            <IconButton aria-label={rowActionsLabel(row)} size="sm">
                              <svg
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-4 w-4"
                              >
                                <circle cx="12" cy="5" r="1.5" />
                                <circle cx="12" cy="12" r="1.5" />
                                <circle cx="12" cy="19" r="1.5" />
                              </svg>
                            </IconButton>
                          </MenuTrigger>
                          <MenuPortal>
                            <MenuContent align="end">{rowActions(row)}</MenuContent>
                          </MenuPortal>
                        </Menu>
                      </DataTableCell>
                    ) : null}
                  </DataTableRow>
                );
              })}
            </DataTableBody>
          </DataTable>
        </div>
      )}

      {paginated ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--card-border)] p-3 text-sm text-[var(--card-text)]/70">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              aria-label="Rows per page"
              value={resolvedPageSize}
              onChange={(event) => handlePageSizeChange(Number(event.target.value))}
              className="rounded-[var(--radius-selector)] border border-[var(--card-border)] bg-transparent py-1 pl-2 pr-6 text-sm text-[var(--card-text)]"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <span>
            {rangeStart}–{rangeEnd} of {totalCount}
          </span>
          <Pagination page={resolvedPage} defaultPage={defaultPage} onPageChange={onPageChange} pageCount={pageCount}>
            <div className="flex items-center gap-1">
              <PaginationPrevious />
              <PaginationNext />
            </div>
          </Pagination>
        </div>
      ) : null}
    </Card>
  );
}

export { DataTableBlock };
export type { DataTableBlockProps, DataTableBlockColumn, DataTableBlockTab };
