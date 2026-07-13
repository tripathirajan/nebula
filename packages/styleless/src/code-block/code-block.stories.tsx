import { expect, userEvent, within } from '@storybook/test';

import { CodeBlock } from './code-block';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof CodeBlock> = {
  title: 'Styleless/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleCode = `function greet(name) {\n  return 'Hello, ' + name;\n}`;

// Minimal borders/spacing only, via `classNames` — no design-system
// tokens, since this layer has zero visual opinion by design. `react-ui`'s
// own `CodeBlock` story is where the real themed look lives.
const demoClassNames = {
  root: 'border border-gray-300 rounded',
  header: 'flex justify-between px-2 py-1 border-b border-gray-300',
  copyButton: 'text-xs underline',
  pre: 'p-2 overflow-x-auto',
  lineNumberCell: 'pr-3 text-right text-gray-400 select-none',
};

export const Default: Story = {
  args: { code: sampleCode, language: 'js', classNames: demoClassNames },
};

export const WithLineNumbers: Story = {
  args: { code: sampleCode, language: 'js', showLineNumbers: true, classNames: demoClassNames },
};

export const CopyToClipboard: Story = {
  args: { code: sampleCode, language: 'js', classNames: demoClassNames },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const copyButton = canvas.getByRole('button', { name: 'Copy' });
    await userEvent.click(copyButton);
    await expect(await canvas.findByRole('button', { name: 'Copied!' })).toBeInTheDocument();
  },
};
