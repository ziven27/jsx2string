const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  target: 'node',
  entry: {
    'App': './demo/App.jsx',
  },
  plugins: [new CleanWebpackPlugin({cleanStaleWebpackAssets: false})],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    libraryTarget: 'commonjs2'
  },
  optimization: {
    minimize: false
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            extends: path.resolve(__dirname, './babel.config.json'),
          },
        }]
      },
    ],
  }
}
