'use strict';

module.exports = {
  env: {
    mocha: true,
  },
  extends: [
    'etherpad',
    'plugin:mocha/recommended',
  ],
  plugins: [
    'mocha',
  ],
  rules: {
    'mocha/no-return-from-async': 'error',
    'mocha/no-synchronous-tests': 'error',
    'mocha/prefer-arrow-callback': 'error',
    'prefer-arrow-callback': 'off',
  },
};
