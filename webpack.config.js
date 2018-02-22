var BundleTracker = require('webpack-bundle-tracker');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

var resolve = path.resolve.bind(path, __dirname);

var extractTextPlugin;
var fileLoaderPath;
var output;
var reactPath;
var reactDomPath;

if (process.env.NODE_ENV === 'production') {
  reactPath = 'node_modules/react/umd/react.production.min.js';
  reactDomPath = 'node_modules/react-dom/umd/react-dom.production.min.js';
  output = {
    path: resolve('saleor/static/assets/'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: process.env.STATIC_URL || '/static/assets/'
  };
  fileLoaderPath = 'file-loader?name=[name].[hash].[ext]';
  extractTextPlugin = new ExtractTextPlugin('[name].[contenthash].css');
} else {
  reactPath = 'node_modules/react/umd/react.development.js';
  reactDomPath = 'node_modules/react-dom/umd/react-dom.development.js';
  output = {
    path: resolve('saleor/static/assets/'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/static/assets/'
  };
  fileLoaderPath = 'file-loader?name=[name].[ext]';
  extractTextPlugin = new ExtractTextPlugin('[name].css');
}

var bundleTrackerPlugin = new BundleTracker({
  filename: 'webpack-bundle.json'
});

var providePlugin = new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery',
  'window.jQuery': 'jquery',
  'Popper': 'popper.js',
  'query-string': 'query-string'
});

var config = {
  entry: {
    dashboard: './saleor/static/dashboard/js/dashboard.js',
    document: './saleor/static/dashboard/js/document.js',
    storefront: './saleor/static/js/storefront.js'
  },
  output: output,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
            },
            {
              loader: 'postcss-loader',
              options: {
                'plugins': function () {
                  return [autoprefixer];
                }
              }
            },
            {
              loader: 'sass-loader',
            }
          ]
        })
      },
      {
        test: /\.(eot|otf|png|svg|jpg|ttf|woff|woff2)(\?v=[0-9.]+)?$/,
        loader: fileLoaderPath,
        include: [
          resolve('node_modules'),
          resolve('saleor/static/fonts'),
          resolve('saleor/static/images'),
          resolve('saleor/static/dashboard/images')
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    bundleTrackerPlugin,
    extractTextPlugin,
    providePlugin
  ],
  resolve: {
    alias: {
      'jquery': resolve('node_modules/jquery/dist/jquery.js'),
      'react': resolve(reactPath),
      'react-dom': resolve(reactDomPath)
    }
  },
  devtool: 'sourceMap'
};

module.exports = config;
