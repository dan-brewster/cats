var webpack = require('webpack');
var path = require('path');
var WebpackErrorNotificationPlugin = require('webpack-error-notification');

var config = {
  entry: path.resolve(__dirname, 'src/cats.js'),
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'cats.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: path.resolve(__dirname, 'src'),
        loader: 'babel',
        query: { presets: ['react', 'es2015'] }
      }
    ],
    plugins: [
      new WebpackErrorNotificationPlugin()
    ]
  },
  devtool: 'source-map'
};

module.exports = config;
