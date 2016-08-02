# node-sass-package-importer
Custom importer for node-sass to import packages from `node_modules` or `bower_components` directories.

## Usage
In modern day web development, packages are everywhere. There is no way around [npm](https://www.npmjs.com/) if you are a JavaScript developer. More and more CSS and SASS projects move to npm but it can be annoying to find the correct way of including them into your project. Package importing makes this a little easier.

First the importer looks for a `sass` option in `package.json` or `bower.json` if no value for `sass` is provided, the `style` option is next in the line, if there is also no `style` option, the importer checks if the `main` option provides a compatible file. If all of this fails, the module is not compatible with this importer.

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

### CLI
```bash
node-sass --importer node_modules/node-sass-package-importer -o dist src/index.scss
```

## About
### Author
Markus Oberlehner  
Twitter: https://twitter.com/MaOberlehner

### License
MIT
