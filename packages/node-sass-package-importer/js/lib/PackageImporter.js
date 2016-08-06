import resolve from 'resolve';
import path from 'path';

export default class PackageImporter {
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

  resolveSync(url) {
    // Remove tilde symbol from the beginning
    // of urls (except home "~/" directory).
    const re = new RegExp(`^~(?!${path.sep})`);
    const cleanUrl = url.replace(re, '');
    // Create url variants for partial file matching (e.g. _file.scss).
    const parsedUrl = path.parse(cleanUrl);
    let urlVariants = [cleanUrl];
    let data = null;
    if (parsedUrl.dir && !parsedUrl.ext) {
      urlVariants = this.options.extensions.reduce((x, extension) => {
        x.push(path.join(parsedUrl.dir, `${parsedUrl.name}${extension}`));
        x.push(path.join(parsedUrl.dir, `_${parsedUrl.name}${extension}`));
        return x;
      }, urlVariants);
    }
    // Find a url variant that can be resolved.
    urlVariants.some(urlVariant => {
      try {
        const resolvedPath = resolve.sync(urlVariant, {
          basedir: this.options.cwd,
          packageFilter: pkg => {
            const newPkg = pkg;
            const pkgKey = this.options.packageKeys.find(x => pkg[x] !== 'undefined');
            newPkg.main = pkg[pkgKey];
            return newPkg;
          }
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

  resolve(url) {
    return new Promise((promiseResolve) => {
      promiseResolve(this.resolveSync(url));
    });
  }
}
