// https://github.com/twbs/bootstrap/issues/24370

// webpack.config.js
const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path')

const extractSass = new ExtractTextPlugin({
  filename: "styles.css",
});

module.exports = {
  mode: 'development',
  performance: { hints: false },
  watch: true,
  entry: './src/index.js',
  output: {
    filename: 'site.js',
    path: path.resolve(__dirname, 'wwwroot')
  },
  devServer: {
    contentBase: path.join(__dirname, "wwwroot"),
    compress: true,
    port: 9000,
    clientLogLevel: "none",
    historyApiFallback: true,
    watchContentBase: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              ['es2015', { modules: false }]
            ]
          }
        }]
      },
      {
        test: /\.(scss)$/,
        use: extractSass.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
          use: [{
            loader: "css-loader" // translates CSS into CommonJS
          }, {
            loader: "sass-loader" // compiles Sass to CSS
          }]
        })
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/images', to: 'images' }
    ]),    
    new webpack.ProvidePlugin({
      $: "jquery", // Used for Bootstrap JavaScript components
      jQuery: "jquery", // Used for Bootstrap JavaScript components
      Popper: ['popper.js', 'default'] // Used for Bootstrap dropdown, popup and tooltip JavaScript components
    }),
    extractSass
  ]
};