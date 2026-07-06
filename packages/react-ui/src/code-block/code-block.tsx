import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

interface CodeBlockProps {
  code: string;
  /** Displayed as a label only (e.g. `"tsx"`, `"bash"`) — this component does not tokenize/highlight syntax, see the doc comment below for why. */
  language?: string;
  showLineNumbers?: boolean;
  /** Hides the header row (language label + copy button) entirely, for a bare code block with no chrome. */
  hideHeader?: boolean;
  className?: string;
}

/**
 * A themed `<pre>`/`<code>` block with a header (language label + a
 * copy-to-clipboard button) and optional line numbers — **deliberately not a
 * syntax highlighter**. Real tokenization (turning `code` into
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
  const { code, language, showLineNumbers = false, hideHeader = false, className } = props;
  const [copied, setCopied] = React.useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can be denied (permissions, insecure context) —
      // silently no-op rather than throwing, same "best-effort convenience"
      // treatment a copy button gets everywhere else.
    }
  };

  const lines = code.split('\n');

  return (
    <div
      ref={forwardedRef}
      className={cn(
        'overflow-hidden rounded-[var(--radius-box)] border border-[var(--code-block-border)] bg-[var(--code-block-bg)] text-sm',
        className,
      )}
    >
      {hideHeader ? null : (
        <div className="flex items-center justify-between border-b border-[var(--code-block-border)] bg-[var(--code-block-header-bg)] px-3 py-1.5">
          <span className="text-xs text-[var(--code-block-header-text)]">{language ?? 'text'}</span>
          <button
            type="button"
            onClick={onCopy}
            className="text-xs text-[var(--code-block-header-text)] hover:underline"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
      <pre className="overflow-x-auto p-3">
        <code className="text-[var(--code-block-text)]">
          {showLineNumbers ? (
            <table className="w-full border-collapse">
              <tbody>
                {lines.map((line, index) => (
                  <tr key={index}>
                    <td className="select-none pr-4 text-right text-[var(--code-block-line-number-text)]">
                      {index + 1}
                    </td>
                    <td className="whitespace-pre">{line}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            code
          )}
        </code>
      </pre>
    </div>
  );
});

CodeBlock.displayName = 'CodeBlock';

export { CodeBlock };
export type { CodeBlockProps };
