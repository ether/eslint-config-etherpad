'use strict';

const tsExts = ['.ts', '.tsx', '.cts', '.mts'];

module.exports = {
  plugins: [
    'node',
  ],
  extends: [
    './index.js',
    'plugin:node/recommended',
  ],
  env: {
    node: true,
  },
  ignorePatterns: [
    'node_modules/',
  ],
  overrides: [
    {
      files: tsExts.map((p) => [`*${p}`, `.*${p}`]).flat(),
      rules: {
        'node/no-missing-import': ['error', {
          tryExtensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.json', '.node'],
        }],
      },
    },
  ],
};
