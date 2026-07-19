import * as React from 'react';

interface CodeBlockClassNames {
  root?: string;
  header?: string;
  language?: string;
  copyButton?: string;
  pre?: string;
  code?: string;
  lineNumberTable?: string;
  lineNumberCell?: string;
  lineContentCell?: string;
}

interface CodeBlockProps {
  code: string;
  /** Displayed as a label only (e.g. `"tsx"`, `"bash"`) — this component does not tokenize/highlight syntax, see `react-ui`'s `CodeBlock` doc comment for why. */
  language?: string;
  showLineNumbers?: boolean;
  /** Hides the header row (language label + copy button) entirely, for a bare code block with no chrome. */
  hideHeader?: boolean;
  copyLabel?: string;
  copiedLabel?: string;
  /**
   * Per-part class injection — this component has more visually-distinct
   * parts (container, header bar, language label, copy button, `pre`/
   * `code`, line-number cells) than a single `className` prop can address,
   * unlike `PasswordInput`'s two-part shape (`className` + `toggleClassName`).
   * A bundled object keeps the prop surface from growing to seven flat
   * `xClassName` props for a component this structural.
   */
  classNames?: CodeBlockClassNames;
}

/**
 * `styleless`-tier `CodeBlock` — the real behavior extracted from
 * `@nebula-lab/react-ui`'s `CodeBlock`: `copied` state (reset after 1.5s via
 * `window.setTimeout`), the `navigator.clipboard.writeText` copy action
 * (silently no-ops on denied clipboard access — permissions/insecure
 * context — same "best-effort convenience" treatment a copy button gets
 * everywhere), and splitting `code` into lines for the optional line-number
 * rendering. No Tailwind classes anywhere by default — every part accepts
 * its own class via `classNames`, which `react-ui`'s version supplies.
 *
 * @example
 * ```tsx
 * <CodeBlock code={source} language="tsx" showLineNumbers />
 * ```
 */
const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>((props, forwardedRef) => {
  const {
    code,
    language,
    showLineNumbers = false,
    hideHeader = false,
    copyLabel = 'Copy',
    copiedLabel = 'Copied!',
    classNames,
  } = props;
  const [copied, setCopied] = React.useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can be denied (permissions, insecure context) —
      // silently no-op rather than throwing.
    }
  };

  const lines = code.split('\n');

  return (
    <div ref={forwardedRef} className={classNames?.root}>
      {hideHeader ? null : (
        <div className={classNames?.header}>
          <span className={classNames?.language}>{language ?? 'text'}</span>
          <button type="button" onClick={onCopy} className={classNames?.copyButton}>
            {copied ? copiedLabel : copyLabel}
          </button>
        </div>
      )}
      <pre className={classNames?.pre}>
        <code className={classNames?.code}>
          {showLineNumbers ? (
            <table className={classNames?.lineNumberTable}>
              <tbody>
                {lines.map((line, index) => (
                  <tr key={index}>
                    <td className={classNames?.lineNumberCell}>{index + 1}</td>
                    <td className={classNames?.lineContentCell}>{line}</td>
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
export type { CodeBlockProps, CodeBlockClassNames };
