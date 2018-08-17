import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';

import pkg from './package.json';

export default [{
  input: 'src/main.js',
  output: {
    name: 'window',
    file: pkg.main,
    format: 'umd',
    extend: true
  },
  plugins: [
    json(),
    resolve(),
    commonjs()
  ]
}];