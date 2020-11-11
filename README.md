# Etherpad ESLint Shareable Config

This package contains an [ESLint](https://eslint.org/) [shareable
config](https://eslint.org/docs/developer-guide/shareable-configs) that is used
by [Etherpad](https://etherpad.org/) and Etherpad plugins in the
https://github.com/ether namespace. You are encouraged to use it for your own
Etherpad plugins so that your code stays consistent with the Etherpad codebase.

## Usage in an Etherpad Plugin

Your plugin is assumed to have the following structure:

* `*.js` files under `static/js` and `static/tests/frontend`, except for any
  `.eslintrc.js` files, are used in the browser.
* All other `*.js` files are used in Node.js.

Install the shareable config:

```shell
npm install --save-dev eslint eslint-config-etherpad
```

Use the shareable config in your `package.json`:

```json
{
  "eslintConfig": {
    "root": true,
    "extends": "etherpad/plugin"
  },
  "scripts": {
    "lint": "eslint ."
  }
}
```

The `scripts` definition is optional. With it you can run `npm run lint` to
check the code.

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
