import { Avatar, AvatarFallback } from '@nebula/react-ui/avatar';
import { IconButton } from '@nebula/react-ui/icon-button';
import { Switch } from '@nebula/react-ui/switch';
import { useState } from 'react';

import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
} from './list';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'React UI/List',
  component: List,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12 12 3l9 9M5 10v10h14V10" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}

export const Simple: Story = {
  render: () => (
    <List style={{ width: 280 }}>
      <ListItem>First item</ListItem>
      <ListItem>Second item</ListItem>
      <ListItem>Third item</ListItem>
    </List>
  ),
};

export const NavigationList: Story = {
  name: 'Navigation list (clickable + selected)',
  render: () => {
    function Demo() {
      const [active, setActive] = useState('home');
      return (
        <List style={{ width: 280 }}>
          <ListItem disablePadding>
            <ListItemButton selected={active === 'home'} onClick={() => setActive('home')}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton selected={active === 'settings'} onClick={() => setActive('settings')}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
        </List>
      );
    }
    return <Demo />;
  },
};

export const ContactsWithSecondaryAction: Story = {
  name: 'Contacts (avatar + secondary action)',
  render: () => (
    <List style={{ width: 320 }}>
      <ListSubheader>Contacts</ListSubheader>
      {[
        { name: 'Jane Cooper', email: 'jane@example.com' },
        { name: 'Wade Warren', email: 'wade@example.com' },
      ].map((contact) => (
        <ListItem key={contact.email}>
          <ListItemAvatar>
            <Avatar className="h-9 w-9">
              <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={contact.name} secondary={contact.email} />
          <ListItemSecondaryAction>
            <Switch aria-label={`Notify ${contact.name}`} />
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  ),
};

export const Dense: Story = {
  render: () => (
    <List dense style={{ width: 280 }}>
      <ListItem>Compact row one</ListItem>
      <ListItem>Compact row two</ListItem>
      <ListItem>Compact row three</ListItem>
    </List>
  ),
};

export const WithIconButtonAction: Story = {
  name: 'With trailing icon-button action',
  render: () => (
    <List style={{ width: 320 }}>
      {['Invoice #1024', 'Invoice #1025'].map((label) => (
        <ListItem key={label}>
          <ListItemText primary={label} secondary="Due in 5 days" />
          <ListItemSecondaryAction>
            <IconButton aria-label={`Remove ${label}`} size="sm" variant="ghost">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12" />
              </svg>
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  ),
};
