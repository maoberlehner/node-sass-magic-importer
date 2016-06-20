# node-sass-magic-importer
Custom node-sass importer for selector specific imports, module importing,
globbing support, import files only once and importing of files with `.css`
extension.

**WARNING: This is a 0.1.x release, there may be bugs and unexpected behavior.
Use at your own risk and please report bugs if you find one.**

## Features
This importer enables several comfort functions for importing SASS files more
easily.
- [Selector filtering](#selector-filtering): import only specific selectors
  from a file.
- [Module importing](#module-importing): import modules from `node_modules`
  without specifying the full path.
- [Globbing](#globbing): use globbing (e.g. `@import: 'scss/**/*.scss'`) to
  import multiple files at once.

By default every file is only imported once even if you `@import` the same file
multiple times in your code but you can [disable this behavior](#options).

### Selector filtering
With selector filtering, it is possible to import only certain CSS selectors
form a file. This is especially useful if you want to import only a few CSS
classes from a huge library or framework.

```scss
// Example:
@import '{ .btn, .btn-alert } from style.scss';
```
```scss
// Result:
.btn { ... }
.btn-alert { ... }
```

#### Transform imported selectors
```scss
// Example:
@import '{ .btn as .button, .btn-alert as .button--alert } from style.scss';
```
```scss
// Result:
.button { ... }
.button--alert { ... } // Transformed to match BEM syntax.
```

#### Usage with Bootstrap
Bootstrap is a mighty and robust framework but most of the time you use only
certain parts of it. There is the possibility to [customize](http://getbootstrap.com/customize/)
Bootstrap to your needs but this can be annoying and you still end up with more
code than you need. Also you might want to use just some specific parts of
Bootstrap but your project uses the BEM syntax for writing class names. Selector
filtering and transforming can help with that.

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

**You may notice that source map support is limited for styles which are
imported with selector filtering. If you have an idea how to fix this, please
feel free to create a new issue or pull request.**

### Module importing
In modern day web development, modules are everywhere. There is no way around
[npm](https://www.npmjs.com/) if you are a JavaScript developer. More and more
CSS and SASS projects move to npm but it can be annoying to find the correct
way of including them into your project. Module importing makes this a little
easier.

First the importer looks for a `sass` option in `package.json` if no value for
`sass` is provided, the `style` option is next in the line, if there is also no
`style` option, the importer checks if the `main` option provides a compatible
file. If all of this fails, the module is not compatible with this importer.

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

The "~" is optional, it is a hint for the importer and developers that this is a
module path.

### Globbing
Globbing allows pattern matching operators to be used to match multiple files at
once.

```scss
// Import all files inside the `scss` directory and subdirectories.
@import: 'scss/**/*.scss';
```

## Usage
```node
const sass = require('node-sass');
const magicImporter = require('node-sass-magic-importer');

sass.render({
  ...
  importer: magicImporter
  ...
});
```

### Options
```node
const sass = require('node-sass');
const magicImporter = require('node-sass-magic-importer');

sass.render({
  ...
  importer: magicImporter,
  magicImporter: {
    importOnce: true, // Import files only once.
    cssImport: true, // Import files with `.css` extension.
    extensions: ['.scss'] // Allowed extensions.
  }
  ...
});
```

### CLI
```bash
node-sass --importer node_modules/node-sass-magic-importer -o dist src/index.scss
```

## About
### Author
Markus Oberlehner  
Twitter: https://twitter.com/MaOberlehner

### License
MIT
