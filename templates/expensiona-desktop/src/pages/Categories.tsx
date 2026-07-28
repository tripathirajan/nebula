import { Badge } from '@nebula-lab/react-ui/badge';
import { Button } from '@nebula-lab/react-ui/button';
import { Card } from '@nebula-lab/react-ui/card';
import { Heading } from '@nebula-lab/react-ui/heading';
import { IconButton } from '@nebula-lab/react-ui/icon-button';
import { Menu, MenuContent, MenuItem, MenuPortal, MenuTrigger } from '@nebula-lab/react-ui/menu';
import { Text } from '@nebula-lab/react-ui/text';
import * as React from 'react';

import { CategoryFormDialog } from '../components/CategoryFormDialog';
import { useStore } from '../data/store';

import type { Category } from '../data/store';

function MoreIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}

export function Categories() {
  const { categories, deleteCategory } = useStore();
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Category | undefined>(undefined);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Heading as="h2" level={3}>
            Categories
          </Heading>
          <Text className="mt-1 opacity-70">Organize transactions into categories and sub-categories.</Text>
        </div>
        <Button
          color="primary"
          onClick={() => {
            setEditing(undefined);
            setFormOpen(true);
          }}
        >
          Add category
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {categories.map((category) => (
          <Card key={category.id} className="flex items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: `var(--color-${category.color})` }}
              />
              <Text className="font-medium">{category.name}</Text>
              <div className="flex flex-wrap gap-1">
                {category.subcategories.map((subcategory) => (
                  <Badge key={subcategory.id} color="neutral" variant="outline">
                    {subcategory.name}
                  </Badge>
                ))}
              </div>
            </div>
            <Menu>
              <MenuTrigger asChild>
                <IconButton aria-label={`Actions for ${category.name}`} variant="text" color="neutral" size="sm">
                  <MoreIcon />
                </IconButton>
              </MenuTrigger>
              <MenuPortal>
                <MenuContent align="end">
                  <MenuItem
                    onSelect={() => {
                      setEditing(category);
                      setFormOpen(true);
                    }}
                  >
                    Edit
                  </MenuItem>
                  <MenuItem onSelect={() => deleteCategory(category.id)}>Delete</MenuItem>
                </MenuContent>
              </MenuPortal>
            </Menu>
          </Card>
        ))}
      </div>

      <CategoryFormDialog open={formOpen} onOpenChange={setFormOpen} category={editing} />
    </div>
  );
}
