# node-sass-glob-importer
[![Build Status](https://travis-ci.org/maoberlehner/node-sass-glob-importer.svg?branch=master)](https://travis-ci.org/maoberlehner/node-sass-glob-importer)

Custom node-sass importer to allow you to use glob syntax in imports.

Globbing allows pattern matching operators to be used to match multiple files at once.

```scss
// Import all files inside the `scss` directory and subdirectories.
@import: 'scss/**/*.scss';
```

## Usage
```node
var sass = require('node-sass');
var glopImporter = require('node-sass-glob-importer');

sass.render({
  ...
  importer: glopImporter()
  ...
});
```

### Options
```node
sass.render({
  ...
  importer: globImporter({
    includePaths: [process.cwd()]
  })
  ...
});
```

### CLI
```bash
node-sass --importer node_modules/node-sass-glob-importer/dist/cli.js -o dist src/index.scss
```

## Upgrade from 2.x.x to 3.x.x
Version 3.x.x does not return a node-sass custom importer function directly. Instead a function which can take a optional parameter for configuration is returned. When the function is executed, it returns a node-sass custom importer function.

```node
sass.render({
  ...
  // Old
  importer: globImporter
  // New
  importer: globImporter()
  ...
});
```

If you want to use the `node-sass-glob-importer` in combination with the node-sass CLI, you now have to specify the path to the `node-sass-glob-importer` CLI script.

```bash
# Old
node-sass --importer node_modules/node-sass-glob-importer -o dist src/index.scss
# New
node-sass --importer node_modules/node-sass-glob-importer/dist/cli.js -o dist src/index.scss
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
