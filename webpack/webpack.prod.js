const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { rules } = require('./common/rules');
const { plugins } = require('./common/plugins');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    app: './src/index.js', // Bundle with our code
    vendor: ['react', 'react-dom'], // Vendor libraries we want make in separate bundles
  },
  output: {
    filename: '[name].[fullhash].js', // [name] - name of the entry (bundle),
    // [checksum] or [hash] - to cache different bundles
    // from update when developing (doing changes in the files)
    path: path.resolve(__dirname, '../dist'),
    // where you uploaded your bundled files. (Relative to server root)
    // needs for react-router-dom
    publicPath: '/',
  },
  resolve: { extensions: ['*', '.js', '.jsx'] },
  optimization: {
    splitChunks: {
      // To split up js code to different bundles.
      chunks: 'all', // Now bundle with our code will be cleaned up
    }, // from vendors imports (2mb ~> 100kb)
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()], // to minimize file size
  },
  plugins: [
    ...plugins,
    new webpack.DefinePlugin({
      'process.env.SERVICE_URL': JSON.stringify('http://localhost:8080/api'),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  module: {
    rules: [
      ...rules,
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
};
