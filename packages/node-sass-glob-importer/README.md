# node-sass-glob-importer
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
  importer: glopImporter
  ...
});
```

### CLI
```bash
node-sass --importer node_modules/node-sass-glob-importer -o dist src/index.scss
```

## node-sass-magic-importer
This module is part of the [node-sass-magic-importer](https://github.com/maoberlehner/node-sass-magic-importer) module.

## About
### Author
Markus Oberlehner  
Twitter: https://twitter.com/MaOberlehner

### License
MIT
