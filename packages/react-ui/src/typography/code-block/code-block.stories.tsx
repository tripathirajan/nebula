import { CodeBlock } from './code-block';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'React UI/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleCode = `function greet(name) {\n  return 'Hello, ' + name + '!';\n}`;

export const Default: Story = {
  args: { code: sampleCode, language: 'js' },
};

export const WithLineNumbers: Story = {
  args: { code: sampleCode, language: 'js', showLineNumbers: true },
};

export const NoHeader: Story = {
  name: 'No header (bare block)',
  args: { code: sampleCode, hideHeader: true },
};
