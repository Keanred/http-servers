import tseslint from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 2020,
        project: './tsconfig.json',
        sourceType: 'module',
      },
      globals: {
        NodeJS: true,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier,
    },
    rules: {
      ...(tseslint.configs?.recommended?.rules ?? {}),
      'prettier/prettier': 'error',
      eqeqeq: 'error',
      complexity: ['warn', 7],
      'no-case-declarations': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { args: 'all', argsIgnorePattern: '^_.*' }],
      '@typescript-eslint/no-shadow': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',
      'no-duplicate-imports': 'error',
      'no-nested-ternary': 'error',
      'no-use-before-define': 'warn',
      'func-style': ['warn', 'declaration', { allowArrowFunctions: true }],
      'prefer-arrow-callback': 'warn',
      'no-delete-var': 'error',
      'no-empty-function': 'error',
      'no-empty-pattern': 'error',
      'no-fallthrough': 'error',
      'no-global-assign': 'error',
      'no-invalid-regexp': 'error',
      'no-octal': 'error',
      'no-redeclare': 'error',
      'no-self-assign': 'error',
      'no-shadow-restricted-names': 'error',
      'no-unused-labels': 'error',
      'no-useless-catch': 'error',
      'no-useless-escape': 'error',
      'no-with': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
    ignores: ['**/*.js', 'node_modules', 'dist'],
  },
];
