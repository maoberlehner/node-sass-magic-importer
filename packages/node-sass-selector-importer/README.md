# node-sass-selector-importer
[![Build Status](https://travis-ci.org/maoberlehner/node-sass-selector-importer.svg?branch=master)](https://travis-ci.org/maoberlehner/node-sass-selector-importer)

With selector importing, it is possible to import only certain CSS selectors form a file. This is especially useful if you want to import only a few CSS classes from a huge library or framework.

## Usage
```node
var sass = require('node-sass');
var selectorImporter = require('node-sass-selector-importer');

sass.render({
  ...
  importer: selectorImporter()
  ...
});
```
```scss
// Example:
@import '{ .btn, .btn-alert } from style.scss';
```
```scss
// Result:
.btn { }
.btn-alert { }
```

### Transform imported selectors
```scss
// Example:
@import '{ .btn as .button, .btn-alert as .button--alert } from style.scss';
```
```scss
// Result:
.button { }
.button--alert { } // Transformed to match BEM syntax.
```

### RegEx
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

### Usage with Bootstrap
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

### Options
```node
sass.render({
  ...
  importer: selectorImporter({
    includePaths: [process.cwd()]
  })
  ...
});
```

### CLI
```bash
node-sass --importer node_modules/node-sass-selector-importer/dist/cli.js -o dist src/index.scss
```

## Upgrade from 3.x.x to 4.x.x
Version 4.x.x changes the way how nested CSS selectors are imported. Up until version 3.x.x you had to specify all nested selectors if you wanted to import them. With version 4.x.x nested selectors are imported automatically if you import the parent selector.

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

## Upgrade from 2.x.x to 3.x.x
Version 3.x.x does not return a node-sass custom importer function directly. Instead a function which can take a optional parameter for configuration is returned. When the function is executed, it returns a node-sass custom importer function.

```node
sass.render({
  ...
  // Old
  importer: selectorImporter
  // New
  importer: selectorImporter()
  ...
});
```

If you want to use the `node-sass-selector-importer` in combination with the node-sass CLI, you now have to specify the path to the `node-sass-selector-importer` CLI script.

```bash
# Old
node-sass --importer node_modules/node-sass-selector-importer -o dist src/index.scss
# New
node-sass --importer node_modules/node-sass-selector-importer/dist/cli.js -o dist src/index.scss
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
