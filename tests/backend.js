'use strict';

module.exports = {
  extends: [
    '../node.js',
    '../tests.js',
  ],
  rules: {
    'node/no-unpublished-require': 'off', // It's OK for tests to use devDependencies.
  },
};
