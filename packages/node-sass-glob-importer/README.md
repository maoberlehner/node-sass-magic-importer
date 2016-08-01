# node-sass-glob-importer
Custom node-sass importer to allow you to use glob syntax in imports.

Globbing allows pattern matching operators to be used to match multiple files at once.

```scss
// Import all files inside the `scss` directory and subdirectories.
@import: 'scss/**/*.scss';
```

## Usage
```node
const sass = require('node-sass');
const glopImporter = require('node-sass-glob-importer');

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

## About
### Author
Markus Oberlehner  
Twitter: https://twitter.com/MaOberlehner

### License
MIT
