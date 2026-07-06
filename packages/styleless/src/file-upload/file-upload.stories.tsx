import { expect, within } from '@storybook/test';
import { useState } from 'react';


import { FileUpload } from './file-upload';
import { FileUploadDropzone } from './file-upload-dropzone';
import { FileUploadFileItem } from './file-upload-file-item';
import { FileUploadFileList } from './file-upload-file-list';
import { FileUploadInput } from './file-upload-input';
import { FileUploadRemoveTrigger } from './file-upload-remove-trigger';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Styleless/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

function DemoFileUpload() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <FileUpload multiple files={files} onFilesChange={setFiles}>
      <FileUploadDropzone>
        <FileUploadInput />
        Drop files here, or click to browse
      </FileUploadDropzone>
      <FileUploadFileList>
        {files.map((file, index) => (
          <FileUploadFileItem key={`${file.name}-${index}`} file={file}>
            {file.name}
            <FileUploadRemoveTrigger index={index} aria-label={`Remove ${file.name}`}>
              ×
            </FileUploadRemoveTrigger>
          </FileUploadFileItem>
        ))}
      </FileUploadFileList>
    </FileUpload>
  );
}

export const Default: Story = {
  render: () => <DemoFileUpload />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Drop files here, or click to browse')).toBeInTheDocument();
    // The native file input is present (visually hidden) inside the label.
    expect(canvasElement.querySelector('input[type="file"]')).not.toBeNull();
  },
};
