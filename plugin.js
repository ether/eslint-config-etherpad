'use strict';

module.exports = {
  overrides: [
    {
      files: ['**/.eslintrc.js'],
      extends: 'etherpad/node',
    },
    {
      files: ['**/*'],
      excludedFiles: ['**/.eslintrc.js', 'static/js/**/*', 'static/tests/frontend/**/*'],
      extends: 'etherpad/node',
    },
    {
      files: ['static/js/**/*', 'static/tests/frontend/**/*'],
      excludedFiles: ['**/.eslintrc.js'],
      extends: 'etherpad/browser',
    },
  ],
};
