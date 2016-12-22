# node-sass-package-importer
[![Build Status](https://travis-ci.org/maoberlehner/node-sass-package-importer.svg?branch=master)](https://travis-ci.org/maoberlehner/node-sass-package-importer)

Custom importer for node-sass to import packages from the `node_modules` directory.

## Usage
In modern day web development, packages are everywhere. There is no way around [npm](https://www.npmjs.com/) if you are a JavaScript developer. More and more CSS and SASS projects move to npm but it can be annoying to find a convenient way of including them into your project. Package importing makes this a little easier.

```node
var sass = require('node-sass');
var packageImporter = require('node-sass-package-importer');

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
- `extensions`: Set which file extensions should get resolved.
- `packageKeys`: You can define the `package.json` keys to search for and in which order.
- `prefix`: You can set the special character for indicating a module resolution.

```node
var sass = require('node-sass');
var packageImporter = require('node-sass-package-importer');

var options = {
  cwd: process.cwd(),
  extensions: [
    '.scss',
    '.sass'
  ],
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
  prefix: '~'
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

## Upgrade from 2.x.x to 3.x.x
Version 3.x.x does not return a node-sass custom importer function directly. Instead a function which can take a optional parameter for configuration is returned. When the function is executed, it returns a node-sass custom importer function.

```node
sass.render({
  ...
  // Old
  importer: packageImporter
  // New
  importer: packageImporter()
  ...
});
```

If you want to use the `node-sass-package-importer` in combination with the node-sass CLI, you now have to specify the path to the `node-sass-package-importer` CLI script.

```bash
# Old
node-sass --importer node_modules/node-sass-package-importer -o dist src/index.scss
# New
node-sass --importer node_modules/node-sass-package-importer/dist/cli.js -o dist src/index.scss
```

## node-sass-magic-importer
This module is part of the [node-sass-magic-importer](https://github.com/maoberlehner/node-sass-magic-importer) module.

## About
### Author
Markus Oberlehner  
Twitter: https://twitter.com/MaOberlehner  
PayPal.me: https://paypal.me/maoberlehner

### License
MIT
