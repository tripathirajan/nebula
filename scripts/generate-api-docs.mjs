#!/usr/bin/env node
// Regenerates packages/<pkg>/API_DOC.md for every package — a real prop/
// parameter reference table per component/hook/utility, extracted from the
// TypeScript AST (not guessed, not hand-maintained). Reuses this repo's
// established "walk src/, don't hand-list" pattern from
// scripts/generate-component-inventory.mjs, extended to open each file and
// read its actual Props/parameter types.
//
// Usage: node scripts/generate-api-docs.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';

const REPO_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PKG_ROOT = path.join(REPO_ROOT, 'packages');

// ---------- shared source-file helpers ----------

const sfCache = new Map();
function getSourceFile(filePath) {
  if (sfCache.has(filePath)) return sfCache.get(filePath);
  if (!fs.existsSync(filePath)) {
    sfCache.set(filePath, null);
    return null;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const kind = filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sf = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true, kind);
  sfCache.set(filePath, sf);
  return sf;
}

function resolveRelativeImport(fromFile, spec) {
  const base = path.resolve(path.dirname(fromFile), spec);
  for (const ext of ['.tsx', '.ts']) {
    if (fs.existsSync(base + ext)) return base + ext;
  }
  if (fs.existsSync(path.join(base, 'index.ts'))) return path.join(base, 'index.ts');
  if (fs.existsSync(path.join(base, 'index.tsx'))) return path.join(base, 'index.tsx');
  return null;
}

/** Map of local imported name -> { spec, isRelative, resolvedFile } for a source file. */
function buildImportMap(sf) {
  const map = new Map();
  for (const stmt of sf.statements) {
    if (!ts.isImportDeclaration(stmt) || !stmt.importClause) continue;
    const spec = stmt.moduleSpecifier.text;
    const isRelative = spec.startsWith('.');
    const resolvedFile = isRelative ? resolveRelativeImport(sf.fileName, spec) : null;
    const bindings = stmt.importClause.namedBindings;
    if (bindings && ts.isNamedImports(bindings)) {
      for (const el of bindings.elements) {
        const localName = el.name.text;
        const importedName = el.propertyName ? el.propertyName.text : el.name.text;
        map.set(localName, { spec, isRelative, resolvedFile, importedName });
      }
    }
  }
  return map;
}

function jsDocCommentToText(comment) {
  if (comment == null) return '';
  if (typeof comment === 'string') return comment;
  return comment.map((c) => ('text' in c ? c.text : '')).join('');
}

function getLeadingDoc(node) {
  const jsDoc = node.jsDoc;
  if (!jsDoc || jsDoc.length === 0) return { description: '', paramTags: new Map(), returnsText: '' };
  const last = jsDoc[jsDoc.length - 1];
  const description = jsDocCommentToText(last.comment).replace(/\s+/g, ' ').trim();
  const paramTags = new Map();
  let returnsText = '';
  for (const tag of last.tags || []) {
    const text = jsDocCommentToText(tag.comment).replace(/\s+/g, ' ').trim();
    if (ts.isJSDocParameterTag(tag)) {
      const name = tag.name.getText();
      const cleaned = text.replace(/^-\s*/, '');
      paramTags.set(name, cleaned);
      // Also index by the last dotted segment (`params.prop` -> `prop`)
      const lastSeg = name.split('.').pop();
      if (lastSeg && !paramTags.has(lastSeg)) paramTags.set(lastSeg, cleaned);
    } else if (tag.tagName?.getText() === 'returns' || tag.tagName?.getText() === 'return') {
      returnsText = text;
    }
  }
  return { description, paramTags, returnsText };
}

const DOT_PLACEHOLDER = '@@DOT@@';
function firstSentence(text, max = 300) {
  // Protect common mid-sentence abbreviations from being mistaken for a
  // sentence boundary (e.g. this comment itself would otherwise truncate
  // right after "e.g.").
  const guarded = text.replace(/\b(e\.g|i\.e|etc|vs)\./gi, (_, w) => w + DOT_PLACEHOLDER);
  const m = guarded.match(/^(.*?[.!?])(\s|$)/);
  const out = (m ? m[1] : guarded).split(DOT_PLACEHOLDER).join('.');
  return out.length > max ? out.slice(0, max).replace(/\s+\S*$/, '') + '…' : out;
}

