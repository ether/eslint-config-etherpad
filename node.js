'use strict';

module.exports = {
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
  plugins: [
    'node',
  ],
};
