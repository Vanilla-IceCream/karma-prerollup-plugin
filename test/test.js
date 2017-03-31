const path = require('path');
const assign = require('object-assign');
const { expect } = require('chai');
const { Server } = require('karma');
const buble = require('rollup-plugin-buble');
const karmaMocha = require('karma-mocha');
const karmaChai = require('karma-chai');
const karmaPhantomjsLauncher = require('karma-phantomjs-launcher');

const rollupPlugin = require('../');

process.chdir(__dirname);

const runFixture = (fixture, options = {}) => {
  const loggerMock = {
    create: () => ({
      debug: () => {},
      error: () => {}
    })
  };

  const defaults = {
    plugins: [buble()]
  };

  const createPreprocessor = rollupPlugin['preprocessor:prerollup'][1];
  const preprocessor = createPreprocessor(null, assign(defaults, options), loggerMock);
  const file = {
    originalPath: path.resolve(__dirname, 'fixtures/' + fixture)
  };

  return new Promise((resolve, reject) => {
      preprocessor(null, file, (error, code) => {
        if (error) {
          reject(error);
        } else {
          resolve(code);
        }
      });
    })
    .then(code => {
      new Function('expect', code)(expect);
      return { code, file };
    });
};

describe('karma-prerollup-plugin', () => {
  it('should be karma preprocessor', () => {
    expect(rollupPlugin).to.exist;
    expect(rollupPlugin).to.be.an.object;
    expect(rollupPlugin['preprocessor:prerollup']).to.be.an.array;
    expect(rollupPlugin['preprocessor:prerollup'][1]).to.be.a.function;
  });

  it('should bundle es2015 modules', () => {
    return runFixture('module.js', { format: 'iife' })
      .then(({ code }) => {
        expect(code).to.not.contain('//# sourceMappingURL');
      });
  });

  it('should transpile es2015 syntax', () => {
    return runFixture('es2015.js', { format: 'iife' });
  });

  it('should fail when an import is not found', () => {
    return runFixture('error-import-not-found.js', { format: 'iife' })
      .catch(error => {
        expect(error.message).to.contain('Could not resolve');
        expect(error.message).to.contain('error-import-not-found.js');
      });
  });

  it('should add inline source map', () => {
    return runFixture('es2015.js', {
        format: 'iife',
        sourceMap: 'inline'
      })
      .then(({ code }) => {
        expect(code).to.contain('//# sourceMappingURL');
      });
  });

  it('should not add map property in file', () => {
    return runFixture('es2015.js', { format: 'iife' })
      .then(({ file }) => {
        expect(file.sourceMap).not.to.be.ok;
      });
  });

  it('should add map property in file with sourceMap = true', () => {
    return runFixture('es2015.js', {
        format: 'iife',
        sourceMap: true
      })
      .then(({ file }) => {
        expect(file.sourceMap).to.be.ok;
      });
  });
});