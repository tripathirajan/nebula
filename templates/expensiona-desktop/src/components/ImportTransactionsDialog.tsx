import { Badge } from '@nebula-lab/react-ui/badge';
import { Button } from '@nebula-lab/react-ui/button';
import { Dialog, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogTitle } from '@nebula-lab/react-ui/dialog';
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadFileItem,
  FileUploadFileList,
  FileUploadInput,
  FileUploadRemoveTrigger,
} from '@nebula-lab/react-ui/file-upload';
import { Text } from '@nebula-lab/react-ui/text';
import * as React from 'react';

import { useStore } from '../data/store';

interface ImportTransactionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * A fixed sample of what "parsing the uploaded file" would produce — this
 * template has no CSV/OFX parser wired in (that's a real backend/parsing
 * concern, out of scope for a UI template), so the preview always shows
 * these same three rows once a file is selected, clearly labeled as a demo
 * rather than silently pretending to read the file's real content.
 */
const previewRows = [
  { description: 'Coffee shop', amount: 6.5, date: '2026-07-28' },
  { description: 'Paycheck', amount: 2100, date: '2026-07-15' },
  { description: 'Electric bill', amount: 92.15, date: '2026-07-10' },
];

export function ImportTransactionsDialog(props: ImportTransactionsDialogProps) {
  const { open, onOpenChange } = props;
  const { accounts, addTransaction } = useStore();
  const [files, setFiles] = React.useState<File[]>([]);

  React.useEffect(() => {
    if (!open) setFiles([]);
  }, [open]);

  function handleImport() {
    const account = accounts[0];
    if (!account) return;
    for (const row of previewRows) {
      addTransaction({
        description: row.description,
        amount: row.amount,
        type: row.amount >= 1000 ? 'income' : 'expense',
        date: row.date,
        accountId: account.id,
      });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="w-full max-w-lg">
          <DialogTitle>Import transactions</DialogTitle>
          <DialogDescription>Upload a CSV export from your bank to bulk-add transactions.</DialogDescription>
          <div className="mt-4 flex flex-col gap-4">
            <FileUpload accept=".csv" files={files} onFilesChange={setFiles}>
              <FileUploadDropzone>
                <FileUploadInput />
                Drop a CSV file here, or click to browse
              </FileUploadDropzone>
              <FileUploadFileList>
                {files.map((file, index) => (
                  <FileUploadFileItem key={file.name} file={file}>
                    {file.name}
                    <FileUploadRemoveTrigger index={index} aria-label={`Remove ${file.name}`} />
                  </FileUploadFileItem>
                ))}
              </FileUploadFileList>
            </FileUpload>

            {files.length > 0 ? (
              <div className="flex flex-col gap-2 rounded-[var(--radius-selector)] border border-[var(--color-base-300)] p-3">
                <div className="flex items-center justify-between">
                  <Text className="text-sm font-medium">Preview</Text>
                  <Badge color="info">Demo data — not the file&apos;s real contents</Badge>
                </div>
                {previewRows.map((row) => (
                  <div key={row.description} className="flex items-center justify-between text-sm">
                    <Text>{row.description}</Text>
                    <Text className="opacity-70">{row.date}</Text>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button color="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button color="primary" disabled={files.length === 0} onClick={handleImport}>
              Import {previewRows.length} transactions
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
