const fs = require('fs');
const sass = require('node-sass');
const magicImporter = require('../index.js');

const outFile = 'css/dist/combined.css';

sass.render({
  file: 'css/combined.scss',
  importer: magicImporter,
  outFile: outFile,
  magicImporter: {
    importOnce: true,
    cssImport: true,
    extensions: ['.scss']
  }
}, function(error, result) {
  if (!error) {
    // No errors during the compilation, write this result on the disk.
    fs.writeFile(outFile, result.css);
  }
});
