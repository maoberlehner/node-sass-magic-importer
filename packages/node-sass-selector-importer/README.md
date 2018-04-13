# node-sass-selector-importer

[![Patreon](https://img.shields.io/badge/patreon-donate-blue.svg)](https://www.patreon.com/maoberlehner)
[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://paypal.me/maoberlehner)
[![Build Status](https://travis-ci.org/maoberlehner/node-sass-magic-importer.svg?branch=master)](https://travis-ci.org/maoberlehner/node-sass-magic-importer)
[![Coverage Status](https://coveralls.io/repos/github/maoberlehner/node-sass-magic-importer/badge.svg?branch=master)](https://coveralls.io/github/maoberlehner/node-sass-magic-importer?branch=master)
[![GitHub stars](https://img.shields.io/github/stars/maoberlehner/node-sass-magic-importer.svg?style=social&label=Star)](https://github.com/maoberlehner/node-sass-magic-importer)

With selector importing, it is possible to import only certain CSS selectors form a file. This is especially useful if you want to import only a few CSS classes from a huge library or framework.

## Usage

```js
const sass = require('node-sass');
const selectorImporter = require('node-sass-selector-importer');

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

### webpack

```js
// webpack.config.js
const selectorImporter = require('node-sass-selector-importer');
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
              importer: selectorImporter()
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
node-sass --importer node_modules/node-sass-selector-importer/dist/cli.js -o dist src/index.scss
```

## Upgrade from 4.x.x to 5.x.x

It is not possible anymore to set the `includePaths` option when initializing the importer. Use the [node-sass includePaths option](https://github.com/sass/node-sass#includepaths) instead.

## node-sass-magic-importer

This module is powered by [node-sass-magic-importer](https://github.com/maoberlehner/node-sass-magic-importer).

## Known issues

### Multi level filtering

Selector filtering goes only one level deep. This means, if you're importing a file with selector filtering which is importing other files, those files are not filtered but imported as is. On a technical level, there is no good solution for this problem. One possibility would be to just pass the filters to all imports in the line but this carries the risk of filtering selectors on which one of the imported files might depend and therefore break the import. I might add this as an optional feature (which can be activated on demand) in the future – let me know if you're interested in multi level filter imports.

## About

### Author

Markus Oberlehner  
Website: https://markus.oberlehner.net  
Twitter: https://twitter.com/MaOberlehner  
PayPal.me: https://paypal.me/maoberlehner  
Patreon: https://www.patreon.com/maoberlehner

### License

MIT
