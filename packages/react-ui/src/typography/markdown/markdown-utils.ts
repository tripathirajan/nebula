import * as React from 'react';

/**
 * Pure block/inline parsing helpers backing `Markdown` — a deliberately
 * small hand-rolled subset, not a full CommonMark implementation. There's
 * no npm registry access in this sandbox to add a real parser (`remark`/
 * `markdown-it`/`marked`), and a byte-for-byte-correct CommonMark parser
 * (link reference definitions, nested emphasis, HTML blocks, tables, etc.)
 * isn't something to responsibly hand-roll from scratch either — so this
 * covers the practical everyday subset (headings, paragraphs, fenced code,
 * blockquotes, lists, bold/italic/inline-code/links) and stops there. See
 * `Markdown`'s own doc comment for the full list of what's out of scope.
 */

type Block =
  | { type: 'heading'; level: 1 | 2 | 3 | 4 | 5 | 6; text: string }
  | { type: 'code'; language: string | undefined; code: string }
  | { type: 'blockquote'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'paragraph'; text: string };

/** Splits a markdown source string into top-level blocks, each on its own paragraph/fence/heading boundary. */
function parseBlocks(source: string): Block[] {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i]!;

    if (line.trim() === '') {
      i += 1;
      continue;
    }

    const fenceMatch = /^```(\w*)\s*$/.exec(line);
    if (fenceMatch) {
      const language = fenceMatch[1] || undefined;
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !/^```\s*$/.test(lines[i]!)) {
        codeLines.push(lines[i]!);
        i += 1;
      }
      i += 1; // skip the closing fence
      blocks.push({ type: 'code', language, code: codeLines.join('\n') });
      continue;
    }

    const headingMatch = /^(#{1,6})\s+(.*)$/.exec(line);
    if (headingMatch) {
      blocks.push({
        type: 'heading',
        level: headingMatch[1]!.length as 1 | 2 | 3 | 4 | 5 | 6,
        text: headingMatch[2]!.trim(),
      });
      i += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quoteLines: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i]!)) {
        quoteLines.push(lines[i]!.replace(/^>\s?/, ''));
        i += 1;
      }
      blocks.push({ type: 'blockquote', text: quoteLines.join(' ') });
      continue;
    }

    if (/^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
      const ordered = /^\d+\.\s+/.test(line);
      const pattern = ordered ? /^\d+\.\s+(.*)$/ : /^[-*]\s+(.*)$/;
      const items: string[] = [];
      while (i < lines.length && pattern.test(lines[i]!)) {
        const match = pattern.exec(lines[i]!);
        items.push(match![1]!.trim());
        i += 1;
      }
      blocks.push({ type: 'list', ordered, items });
      continue;
    }

    // Plain paragraph: accumulate until a blank line or the start of
    // another block type.
    const paragraphLines: string[] = [];
    while (
      i < lines.length &&
      lines[i]!.trim() !== '' &&
      !/^```/.test(lines[i]!) &&
      !/^#{1,6}\s+/.test(lines[i]!) &&
      !/^>\s?/.test(lines[i]!) &&
      !/^[-*]\s+/.test(lines[i]!) &&
      !/^\d+\.\s+/.test(lines[i]!)
    ) {
      paragraphLines.push(lines[i]!);
      i += 1;
    }
    blocks.push({ type: 'paragraph', text: paragraphLines.join(' ') });
  }

  return blocks;
}

const INLINE_PATTERN = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`(.+?)`)|(\[(.+?)\]\((.+?)\))/g;

/** Applies bold/italic/inline-code/link formatting to a single line of text, returning a mix of plain strings and inline React elements. No nested formatting (e.g. bold-inside-a-link) — a deliberate simplification, see `Markdown`'s doc comment. */
function parseInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  INLINE_PATTERN.lastIndex = 0;
  while ((match = INLINE_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[1] !== undefined) {
      nodes.push(React.createElement('strong', { key: key++ }, match[2]));
    } else if (match[3] !== undefined) {
      nodes.push(React.createElement('em', { key: key++ }, match[4]));
    } else if (match[5] !== undefined) {
      nodes.push(React.createElement('code', { key: key++ }, match[6]));
    } else if (match[7] !== undefined) {
      nodes.push(
        React.createElement('a', { key: key++, href: match[9], className: 'underline' }, match[8]),
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

export { parseBlocks, parseInline };
export type { Block };
