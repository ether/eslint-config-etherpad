# Etherpad ESLint Shareable Config

This package contains an [ESLint](https://eslint.org/) [shareable
config](https://eslint.org/docs/developer-guide/shareable-configs) that is used
by [Etherpad](https://etherpad.org/) and Etherpad plugins in the
https://github.com/ether namespace. You are encouraged to use it for your own
Etherpad plugins so that your code stays consistent with the Etherpad codebase.

## ESLint 8 or ESLint 9/10?

This package ships the same rule set in both config formats:

* **eslintrc** (`.eslintrc.cjs`) — for ESLint 8. Entry points are `etherpad`,
  `etherpad/node`, `etherpad/plugin`, etc. (see below).
* **flat config** (`eslint.config.js`) — for ESLint 9 and 10. Entry points are
  the same names under `eslint-config-etherpad/flat/`, e.g.
  `eslint-config-etherpad/flat/plugin`.

The flat entry points are generated from the eslintrc ones at load time with
[`FlatCompat`](https://eslint.org/docs/latest/use/configure/migration-guide), so
there is exactly one copy of the rules and the two formats cannot drift apart.

## Available Configs

* **`etherpad`**: Base config containing settings that are common to all files.
* **`etherpad/node`**: Extends `etherpad` for code that runs in Node.js.
* **`etherpad/browser`**: Extends `etherpad` for code that runs in the browser.
* **`etherpad/tests`**: Extends `etherpad` for test code.
* **`etherpad/tests/backend`**: Extends `etherpad/node` and `etherpad/tests` for
  backend test code.
* **`etherpad/tests/cypress`**: Extends `etherpad/node` and `etherpad/tests` for
  [Cypress](https://www.cypress.io/) test code.
* **`etherpad/tests/frontend`**: Extends `etherpad/browser` and `etherpad/tests`
  for frontend test code.
* **`etherpad/plugin`**: Applies the above configs to the appropriate files.
  Assumes the plugin follows the [typical file
  layout](https://etherpad.org/doc/latest/#index_folder_structure).

Each of the names above also exists as a flat config under `flat/`:
`eslint-config-etherpad/flat`, `eslint-config-etherpad/flat/node`,
`eslint-config-etherpad/flat/browser`, `eslint-config-etherpad/flat/tests`,
`eslint-config-etherpad/flat/tests/backend`,
`eslint-config-etherpad/flat/tests/cypress`,
`eslint-config-etherpad/flat/tests/frontend` and
`eslint-config-etherpad/flat/plugin`. Each one exports a flat config array.
There is a parallel set under `flat/ts/` (`eslint-config-etherpad/flat/ts/plugin`
and so on) that also lints TypeScript files; see step 4 below.

## Usage in an Etherpad Plugin (ESLint 9 or 10, flat config)

1.  Install the shareable config and its dependencies:

    ```shell
    npm install --save-dev eslint eslint-config-etherpad typescript
    ```

    `typescript` must satisfy `>=4.8.4 <6.1.0`; that is the range
    [`typescript-eslint` supports](https://typescript-eslint.io/users/dependency-versions/).
    TypeScript 7 is the native port and does not expose the compiler API that
    `typescript-eslint` needs, so it will not work.

2.  Create an `eslint.config.js` in your project's root directory:

    ```javascript
    'use strict';

    module.exports = require('eslint-config-etherpad/flat/plugin');
    ```

    or, if your package is ESM (`"type": "module"`), an `eslint.config.mjs`:

    ```javascript
    import etherpad from 'eslint-config-etherpad/flat/plugin';

    export default etherpad;
    ```

    No `@rushstack/eslint-patch` workaround is needed: flat config resolves
    plugins relative to the config that declares them.

3.  To add your own rules, spread the array:

    ```javascript
    module.exports = [
      ...require('eslint-config-etherpad/flat/plugin'),
      {
        files: ['static/js/shared/**/*'],
        rules: {'no-console': 'error'},
      },
    ];
    ```

4.  Like eslintrc, the flat configs only look at `.js`, `.cjs`, `.mjs` and
    `.jsx` files. To also lint TypeScript (the eslintrc equivalent of
    `eslint --ext .ts .`), use the matching entry point under `flat/ts/`:

    ```javascript
    module.exports = require('eslint-config-etherpad/flat/ts/plugin');
    ```

    The TypeScript rules include type-aware ones, so you must also tell the
    parser where your `tsconfig.json` is:

    ```javascript
    module.exports = [
      ...require('eslint-config-etherpad/flat/ts/plugin'),
      {
        files: ['**/*.ts', '**/*.cts', '**/*.mts', '**/*.tsx'],
        languageOptions: {parserOptions: {projectService: true}},
      },
    ];
    ```

## Usage in an Etherpad Plugin (ESLint 8, eslintrc)

1.  Install the shareable config and its dependencies:

    ```shell
    npm install --save-dev eslint eslint-config-etherpad typescript
    ```

2.  Create a `.eslintrc.cjs` in your project's root directory:

    ```javascript
    'use strict';

    // This is a workaround for https://github.com/eslint/eslint/issues/3458
    require('eslint-config-etherpad/patch/modern-module-resolution');

    module.exports = {
      root: true,
      extends: 'etherpad/plugin',
    };
    ```

3. If you `require('ep_etherpad-lite/*')` anywhere in your server-side code, add
   a peer dependency to your `package.json` so that the `n` ESLint plugin (for
   Node.js) won't complain about unavailable modules:

   ```json
      "peerDependencies": {
        "ep_etherpad-lite": ">=1.8.6"
      },
   ```

   Adding an entry to `peerDependencies` does not cause `npm install` to install
   that peer dependency; you must manually install it yourself:

   ```shell
   npm install --no-save ep_etherpad-lite@file:/path/to/etherpad-lite/src
   ```

   The above command creates a symlink at `node_modules/ep_etherpad-lite` that
   points to `/path/to/etherpad-lite/src`. Unfortunately, `npm` automatically
   deletes that symlink whenever you run `npm install` to install, add, or
   update a regular dependency, so remember to re-run the above command each
   time you run `npm install`.

4. *Optional but recommended:* Define a `lint` script in your `package.json` so
   that you can run `npm run lint` to check the code:

    ```json
      "scripts": {
        "lint": "eslint ."
      },
    ```

5. *Optional but recommended:* Specify the minimum version of Node.js you
    support (ideally this would match [Etherpad's minimum required
    version](https://github.com/ether/etherpad-lite#requirements)) so that the
    `n` ESLint plugin (for Node.js) can warn you when you use incompatible
    features:

    ```json
      "engines": {
        "node": ">=12.17.0"
      },
    ```

6. Apply automatic fixes. If you added the optional `lint` script to
   `package.json`, you can run:

   ```shell
   npm run lint -- --fix
   ```

   Or you can run:

   ```shell
   npx eslint --fix .
   ```

## Overrides (eslintrc)

If you need to tune the configs, you can specify
[overrides](https://eslint.org/docs/user-guide/configuring#configuration-based-on-glob-patterns)
in your `.eslintrc.cjs`. For example:

```javascript
'use strict';

// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('eslint-config-etherpad/patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: 'etherpad/plugin',
  overrides: [
    {
      files: ['static/js/shared/**/*'],
      env: {
        shared-node-browser: true,
      },
      extends: 'etherpad/node',
    },
  ],
};
```

## Copyright and License

Copyright © 2020 Richard Hansen <rhansen@rhansen.org>

Licensed under the [Apache License, Version 2.0](LICENSE) (the "License"); you
may not use this file except in compliance with the License. You may obtain a
copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
