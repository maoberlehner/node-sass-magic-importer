# node-sass-magic-importer
[![Build Status](https://travis-ci.org/maoberlehner/node-sass-magic-importer.svg?branch=master)](https://travis-ci.org/maoberlehner/node-sass-magic-importer)
[![Coverage Status](https://coveralls.io/repos/github/maoberlehner/node-sass-magic-importer/badge.svg?branch=master)](https://coveralls.io/github/maoberlehner/node-sass-magic-importer?branch=master)
[![GitHub stars](https://img.shields.io/github/stars/maoberlehner/node-sass-magic-importer.svg?style=social&label=Star)](https://github.com/maoberlehner/node-sass-magic-importer)

Custom node-sass importer for selector specific imports, node importing, module importing, globbing support and importing files only once.

## Install
```bash
npm install node-sass-magic-importer --save-dev
```

## Features
This importer enables several comfort functions for importing SASS files more easily.
- [Selector filtering](#selector-filtering): import only specific selectors from a file.  
  (Uses the [node-sass-selector-importer](https://github.com/maoberlehner/node-sass-selector-importer) module.)
- [Node filtering](#node-filtering): import only specific nodes from a file.  
  (Uses the [node-sass-filter-importer](https://github.com/maoberlehner/node-sass-filter-importer) module.)
- [Module importing](#module-importing): import modules from `node_modules` without specifying the full path.  
  (Uses the [node-sass-package-importer](https://github.com/maoberlehner/node-sass-package-importer) module.)
- [Globbing](#globbing): use globbing (e.g. `@import: 'scss/**/*.scss'`) to import multiple files at once.  
  (Uses the [node-sass-glob-importer](https://github.com/maoberlehner/node-sass-glob-importer) module.)

By default every file is only imported once even if you `@import` the same file multiple times in your code (except if you are using filters).

### Selector filtering
With selector filtering, it is possible to import only certain CSS selectors form a file. This is especially useful if you want to import only a few CSS classes from a huge library or framework.

```scss
// Example:
@import '{ .btn, .btn-alert } from style.scss';
```
```scss
// Result:
.btn { }
.btn-alert { }
```

#### Transform imported selectors
```scss
// Example:
@import '{ .btn as .button, .btn-alert as .button--alert } from style.scss';
```
```scss
// Result:
.button { }
.button--alert { } // Transformed to match BEM syntax.
```

#### RegEx
```scss
// Example:
@import '{ /^\..+-alert/ } from style.scss';
```
```scss
// Result:
.box-alert { }
.btn-alert { }
```

```scss
// Example:
@import '{ /^\.btn(.*)/ as .button$1 } from style.scss';
```
```scss
// Result:
.button { }
.button-alert { }
```

#### Usage with Bootstrap
Bootstrap is a mighty and robust framework but most of the time you use only certain parts of it. There is the possibility to [customize](http://getbootstrap.com/customize/) Bootstrap to your needs but this can be annoying and you still end up with more code than you need. Also you might want to use just some specific parts of Bootstrap but your project uses the BEM syntax for writing class names.

```scss
// This example uses the v4 dev version of the Bootstrap `alert` component:
// https://github.com/twbs/bootstrap/blob/v4-dev/scss/_alert.scss
@import 'bootstrap/scss/variables';
@import 'bootstrap/scss/mixins/border-radius';
@import 'bootstrap/scss/mixins/alert';
@import '{
  .alert,
  .alert-dismissible as .alert--dismissible,
  .close as .alert__close
} from bootstrap/scss/alert';
```
```scss
// Result:
.alert {
  padding: 15px;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}

.alert--dismissible {
  padding-right: 35px;
}

.alert--dismissible .alert__close {
  position: relative;
  top: -2px;
  right: -21px;
  color: inherit;
}
```

### Node filtering
Filter certain elements from SCSS code.

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

#### Filters
- **at-rules**: `@media`, `@supports`, `@mixin`,...
- **functions**: `@function`
- **mixins**: `@mixin`
- **rules**: `.class-selector`, `#id-selector`,...
- **silent**: Extract only nodes that do not compile to CSS code (mixins, placeholder selectors, variables,...)
- **variables**: `$variable`
- **make-your-own**: Define custom filters

### Module importing
In modern day web development, modules and packages are everywhere. There is no way around [npm](https://www.npmjs.com/) if you are a JavaScript developer. More and more CSS and SASS projects move to npm but it can be annoying to find a convenient way of including them into your project. Module importing makes this a little easier.

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

#### Path resolving
If only the module name is given (e.g. `@import '~bootstrap'`) the importer looks in the `package.json` file of the module for the following keys: "sass", "scss", "style", "css", "main.sass", "main.scss", "main.style", "main.css" and "main". The first key that is found is used for resolving the path and importing the file into your sass code.

To load only a certain file from a module you can specify the file in the import url (e.g. `@import '~bootstrap/scss/_alert.scss'`). The `node-sass-magic-importer` also supports partial file name resolving so you can import files by only specifying their base name without prefix and extension (e.g. `@import '~bootstrap/scss/alert'`). Sadly bootstrap and most other frameworks do not load their dependencies directly in the concerned files. So you have to load all dependencies of a file manually like in the example above. I recommend you to do better and to import dependencies directly in the files that are using them.

### Globbing
Globbing allows pattern matching operators to be used to match multiple files at once.

```scss
// Import all files inside the `scss` directory and subdirectories.
@import: 'scss/**/*.scss';
```

## Usage
```js
var sass = require('node-sass');
var magicImporter = require('node-sass-magic-importer');

sass.render({
  ...
  importer: magicImporter()
  ...
});
```

### Options
```js
const sass = require('node-sass');
const magicImporter = require('node-sass-magic-importer');

const options = {
  // Defines the path in which your node_modules directory is found.
  cwd: process.cwd(),
  // Define the package.json keys and in which order to search for them.
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
  // You can set the special character for indicating a module resolution.
  packagePrefix: '~',
  // Disable console warnings.
  disableWarnings: false,
  // Disable importing files only once.
  disableImportOnce: false,
  // Add custom node filters.
  customFilters: undefined
};

sass.render({
  ...
  importer: magicImporter(options)
  ...
});
```

#### Custom filters
```js
const sass = require('node-sass');
const magicImporter = require('node-sass-magic-importer');

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
  importer: magicImporter(options)
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
const magicImporter = require('node-sass-magic-importer');
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
              importer: magicImporter()
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

### Gulp
```js
const gulp = require('gulp');
const sass = require('gulp-sass');
const magicImporter = require('node-sass-magic-importer');

gulp.task('sass', function () {
  return gulp.src('./**/*.scss')
    .pipe(sass({ importer: magicImporter() }).on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});
```

### CLI
```bash
node-sass --importer node_modules/node-sass-magic-importer/dist/cli.js -o dist src/index.scss
```

## Upgrade from 4.x.x to 5.x.x
- It is not possible anymore to set the `includePaths` option when initializing the importer. Use the [node-sass includePaths option](https://github.com/sass/node-sass#includepaths) instead.
- The `prefix` option was renamed to `packagePrefix`.

## Known issues
### Multi level filtering
Node filtering and selector filtering goes only one level deep. This means, if you're importing a file with selector or node filtering which is importing other files, those files are not filtered but imported as is. On a technical level, there is no good solution for this problem. One possibility would be to just pass the filters to all imports in the line but this carries the risk of filtering selectors or nodes on which one of the imported files might depend and therefore break the import. I might add this as an optional feature (which can be activated on demand) in the future – let me know if you're interested in multi level filter imports.

## About
### Author
Markus Oberlehner  
Website: https://markus.oberlehner.net  
Twitter: https://twitter.com/MaOberlehner  
PayPal.me: https://paypal.me/maoberlehner

### License
MIT
