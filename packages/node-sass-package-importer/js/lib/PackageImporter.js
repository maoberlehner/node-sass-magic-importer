import resolve from 'resolve';
import path from 'path';

export default class PackageImporter {
  /**
   * Import packages from the `node_modules` directory.
   * @param {Object} options - Configuration options.
   */
  constructor(options = {}) {
    const defaultOptions = {
      cwd: process.cwd(),
      extensions: [
        '.scss',
        '.sass'
      ],
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
      ]
    };
    this.options = Object.assign(defaultOptions, options);
  }

  /**
   * Synchronously resolve the path to a node-sass import url.
   * @param {string} url - Import url from node-sass.
   * @return {mixed} Import object for node-sass or null.
   */
  resolveSync(url) {
    const cleanUrl = this.cleanUrl(url);
    const urlVariants = this.urlVariants(cleanUrl);
    let data = null;
    // Find a url variant that can be resolved.
    urlVariants.some(urlVariant => {
      try {
        const resolvedPath = resolve.sync(urlVariant, {
          basedir: this.options.cwd,
          packageFilter: pkg => this.resolveFilter(pkg)
        });
        if (resolvedPath) {
          data = {
            file: resolvedPath
          };
          return true;
        }
      } catch (e) {}
      return false;
    });
    return data;
  }

  /**
   * Asynchronously resolve the path to a node-sass import url.
   * @param {string} url - Import url from node-sass.
   * @return {Promise} Promise for node-sass importer return object.
   */
  resolve(url) {
    return new Promise((promiseResolve) => {
      promiseResolve(this.resolveSync(url));
    });
  }

  /**
   * Clean a node sass import url.
   * @param {string} url - Import url from node-sass.
   * @return {string} Cleaned url.
   */
  cleanUrl(url) {
    // Remove tilde symbol from the beginning
    // of urls (except home "~/" directory).
    const re = new RegExp(`^~(?!${path.sep})`);
    return url.replace(re, '');
  }

  /**
   * Create url variants for partial file matching (e.g. _file.scss).
   * @param {string} url - Import url from node-sass.
   * @return {Array} Multiple variants of sass file names.
   */
  urlVariants(url) {
    const parsedUrl = path.parse(url);
    let urlVariants = [url];
    if (parsedUrl.dir && !parsedUrl.ext) {
      urlVariants = this.options.extensions.reduce((x, extension) => {
        x.push(path.join(parsedUrl.dir, `${parsedUrl.name}${extension}`));
        x.push(path.join(parsedUrl.dir, `_${parsedUrl.name}${extension}`));
        return x;
      }, urlVariants);
    }
    return urlVariants;
  }

  /**
   * Find the first matching key in a package.json file
   * and set it as value for the `main` field.
   * @param  {Object} pkg - Contents of a package.json.
   * @return {Object} A package.json object with a replaced main value.
   */
  resolveFilter(pkg) {
    const newPkg = pkg;
    const pkgKey = this.options.packageKeys.find(x => pkg[x] !== undefined);
    newPkg.main = pkg[pkgKey];
    return newPkg;
  }
}
