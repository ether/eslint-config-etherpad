'use strict';

// Shared plumbing for the flat-config entry points.
//
// `eslint-config-etherpad` has shipped eslintrc-format configs (`index.js`, `node.js`,
// `browser.js`, `tests.js`, `plugin.js`, `tests/*.js`) since forever, and ~80 Etherpad plugins
// still consume them via `.eslintrc.cjs`. ESLint 9 and 10 can only read flat config, so rather
// than fork the rule set (and let the two copies drift), the flat entry points translate the
// eslintrc configs at load time with `FlatCompat`. One source of truth, two formats.

const path = require('path');
const {FlatCompat} = require('@eslint/eslintrc');
const js = require('@eslint/js');

const root = path.resolve(__dirname, '..');

const compat = new FlatCompat({
  // `baseDirectory` is what the eslintrc `overrides[].files` globs are matched against, so it has
  // to be the directory being linted, not this package's directory. Getting this wrong is silent:
  // every glob in `plugin.js` (`static/js/**/*`, `static/tests/**/*`, ...) would be resolved
  // against `node_modules/eslint-config-etherpad/`, match nothing, and ESLint would cheerfully
  // report zero problems. `process.cwd()` is also what ESLint itself uses as the base path for
  // relative `files` patterns in a flat config.
  baseDirectory: process.cwd(),
  // Plugins, on the other hand, are dependencies of this package, so they have to be resolved
  // relative to this package's directory.
  resolvePluginsRelativeTo: root,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

// `eslint-plugin-mocha` is the one dependency that cannot serve both formats from one version:
//   * v10 is CommonJS and supports ESLint 7-9, but calls `context.getSourceCode()`, which ESLint
//     10 removed, so every mocha rule throws on ESLint 10.
//   * v11+ works on ESLint 9/10, but it is ESM-only and its `configs.recommended` is a flat config
//     array, so the eslintrc entry points (`extends: 'plugin:mocha/recommended'`) cannot use it.
// Both are therefore installed -- v11 under the `eslint-plugin-mocha-flat` alias -- and the flat
// entry points swap v10 out for v11 after translation. v11 renamed some rules; the map below keeps
// the rule set the same so that `tests.js` and friends do not have to care which one is in use.
let mochaFlat;

/**
 * Loads eslint-plugin-mocha v11, or returns null if this Node.js can't `require()` an ES module.
 *
 * Loaded lazily so that configs that don't use the mocha plugin (everything outside `tests.js`)
 * don't pay for it at all.
 *
 * Returning null is safe rather than a silent downgrade. `require()`ing an ES module needs Node.js
 * >=20.19.0, >=22.12.0 or >=24, and ESLint 10 -- the only ESLint that v10 of the plugin is broken
 * on -- declares `engines.node` of `^20.19.0 || ^22.13.0 || >=24`. So any runtime that can't load
 * v11 also can't be running ESLint 10, which means the v10 plugin that eslintrc already uses works
 * there. The older Node.js versions this package supports therefore fall back to v10 under ESLint
 * 9 instead of failing to load the config at all.
 *
 * @returns {?Object} The eslint-plugin-mocha v11 plugin object, or null.
 */
const getMochaFlat = () => {
  if (mochaFlat !== undefined) return mochaFlat;
  let mod;
  try {
    mod = require('eslint-plugin-mocha-flat');
  } catch (err) {
    if (err.code !== 'ERR_REQUIRE_ESM' && err.code !== 'ERR_REQUIRE_ASYNC_MODULE') throw err;
    mochaFlat = null;
    return mochaFlat;
  }
  mochaFlat = mod.default || mod;
  return mochaFlat;
};

const mochaRenamedRules = {
  'mocha/no-async-describe': 'mocha/no-async-suite',
  'mocha/no-empty-description': 'mocha/no-empty-title',
  'mocha/valid-suite-description': 'mocha/valid-suite-title',
  'mocha/valid-test-description': 'mocha/valid-test-title',
};

// v11 folded `mocha/no-skipped-tests` into `mocha/no-pending-tests`, which is also enabled by
// `plugin:mocha/recommended`, so dropping it does not lose any coverage.
const mochaRemovedRules = new Set(['mocha/no-skipped-tests']);

// eslintrc only ever looked at `.js` files unless `--ext` said otherwise, so the `files: ['**/*']`
// globs in `plugin.js` were harmless. Flat config has no `--ext`: whether a file gets linted is
// decided entirely by the `files` patterns, and FlatCompat turns every eslintrc `files`/
// `excludedFiles` pair into a matcher *function*, which ESLint does not treat as a universal
// pattern. Without a guard, `eslint .` would try to parse `package.json`, `pnpm-lock.yaml`,
// `locales/*.json` and every other file in the tree as JavaScript. So every translated matcher is
// ANDed with this extension check.
//
// The set defaults to the JavaScript extensions only, which is what `eslint .` looked at under
// eslintrc (TypeScript needed an explicit `--ext .ts`). The `flat/ts/*` entry points add the
// TypeScript extensions; they are opt-in because the TypeScript rules in `index.js` include
// type-aware ones, which need a `parserOptions.project`/`projectService` that the consumer has to
// supply.
const jsExtensions = ['.js', '.cjs', '.mjs', '.jsx'];
const tsExtensions = ['.ts', '.cts', '.mts', '.tsx'];

/**
 * Replaces eslint-plugin-mocha v10 with v11 in a translated flat config object.
 *
 * @param {Object} config A flat config object.
 * @returns {Object} The same config, with the mocha plugin and rule names updated.
 */
const useFlatCompatibleMocha = (config) => {
  const mocha = getMochaFlat();
  // No v11 available: keep the v10 plugin and its rule names (see `getMochaFlat()`).
  if (mocha == null) return config;
  const out = {...config};
  if (out.plugins && out.plugins.mocha) {
    out.plugins = {...out.plugins, mocha};
  }
  if (!out.rules) return out;
  const rules = {};
  for (const [name, value] of Object.entries(out.rules)) {
    if (mochaRemovedRules.has(name)) continue;
    rules[mochaRenamedRules[name] || name] = value;
  }
  out.rules = rules;
  return out;
};

/**
 * Translates one of this package's eslintrc config files into a flat config array.
 *
 * @param {string} relPath Path to the eslintrc config file, relative to this package's root.
 * @param {Object} [options] Options.
 * @param {boolean} [options.typescript] Whether to also lint TypeScript files.
 * @returns {Object[]} A flat config array, ready to be exported from an `eslint.config.js`.
 */
module.exports = (relPath, {typescript = false} = {}) => {
  const lintable = new Set(typescript ? [...jsExtensions, ...tsExtensions] : jsExtensions);
  const isLintable = (filePath) => lintable.has(path.extname(filePath));
  return compat.extends(path.join(root, relPath))
      .map(useFlatCompatibleMocha)
      .map((config) => (Array.isArray(config.files) ? {
        ...config,
        files: config.files.map((f) => (typeof f === 'function'
          ? (filePath) => isLintable(filePath) && f(filePath)
          : f)),
      } : config));
};
