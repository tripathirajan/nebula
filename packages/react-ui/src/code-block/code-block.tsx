import { cn } from '@nebula/primitives/cn';
import { CodeBlock as StylelessCodeBlock } from '@nebula/styleless/code-block';
import * as React from 'react';

import type { CodeBlockProps as StylelessCodeBlockProps } from '@nebula/styleless/code-block';

type CodeBlockProps = Omit<StylelessCodeBlockProps, 'classNames'> & { className?: string };

/**
 * Wraps `@nebula/styleless`'s `CodeBlock` (which owns the real behavior:
 * `copied` state, the clipboard write, splitting `code` into lines) and
 * supplies every part's Tailwind classes via its `classNames` prop — this
 * file's whole job is visual, matching every other `react-ui` wrapper's
 * division of labor with its `styleless` counterpart.
 *
 * A themed `<pre>`/`<code>` block with a header (language label + a
 * copy-to-clipboard button) and optional line numbers — **deliberately not
 * a syntax highlighter**. Real tokenization (turning `code` into
 * per-token-colored spans) needs a highlighting engine (Shiki, Prism,
 * highlight.js) as a real dependency, and this sandbox has no npm registry
 * access to add one — the same constraint `Markdown` documents for full
 * CommonMark parsing. Rather than hand-rolling a fragile, likely-incorrect
 * tokenizer for a handful of languages, this ships the honest, useful
 * subset: clean monospace layout, a copy button, optional line numbers, and
 * a `language` label a consumer can read (or pass along to their own
 * highlighter if `code` arrives pre-highlighted as JSX `children` instead —
 * not supported by this first pass, but a natural follow-up extension
 * point). If real syntax highlighting matters, wrap this component's
 * *output* pattern with a highlighting library at the app layer, once one
 * can actually be installed.
 *
 * @example
 * ```tsx
 * <CodeBlock language="tsx" code={source} showLineNumbers />
 * ```
 */
const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>((props, forwardedRef) => {
  const { className, ...rest } = props;

  return (
    <StylelessCodeBlock
      {...rest}
      ref={forwardedRef}
      classNames={{
        root: cn(
          'overflow-hidden rounded-[var(--radius-box)] border border-[var(--code-block-border)] bg-[var(--code-block-bg)] text-sm',
          className,
        ),
        header:
          'flex items-center justify-between border-b border-[var(--code-block-border)] bg-[var(--code-block-header-bg)] px-3 py-1.5',
        language: 'text-xs text-[var(--code-block-header-text)]',
        copyButton: 'text-xs text-[var(--code-block-header-text)] hover:underline',
        pre: 'overflow-x-auto p-3',
        code: 'text-[var(--code-block-text)]',
        lineNumberTable: 'w-full border-collapse',
        lineNumberCell: 'select-none pr-4 text-right text-[var(--code-block-line-number-text)]',
        lineContentCell: 'whitespace-pre',
      }}
    />
  );
});

CodeBlock.displayName = 'CodeBlock';

export { CodeBlock };
export type { CodeBlockProps };