function truncate(text, max = 150) {
  return text.length > max ? text.slice(0, max).replace(/\s+\S*$/, '') + '…' : text;
}

function md(s) {
  return (s || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

// ---------- known generic wrappers from @nebula-lab/primitives ----------

const POLYMORPHIC_WRAPPERS = new Set(['PrimitivePropsWithRef', 'PolymorphicComponentPropsWithRef']);

// ---------- member extraction (own props, recursively resolving local types) ----------

function propSigToMember(sf, node, paramTags) {
  if (!ts.isPropertySignature(node) || !node.name) return null;
  const name = node.name.getText(sf).replace(/^['"]|['"]$/g, '');
  const optional = !!node.questionToken;
  const typeText = node.type ? node.type.getText(sf).replace(/\s+/g, ' ') : 'unknown';
  const { description } = getLeadingDoc(node);
  const doc = description || paramTags?.get(name) || '';
  return { name, optional, typeText, doc: truncate(doc, 140) };
}

/**
 * Resolves a type node into { members, extendsNotes } — own PropertySignature
 * members are collected directly from the AST (never expanded through the
 * checker, so inherited DOM attributes from React.HTMLAttributes etc. stay
 * as a single "extends" note rather than exploding into hundreds of rows).
 * Locally-declared type aliases/interfaces referenced from the same file
 * (e.g. `FlexOwnProps` used as a type argument) are inlined as "own" since
 * they exist purely to describe this component's own props.
 */
function resolveTypeNode(sf, typeNode, importMap, paramTags, depth = 0) {
  const members = [];
  const extendsNotes = [];
  if (!typeNode || depth > 4) return { members, extendsNotes };

  if (ts.isTypeLiteralNode(typeNode)) {
    for (const m of typeNode.members) {
      const info = propSigToMember(sf, m, paramTags);
      if (info) members.push(info);
    }
    return { members, extendsNotes };
  }

  if (ts.isIntersectionTypeNode(typeNode)) {
    for (const t of typeNode.types) {
      const r = resolveTypeNode(sf, t, importMap, paramTags, depth + 1);
      members.push(...r.members);
      extendsNotes.push(...r.extendsNotes);
    }
    return { members, extendsNotes };
  }

  if (ts.isParenthesizedTypeNode(typeNode)) {
    return resolveTypeNode(sf, typeNode.type, importMap, paramTags, depth);
  }

  if (ts.isTypeReferenceNode(typeNode)) {
    const name = typeNode.typeName.getText(sf);
    const shortName = name.split('.').pop();

    // Well-known polymorphic wrappers from @nebula-lab/primitives.
    if (POLYMORPHIC_WRAPPERS.has(shortName)) {
      const args = typeNode.typeArguments || [];
      const tagArg = args[0] ? args[0].getText(sf).replace(/\s+/g, ' ') : null;
      const note =
        shortName === 'PolymorphicComponentPropsWithRef'
          ? `Polymorphic — accepts an \`as\` prop to change the rendered element; inherits that element's standard attributes.`
          : `Inherits all standard \`${tagArg}\` attributes.`;
      extendsNotes.push({ text: note, synthetic: true });
      if (args[1]) {
        const r = resolveTypeNode(sf, args[1], importMap, paramTags, depth + 1);
        members.push(...r.members);
        extendsNotes.push(...r.extendsNotes);
      }
      return { members, extendsNotes };
    }

    // cva variant props — don't try to flatten the recipe, just point at it.
    if (shortName === 'VariantProps') {
      const argText = typeNode.typeArguments?.[0]?.getText(sf) || '';
      const cvaName = argText.replace(/^typeof\s+/, '').trim();
      extendsNotes.push({ text: `CVA variant props from \`${cvaName}\` (see this file's own \`${cvaName}\` recipe for the full option list).`, synthetic: true });
      return { members, extendsNotes };
    }

    // Same-file locally-declared type alias/interface -- inline as "own".
    const localDecl = sf.statements.find(
      (s) => (ts.isTypeAliasDeclaration(s) || ts.isInterfaceDeclaration(s)) && s.name.text === shortName,
    );
    if (localDecl) {
      if (ts.isTypeAliasDeclaration(localDecl)) {
        const r = resolveTypeNode(sf, localDecl.type, importMap, paramTags, depth + 1);
        members.push(...r.members);
        extendsNotes.push(...r.extendsNotes);
      } else {
        for (const m of localDecl.members) {
          const info = propSigToMember(sf, m, paramTags);
          if (info) members.push(info);
        }
        for (const hc of localDecl.heritageClauses || []) {
          for (const t of hc.types) {
            const r = resolveTypeNode(sf, t.expression ? t : t, importMap, paramTags, depth + 1);
            extendsNotes.push(...r.extendsNotes);
          }
        }
      }
      return { members, extendsNotes };
    }

    // Cross-package / external reference -- record, don't expand.
    const imp = importMap.get(shortName);
    const raw = typeNode.getText(sf).replace(/\s+/g, ' ');
    extendsNotes.push({ text: raw, from: imp && !imp.isRelative ? imp.spec : null });
    return { members, extendsNotes };
  }

  // Anything else (union, keyof, etc.) at top level -- treat as a raw extends note.
  extendsNotes.push({ text: typeNode.getText(sf).replace(/\s+/g, ' ') });
  return { members, extendsNotes };
}

/** Resolves a top-level `interface X extends A, B { ...own } ` or `type X = ...` declaration. */
function resolvePropsDeclaration(sf, decl, importMap) {
  if (!decl) return { members: [], extendsNotes: [] };
  if (ts.isInterfaceDeclaration(decl)) {
    const members = [];
    for (const m of decl.members) {
      const info = propSigToMember(sf, m, null);
      if (info) members.push(info);
    }
    const extendsNotes = [];
    for (const hc of decl.heritageClauses || []) {
      for (const t of hc.types) {
        const r = resolveTypeNode(sf, t, importMap, null, 1);
        // heritage clause type nodes are ExpressionWithTypeArguments, not
        // TypeReferenceNode -- resolveTypeNode only understands the latter,
        // so fall back to a raw text extends-note for interface heritage.
        if (r.members.length === 0 && r.extendsNotes.length === 0) {
          const name = t.expression.getText(sf);
          const imp = importMap.get(name);
          extendsNotes.push({ text: t.getText(sf), from: imp && !imp.isRelative ? imp.spec : null });
        } else {
          members.push(...r.members);
          extendsNotes.push(...r.extendsNotes);
        }
      }
    }
    return { members, extendsNotes };
  }
  if (ts.isTypeAliasDeclaration(decl)) {
    return resolveTypeNode(sf, decl.type, importMap, null, 0);
  }
  return { members: [], extendsNotes: [] };
}

function findPropsDecl(sf, typeName) {
  return sf.statements.find(
    (s) => (ts.isInterfaceDeclaration(s) || ts.isTypeAliasDeclaration(s)) && s.name.text === typeName,
  );
}

// ---------- rendering ----------

function renderPropsCell(members, extendsNotes) {
  const lines = [];
  for (const m of members) {
    const doc = m.doc ? ` — ${md(m.doc)}` : '';
    lines.push(`\`${m.name}${m.optional ? '?' : ''}: ${md(m.typeText)}\`${doc}`);
  }
  for (const e of extendsNotes) {
    if (e.synthetic) {
      lines.push(md(e.text));
    } else {
      const from = e.from ? ` (from \`${e.from}\`)` : '';
      lines.push(`extends \`${md(e.text)}\`${from}`);
    }
  }
  if (lines.length === 0) return '—';
  return lines.join('<br>');
}

function componentRow(sn, displayName, filePath, typeName, extraComment) {
  const sf = filePath ? getSourceFile(filePath) : null;
  if (!sf) {
    return {
      sn,
      component: displayName,
      props: typeName ? `Same as \`${typeName}\`` : '—',
      usage: '(source file not found)',
      comments: extraComment || '',
    };
  }
  const importMap = buildImportMap(sf);
  const decl = typeName ? findPropsDecl(sf, typeName) : null;
  const { members, extendsNotes } = decl ? resolvePropsDeclaration(sf, decl, importMap) : { members: [], extendsNotes: [] };

  // Usage notes: the component's own doc comment (declaration-position heuristic,
  // same as scripts/generate-component-inventory.mjs).
  const pascal = displayName;
  const declRe = new RegExp(`(?:function|const)\\s+${pascal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
  const content = sf.text;
  const declMatch = content.match(declRe);
  const blocks = [...content.matchAll(/\/\*\*([\s\S]*?)\*\//g)];
  let usage = '';
  if (blocks.length > 0) {
    let best = null;
    if (declMatch) {
      for (const b of blocks) {
        if (b.index < declMatch.index) best = b;
        else break;
      }
    }
    if (!best) {
      best = blocks[0];
      for (const b of blocks) if (b[1].length > best[1].length) best = b;
    }
    const cleaned = best[1]
      .split('\n')
      .map((l) => l.replace(/^\s*\*\/?/, '').trim())
      .filter((l) => !l.startsWith('@'))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    usage = firstSentence(cleaned, 320);
  }

  return {
    sn,
    component: displayName,
    props: renderPropsCell(members, extendsNotes),
    usage: md(usage) || '(no doc comment found)',
    comments: extraComment || '',
  };
}

function functionRow(sn, displayName, filePath, extraComment) {
  const sf = filePath ? getSourceFile(filePath) : null;
  if (!sf) return { sn, component: displayName, props: '—', usage: '(source file not found)', comments: extraComment || '' };
  const importMap = buildImportMap(sf);

  let fnNode = null;
  for (const stmt of sf.statements) {
    if (ts.isFunctionDeclaration(stmt) && stmt.name?.text === displayName) {
      fnNode = stmt;
      break;
    }
    if (ts.isVariableStatement(stmt)) {
      for (const decl of stmt.declarationList.declarations) {
        if (
          ts.isIdentifier(decl.name) &&
          decl.name.text === displayName &&
          decl.initializer &&
          (ts.isArrowFunction(decl.initializer) || ts.isFunctionExpression(decl.initializer))
        ) {
          fnNode = decl.initializer;
        }
      }
    }
  }

  if (!fnNode) {
    return { sn, component: displayName, props: '—', usage: '(function declaration not found)', comments: extraComment || '' };
  }

  const docHost = fnNode.parent?.parent && ts.isVariableStatement(fnNode.parent.parent) ? fnNode.parent.parent : fnNode;
  const { description, paramTags, returnsText } = getLeadingDoc(docHost.jsDoc ? docHost : fnNode);

  const paramLines = [];
  for (const p of fnNode.parameters) {
    if (ts.isObjectBindingPattern(p.name) && p.type) {
      const { members, extendsNotes } = resolveTypeNode(sf, p.type, importMap, paramTags, 0);
      for (const m of members) {
        const doc = m.doc ? ` — ${md(m.doc)}` : '';
        paramLines.push(`\`${m.name}${m.optional ? '?' : ''}: ${md(m.typeText)}\`${doc}`);
      }
      for (const e of extendsNotes) {
        paramLines.push(e.synthetic ? md(e.text) : `extends \`${md(e.text)}\``);
      }
    } else {
      const name = p.name.getText(sf);
      const typeText = p.type ? p.type.getText(sf).replace(/\s+/g, ' ') : 'unknown';
      const doc = paramTags.get(name);
      paramLines.push(`\`${name}${p.questionToken ? '?' : ''}: ${md(typeText)}\`${doc ? ` — ${md(doc)}` : ''}`);
    }
  }
  const returnType = fnNode.type ? fnNode.type.getText(sf).replace(/\s+/g, ' ') : null;
  if (returnType) paramLines.push(`**returns** \`${md(returnType)}\`${returnsText ? ` — ${md(returnsText)}` : ''}`);

  return {
    sn,
    component: displayName,
    props: paramLines.length ? paramLines.join('<br>') : '—',
    usage: md(firstSentence(description, 320)) || '(no doc comment found)',
    comments: extraComment || '',
  };
}

function renderTable(title, description, rows) {
  let out = `## ${title}\n\n${description}\n\n`;
  out += `| SN | Component | Props | Usage notes | Comments |\n`;
  out += `|---|---|---|---|---|\n`;
  for (const r of rows) {
    out += `| ${r.sn} | \`${r.component}\` | ${r.props} | ${r.usage} | ${r.comments || ''} |\n`;
  }
  return out + '\n';
}

// ---------- barrel parsing (discovers every real exported component + its Props type) ----------

// Matches `export { A, B as C } from './spec';` and `export type { X, Y } from './spec';`
const EXPORT_STMT_RE = /export\s+(type\s+)?\{([^}]+)\}\s*from\s*['"](\.[^'"]+)['"];?/g;

