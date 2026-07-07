import { expect, fn, userEvent, within } from '@storybook/test';
import * as React from 'react';

import { Pagination } from './pagination';
import { PaginationEllipsis } from './pagination-ellipsis';
import { PaginationItem } from './pagination-item';
import { PaginationLink } from './pagination-link';
import { PaginationList } from './pagination-list';
import { PaginationNext } from './pagination-next';
import { PaginationPrevious } from './pagination-previous';
import { usePaginationRange } from './use-pagination-range';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Headless/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { pageCount: 10 },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

function PaginationDemo(props: { pageCount: number; onPageChange?: (page: number) => void }) {
  const [page, setPage] = React.useState(1);
  const items = usePaginationRange({ page, pageCount: props.pageCount });

  return (
    <Pagination
      page={page}
      onPageChange={(next) => {
        setPage(next);
        props.onPageChange?.(next);
      }}
      pageCount={props.pageCount}
    >
      <PaginationList style={{ display: 'flex', gap: 4, listStyle: 'none' }}>
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

export const Default: Story = {
  render: (args) => <PaginationDemo pageCount={args.pageCount} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('navigation', { name: 'pagination' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Page 1' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(canvas.getByRole('button', { name: 'Previous page' })).toBeDisabled();

    await userEvent.click(canvas.getByRole('button', { name: 'Page 2' }));
    await expect(canvas.getByRole('button', { name: 'Page 2' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  },
};

export const OnLastPage: Story = {
  args: { pageCount: 5 },
  render: () => {
    const onPageChange = fn();
    return (
      <Pagination page={5} onPageChange={onPageChange} pageCount={5}>
        <PaginationList style={{ display: 'flex', gap: 4, listStyle: 'none' }}>
          <PaginationItem>
            <PaginationPrevious />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink page={5}>5</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext />
          </PaginationItem>
        </PaginationList>
      </Pagination>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Next page' })).toBeDisabled();
  },
};
