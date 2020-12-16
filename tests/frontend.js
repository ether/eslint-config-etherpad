'use strict';

module.exports = {
  extends: [
    '../browser.js',
    '../tests.js',
  ],
  globals: {
    _: 'readonly',
    expect: 'readonly',
    helper: 'readonly',
  },
};
