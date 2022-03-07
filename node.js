'use strict';

module.exports = {
  plugins: [
    'node',
  ],
  extends: [
    './index.js',
    'plugin:node/recommended',
  ],
  parserOptions: {
    // Set to at least 2020 to enable support for dynamic import(). This only affects how the code
    // is parsed -- it does not affect what features rules will allow.
    ecmaVersion: 2020,
  },
  settings: {
    node: {
      tryExtensions: ['.js', '.cjs', '.mjs', '.json', '.node'],
    },
  },
  env: {
    node: true,
  },
  ignorePatterns: [
    'node_modules/',
  ],
  overrides: [
    {
      files: ['.eslintrc.*'],
      rules: {
        'node/no-unpublished-require': 'off',
      },
    },
    {
      files: ['.ts', '.tsx', '.cts', '.mts'].map((p) => [`*${p}`, `.*${p}`]).flat(),
      settings: {
        node: {
          tryExtensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.json', '.node'],
        },
      },
    },
  ],
};
