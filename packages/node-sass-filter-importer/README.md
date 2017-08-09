# node-sass-filter-importer
[![Build Status](https://travis-ci.org/maoberlehner/node-sass-magic-importer.svg?branch=master)](https://travis-ci.org/maoberlehner/node-sass-magic-importer)
[![GitHub stars](https://img.shields.io/github/stars/maoberlehner/node-sass-magic-importer.svg?style=social&label=Star)](https://github.com/maoberlehner/node-sass-magic-importer)

Filter certain elements from SCSS code.

## Usage
```js
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

## Upgrade from 1.x.x to 5.x.x
It is not possible anymore to set the `includePaths` option when initializing the importer. Use the [node-sass includePaths option](https://github.com/sass/node-sass#includepaths) instead.

## Why is there no 2.x, 3.x or 4.x version?
This module is maintained in [one repository](https://github.com/maoberlehner/node-sass-magic-importer) together with multiple other node-sass custom importers. The node-sass-magic-importer repository is using a [monorepo approach](https://medium.com/@maoberlehner/monorepos-in-the-wild-33c6eb246cb9) with fixed versions for all packages. The projects maintained in the node-sass-magic-importer monorepo started out as separate repositories with separate versioning, so when they were integrated into the monorepo, the versions of all projects were raised to 5.0.0 and are in sync since then.

## node-sass-magic-importer
This module is powered by [node-sass-magic-importer](https://github.com/maoberlehner/node-sass-magic-importer).

## Known issues
Filtering goes only one level deep. This means, if you're importing a file with filtering which is importing other files, those files are not filtered but imported as is. On a technical level, there is no good solution for this problem. One possibility would be to just pass the filters to all imports in the line but this carries the risk of filtering nodes on which one of the imported files might depend and therefore break the import. I might add this as an optional feature (which can be activated on demand) in the future – let me know if you're interested in multi level filter imports.

## About
### Author
Markus Oberlehner  
Website: https://markus.oberlehner.net  
Twitter: https://twitter.com/MaOberlehner  
PayPal.me: https://paypal.me/maoberlehner

### License
MIT
