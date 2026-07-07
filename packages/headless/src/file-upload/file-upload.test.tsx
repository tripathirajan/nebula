import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { FileUpload } from './file-upload';
import { FileUploadDropzone } from './file-upload-dropzone';
import { FileUploadFileItem } from './file-upload-file-item';
import { FileUploadFileList } from './file-upload-file-list';
import { FileUploadInput } from './file-upload-input';
import { FileUploadRemoveTrigger } from './file-upload-remove-trigger';

function makeFile(name: string) {
  return new File(['content'], name, { type: 'text/plain' });
}

function DemoFileUpload(props: Partial<React.ComponentProps<typeof FileUpload>>) {
  const [files, setFiles] = useState<File[]>(props.defaultFiles ?? []);
  return (
    <FileUpload multiple files={files} onFilesChange={setFiles} {...props}>
      <FileUploadDropzone>
        <FileUploadInput />
        Drop files here
      </FileUploadDropzone>
      <FileUploadFileList>
        {files.map((file, index) => (
          <FileUploadFileItem key={`${file.name}-${index}`} file={file}>
            {file.name}
            <FileUploadRemoveTrigger index={index} aria-label={`Remove ${file.name}`} />
          </FileUploadFileItem>
        ))}
      </FileUploadFileList>
    </FileUpload>
  );
}

describe('FileUpload', () => {
  it('the dropzone is a label wrapping the native file input', () => {
    const { container } = render(<DemoFileUpload />);
    const label = container.querySelector('label');
    const input = container.querySelector('input[type="file"]');
    expect(label).not.toBeNull();
    expect(input).not.toBeNull();
    expect(label?.contains(input)).toBe(true);
  });

  it('selecting files via the native input adds them to the list', () => {
    render(<DemoFileUpload />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = makeFile('report.pdf');

    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByText('report.pdf')).toBeInTheDocument();
  });

  it('dropping files onto the dropzone adds them', () => {
    const { container } = render(<DemoFileUpload />);
    const label = container.querySelector('label') as HTMLElement;
    const file = makeFile('photo.png');

    fireEvent.drop(label, { dataTransfer: { files: [file] } });
    expect(screen.getByText('photo.png')).toBeInTheDocument();
  });

  it('dragging over sets data-dragging-over, leaving clears it', () => {
    const { container } = render(<DemoFileUpload />);
    const label = container.querySelector('label') as HTMLElement;

    fireEvent.dragOver(label);
    expect(label).toHaveAttribute('data-dragging-over', '');

    fireEvent.dragLeave(label);
    expect(label).not.toHaveAttribute('data-dragging-over');
  });

  it('removing a file via FileUploadRemoveTrigger works', () => {
    render(<DemoFileUpload />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile('a.txt'), makeFile('b.txt')] } });

    expect(screen.getByText('a.txt')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Remove a.txt' }));
    expect(screen.queryByText('a.txt')).not.toBeInTheDocument();
    expect(screen.getByText('b.txt')).toBeInTheDocument();
  });

  it('replaces rather than appends when multiple is false', () => {
    render(<DemoFileUpload multiple={false} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [makeFile('first.txt')] } });
    fireEvent.change(input, { target: { files: [makeFile('second.txt')] } });

    expect(screen.queryByText('first.txt')).not.toBeInTheDocument();
    expect(screen.getByText('second.txt')).toBeInTheDocument();
  });

  it('calls onFilesChange', () => {
    const onFilesChange = vi.fn();
    render(
      <FileUpload multiple onFilesChange={onFilesChange}>
        <FileUploadDropzone>
          <FileUploadInput />
        </FileUploadDropzone>
      </FileUpload>,
    );
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile('x.txt')] } });
    expect(onFilesChange).toHaveBeenCalled();
  });

  it('has no axe violations', async () => {
    const { container } = render(<DemoFileUpload />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
