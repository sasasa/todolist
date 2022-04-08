module.exports = {
  configureWebpack: {
    devtool: 'source-map',
  },
  devServer: {
    watchOptions: {
      ignored: ['node_modules'],
      aggregateTimeout: 300,
      poll: 1500,
    },
    host: '0.0.0.0',
    port: '8080',
  }
}