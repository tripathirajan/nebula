import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeader,
  DataTableRow,
} from '../data-table';

import type { DataTableProps } from '../data-table';

interface TreeTableNode {
  id: string;
  children?: TreeTableNode[];
}

interface TreeTableColumn<T extends TreeTableNode> {
  key: string;
  header: React.ReactNode;
  /** Render this column's cell content for a row. The first column additionally receives the expand/collapse toggle and indentation — see `TreeTable`'s doc comment. */
  render: (row: T, depth: number) => React.ReactNode;
}

interface TreeTableProps<T extends TreeTableNode>
  extends Omit<DataTableProps, 'children' | 'data'> {
  data: T[];
  columns: TreeTableColumn<T>[];
  /** Row ids expanded by default, before any toggle. @default [] (fully collapsed) */
  defaultExpanded?: string[];
  /** Indent per depth level, in pixels. @default 20 */
  indent?: number;
}

/**
 * A hierarchical table — composes react-ui's own `DataTable` parts
 * (`DataTableHeader`/`DataTableBody`/`DataTableRow`/`DataTableHead`/
 * `DataTableCell`) rather than reinventing table chrome, the same way
 * `AlertDialog`/`Menubar` reuse an existing sibling's building blocks. What
 * `TreeTable` adds on top is purely structural: recursive row rendering
 * over a `{ id, children? }` tree shape, per-row indentation (`depth *
 * indent` px of left padding on the first column), and a expand/collapse
 * toggle button prepended to the first column's content. Expanded-state is
 * local (`Set<string>` of expanded row ids) since, unlike `DataTable`'s
 * sort/selection, there's no obvious controlled-prop shape a consumer would
 * want to own — collapse the tree in-place, not in URL/query state, is the
 * overwhelmingly common case (mirrors `Tree`'s own local-state precedent
 * in `@nebula/styleless`).
 *
 * Rows are flattened depth-first at render time, skipping any subtree whose
 * parent isn't in the expanded set, rather than each row-recursion emitting
 * its own nested `<tr>` — real HTML tables don't support a `<tr>` inside a
 * `<tr>`, so this is the only structurally valid way to render a tree as
 * table rows.
 *
 * @example
 * ```tsx
 * <TreeTable
 *   data={fileTree}
 *   columns={[
 *     { key: 'name', header: 'Name', render: (row) => row.name },
 *     { key: 'size', header: 'Size', render: (row) => row.size },
 *   ]}
 * />
 * ```
 */
function TreeTable<T extends TreeTableNode>(props: TreeTableProps<T>) {
  const { data, columns, defaultExpanded = [], indent = 20, className, ...rest } = props;

  const [expanded, setExpanded] = React.useState<Set<string>>(() => new Set(defaultExpanded));

  const toggle = React.useCallback((id: string) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const flattened = React.useMemo(() => {
    const result: Array<{ row: T; depth: number }> = [];
    const visit = (nodes: T[], depth: number) => {
      for (const node of nodes) {
        result.push({ row: node, depth });
        if (node.children && node.children.length > 0 && expanded.has(node.id)) {
          visit(node.children as T[], depth + 1);
        }
      }
    };
    visit(data, 0);
    return result;
  }, [data, expanded]);

  return (
    <DataTable className={cn(className)} {...rest}>
      <DataTableHeader>
        <DataTableRow>
          {columns.map((column) => (
            <DataTableHead key={column.key}>{column.header}</DataTableHead>
          ))}
        </DataTableRow>
      </DataTableHeader>
      <DataTableBody>
        {flattened.map(({ row, depth }) => {
          const hasChildren = Boolean(row.children && row.children.length > 0);
          const isExpanded = expanded.has(row.id);
          return (
            <DataTableRow key={row.id} id={row.id}>
              {columns.map((column, columnIndex) => (
                <DataTableCell key={column.key}>
                  {columnIndex === 0 ? (
                    <span
                      className="flex items-center gap-1"
                      style={{ paddingLeft: depth * indent }}
                    >
                      {hasChildren ? (
                        <button
                          type="button"
                          aria-expanded={isExpanded}
                          aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
                          onClick={() => toggle(row.id)}
                          className="grid h-4 w-4 shrink-0 place-items-center text-[var(--data-table-text)]"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            className={cn('h-3 w-3 transition-transform', isExpanded && 'rotate-90')}
                          >
                            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      ) : (
                        <span className="h-4 w-4 shrink-0" />
                      )}
                      {column.render(row, depth)}
                    </span>
                  ) : (
                    column.render(row, depth)
                  )}
                </DataTableCell>
              ))}
            </DataTableRow>
          );
        })}
      </DataTableBody>
    </DataTable>
  );
}

export { TreeTable };
export type { TreeTableProps, TreeTableColumn, TreeTableNode };
