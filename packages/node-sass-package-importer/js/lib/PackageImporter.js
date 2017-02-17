import resolve from 'resolve';
import path from 'path';

/**
 * Import packages from the `node_modules` directory.
 */
export default class PackageImporter {
  /**
   * @param {Object} options - Configuration options.
   */
  constructor(options = {}) {
    const defaultOptions = {
      cwd: process.cwd(),
      extensions: [
        `.scss`,
        `.sass`
      ],
      packageKeys: [
        `sass`,
        `scss`,
        `style`,
        `css`,
        `main.sass`,
        `main.scss`,
        `main.style`,
        `main.css`,
        `main`
      ],
      prefix: `~`
    };
    /**
     * @type {Object}
     */
    this.options = Object.assign({}, defaultOptions, options);

    /**
     * Ensure any regex characters entered are escaped.
     */
    this.options.prefix = this.options.prefix.replace(/[-/\\^$*+?.()|[\]{}]/g, `\\$&`);

    /**
     * Match given prefix symbol at the beginning of urls (except posix home "~/" directory).
     * @type {RegExp}
     */
    this.matchPackageUrl = new RegExp(`^${this.options.prefix}(?!/)`);
  }

  /**
   * Synchronously resolve the path to a node-sass import url.
   * @param {string} url - Import url from node-sass.
   * @return {Object|null} Importer object or null.
   */
  resolveSync(url) {
    if (!url.match(this.matchPackageUrl)) {
      return null;
    }

    let file = null;
    const cleanUrl = this.cleanUrl(url);
    const urlVariants = this.urlVariants(cleanUrl);

    // Find a url variant that can be resolved.
    urlVariants.some(urlVariant => {
      try {
        const resolvedPath = resolve.sync(urlVariant, {
          basedir: this.options.cwd,
          packageFilter: pkg => this.resolveFilter(pkg),
          extensions: this.options.extensions
        });
        if (resolvedPath) {
          file = resolvedPath;
          return true;
        }
      } catch (e) {}
      return false;
    });

    return file ? { file: file.replace(/\.css$/, ``) } : null;
  }

  /**
   * Asynchronously resolve the path to a node-sass import url.
   * @param {string} url - Import url from node-sass.
   * @return {Promise} Promise for a importer object or null.
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
    return url.replace(this.matchPackageUrl, ``);
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
