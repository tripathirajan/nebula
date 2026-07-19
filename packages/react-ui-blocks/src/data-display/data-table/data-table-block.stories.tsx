
import { Avatar, AvatarFallback, AvatarImage } from '@nebula-lab/react-ui/avatar';
import { Badge } from '@nebula-lab/react-ui/badge';
import { MenuItem } from '@nebula-lab/react-ui/menu';
import { Text } from '@nebula-lab/react-ui/text';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { useState } from 'react';

import { DataTableBlock } from './data-table-block';

import type { Meta, StoryObj } from '@storybook/react';

// `DataTableBlock` is generic (`<TRow>`) — every story below drives it
// entirely through a custom `render`, so `Meta<typeof DataTableBlock>`'s
// generic-inferred `args` type (which would otherwise require every one of
// this component's ~30 props up front) is intentionally not used here.
const meta: Meta = {
  title: 'Blocks/Data Display/Data Table',
  component: DataTableBlock,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

interface DemoUser {
  id: string;
  name: string;
  email: string;
  avatarSrc?: string;
  company: string;
  role: string;
  status: 'active' | 'pending' | 'banned';
}

const allUsers: DemoUser[] = [
  { id: '1', name: 'Angelique Morse', email: 'benny89@yahoo.com', company: 'Wuckert Inc', role: 'Content Creator', status: 'banned' },
  { id: '2', name: 'Ariana Lang', email: 'avery43@hotmail.com', company: 'Feest Group', role: 'IT Administrator', status: 'pending' },
  { id: '3', name: 'Aspen Schmitt', email: 'mireya13@hotmail.com', company: 'Kihn, Marquardt and Crist', role: 'Financial Planner', status: 'banned' },
  { id: '4', name: 'Brycen Jimenez', email: 'tyrel.greenholt@gmail.com', company: 'Rempel, Hand and Herzog', role: 'HR Recruiter', status: 'active' },
  { id: '5', name: 'Chase Day', email: 'joana.simonis84@gmail.com', company: 'Mraz, Donnelly and Collins', role: 'Graphic Designer', status: 'active' },
];

const statusColor: Record<DemoUser['status'], 'success' | 'warning' | 'danger'> = {
  active: 'success',
  pending: 'warning',
  banned: 'danger',
};

function UserListDemo() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const filtered = allUsers
    .filter((user) => activeTab === 'all' || user.status === activeTab)
    .filter((user) => user.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <DataTableBlock
      columns={[
        {
          key: 'name',
          header: 'Name',
          sortable: true,
          render: (user) => (
            <div className="flex items-center gap-3">
              <Avatar>
                {user.avatarSrc ? <AvatarImage src={user.avatarSrc} alt="" /> : null}
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <Text className="text-sm font-medium">{user.name}</Text>
                <Text className="text-xs opacity-70">{user.email}</Text>
              </div>
            </div>
          ),
        },
        { key: 'company', header: 'Company', render: (user) => user.company },
        { key: 'role', header: 'Role', render: (user) => user.role },
        {
          key: 'status',
          header: 'Status',
          render: (user) => (
            <Badge color={statusColor[user.status]}>
              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </Badge>
          ),
        },
      ]}
      rows={filtered}
      getRowId={(user) => user.id}
      tabs={[
        { value: 'all', label: 'All', count: allUsers.length },
        { value: 'active', label: 'Active', count: allUsers.filter((u) => u.status === 'active').length },
        { value: 'pending', label: 'Pending', count: allUsers.filter((u) => u.status === 'pending').length },
        { value: 'banned', label: 'Banned', count: allUsers.filter((u) => u.status === 'banned').length },
      ]}
      activeTab={activeTab}
      onActiveTabChange={setActiveTab}
      searchPlaceholder="Search users…"
      searchValue={search}
      onSearchChange={setSearch}
      selectable
      selected={selected}
      onSelectedChange={setSelected}
      rowActions={() => (
        <>
          <MenuItem onSelect={() => {}}>Edit</MenuItem>
          <MenuItem onSelect={() => {}}>Delete</MenuItem>
        </>
      )}
      rowActionsLabel={(user) => `Actions for ${user.name}`}
      page={page}
      onPageChange={setPage}
      totalCount={filtered.length}
    />
  );
}

export const UserList: Story = {
  name: 'User list (tabs + search + selection + row actions)',
  render: () => <UserListDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Angelique Morse')).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: /Active/ }));
    await waitFor(() => expect(canvas.queryByText('Angelique Morse')).not.toBeInTheDocument());
    await expect(canvas.getByText('Brycen Jimenez')).toBeInTheDocument();
  },
};

export const Empty: Story = {
  render: () => (
    <DataTableBlock
      columns={[{ key: 'name', header: 'Name', render: (user: DemoUser) => user.name }]}
      rows={[]}
      getRowId={(user: DemoUser) => user.id}
      searchValue=""
      onSearchChange={() => {}}
    />
  ),
};

export const NoToolbarNoTabs: Story = {
  name: 'No toolbar, no tabs (minimal usage)',
  render: () => (
    <DataTableBlock
      columns={[
        { key: 'name', header: 'Name', render: (user: DemoUser) => user.name },
        { key: 'email', header: 'Email', render: (user: DemoUser) => user.email },
      ]}
      rows={allUsers}
      getRowId={(user) => user.id}
    />
  ),
};
