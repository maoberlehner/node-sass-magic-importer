# node-sass-package-importer

[![Patreon](https://img.shields.io/badge/patreon-donate-blue.svg)](https://www.patreon.com/maoberlehner)
[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://paypal.me/maoberlehner)
[![Build Status](https://travis-ci.org/maoberlehner/node-sass-magic-importer.svg?branch=master)](https://travis-ci.org/maoberlehner/node-sass-magic-importer)
[![Coverage Status](https://coveralls.io/repos/github/maoberlehner/node-sass-magic-importer/badge.svg?branch=master)](https://coveralls.io/github/maoberlehner/node-sass-magic-importer?branch=master)
[![GitHub stars](https://img.shields.io/github/stars/maoberlehner/node-sass-magic-importer.svg?style=social&label=Star)](https://github.com/maoberlehner/node-sass-magic-importer)

Custom importer for node-sass to import packages from the `node_modules` directory.

## Usage

In modern day web development, packages are everywhere. There is no way around [npm](https://www.npmjs.com/) if you are a JavaScript developer. More and more CSS and SASS projects move to npm but it can be annoying to find a convenient way of including them into your project. Package importing makes this a little easier.

```js
const sass = require('node-sass');
const packageImporter = require('node-sass-package-importer');

sass.render({
  ...
  importer: packageImporter()
  ...
});
```

```scss
// Import the file that is specified in the `package.json` file of the module.
// In the case of bootstrap, the following file is loaded:
// https://github.com/twbs/bootstrap/blob/v4-dev/scss/bootstrap.scss
@import '~bootstrap';
```

```scss
// Import only specific files:
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/border-radius';
@import '~bootstrap/scss/mixins/alert';
@import '~bootstrap/scss/alert';
```

The "~" is mandatory and marks the import path as module.

### Path resolving

If only the module name is given (e.g. `@import '~bootstrap'`) the importer looks in the `package.json` file of the module for the following keys: "sass", "scss", "style", "css", "main.sass", "main.scss", "main.style", "main.css" and "main". The first key that is found is used for resolving the path and importing the file into your sass code.

To load only a certain file from a module you can specify the file in the import url (e.g. `@import '~bootstrap/scss/_alert.scss'`). This module also supports partial file name resolving so you can import files by only specifying their base name without prefix and extension (e.g. `@import '~bootstrap/scss/alert'`). Sadly bootstrap and most other frameworks do not load their dependencies directly in the concerned files. So you have to load all dependencies of a file manually like in the example above. I recommend you to do better and to import dependencies directly in the files that are using them.

### Options

In the example below you can see the default configuration options.

- `cwd`: Defines the path in which your `node_modules` directory is found.
- `packageKeys`: You can define the `package.json` keys to search for and in which order.
- `packagePrefix`: You can set the special character for indicating a module resolution.

```js
const sass = require('node-sass');
const packageImporter = require('node-sass-package-importer');

const options = {
  cwd: process.cwd(),
  packageKeys: [
    'sass',
    'scss',
    'style',
    'css',
    'main.sass',
    'main.scss',
    'main.style',
    'main.css',
    'main'
  ],
  packagePrefix: '~'
};

sass.render({
  ...
  importer: packageImporter(options)
  ...
});
```

### CLI

```bash
node-sass --importer node_modules/node-sass-package-importer/dist/cli.js -o dist src/index.scss
```

## Upgrade from 3.x.x to 5.x.x

- The `prefix` option was renamed to `packagePrefix`.

## Why is there no 4.x version?

This module is maintained in [one repository](https://github.com/maoberlehner/node-sass-magic-importer) together with multiple other node-sass custom importers. The node-sass-magic-importer repository is using a [monorepo approach](https://medium.com/@maoberlehner/monorepos-in-the-wild-33c6eb246cb9) with fixed versions for all packages. The projects maintained in the node-sass-magic-importer monorepo started out as separate repositories with separate versioning, so when they were integrated into the monorepo, the versions of all projects were raised to 5.0.0 and are in sync since then.

## node-sass-magic-importer

This module is powered by [node-sass-magic-importer](https://github.com/maoberlehner/node-sass-magic-importer).

## About

### Author

Markus Oberlehner  
Website: https://markus.oberlehner.net  
Twitter: https://twitter.com/MaOberlehner  
PayPal.me: https://paypal.me/maoberlehner  
Patreon: https://www.patreon.com/maoberlehner

### License

MIT
