# node-sass-filter-importer

[![Patreon](https://img.shields.io/badge/patreon-donate-blue.svg)](https://www.patreon.com/maoberlehner)
[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://paypal.me/maoberlehner)
[![Build Status](https://travis-ci.org/maoberlehner/node-sass-magic-importer.svg?branch=master)](https://travis-ci.org/maoberlehner/node-sass-magic-importer)
[![Coverage Status](https://coveralls.io/repos/github/maoberlehner/node-sass-magic-importer/badge.svg?branch=master)](https://coveralls.io/github/maoberlehner/node-sass-magic-importer?branch=master)
[![GitHub stars](https://img.shields.io/github/stars/maoberlehner/node-sass-magic-importer.svg?style=social&label=Star)](https://github.com/maoberlehner/node-sass-magic-importer)

Filter certain elements from SCSS code.

## Usage

```js
const sass = require('node-sass');
const filterImporter = require('node-sass-filter-importer');

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
- **make-your-own**: Define custom filters

### Options

In the example below you can see the default configuration options.

- `customFilters`: Define custom node filters.

```js
const sass = require('node-sass');
const filterImporter = require('node-sass-filter-importer');

const options = {
  customFilters: {
    // Add a node filter for a specific min-width media query.
    customMediaWidth: [
      [
        { property: 'type', value: 'atrule' },
        { property: 'name', value: 'media' },
        { property: 'params', value:'(min-width: 42em)' }
      ]
    ],
    // Add a node filter for print media queries.
    customMediaPrint: [
      [
        { property: 'type', value: 'atrule' },
        { property: 'name', value: 'media' },
        { property: 'params', value: 'print' }
      ]
    ]
  }
};

sass.render({
  ...
  importer: filterImporter(options)
  ...
});
```

```scss
// Sass file which implements filter importing.
@import '[custom-media-width, custom-media-print] from file/with/at/rules';
```

```scss
// file/with/at/_rules.scss
@media (min-width: 42em) {
  .custom-1-mq {
    content: 'Custom 1 mq';
  }
}

@media (min-width: 43em) {
  .custom-2-mq {
    content: 'Custom 1 mq';
  }
}

@media print {
  .custom-print-mq {
    content: 'Custom print mq';
  }
}
```

```scss
// CSS output – the `min-width: 43em` media query gets not imported.
@media (min-width: 42em) {
  .custom-1-mq {
    content: 'Custom 1 mq';
  }
}

@media print {
  .custom-print-mq {
    content: 'Custom print mq';
  }
}
```

### webpack

```js
// webpack.config.js
const filterImporter = require('node-sass-filter-importer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract([
          {
            loader: 'css-loader'
          }, {
            loader: 'sass-loader',
            options: {
              importer: filterImporter()
            }
          }
        ])
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'style.css'
    })
  ]
}
```

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

### Multi level filtering

Filtering goes only one level deep. This means, if you're importing a file with filtering which is importing other files, those files are not filtered but imported as is. On a technical level, there is no good solution for this problem. One possibility would be to just pass the filters to all imports in the line but this carries the risk of filtering nodes on which one of the imported files might depend and therefore break the import. I might add this as an optional feature (which can be activated on demand) in the future – let me know if you're interested in multi level filter imports.

## About

### Author

Markus Oberlehner  
Website: https://markus.oberlehner.net  
Twitter: https://twitter.com/MaOberlehner  
PayPal.me: https://paypal.me/maoberlehner  
Patreon: https://www.patreon.com/maoberlehner

### License

MIT