function parseNameList(raw) {
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const m = s.match(/^([A-Za-z_$][\w$]*)\s*(?:as\s+([A-Za-z_$][\w$]*))?$/);
      if (!m) return null;
      return { exported: m[1], displayName: m[2] || m[1] };
    })
    .filter(Boolean);
}

/**
 * Walks every `export { ... } from './x'` / `export type { ... } from './x'`
 * statement in a barrel, grouped by their source `spec`, then pairs each
 * real (PascalCase, i.e. component-shaped) runtime export with the type
 * export that looks like its Props type — falling back to "the type export
 * from the same spec" when there's exactly one of each and no exact name
 * match (handles `export { Button, buttonVariants } from './button'` next
 * to `export type { ButtonProps } from './button'`: `buttonVariants` is
 * filtered out for not being PascalCase, leaving one clean pair).
 */
function parseBarrel(barrelPath) {
  if (!fs.existsSync(barrelPath)) return [];
  const content = fs.readFileSync(barrelPath, 'utf8');
  const bySpec = new Map();
  for (const m of content.matchAll(EXPORT_STMT_RE)) {
    const [, isType, rawNames, spec] = m;
    if (!bySpec.has(spec)) bySpec.set(spec, { runtime: [], types: [] });
    const bucket = isType ? bySpec.get(spec).types : bySpec.get(spec).runtime;
    bucket.push(...parseNameList(rawNames));
  }

  const entries = [];
  for (const [spec, { runtime, types }] of bySpec) {
    const components = runtime.filter((r) => /^[A-Z]/.test(r.displayName));
    for (const comp of components) {
      const exact = types.find((t) => t.displayName === `${comp.displayName}Props`);
      const fallback = types.length === 1 ? types[0] : null;
      const propsType = (exact || fallback)?.exported || `${comp.exported}Props`;
      entries.push({ displayName: comp.displayName, spec, propsType });
    }
  }
  return entries;
}

