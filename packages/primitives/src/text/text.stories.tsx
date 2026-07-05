
import { Code } from '../code/code';
import { Heading } from '../heading/heading';
import { Link } from '../link/link';
import { Paragraph } from '../paragraph/paragraph';
import { Pre } from '../pre/pre';
import { Stack } from '../stack/stack';

import { Text } from './text';

import type { Meta, StoryObj } from '@storybook/react';

/** `Text` alongside `Heading`, `Paragraph`, `Code`, `Pre`, and `Link` — the text-primitive family, shown together. */
const meta = {
  title: 'Primitives/Text',
  component: Text,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Family: Story = {
  render: () => (
    <Stack gap={12} className="max-w-lg">
      <Heading as="h1" level={1}>
        Page title (h1, level 1)
      </Heading>
      <Heading as="h2" level={4}>
        Dense card title (h2 tag, level 4 size)
      </Heading>
      <Paragraph>
        Body copy with comfortable line-height by default — run{' '}
        <Code>pnpm --filter @nebula/primitives dev</Code> to watch this package rebuild, or read
        the <Link href="#nebula">full docs</Link> / an{' '}
        <Link href="https://example.com" external>
          external reference
        </Link>
        .
      </Paragraph>
      <Pre>
        <Code>{`import { Text } from '@nebula/primitives';\n\nexport const Label = () => <Text>Hi</Text>;`}</Code>
      </Pre>
      <Text truncate className="max-w-[200px]">
        A long string that will truncate with an ellipsis once it overflows its container width
      </Text>
    </Stack>
  ),
};
