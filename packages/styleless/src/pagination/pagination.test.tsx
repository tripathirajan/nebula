import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Pagination } from './pagination';
import { PaginationEllipsis } from './pagination-ellipsis';
import { PaginationItem } from './pagination-item';
import { PaginationLink } from './pagination-link';
import { PaginationList } from './pagination-list';
import { PaginationNext } from './pagination-next';
import { PaginationPrevious } from './pagination-previous';
import { usePaginationRange } from './use-pagination-range';

function DemoPagination(props: {
  page: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
}) {
  const items = usePaginationRange({ page: props.page, pageCount: props.pageCount });

  return (
    <Pagination page={props.page} onPageChange={props.onPageChange} pageCount={props.pageCount}>
      <PaginationList>
        <PaginationItem>
          <PaginationPrevious />
        </PaginationItem>
        {items.map((item, i) =>
          item === 'ellipsis' ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink page={item}>{item}</PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext />
        </PaginationItem>
      </PaginationList>
    </Pagination>
  );
}

describe('Pagination', () => {
  it('renders a nav landmark labelled "pagination" by default', () => {
    render(<DemoPagination page={1} pageCount={10} />);
    expect(screen.getByRole('navigation', { name: 'pagination' })).toBeInTheDocument();
  });

  it('allows overriding the aria-label', () => {
    render(
      <Pagination aria-label="Search results pages" pageCount={3}>
        <PaginationList>
          <PaginationItem>
            <PaginationLink page={1}>1</PaginationLink>
          </PaginationItem>
        </PaginationList>
      </Pagination>,
    );
    expect(screen.getByRole('navigation', { name: 'Search results pages' })).toBeInTheDocument();
  });

  it('marks the active page with aria-current="page"', () => {
    render(<DemoPagination page={3} pageCount={10} />);
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Page 1' })).not.toHaveAttribute('aria-current');
  });

  it('disables PaginationPrevious on the first page', () => {
    render(<DemoPagination page={1} pageCount={10} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).not.toBeDisabled();
  });

  it('disables PaginationNext on the last page', () => {
    render(<DemoPagination page={10} pageCount={10} />);
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Previous page' })).not.toBeDisabled();
  });

  it('calls onPageChange when a page link is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<DemoPagination page={1} pageCount={10} onPageChange={onPageChange} />);

    await user.click(screen.getByRole('button', { name: 'Page 2' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange with page - 1 / page + 1 from Previous/Next', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<DemoPagination page={5} pageCount={10} onPageChange={onPageChange} />);

    await user.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(onPageChange).toHaveBeenLastCalledWith(4);

    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenLastCalledWith(6);
  });

  it('renders collapsed ellipsis markers for large page counts', () => {
    render(<DemoPagination page={5} pageCount={20} />);
    expect(screen.getAllByText('More pages', { exact: false }).length).toBeGreaterThan(0);
  });

  it('respects the disabled prop, ignoring clicks entirely', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination page={2} onPageChange={onPageChange} pageCount={5} disabled>
        <PaginationList>
          <PaginationItem>
            <PaginationLink page={3}>3</PaginationLink>
          </PaginationItem>
        </PaginationList>
      </Pagination>,
    );
    await user.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('has no axe violations', async () => {
    const { container } = render(<DemoPagination page={3} pageCount={10} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