// ---------- component-package discovery (folders under src/, depth per package) ----------

function listComponentFolders(pkgDir, depth) {
  const results = [];
  function walk(dir, relParts) {
    const entries = fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory());
    for (const e of entries) {
      const full = path.join(dir, e.name);
      const parts = [...relParts, e.name];
      const hasFiles = fs.readdirSync(full).some((f) => /\.(tsx|ts)$/.test(f));
      if (hasFiles) {
        results.push({ name: e.name, dir: full, category: relParts.join('/') });
      } else if (parts.length < depth + 1) {
        walk(full, parts);
      }
    }
  }
  walk(pkgDir, []);
  return results.sort((a, b) => (a.category + a.name).localeCompare(b.category + b.name));
}

function buildComponentPackageDoc(pkgName, pkgDir, depth, headerNote) {
  const folders = listComponentFolders(pkgDir, depth);
  const rows = [];
  let sn = 1;
  for (const folder of folders) {
    const barrel = path.join(folder.dir, 'index.ts');
    let entries = parseBarrel(barrel);
    if (entries.length === 0) {
      // No barrel pairs found (single-file component, or unconventional index.ts) --
      // fall back to the folder's own main file under its own name.
      const mainCandidates = [`${folder.name}.tsx`, `${folder.name}.ts`];
      const mainFile = mainCandidates.map((c) => path.join(folder.dir, c)).find((p) => fs.existsSync(p));
      if (mainFile) {
        entries = [{ displayName: null, spec: null, propsType: null, __fallbackFile: mainFile }];
      } else {
        entries = [];
      }
    }
    for (const entry of entries) {
      let filePath;
      let displayName = entry.displayName;
      if (entry.__fallbackFile) {
        filePath = entry.__fallbackFile;
        displayName = displayName || pascalFallback(folder.name);
      } else {
        filePath = resolveRelativeImport(barrel, entry.spec) || path.join(folder.dir, entry.spec.replace(/^\.\//, '') + '.tsx');
      }
      if (!filePath || !fs.existsSync(filePath)) continue;
      rows.push(componentRow(sn++, displayName, filePath, entry.propsType, folder.category ? `\`${folder.category}\`` : ''));
    }
  }
  return renderTable(`\`@nebula-lab/${pkgName}\``, headerNote, rows);
}

function pascalFallback(kebab) {
  return kebab.split('-').map((s) => s[0].toUpperCase() + s.slice(1)).join('');
}

// ---------- react-ui-blocks discovery (multiple sibling components per leaf folder) ----------

function buildBlocksDoc(pkgDir) {
  const files = [];
  (function walk(dir, relParts) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name === 'compositions') continue;
        walk(full, [...relParts, e.name]);
      } else if (/\.tsx$/.test(e.name) && !/\.(test|stories)\.tsx$/.test(e.name)) {
        files.push({ full, name: e.name.replace(/\.tsx$/, ''), category: relParts.join('/') });
      }
    }
  })(pkgDir, []);
  files.sort((a, b) => (a.category + a.name).localeCompare(b.category + b.name));

  const rows = [];
  let sn = 1;
  for (const f of files) {
    const sf = getSourceFile(f.full);
    if (!sf) continue;
    // Find every exported component in the file (react-ui-blocks files often
    // export one primary component, occasionally a couple of sibling ones).
    const exportedNames = [];
    for (const stmt of sf.statements) {
      if (ts.isVariableStatement(stmt) && stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
        for (const d of stmt.declarationList.declarations) {
          if (ts.isIdentifier(d.name)) exportedNames.push(d.name.text);
        }
      }
      if (ts.isFunctionDeclaration(stmt) && stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) && stmt.name) {
        exportedNames.push(stmt.name.text);
      }
    }
    // Named export-list form: export { Foo, Bar };
    const exportListMatch = sf.text.match(/export\s*\{\s*([^}]+)\}\s*;?\s*$/m);
    if (exportListMatch) {
      for (const part of exportListMatch[1].split(',')) {
        const nm = part.trim().split(/\s+as\s+/)[0].trim();
        if (nm && /^[A-Z]/.test(nm) && !exportedNames.includes(nm)) exportedNames.push(nm);
      }
    }
    const names = exportedNames.filter((n) => /^[A-Z]/.test(n));
    const uniqueNames = [...new Set(names.length ? names : [pascalFallback(f.name)])];
    for (const name of uniqueNames) {
      rows.push(componentRow(sn++, name, f.full, `${name}Props`, f.category ? `\`${f.category}\`` : ''));
    }
  }
  return renderTable(
    '`@nebula-lab/react-ui-blocks`',
    'Full page sections/flows composed from `react-ui` components — each block is its own file; a leaf folder may hold several sibling blocks.',
    rows,
  );
}

