# Etherpad ESLint Shareable Config

This package contains an [ESLint](https://eslint.org/) [shareable
config](https://eslint.org/docs/developer-guide/shareable-configs) that is used
by [Etherpad](https://etherpad.org/) and Etherpad plugins in the
https://github.com/ether namespace. You are encouraged to use it for your own
Etherpad plugins so that your code stays consistent with the Etherpad codebase.

## Available Configs

* **`etherpad`**: Base config containing settings that are common to all files.
* **`etherpad/node`**: Extends `etherpad` for code that runs in Node.js.
* **`etherpad/browser`**: Extends `etherpad` for code that runs in the browser.
* **`etherpad/tests`**: Mixin that adds test-specific settings.
* **`etherpad/tests/backend`**: Extends `etherpad/tests` for backend test code.
* **`etherpad/tests/frontend`**: Extends `etherpad/tests` for frontend test
  code.
* **`etherpad/plugin`**: Applies `etherpad/node` to code that runs in Node.js,
  `etherpad/browser` to code that runs in the browser, and `etherpad/tests` to
  test code.

## Usage in an Etherpad Plugin

The files in the plugin are expected to follow the [typical
layout](https://etherpad.org/doc/latest/#index_folder_structure).

1.  Install the shareable config and its dependencies:

    ```shell
    npm install --save-dev eslint eslint-config-etherpad eslint-plugin-mocha
    ```

2.  Edit your `package.json` to use the shareable config:

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

    The `scripts` definition is optional but recommended. With it you can run
    `npm run lint` to check the code.

## Overrides

If you need to tune the configs, you can specify
[overrides](https://eslint.org/docs/user-guide/configuring#configuration-based-on-glob-patterns)
in your `package.json`. For example:

```json
{
  "eslintConfig": {
    "root": true,
    "extends": "etherpad/plugin",
    "overrides": [
      {
        "files": ["static/js/shared/**/*"],
        "env": {
          "shared-node-browser": true
        }
        "extends": "etherpad/node",
      }
    ]
  }
}
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
