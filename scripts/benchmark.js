#!/usr/bin/env node
const { performance } = require(`perf_hooks`);
const path = require(`path`);
const sass = require(`node-sass`);

const magicImporter = require(`../packages/node-sass-magic-importer/dist/index`);

const start = performance.now();

for (let i = 0; i < 100; i += 1) {
  sass.renderSync({
    file: `scripts/files/benchmark.scss`,
    importer: magicImporter({
      cwd: path.resolve(__dirname, `files`),
    }),
  }).css.toString();
}

const end = performance.now();
const duration = end - start;

console.log(`Duration: ${duration}ms`)
