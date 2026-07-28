import { Button } from '@nebula-lab/react-ui/button';
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTitle } from '@nebula-lab/react-ui/dialog';
import { Field, FieldControl, FieldLabel } from '@nebula-lab/react-ui/field';
import { IconButton } from '@nebula-lab/react-ui/icon-button';
import { Input } from '@nebula-lab/react-ui/input';
import { Select, SelectContent, SelectItem, SelectPortal, SelectTrigger, SelectValue } from '@nebula-lab/react-ui/select';
import * as React from 'react';

import { useStore } from '../data/store';

import type { Category, CategoryColor, Subcategory } from '../data/store';

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category;
}

const colorOptions: { value: CategoryColor; label: string }[] = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'accent', label: 'Accent' },
  { value: 'info', label: 'Info' },
  { value: 'success', label: 'Success' },
  { value: 'warning', label: 'Warning' },
  { value: 'danger', label: 'Danger' },
  { value: 'neutral', label: 'Neutral' },
];

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-4 w-4">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

let tempIdCounter = 0;
function tempId(): string {
  tempIdCounter += 1;
  return `tmp-${tempIdCounter}`;
}

export function CategoryFormDialog(props: CategoryFormDialogProps) {
  const { open, onOpenChange, category } = props;
  const { addCategory, updateCategory } = useStore();

  const [name, setName] = React.useState('');
  const [color, setColor] = React.useState<CategoryColor>('primary');
  const [subcategories, setSubcategories] = React.useState<Subcategory[]>([]);

  React.useEffect(() => {
    if (!open) return;
    if (category) {
      setName(category.name);
      setColor(category.color);
      setSubcategories(category.subcategories);
    } else {
      setName('');
      setColor('primary');
      setSubcategories([]);
    }
  }, [open, category]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = { name, color, subcategories: subcategories.filter((s) => s.name.trim().length > 0) };
    if (category) {
      updateCategory(category.id, input);
    } else {
      addCategory(input);
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="w-full max-w-md">
          <DialogTitle>{category ? 'Edit category' : 'Add category'}</DialogTitle>
          <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
            <Field>
              <FieldLabel>Name</FieldLabel>
              <FieldControl asChild>
                <Input required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Groceries" />
              </FieldControl>
            </Field>

            <Field>
              <FieldLabel>Color</FieldLabel>
              <Select value={color} onValueChange={(value) => setColor(value as CategoryColor)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectPortal>
                  <SelectContent>
                    {colorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Subcategories</FieldLabel>
              <div className="flex flex-col gap-2">
                {subcategories.map((subcategory, index) => (
                  <div key={subcategory.id} className="flex items-center gap-2">
                    <Input
                      value={subcategory.name}
                      onChange={(event) => {
                        const next = [...subcategories];
                        next[index] = { ...subcategory, name: event.target.value };
                        setSubcategories(next);
                      }}
                      placeholder="Subcategory name"
                    />
                    <IconButton
                      type="button"
                      aria-label={`Remove ${subcategory.name || 'subcategory'}`}
                      variant="text"
                      color="neutral"
                      size="sm"
                      onClick={() => setSubcategories(subcategories.filter((_, i) => i !== index))}
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  color="neutral"
                  size="sm"
                  onClick={() => setSubcategories([...subcategories, { id: tempId(), name: '' }])}
                >
                  + Add subcategory
                </Button>
              </div>
            </Field>

            <div className="mt-2 flex justify-end gap-2">
              <Button type="button" color="secondary" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" color="primary">
                {category ? 'Save changes' : 'Add category'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
