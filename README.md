# node-sass-magic-importer

[![Patreon](https://img.shields.io/badge/patreon-donate-blue.svg)](https://www.patreon.com/maoberlehner)
[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://paypal.me/maoberlehner)
[![Build Status](https://travis-ci.org/maoberlehner/node-sass-magic-importer.svg?branch=master)](https://travis-ci.org/maoberlehner/node-sass-magic-importer)
[![Coverage Status](https://coveralls.io/repos/github/maoberlehner/node-sass-magic-importer/badge.svg?branch=master)](https://coveralls.io/github/maoberlehner/node-sass-magic-importer?branch=master)
[![GitHub stars](https://img.shields.io/github/stars/maoberlehner/node-sass-magic-importer.svg?style=social&label=Star)](https://github.com/maoberlehner/node-sass-magic-importer)

node-sass-magic-importer is a tool to enhance Sass `@import` statements.

The node-sass-magic-importer project consists of multiple [node-sass costum importers](https://github.com/sass/node-sass#importer--v200---experimental) which make it possible to do a lot of fancy things with Sass `@import` statements. Some of the highlights are selector and filter imports.

- `@import '{ .btn as .button } from ~bootstrap';` imports only `.btn` selectors and renames them to `.button`.
- `@import '[variables, mixins] from menu.scss';` imports only Sass variables (e.g. `$menu-height`) and mixins (e.g. `@mixin menu-item()`) but no selectors.

## Packages

The node-sass-magic-importer repository is managed as a [monorepo](https://medium.com/@maoberlehner/monorepos-in-the-wild-33c6eb246cb9) that is composed of many npm packages.

### [node-sass-magic-importer](https://github.com/maoberlehner/node-sass-magic-importer/tree/master/packages/node-sass-magic-importer)

The [node-sass-magic-importer package](https://github.com/maoberlehner/node-sass-magic-importer/tree/master/packages/node-sass-magic-importer) combines the functionality of all the other importers maintained in this package.

### [node-sass-selector-importer](https://github.com/maoberlehner/node-sass-magic-importer/tree/master/packages/node-sass-selector-importer)

By using the [node-sass-selector-importer](https://github.com/maoberlehner/node-sass-magic-importer/tree/master/packages/node-sass-selector-importer) it is possible to import only specific selectors from a Sass file. This enables you to take exactly the bits and pieces you really need from huge one size fits all CSS frameworks, instead of having to import the entire framework or at least some component from which you may only need one class.

### [node-sass-filter-importer](https://github.com/maoberlehner/node-sass-magic-importer/tree/master/packages/node-sass-filter-importer)

The [node-sass-filter-importer](https://github.com/maoberlehner/node-sass-magic-importer/tree/master/packages/node-sass-filter-importer) package allows you to filter certain types of nodes from a Sass file. That way it is possible to import – for example – only variables of a Sass file. Other possibilities are to only import only mixins or class selectors.

### [node-sass-glob-importer](https://github.com/maoberlehner/node-sass-magic-importer/tree/master/packages/node-sass-glob-importer)

Globbing allows pattern matching operators to be used to match multiple files at once. The [node-sass-glob-importer](https://github.com/maoberlehner/node-sass-magic-importer/tree/master/packages/node-sass-glob-importer) allows you to use glob syntax in Sass imports.

### [node-sass-once-importer](https://github.com/maoberlehner/node-sass-magic-importer/tree/master/packages/node-sass-once-importer)

The [node-sass-once-importer](https://github.com/maoberlehner/node-sass-magic-importer/tree/master/packages/node-sass-once-importer) package changes the Sass import logic to import files only once. If the same file is imported in multiple `@import` statements, this package will ignore subsequent imports of the same file.

### [node-sass-package-importer](https://github.com/maoberlehner/node-sass-magic-importer/tree/master/packages/node-sass-package-importer)

To easily import Sass files from packages inside your `node_modules` directory the [node-sass-package-importer](https://github.com/maoberlehner/node-sass-magic-importer/tree/master/packages/node-sass-package-importer) automatically resolves the paths of packages installed with npm.

## About

### Author

Markus Oberlehner  
Website: https://markus.oberlehner.net  
Twitter: https://twitter.com/MaOberlehner  
PayPal.me: https://paypal.me/maoberlehner  
Patreon: https://www.patreon.com/maoberlehner

### License

MIT
