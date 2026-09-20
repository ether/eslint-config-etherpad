'use strict';

const tsExts = ['.ts', '.tsx', '.cts', '.mts'];

// Rules from `sharedEsTsRules` that @typescript-eslint still provides a TypeScript-aware
// "extension rule" for. As of @typescript-eslint v8 all of the purely stylistic extension rules
// (brace-style, comma-dangle, comma-spacing, func-call-spacing, indent, keyword-spacing,
// object-curly-spacing, quotes, semi, space-before-function-paren, space-infix-ops) have been
// deleted upstream, and `@typescript-eslint/no-duplicate-imports` is gone too. For those, the
// plain ESLint core rule is left enabled on TypeScript files instead of being switched off, so
// the same things are still checked.
const tsExtensionRules = [
  'dot-notation',
  'no-array-constructor',
  'no-implied-eval',
  'no-unused-vars',
  'no-use-before-define',
];

// Extension rules that @typescript-eslint v8 renamed. Key is the core rule name (as used in
// `sharedEsTsRules`), value is the new name within the `@typescript-eslint/` namespace.
const tsRenamedExtensionRules = {
  'no-throw-literal': 'only-throw-error',
};

const sharedEsTsRules = {
  'brace-style': ['error', '1tbs', {allowSingleLine: true}],
  'comma-dangle': ['error', 'always-multiline'],
  'comma-spacing': 'error',
  'dot-notation': 'error',
  'func-call-spacing': 'error',
  'indent': ['error', 2, {
    CallExpression: {
      arguments: 2,
    },
    MemberExpression: 2,
    SwitchCase: 1,
    flatTernaryExpressions: true,
    offsetTernaryExpressions: true,
  }],
  'keyword-spacing': 'error',
  'no-array-constructor': 'error',
  'no-duplicate-imports': 'error',
  'no-implied-eval': 'error',
  'no-throw-literal': 'error',
  'no-unused-vars': ['error', {args: 'none'}],
  // There is a lot of existing code that intentionally declares functions below their use.
  // Hopefully that code will be updated, but until then this is set to warn to keep CI tests from
  // failing.
  'no-use-before-define': 'warn',
  'object-curly-spacing': 'error',
  'quotes': ['error', 'single', {avoidEscape: true}],
  'semi': 'error',
  'space-before-function-paren':
      ['error', {anonymous: 'always', asyncArrow: 'always', named: 'never'}],
  'space-infix-ops': 'error',
};

