import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const config = [
  { ignores: ['.next/'] },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    plugins: { 'no-relative-import-paths': noRelativeImportPaths },
    rules: {
      'object-shorthand': 'warn',
      'no-useless-rename': 'warn',
      'quotes': ['warn', 'single', { avoidEscape: true }],
      'no-relative-import-paths/no-relative-import-paths': [
        'warn',
        { allowSameFolder: true, rootDir: '.', prefix: '~' },
      ],
    },
  },
  {
    files: ['scripts/**/*.ts'],
    rules: { 'no-console': 'off' },
  },
];

export default config;
