import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import { Blockquote } from '../blockquote/blockquote';
import { CodeBlock } from '../code-block/code-block';
import { Heading } from '../heading/heading';
import { List, ListItem } from '../list/list';

import { parseBlocks, parseInline } from './markdown-utils';

interface MarkdownProps {
  /** Raw markdown source — see this component's doc comment for exactly what subset is supported. */
  children: string;
  className?: string;
}

/**
 * Renders a **practical subset** of Markdown as themed `react-ui`
 * components — not a full CommonMark implementation (see
 * `markdown-utils.ts`'s header comment for why: no npm registry access in
 * this sandbox to add a real parser, and hand-rolling one that's actually
 * spec-correct isn't a responsible substitute). Supported: headings (`#`
 * through `######`), paragraphs, fenced code blocks (rendered via
 * `CodeBlock`, language taken from the fence info string), blockquotes
 * (`>`), unordered/ordered lists (rendered via `List`/`ListItem`), and
 * inline `**bold**`/`*italic*`/`` `code` ``/`[link](url)` formatting (not
 * nested — `**bold *and* italic**` renders as literal asterisks, a known,
 * documented gap). Explicitly **not** supported: tables, images, nested
 * blockquotes/lists, link reference definitions, raw HTML blocks, footnotes,
 * or strikethrough. For anything beyond this subset, render markdown with a
 * real parser (e.g. `react-markdown`) once one can actually be installed,
 * rather than stretching this component past what it can honestly do.
 *
 * Maps blocks onto this package's own existing components rather than raw
 * HTML tags, so a rendered document already picks up this theme's
 * `Heading`/`Blockquote`/`List`/`CodeBlock` styling for free.
 *
 * @example
 * ```tsx
 * <Markdown>{`# Title\n\nSome **bold** text with a [link](https://example.com).`}</Markdown>
 * ```
 */
function Markdown(props: MarkdownProps) {
  const { children, className } = props;
  const blocks = React.useMemo(() => parseBlocks(children), [children]);

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {blocks.map((block, index) => {
        const key = index;
        switch (block.type) {
          case 'heading':
            return (
              <Heading key={key} as={`h${block.level}` as React.ElementType} level={block.level}>
                {parseInline(block.text)}
              </Heading>
            );
          case 'code':
            return <CodeBlock key={key} language={block.language} code={block.code} />;
          case 'blockquote':
            return <Blockquote key={key}>{parseInline(block.text)}</Blockquote>;
          case 'list':
            return (
              <List key={key} ordered={block.ordered}>
                {block.items.map((item, itemIndex) => (
                  <ListItem key={itemIndex}>{parseInline(item)}</ListItem>
                ))}
              </List>
            );
          case 'paragraph':
            return <p key={key}>{parseInline(block.text)}</p>;
          default:
            return null;
        }
      })}
    </div>
  );
}

export { Markdown };
export type { MarkdownProps };
