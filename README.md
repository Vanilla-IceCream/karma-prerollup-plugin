# karma-prerollup-plugin [![Build Status](https://travis-ci.org/Vanilla-IceCream/karma-prerollup-plugin.svg?branch=master)](https://travis-ci.org/Vanilla-IceCream/karma-prerollup-plugin)

A Karma preprocessor plugin to offer seamless integration with Rollup.

## Install

```bash
$ npm i karma-prerollup-plugin -D
```

## Usage

```js
// karma.conf.js
module.exports = config => {
  config.set({
    // ...
    preprocessors: {
      'src/polyfills.js': ['prerollup'],
      'src/**/*.spec.js': ['rollup']
    },
    prerollupPreprocessor: {
      plugins: [
        babel({
          babelrc: false,
          presets: [['latest', { es2015: { modules: false } }]],
          plugins: ['external-helpers'],
          exclude: 'node_modules/**'
        }),
        globals(),
        builtins(),
        resolve({ jsnext: true, browser: true }),
        commonjs({ include: 'node_modules/**' }),
        replace({ eval: '[eval][0]' }),
        uglify()
      ],
      format: 'iife'
    },
    rollupPreprocessor: {
      plugins: [buble()],
      format: 'iife',
      sourceMap: 'inline'
    },
    // ...
  });
};
```
