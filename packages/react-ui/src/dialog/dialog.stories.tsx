import { expect, userEvent, waitFor, within } from '@storybook/test';
import * as React from 'react';

import { Button } from '../button/button';
import { Field } from '../field/field';
import { FieldControl } from '../field/field-control';
import { FieldLabel } from '../field/field-label';
import { Input } from '../input/input';
import { SearchField } from '../search-field/search-field';

import { Dialog } from './dialog';
import { DialogClose } from './dialog-close';
import { DialogContent } from './dialog-content';
import { DialogDescription } from './dialog-description';
import { DialogOverlay } from './dialog-overlay';
import { DialogPortal } from './dialog-portal';
import { DialogTitle } from './dialog-title';
import { DialogTrigger } from './dialog-trigger';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Dialog> = {
  title: 'React UI/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

function DemoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button color="danger">Delete item</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>Delete item?</DialogTitle>
          <DialogDescription>This can&apos;t be undone.</DialogDescription>
          <div className="mt-4 flex justify-end gap-2">
            <DialogClose asChild>
              <Button color="secondary" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <Button color="danger" size="sm">
              Delete
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

function BlurredBackdropDialog() {
  return (
    <Dialog>
      {/* A grid of colorful blocks purely so the blur has something behind
          it to visibly soften — an empty canvas makes "solid" and "blur"
          look identical at a glance. */}
      <div className="grid w-[360px] grid-cols-3 gap-2">
        {['#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#2563eb', '#7c3aed'].map((color) => (
          <div key={color} style={{ backgroundColor: color }} className="h-16 rounded-lg" />
        ))}
      </div>
      <DialogTrigger asChild>
        <Button className="mt-4">Open search</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay backdrop="blur" />
        <DialogContent>
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>A lighter-weight dialog reads better with a frosted backdrop than a flat dim.</DialogDescription>
          <div className="mt-4 flex justify-end">
            <DialogClose asChild>
              <Button color="secondary" size="sm">
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

function FormInModalDialog() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add contact</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>Add contact</DialogTitle>
          <DialogDescription>
            `Dialog` is the generic modal surface — a form is just content inside it, with no
            dedicated &quot;form modal&quot; component needed.
          </DialogDescription>
          <form
            className="mt-4 flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <Field>
              <FieldLabel>Name</FieldLabel>
              <FieldControl asChild>
                <Input
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </FieldControl>
            </Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <FieldControl asChild>
                <Input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </FieldControl>
            </Field>
            <div className="mt-2 flex justify-end gap-2">
              <DialogClose asChild>
                <Button color="secondary" size="sm" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button size="sm" type="submit">
                  Save
                </Button>
              </DialogClose>
            </div>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export const FormInModal: Story = {
  name: 'Form in a modal (proves Dialog works for forms — no separate component needed)',
  render: () => <FormInModalDialog />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Add contact' }));

    const body = within(document.body);
    const dialog = await body.findByRole('dialog');
    await expect(dialog).toBeInTheDocument();
    await waitFor(() => expect(getComputedStyle(dialog).opacity).toBe('1'));

    await userEvent.type(body.getByLabelText('Name'), 'Ada Lovelace');
    await userEvent.type(body.getByLabelText('Email'), 'ada@example.com');
    await userEvent.click(body.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
  },
};

const suggestions = ['Dashboard', 'Invoices', 'Team members', 'Billing settings', 'API keys'];

function SearchPaletteDialog() {
  return (
    <Dialog>
      {/* A grid behind the trigger so the blurred backdrop has real content to soften. */}
      <div className="grid w-[360px] grid-cols-3 gap-2">
        {['#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#2563eb', '#7c3aed'].map((color) => (
          <div key={color} style={{ backgroundColor: color }} className="h-16 rounded-lg" />
        ))}
      </div>
      <DialogTrigger asChild>
        <Button className="mt-4">Open search (⌘K)</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay backdrop="blur" />
        <DialogContent
          hideCloseButton
          className="top-24 max-w-lg translate-y-0 p-0"
          aria-label="Search"
        >
          <SearchField placeholder="Search pages, people, settings…" className="m-3 w-auto" />
          <ul className="border-t border-[var(--dialog-content-border)] py-2">
            {suggestions.map((item) => (
              <li key={item}>
                <DialogClose asChild>
                  <button
                    type="button"
                    className="w-full px-4 py-2 text-left text-sm text-[var(--dialog-text)] hover:bg-[var(--dialog-content-border)]/40"
                  >
                    {item}
                  </button>
                </DialogClose>
              </li>
            ))}
          </ul>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export const SearchPalette: Story = {
  name: 'Search palette (Dialog + blurred backdrop, top-aligned like a command palette)',
  render: () => <SearchPaletteDialog />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open search (⌘K)' }));

    const body = within(document.body);
    const dialog = await body.findByRole('dialog', { name: 'Search' });
    await expect(dialog).toBeInTheDocument();
    await waitFor(() => expect(getComputedStyle(dialog).opacity).toBe('1'));

    await userEvent.click(body.getByRole('button', { name: 'Dashboard' }));
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
  },
};

export const BlurredBackdrop: Story = {
  name: 'Blurred backdrop (DialogOverlay backdrop="blur")',
  render: () => <BlurredBackdropDialog />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open search' }));

    const body = within(document.body);
    await expect(await body.findByRole('dialog')).toBeInTheDocument();
  },
};

export const Default: Story = {
  render: () => <DemoDialog />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Delete item' }));

    const body = within(document.body);
    const dialog = await body.findByRole('dialog');
    await expect(dialog).toBeInTheDocument();
    await expect(body.getByText("This can't be undone.")).toBeInTheDocument();

    // `DialogContent` fades/scales in over `--motion-duration-base` (200ms)
    // — without waiting for it to settle, an a11y scan racing this play
    // function can catch a still-near-transparent frame and misreport a
    // color-contrast violation that no real user ever perceives (the
    // animation is well under a user's reaction time). Same fix applied to
    // every story in this repo that opens an animated overlay and then
    // immediately asserts/interacts further.
    await waitFor(() => expect(getComputedStyle(dialog).opacity).toBe('1'));

    await userEvent.click(body.getByRole('button', { name: 'Cancel' }));

    // Same `Presence`-driven exit-animation delay documented above for the
    // open side — the closed node stays mounted through
    // `--motion-duration-base` (200ms), so this has to poll rather than
    // assert once.
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
  },
};
