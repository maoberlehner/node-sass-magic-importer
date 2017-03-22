# node-sass-magic-importer
[![Build Status](https://travis-ci.org/maoberlehner/node-sass-magic-importer.svg?branch=master)](https://travis-ci.org/maoberlehner/node-sass-magic-importer)

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

**You may notice that source map support is limited for styles which are imported with selector or node filtering. If you have an idea how to fix this, please feel free to create a new issue or pull request.**

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
```node
var sass = require('node-sass');
var magicImporter = require('node-sass-magic-importer');

sass.render({
  ...
  importer: magicImporter()
  ...
});
```

### Options
```node
var sass = require('node-sass');
var magicImporter = require('node-sass-magic-importer');

var options = {
  // Defines the path in which your node_modules directory is found.
  cwd: process.cwd(),
  // Paths in which to search for imported files.
  includePaths: [process.cwd()],
  // Allowed extensions.
  extensions: [
    '.scss',
    '.sass'
  ],
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
  prefix: '~',
  // Disable console warnings.
  disableWarnings: false,
  // Disable importing files only once.
  disableImportOnce: false
};

sass.render({
  ...
  importer: magicImporter(options)
  ...
});
```

### Gulp
```node
var gulp = require('gulp');
var sass = require('gulp-sass');
var magicImporter = require('node-sass-magic-importer');

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

## Upgrade from 3.x.x to 4.x.x
No changes have to be made.

## Upgrade from 2.x.x to 3.x.x
Version 3.x.x changes the way how nested CSS selectors are imported. Up until version 2.x.x you had to specify all nested selectors if you wanted to import them. With version 3.x.x nested selectors are imported automatically if you import the parent selector.

```scss
// File: styles.scss
.selector {
  .nested-selector { }
  .other-nested-selector { }
}

// New way of importing .selector and all it's child selectors:
@import '{ .selector } from styles.scss';

// Old way:
@import '{ .selector, .nested-selector, .other-nested-selector } from styles.scss';
```

It is not possible anymore to import only certain nested selectors. If this is a major concern in your daily work feel free to create a new issue or pull request and I may think about making this configurable.

## About
### Author
Markus Oberlehner  
Website: https://markus.oberlehner.net  
Twitter: https://twitter.com/MaOberlehner  
PayPal.me: https://paypal.me/maoberlehner

### License
MIT
