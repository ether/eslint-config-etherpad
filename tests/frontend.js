'use strict';

module.exports = {
  extends: [
    'etherpad/browser',
    'etherpad/tests',
  ],
  globals: {
    expect: 'readonly',
    helper: 'readonly',
  },
};
