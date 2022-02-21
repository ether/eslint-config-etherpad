'use strict';

module.exports = {
  plugins: [
    'cypress',
  ],
  extends: [
    '../node.js',
    '../tests.js',
    'plugin:cypress/recommended',
  ],
  env: {
    'cypress/globals': true,
  },
  rules: {
    // Cypress prefers synchronous arrow functions passed to Mocha functions.
    'mocha/no-mocha-arrows': 'off',
    'mocha/no-synchronous-tests': 'off',
    'mocha/prefer-arrow-callback': 'off',
    'prefer-arrow-callback': 'error',
    'prefer-arrow/prefer-arrow-functions': 'error',
  },
};
