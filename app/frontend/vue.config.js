process.env.VUE_APP_VERSION = require('./package.json').version;

const proxyConfig = {
  target: 'http://localhost:8080',
  ws: true,
  changeOrigin: true
};

module.exports = {
  publicPath: './',
  'transpileDependencies': [
    'vuetify'
  ],
  devServer: {
    proxy: {
      '/config': proxyConfig,
      '^/app/api': proxyConfig
    }
  }
};
