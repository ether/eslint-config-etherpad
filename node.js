'use strict';

module.exports = {
  plugins: [
    'n',
  ],
  extends: [
    './index.js',
    'plugin:n/recommended',
  ],
  parserOptions: {
    // Set to at least 2020 to enable support for dynamic import(). This only affects how the code
    // is parsed -- it does not affect what features rules will allow.
    ecmaVersion: 2020,
  },
  env: {
    node: true,
  },
  ignorePatterns: [
    'node_modules/',
  ],
  overrides: [
    {
      // ESLint's own config file is not part of the package's published API, but it is usually
      // published (plugins rarely set `files` in `package.json`) and it requires devDependencies,
      // which is exactly what `n/no-unpublished-require` complains about.
      files: ['.eslintrc.*', 'eslint.config.*'],
      rules: {
        'n/no-unpublished-require': 'off',
        'n/no-unpublished-import': 'off',
      },
    },
    {
      files: ['*.ts', '*.tsx', '*.cts', '*.mts'].map((p) => [p, `.${p}`]).flat(),
      settings: {
        n: {
          tryExtensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.json', '.node'],
        },
      },
    },
  ],
};
