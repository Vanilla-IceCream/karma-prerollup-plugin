const { rollup } = require('rollup');

const SOURCEMAPPING_URL = 'sourceMappingURL';

const createRollupPreprocessor = (args, options = {}, logger) => {
  const log = logger.create('preprocessor.prerollup');

  return (content, file, done) => {
    log.debug(`Processing "${file.originalPath}".`);

    try {
      options.entry = file.originalPath;

      rollup(options)
        .then(bundle => {
          let { code, map } = bundle.generate(options);

          if (options.sourceMap === 'inline') code += `\n//# ${SOURCEMAPPING_URL}=${map.toUrl()}`;
          if (options.sourceMap) file.sourceMap = map;

          done(null, code);
        })
        .catch(error => {
          log.error(`${error.message}\n at ${file.originalPath}\n${error.stack}`);
          done(error);
        });
    } catch (error) {
      log.error(`${error.message}\n at ${file.originalPath}`);
      done(error);
    }
  };
};

createRollupPreprocessor.$inject = ['args', 'config.prerollupPreprocessor', 'logger'];

module.exports = { 'preprocessor:prerollup': ['factory', createRollupPreprocessor] };
