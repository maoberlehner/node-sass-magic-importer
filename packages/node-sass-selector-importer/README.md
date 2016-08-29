# node-sass-selector-importer
With selector importing, it is possible to import only certain CSS selectors form a file. This is especially useful if you want to import only a few CSS classes from a huge library or framework.

## Usage
```node
const sass = require('node-sass');
const selectorImporter = require('node-sass-selector-importer');

sass.render({
  ...
  importer: selectorImporter
  ...
});
```
```scss
// Example:
@import '{ .btn, .btn-alert } from style.scss';
```
```scss
// Result:
.btn { ... }
.btn-alert { ... }
```

### Transform imported selectors
```scss
// Example:
@import '{ .btn as .button, .btn-alert as .button--alert } from style.scss';
```
```scss
// Result:
.button { ... }
.button--alert { ... } // Transformed to match BEM syntax.
```

### Usage with Bootstrap
Bootstrap is a mighty and robust framework but most of the time you use only certain parts of it. There is the possibility to [customize](http://getbootstrap.com/customize/) Bootstrap to your needs but this can be annoying and you still end up with more code than you need. Also you might want to use just some specific parts of
Bootstrap but your project uses the BEM syntax for writing class names.

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

### CLI
```bash
node-sass --importer node_modules/node-sass-selector-importer -o dist src/index.scss
```

## About
### Author
Markus Oberlehner  
Twitter: https://twitter.com/MaOberlehner

### License
MIT
