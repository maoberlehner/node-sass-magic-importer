"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toolbox_1 = require("node-sass-magic-importer/dist/toolbox");
function globImporter() {
    return function importer(url, prev) {
        const nodeSassOptions = this.options;
        const includePaths = toolbox_1.buildIncludePaths(nodeSassOptions.includePaths, prev);
        const filePaths = toolbox_1.resolveGlobUrl(url, includePaths);
        if (filePaths.length) {
            const contents = filePaths
                .map((x) => `@import '${x}';`)
                .join(`\n`);
            return { contents };
        }
        return null;
    };
}
exports.default = globImporter;
//# sourceMappingURL=index.js.map