module.exports = {
  plugins: [
    'eslint-comments',
    'import',
    'prefer-arrow',
    'promise',
    'you-dont-need-lodash-underscore',
  ],
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:promise/recommended',
    'plugin:you-dont-need-lodash-underscore/compatible',
  ],
  env: {
    es2017: true,
  },
  parserOptions: {
    // plugin:import/recommended sets sourceType to module. Change it back to script because most
    // Etherpad core and plugin code is still CommonJS. The node plugin will change it to module if
    // package.json sets type to module.
    sourceType: 'script',
  },
  rules: {
    ...sharedEsTsRules,
    'array-bracket-newline': ['error', 'consistent'],
    'array-bracket-spacing': 'error',
    'array-element-newline': ['error', 'consistent'],
    'arrow-body-style': 'error',
    'arrow-parens': 'error',
    'arrow-spacing': 'error',
    'block-spacing': 'error',
    'camelcase': ['warn', {allow: ['^ace_', '^eejsBlock_', '(?:^|_)ep_', '^handleClientMessage_']}],
    'comma-style': 'error',
    'computed-property-spacing': 'error',
    'curly': ['error', 'multi-line', 'consistent'],
    'dot-location': ['error', 'property'],
    'eol-last': 'error',
    'eqeqeq': ['error', 'always', {null: 'never'}],
    // These are `plugin:eslint-comments/recommended`, inlined. The upstream config can't be used
    // directly: `eslint-plugin-eslint-comments` is unmaintained and blows up on ESLint 10, so this
    // package depends on the maintained `@eslint-community` fork aliased back to the original
    // package name. That keeps the rule namespace `eslint-comments/` (and therefore every
    // `eslint-disable eslint-comments/...` comment in the ~80 plugin repos) working, but the
    // fork's own `recommended` config hard-codes the `@eslint-community/eslint-comments/`
    // namespace, so it has to be spelled out here instead of extended.
    'eslint-comments/disable-enable-pair': 'error',
    'eslint-comments/no-aggregating-enable': 'error',
    'eslint-comments/no-duplicate-disable': 'error',
    'eslint-comments/no-unlimited-disable': 'error',
    'eslint-comments/no-unused-enable': 'error',
    'guard-for-in': 'error',
    'implicit-arrow-linebreak': 'error',
    'key-spacing': 'error',
    'linebreak-style': 'error',
    'max-len': ['error', {
      code: 100,
      ignorePattern: '\\s*/[/*] eslint-',
      ignoreUrls: true,
      tabWidth: 2,
    }],
    'new-cap': ['error', {
      capIsNewExceptions: [
        // ERR is an async-stacktrace convention. Remove this exception after modernizing code to
        // use async and await.
        'ERR',
      ],
    }],
    'new-parens': 'error',
    'no-caller': 'error',
    'no-constant-condition': ['error', {checkLoops: false}],
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-implicit-globals': 'error',
    'no-lonely-if': 'error',
    'no-multi-spaces': 'error',
    'no-multi-str': 'error',
    'no-multiple-empty-lines': ['error', {max: 2, maxBOF: 0, maxEOF: 0}],
    'no-new-object': 'error',
    'no-new-wrappers': 'error',
    'no-prototype-builtins': 'error',
    'no-script-url': 'error',
    'no-sequences': 'error',
    'no-tabs': 'error',
    'no-trailing-spaces': 'error',
    'no-var': 'error',
    'no-whitespace-before-property': 'error',
    'nonblock-statement-body-position': 'error',
    'object-curly-newline': 'error',
    'object-shorthand': 'error',
    'one-var': ['error', {initialized: 'never'}],
    'one-var-declaration-per-line': ['error', 'initializations'],
    'operator-assignment': 'error',
    'operator-linebreak': 'error',
    'padded-blocks': ['error', 'never'],
    'prefer-arrow-callback': 'error',
    'prefer-arrow/prefer-arrow-functions': 'error',
    'prefer-const': 'error',
    'prefer-exponentiation-operator': 'error',
    'prefer-promise-reject-errors': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    // This rule is largely unnecessary thanks to the `await` keyword (`.then()` should be rare).
    // Also, being forced to add a return statement for a valueless Promise is annoying.
    'promise/always-return': 'off',
    // This rule is largely unnecessary because most browsers now log unhandled Promise rejections.
    'promise/catch-or-return': 'off',
    // Too many false positives. The docs for this rule say to use nodify, but in the following
    // example nodeify and util.callbackify() don't work because the `next` callback should not
    // always be called:
    //     app.use((req, res, next) => { asyncMiddleware(req, res, next).catch(next); });
    // This rule does catch legitimate issues, but as code is modernized with `async` and `await`,
    // this rule will become less relevant.
    'promise/no-callback-in-promise': 'off',
    // Too many false positives. In particular, there is no good way to process in parallel values
    // that were obtained asynchronously unless nested .then() calls are used. Example:
    //     asyncGetItems().then((items) => Promise.all(
    //         items.map((item) => asyncProcessItem(item).then(asyncConveyResults))));
    // The nested .then() in the above example can be avoided by changing the logic like this:
    //     asyncGetItems()
    //         .then((items) => Promise.all(items.map(asyncProcessItem)))
    //         .then((results) => Promise.all(results.map(asyncConveyResults)));
    // but there are problems with the logic change:
    //   * No result will be conveyed if any of the processing calls fail.
    //   * No result will be conveyed until all items are done being processed.
    // The proper way to address nested .then() calls is to use await instead of .then(), but that
    // should be the topic of a different ESLint rule. This rule does catch legitimate issues, but
    // as code is modernized with `async` and `await`, this rule will become less relevant.
    'promise/no-nesting': 'off',
    'quote-props': ['error', 'consistent-as-needed'],
    'rest-spread-spacing': 'error',
    'semi-spacing': 'error',
    'semi-style': 'error',
    'space-before-blocks': 'error',
    'space-in-parens': 'error',
    'space-unary-ops': ['error', {words: true, nonwords: false}],
    'spaced-comment': 'error',
    'strict': ['error', 'global'],
    'switch-colon-spacing': 'error',
    'template-curly-spacing': 'error',
    'template-tag-spacing': 'error',
  },
  overrides: [
    {
      files: tsExts.map((p) => [`*${p}`, `.*${p}`]).flat(),
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/typescript',
      ],
      rules: {
        // Turn the core rule off only where @typescript-eslint has a TypeScript-aware replacement.
        ...Object.fromEntries([
          ...tsExtensionRules,
          ...Object.keys(tsRenamedExtensionRules),
        ].map((k) => [k, 'off'])),
        ...Object.fromEntries(
            tsExtensionRules.map((k) => [`@typescript-eslint/${k}`, sharedEsTsRules[k]])),
        ...Object.fromEntries(Object.entries(tsRenamedExtensionRules).map(
            ([k, v]) => [`@typescript-eslint/${v}`, sharedEsTsRules[k]])),
        'indent': [...sharedEsTsRules.indent.slice(0, -1), {
          ...sharedEsTsRules.indent.slice(-1)[0],
          // https://github.com/typescript-eslint/typescript-eslint/issues/1824
          ignoredNodes: [
            'TSTypeAliasDeclaration *',
            'TSTypeParameterInstantiation',
          ],
        }],
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/require-await': 'off',
      },
      settings: {
        'import/parsers': {
          '@typescript-eslint/parser': tsExts,
        },
        'import/resolver': {
          typescript: {
            alwaysTryTypes: true,
          },
        },
      },
    },
  ],
};
