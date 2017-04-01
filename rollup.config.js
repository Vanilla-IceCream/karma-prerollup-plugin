import { join } from 'path';
import buble from 'rollup-plugin-buble';

const pkg = require('./package.json');

export default {
  entry: join(__dirname, 'src/index.js'),
  format: 'cjs',
  dest: pkg.main,
  plugins: [buble()],
  external: Object.keys(pkg.dependencies),
  sourceMap: true
};
