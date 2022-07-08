const paths = require('./paths');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;
const TerserPlugin = require('terser-webpack-plugin');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const dotenv = require('dotenv');
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const isEnvProduction = process.env.NODE_ENV === 'production';
const styledComponentsTransformer = createStyledComponentsTransformer();

const env = dotenv.config().parsed;

const envKeys =
  env &&
  Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

const config = {
  mode: isEnvProduction ? 'production' : 'development',
  entry: paths.appIndex,
  output: {
    path: paths.appBuild,
    publicPath: '/',
    pathinfo: !isEnvProduction,
    filename: isEnvProduction ? '[name].[contenthash].js' : 'bundle.js',
    assetModuleFilename: 'images/[hash][ext][query]',
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.ts(x?)$/,
            exclude: /(node_modules|bower_components)/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  configFile: paths.babelConfig,
                  plugins: [!isEnvProduction && require.resolve('react-refresh/babel')].filter(Boolean),
                },
              },
              {
                loader: 'ts-loader',
                options: {
                  // disable type checker - we will use it in fork plugin
                  transpileOnly: true,
                  getCustomTransformers: () => ({ before: [styledComponentsTransformer] }),
                },
              },
            ],
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  configFile: paths.babelConfig,
                  plugins: [!isEnvProduction && require.resolve('react-refresh/babel')].filter(Boolean),
                },
              },
            ],
          },
          {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
          },
          {
            test: /\.(png|jpe?g|gif|svg)$/i,
            type: 'asset',
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  outputPath: 'fonts',
                },
              },
            ],
          },
          // ** STOP ** Are you adding a new loader?
          // Make sure to add the new loader(s) before the "file" loader.
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin(envKeys),
    // new ForkTsCheckerWebpackPlugin(),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
    new HtmlWebpackPlugin({
      template: paths.appHtml,
      filename: 'index.html',
      inject: true,
    }),
    env && new InterpolateHtmlPlugin(HtmlWebpackPlugin, env),
    new ModuleNotFoundPlugin(paths.appPath),
    !isEnvProduction && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    fallback: {
      process: require.resolve('process/browser'),
      zlib: require.resolve('browserify-zlib'),
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util'),
      buffer: require.resolve('buffer'),
      assert: require.resolve('assert'),
    },
  },
  optimization: {
    minimize: isEnvProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: true,
        },
      }),
    ],
  },
};

module.exports = config;
