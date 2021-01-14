const webpack = require('webpack')
const path = require('path')

const isDevMode = process.env.NODE_ENV !== 'production'

const plugins = [
  new webpack.DefinePlugin({
    '"process.env.NODE_ENV"': 'development'
  })
]

const config = {
  mode: isDevMode ? 'development' : 'production',
  target: 'web',
  entry: './demo/index.js',
  node: {
    fs: 'empty'
  },
  output: {
    path: path.resolve(__dirname, 'demo'),
    filename: 'bundle.js'
  },
  plugins: plugins,
  module: {
    rules: [{
      test: /\.js$/,
      include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'demo')],
      loader: 'babel-loader'
    }]
  },
  devtool: 'source-map',
  devServer: {
    contentBase: [path.join(__dirname, 'demo'), __dirname],
    host: '0.0.0.0'
  }
}

module.exports = config
