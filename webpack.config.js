const webpack = require('webpack')
const path = require('path')

const isDevMode = process.env.NODE_ENV !== 'production'

const plugins = [
  new webpack.DefinePlugin({
    '"process.env.NODE_ENV"': isDevMode ? 'development' : 'production'
  })
]

if (!isDevMode) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    output: {
      comments: false
    }
  }))
}

const config = {
  mode: isDevMode ? 'development' : 'production',
  target: 'web',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `bundle.js`
  },
  plugins: plugins,
  module: {
    rules: [{
      test: /\.js$/,
      include: [path.resolve(__dirname, 'src')],
      loader: 'babel-loader'
    }]
  }
}

if (isDevMode) {
  config.devtool = 'source-map'
  config.devServer = {
    contentBase: [path.join(__dirname, 'public'), __dirname],
    host: '0.0.0.0'
  }
}

module.exports = config
