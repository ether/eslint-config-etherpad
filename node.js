'use strict';

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
      files: ['.ts', '.tsx', '.cts', '.mts'].map((p) => [`*${p}`, `.*${p}`]).flat(),
      settings: {
        node: {
          tryExtensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.json', '.node'],
        },
      },
    },
  ],
};
