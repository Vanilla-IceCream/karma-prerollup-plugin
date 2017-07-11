# karma-prerollup-plugin [![Build Status](https://travis-ci.org/Vanilla-IceCream/karma-prerollup-plugin.svg?branch=master)](https://travis-ci.org/Vanilla-IceCream/karma-prerollup-plugin) [![Coverage Status](https://coveralls.io/repos/github/Vanilla-IceCream/karma-prerollup-plugin/badge.svg?branch=master)](https://coveralls.io/github/Vanilla-IceCream/karma-prerollup-plugin?branch=master)

A Karma preprocessor plugin to offer seamless integration with Rollup.

## Install

```bash
$ npm i karma-prerollup-plugin -D
```

## Usage

```js
// karma.conf.js
const postcss = require('rollup-plugin-postcss');
const cssnano = require('cssnano');
const buble = require('rollup-plugin-buble');
const globals = require('rollup-plugin-node-globals');
const builtins = require('rollup-plugin-node-builtins');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
const uglify = require('rollup-plugin-uglify');

module.exports = config => {
  config.set({
    // ...
    preprocessors: {
      'src/polyfills.js': ['prerollup'],
      'src/vendor.js': ['prerollup']
    },
    prerollupPreprocessor: {
      format: 'es',
      context: 'window',
      plugins: [
        postcss({ plugins: [cssnano()] }),
        buble(),
        globals(),
        builtins(),
        resolve({ jsnext: true, browser: true }),
        commonjs({ include: 'node_modules/**' }),
        replace({ eval: '[eval][0]' }),
        uglify()
      ]
    },
    // ...
  });
};
```
