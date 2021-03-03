const webpack = require('webpack')
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const minimizer = []

const isDevMode = process.env.NODE_ENV !== 'production'

const plugins = [
  new webpack.DefinePlugin({
    '"process.env.NODE_ENV"': isDevMode ? 'development' : 'production'
  })
]

if (!isDevMode) {
  minimizer.push(new UglifyJsPlugin({
    uglifyOptions: {
        output: {
            comments: false
        },
        compress: {
          drop_debugger: true,
          drop_console: true
        }
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
  optimization: {
    minimizer: minimizer,
  },
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
