'use strict';

var ref = require('rollup');
var rollup = ref.rollup;

var SOURCEMAPPING_URL = 'sourceMappingURL';

var createRollupPreprocessor = function (args, options, logger) {
  if ( options === void 0 ) options = {};

  var log = logger.create('preprocessor.prerollup');

  return function (content, file, done) {
    log.debug(("Processing \"" + (file.originalPath) + "\"."));

    try {
      options.entry = file.originalPath;

      rollup(options)
        .then(function (bundle) {
          var ref = bundle.generate(options);
          var code = ref.code;
          var map = ref.map;

          if (options.sourceMap === 'inline') { code += "\n//# " + SOURCEMAPPING_URL + "=" + (map.toUrl()); }
          if (options.sourceMap) { file.sourceMap = map; }

          done(null, code);
        })
        .catch(function (error) {
          log.error(((error.message) + "\n at " + (file.originalPath) + "\n" + (error.stack)));
          done(error);
        });
    } catch (error) {
      log.error(((error.message) + "\n at " + (file.originalPath)));
      done(error);
    }
  };
};

createRollupPreprocessor.$inject = ['args', 'config.prerollupPreprocessor', 'logger'];

module.exports = { 'preprocessor:prerollup': ['factory', createRollupPreprocessor] };
//# sourceMappingURL=rollup-prerollup-karma.js.map