// ---------- hooks / utilities discovery ----------

function buildFunctionPackageDoc(pkgName, pkgDir, headerNote) {
  const entries = fs
    .readdirSync(pkgDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
  const rows = [];
  let sn = 1;
  for (const name of entries) {
    const dir = path.join(pkgDir, name);
    const mainFile = [`${name}.ts`, `${name}.tsx`].map((c) => path.join(dir, c)).find((p) => fs.existsSync(p));
    if (!mainFile) continue;
    const fnName = toCamelExport(name);
    rows.push(functionRow(sn++, fnName, mainFile, ''));
  }
  return renderTable(`\`@nebula-lab/${pkgName}\``, headerNote, rows);
}

function toCamelExport(kebab) {
  const parts = kebab.split('-');
  return parts[0] + parts.slice(1).map((s) => s[0].toUpperCase() + s.slice(1)).join('');
}

// ---------- run ----------

const PREAMBLE = (pkgName) => `# \`@nebula-lab/${pkgName}\` — API Reference

Generated from the actual TypeScript source (real exported prop/parameter names and types, not hand-transcribed) — regenerate with \`node scripts/generate-api-docs.mjs\` after adding/changing a component so this doesn't drift. See \`ARCHITECTURE.md\` at the repo root for how this package fits into the overall layering, and this package's own \`README.md\` for install/usage.

Cross-package prop types (e.g. a \`react-ui\` component's Props extending a \`styleless\` one) are shown as \`extends \`Type\` (from \`@nebula-lab/other-package\`)\` rather than flattened in place — look up that type in the other package's own API_DOC.md. Inherited native DOM attributes (from \`PrimitivePropsWithRef\`/\`PolymorphicComponentPropsWithRef\`) are summarized as a single note rather than enumerated, since they're just the target element's standard attributes.

---

`;

fs.writeFileSync(
  path.join(PKG_ROOT, 'utilities/API_DOC.md'),
  PREAMBLE('utilities') +
    buildFunctionPackageDoc(
      'utilities',
      path.join(PKG_ROOT, 'utilities/src'),
      'Framework-agnostic helper functions — no React, no DOM dependency beyond what a couple of DOM-predicate helpers need.',
    ),
);
console.log('packages/utilities/API_DOC.md written');

fs.writeFileSync(
  path.join(PKG_ROOT, 'hooks/API_DOC.md'),
  PREAMBLE('hooks') +
    buildFunctionPackageDoc('hooks', path.join(PKG_ROOT, 'hooks/src'), 'Reusable React hooks — state, DOM observation, and lifecycle utilities every other package builds on.'),
);
console.log('packages/hooks/API_DOC.md written');

fs.writeFileSync(
  path.join(PKG_ROOT, 'primitives/API_DOC.md'),
  PREAMBLE('primitives') +
    buildComponentPackageDoc(
      'primitives',
      path.join(PKG_ROOT, 'primitives/src'),
      1,
      'Unstyled, polymorphic low-level building blocks. Zero in-workspace dependencies.',
    ),
);
console.log('packages/primitives/API_DOC.md written');

fs.writeFileSync(
  path.join(PKG_ROOT, 'headless/API_DOC.md'),
  PREAMBLE('headless') +
    buildComponentPackageDoc(
      'headless',
      path.join(PKG_ROOT, 'headless/src'),
      1,
      'Behavior-only, ARIA-complete compound components — no styling opinions.',
    ),
);
console.log('packages/headless/API_DOC.md written');

fs.writeFileSync(
  path.join(PKG_ROOT, 'styleless/API_DOC.md'),
  PREAMBLE('styleless') +
    buildComponentPackageDoc(
      'styleless',
      path.join(PKG_ROOT, 'styleless/src'),
      1,
      'Reusable UI components with a complete, semantic API but zero visual opinion.',
    ),
);
console.log('packages/styleless/API_DOC.md written');

fs.writeFileSync(
  path.join(PKG_ROOT, 'react-ui/API_DOC.md'),
  PREAMBLE('react-ui') +
    buildComponentPackageDoc(
      'react-ui',
      path.join(PKG_ROOT, 'react-ui/src'),
      2,
      'Tailwind-styled components built on `primitives`/`headless`/`styleless`, plus the design token system.',
    ),
);
console.log('packages/react-ui/API_DOC.md written');

fs.writeFileSync(path.join(PKG_ROOT, 'react-ui-blocks/API_DOC.md'), PREAMBLE('react-ui-blocks') + buildBlocksDoc(path.join(PKG_ROOT, 'react-ui-blocks/src')));
console.log('packages/react-ui-blocks/API_DOC.md written');
