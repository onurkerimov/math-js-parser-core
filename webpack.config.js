const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'main.js': './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]'
  },
  devtool: 'source-map',
  devServer: {
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.txt$/,
        use: [{
          loader: 'raw-loader',
        }],
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
    })
  ]
};