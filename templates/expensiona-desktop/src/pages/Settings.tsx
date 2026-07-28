import { Button } from '@nebula-lab/react-ui/button';
import { Card } from '@nebula-lab/react-ui/card';
import { Field, FieldLabel } from '@nebula-lab/react-ui/field';
import { Heading } from '@nebula-lab/react-ui/heading';
import { Select, SelectContent, SelectItem, SelectPortal, SelectTrigger, SelectValue } from '@nebula-lab/react-ui/select';
import { Separator } from '@nebula-lab/react-ui/separator';
import { Switch } from '@nebula-lab/react-ui/switch';
import { Text } from '@nebula-lab/react-ui/text';
import * as React from 'react';
import { Link } from 'react-router-dom';

// Illustrative only — this template has no i18n/formatting-library wiring,
// so these selections don't actually change how `formatCurrency`/`formatDate`
// (in `data/store.tsx`) render numbers/dates elsewhere in the app.
export function Settings() {
  const [currency, setCurrency] = React.useState('usd');
  const [dateFormat, setDateFormat] = React.useState('mdy');
  const [pinLock, setPinLock] = React.useState(false);
  const [notice, setNotice] = React.useState<string | undefined>(undefined);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Heading as="h2" level={3}>
          Settings
        </Heading>
        <Text className="mt-1 opacity-70">Currency, security, categories, and backup.</Text>
      </div>

      <Card className="flex flex-col gap-4 p-4">
        <Text className="font-medium">General</Text>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>Currency</FieldLabel>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectPortal>
                <SelectContent>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                </SelectContent>
              </SelectPortal>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Date format</FieldLabel>
            <Select value={dateFormat} onValueChange={setDateFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectPortal>
                <SelectContent>
                  <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                  <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                  <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </SelectPortal>
            </Select>
          </Field>
        </div>
      </Card>

      <Card className="flex flex-col gap-4 p-4">
        <Text className="font-medium">Categories</Text>
        <div className="flex items-center justify-between">
          <Text className="text-sm opacity-70">Manage categories and sub-categories used across your transactions.</Text>
          <Button asChild color="secondary">
            <Link to="/categories">Manage</Link>
          </Button>
        </div>
      </Card>

      <Card className="flex flex-col gap-4 p-4">
        <Text className="font-medium">Security</Text>
        <div className="flex items-center justify-between">
          <div>
            <Text className="text-sm font-medium">PIN lock</Text>
            <Text className="text-xs opacity-70">Require a PIN when opening the app.</Text>
          </div>
          <Switch checked={pinLock} onCheckedChange={setPinLock} aria-label="PIN lock" />
        </div>
      </Card>

      <Card className="flex flex-col gap-4 p-4">
        <Text className="font-medium">Backup &amp; restore</Text>
        <div className="flex flex-wrap gap-2">
          <Button color="secondary" onClick={() => setNotice('Backup created just now.')}>
            Back up now
          </Button>
          <Button color="secondary" onClick={() => setNotice('Restored from your latest backup.')}>
            Restore from backup
          </Button>
        </div>
        {notice ? (
          <>
            <Separator />
            <Text className="text-sm text-[var(--color-success-text)]">{notice}</Text>
          </>
        ) : null}
      </Card>
    </div>
  );
}
