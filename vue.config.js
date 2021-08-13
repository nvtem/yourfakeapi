const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  configureWebpack: {
    plugins: [
      new HTMLWebpackPlugin({
        template: './src/client/index.html',
        title: 'yourfakeapi'
      })
    ]
  },
  chainWebpack(config) {
    config
      .entry('app')
      .clear()

    config
      .entry('app')
      .add('./src/client/main.js')
  },
  outputDir: './src/client/dist'
}