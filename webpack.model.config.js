const path = require('path');

module.exports = {
  mode: 'production',
  entry: './lib/model/index.js',
  devtool: 'source-map',
  output: {
    filename: 'model.js',
    path: path.resolve(__dirname, 'dist'),
  },
};