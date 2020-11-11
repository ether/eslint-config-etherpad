'use strict';

module.exports = {
  extends: 'etherpad',
  overrides: [
    {
      files: ['static/js/**/*', 'static/tests/frontend/**/*'],
      excludedFiles: ['**/.eslintrc.js'],
      env: {
        browser: true,
        node: false,
      },
    },
  ],
};
