// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import storybookPlugin from 'eslint-plugin-storybook';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/storybook-static/**',
      '**/node_modules/**',
      '**/.nx/**',
      '**/coverage/**',
      '**/*.d.ts',
      // Isolated git worktrees the Claude Code harness creates for
      // background/parallel sessions — each is its own independent
      // checkout with its own lint state, not part of this tree's surface.
      '**/.claude/worktrees/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      import: importPlugin,
    },
    settings: {
      react: { version: '18.3.1' },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...jsxA11yPlugin.configs.recommended.rules,

      // Nebula conventions: components are polymorphic (asChild) and
      // forward refs — keep these loose where the pattern requires it.
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },

  // Package-boundary / layering rules from component-library-architecture.md §2:
  // utilities -> hooks -> primitives -> headless -> styleless -> react-ui -> react-ui-blocks.
  // (`styleless` only has one component (`Button`) extracted so far — see LAYER_TAXONOMY.md
  // §4 for the ~49 remaining — but its layering block below is already in place.)
  // Each block below blocks imports from higher layers than itself.
  // `utilities` and `hooks` sit at the bottom and depend on nothing else in
  // the workspace (not even each other — see packages/hooks/README.md).
  {
    files: ['packages/utilities/**/*.{ts,tsx}'],
    settings: {
      react: { version: '18.3.1' },
    },
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@nebula/*'],
              message:
                'Layering violation: packages/utilities depends on nothing else in the workspace. See component-library-architecture.md §2.',
            },
          ],
        },
      ],
    },
  },

  {
    files: ['packages/hooks/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@nebula/*'],
              message:
                'Layering violation: packages/hooks depends on nothing else in the workspace. See component-library-architecture.md §2.',
            },
          ],
        },
      ],
    },
  },

  {
    files: ['packages/primitives/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@nebula/headless*', '@nebula/react-ui*', '@nebula/react-ui-blocks*'],
              message:
                'Layering violation: packages/primitives cannot depend on higher layers. See component-library-architecture.md §2.',
            },
          ],
        },
      ],
    },
  },

  {
    files: ['packages/headless/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@nebula/react-ui*', '@nebula/react-ui-blocks*'],
              message:
                'Layering violation: packages/headless depends only on primitives + hooks. See component-library-architecture.md §2.',
            },
          ],
        },
      ],
    },
  },

  {
    files: ['packages/styleless/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@nebula/react-ui*', '@nebula/react-ui-blocks*'],
              message:
                'Layering violation: packages/styleless depends only on primitives + hooks + headless. See component-library-architecture.md §2 and LAYER_TAXONOMY.md.',
            },
          ],
        },
      ],
    },
  },

  {
    files: ['packages/react-ui/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@nebula/react-ui-blocks*'],
              message:
                'Layering violation: packages/react-ui cannot depend on react-ui-blocks. See component-library-architecture.md §2.',
            },
          ],
        },
      ],
    },
  },

  // packages/react-ui-blocks is the top of the graph (depends on react-ui +
  // primitives, per its own package.json — react-ui now owns tokens/theming
  // too, absorbing the former packages/theme) — nothing sits above it, so
  // it gets no no-restricted-imports block of its own.

  {
    files: ['**/*.stories.@(ts|tsx)'],
    plugins: { storybook: storybookPlugin },
    rules: {
      ...storybookPlugin.configs.recommended.rules,
    },
  },

  {
    files: ['**/*.config.@(js|ts|mjs|cjs)', '**/.storybook/**'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      'import/order': 'off',
    },
  },

  prettierConfig,
);
