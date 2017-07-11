"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toolbox_1 = require("node-sass-magic-importer/dist/toolbox");
function packageImporter(options) {
    const defaultOptions = {
        cwd: process.cwd(),
        extensions: [
            `.scss`,
            `.sass`,
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
            `main`,
        ],
        prefix: `~`,
    };
    options = Object.assign({}, defaultOptions, options);
    const escapedPrefix = options.prefix.replace(/[-/\\^$*+?.()|[\]{}]/g, `\\$&`);
    const matchPackageUrl = new RegExp(`^${escapedPrefix}(?!/)`);
    return function importer(url, prev) {
        const nodeSassOptions = this.options;
        if (!url.match(matchPackageUrl)) {
            return null;
        }
        const includePaths = toolbox_1.buildIncludePaths(nodeSassOptions.includePaths, prev);
        const cleanedUrl = url.replace(matchPackageUrl, ``);
        const file = toolbox_1.resolvePackageUrl(cleanedUrl, options.extensions, options.cwd, options.packageKeys);
        // TODO: Wirklich css replacen? Why? Why not?
        return file ? { file: file.replace(/\.css$/, ``) } : null;
    };
}
exports.default = packageImporter;
//# sourceMappingURL=index.js.map