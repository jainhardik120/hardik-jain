import turboPlugin from "eslint-plugin-turbo";
import { defineConfig, globalIgnores } from 'eslint/config';
import { fixupConfigRules } from '@eslint/compat';
import _import from 'eslint-plugin-import';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});
export default defineConfig([
  globalIgnores([
    '**/node_modules',
    '**/build',
    '**/public',
    '**/prisma',
    'src/components/ui',
    'src/canva-client',
    '**/tailwind.config.ts',
  ]),
  {
    extends: fixupConfigRules(
      compat.extends(
        'next/core-web-vitals',
        'next/typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/strict',
        'plugin:prettier/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
      ),
    ),
    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'script',

      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: './',
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },

        node: {
          extensions: ['.ts', '.tsx', '.js', '.jsx'],
        },
      },

      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },

      'import/extensions': ['.ts', '.tsx', '.js', '.jsx'],
      'import/internal-regex': '^@/',
    },
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
      '@typescript-eslint/consistent-type-imports': 'error',

      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
        },
      ],

      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unused-vars': 'error',

      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: false,
        },
      ],

      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      'array-bracket-spacing': ['error', 'never'],
      'arrow-parens': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      curly: ['error', 'all'],
      eqeqeq: 'error',

      'key-spacing': [
        'error',
        {
          beforeColon: false,
          afterColon: true,
        },
      ],

      'keyword-spacing': [
        'error',
        {
          before: true,
          after: true,
        },
      ],

      'max-len': [
        'warn',
        {
          code: 100,
          ignoreStrings: true,
          ignoreComments: true,
        },
      ],

      'no-console': 'error',
      'no-constant-condition': 'error',
      'no-debugger': 'error',

      'no-multiple-empty-lines': [
        'error',
        {
          max: 1,
          maxEOF: 1,
        },
      ],

      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'prettier/prettier': 'warn',
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'space-before-blocks': ['error', 'always'],

      'spaced-comment': [
        'error',
        'always',
        {
          markers: ['/'],
        },
      ],

      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', ['sibling', 'index'], 'type', 'object'],

          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'next/**',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
          ],

          pathGroupsExcludedImportTypes: ['react', 'next'],
          'newlines-between': 'always',

          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      'import/no-cycle': [
        'error',
        {
          maxDepth: 3,
        },
      ],

      'import/no-self-import': 'error',

      'import/no-useless-path-segments': [
        'error',
        {
          noUselessIndex: true,
        },
      ],

      'import/first': 'error',
      'import/no-duplicates': 'error',
      'import/newline-after-import': 'error',

      'import/no-unassigned-import': [
        'error',
        {
          allow: ['**/*.css', '**/*.scss'],
        },
      ],

      'import/no-named-default': 'error',
      'import/no-anonymous-default-export': 'error',
      'import/no-default-export': 'off',
      'import/no-mutable-exports': 'error',
      'import/no-absolute-path': 'error',
      'import/no-namespace': 'error',

      'import/extensions': [
        'error',
        'never',
        {
          json: 'always',
          css: 'always',
          scss: 'always',
        },
      ],

      'import/max-dependencies': [
        'error',
        {
          max: 20,
        },
      ],

      'import/no-relative-packages': 'error',
      'import/no-import-module-exports': 'error',

      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*'],
              message:
                'Imports from parent directories are not allowed. Use absolute imports instead.',
            },
            {
              group: ['*/.//*'],
              message: 'Malformed relative imports are not allowed.',
            },
            {
              group: ['src/*'],
              message:
                "Import from 'src/' directory is not allowed. Use absolute imports with '@/' instead.",
            },
            {
              group: ['react-dom/server'],
              message:
                "Import from 'react-dom/server' is not allowed in client components. Use a server component instead.",
            },
          ],

          paths: [
            {
              name: 'lodash',
              message:
                "Import specific lodash methods instead. Example: import map from 'lodash/map'",
            },
          ],
        },
      ],
    },
  },
]);
