# node-sass-filter-importer
[![Build Status](https://travis-ci.org/maoberlehner/node-sass-filter-importer.svg?branch=master)](https://travis-ci.org/maoberlehner/node-sass-filter-importer)

Filter certain elements from SCSS code.

## Usage
```node
var sass = require('node-sass');
var filterImporter = require('node-sass-filter-importer');

sass.render({
  ...
  importer: filterImporter()
  ...
});
```
```scss
// Example:
@import '[variables, mixins] from style.scss';
```
```scss
// style.scss:
$variable1: 'value';
$variable2: 'value';
.selector { }
@mixin mixin() { }

// Result:
$variable1: 'value';
$variable2: 'value';
@mixin mixin() { }
```

### Filters
- **at-rules**: `@media`, `@supports`, `@mixin`,...
- **functions**: `@function`
- **mixins**: `@mixin`
- **rules**: `.class-selector`, `#id-selector`,...
- **silent**: Extract only nodes that do not compile to CSS code (mixins, placeholder selectors, variables,...)
- **variables**: `$variable`

### CLI
```bash
node-sass --importer node_modules/node-sass-filter-importer/dist/cli.js -o dist src/index.scss
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
