import { Avatar, AvatarFallback, AvatarImage } from '@nebula/react-ui/avatar';
import { Badge } from '@nebula/react-ui/badge';
import { Button } from '@nebula/react-ui/button';
import { MenuItem } from '@nebula/react-ui/menu';
import { Text } from '@nebula/react-ui/text';
import { useState } from 'react';

import { CardListItem } from '../data-display/card-list-item/card-list-item';
import { DataTableBlock } from '../data-display/data-table/data-table-block';
import { PageSection } from '../layouts/page-section/page-section';

import type { Meta, StoryObj } from '@storybook/react';

// Assembled-page story — see saas-dashboard-home.stories.tsx's header
// comment for the "Assembled Page" pattern (BLOCKS_ARCHITECTURE.md §9).
// No component of its own — PageSection + DataTableBlock wrapping is the
// generic entity-list shell §5's own "Table Block" variant note describes:
// swap the column schema and this becomes the Product/Order/Invoice list
// too, not a bespoke page per entity. `renderCard` demonstrates
// `DataTableBlock`'s responsive table/card switch — resize the Storybook
// viewport below 768px (or use the toolbar's Mobile preset) to see it swap
// to a stacked `CardListItem` list.
const meta = {
  title: 'Blocks/Compositions/User List',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface DemoUser {
  id: string;
  name: string;
  email: string;
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

function UserListPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = allUsers
    .filter((user) => activeTab === 'all' || user.status === activeTab)
    .filter((user) => user.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[var(--color-base-200)] p-6">
      <div className="mx-auto max-w-6xl">
        <PageSection
          title="User list"
          description="Manage your team members and their account permissions here."
          actions={<Button color="primary">New user</Button>}
        >
          <DataTableBlock
            columns={[
              {
                key: 'name',
                header: 'Name',
                sortable: true,
                render: (user) => (
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="" alt="" />
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
            rowActions={() => (
              <>
                <MenuItem onSelect={() => {}}>Edit</MenuItem>
                <MenuItem onSelect={() => {}}>Delete</MenuItem>
              </>
            )}
            rowActionsLabel={(user) => `Actions for ${user.name}`}
            renderCard={(user) => (
              <CardListItem
                avatar={
                  <Avatar>
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                }
                title={user.name}
                description={user.email}
                trailing={
                  <Badge color={statusColor[user.status]}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Badge>
                }
                actions={
                  <>
                    <MenuItem onSelect={() => {}}>Edit</MenuItem>
                    <MenuItem onSelect={() => {}}>Delete</MenuItem>
                  </>
                }
              />
            )}
            page={1}
            totalCount={filtered.length}
          />
        </PageSection>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => <UserListPage />,
};
