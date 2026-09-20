'use strict';

// Flat config for linting this package itself, and a smoke test that the flat entry points
// actually load and work under ESLint 9/10. The eslintrc equivalent lives in `.eslintrc.js`.

module.exports = require('./flat/node.js');
