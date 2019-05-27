module.exports = {
  // When running in VueCLI development mode (npm run serve) proxy calls through the intended backend API route
  // To override, see .env.development file
  devServer: {
    proxy: {
      '^/getok/api': {
        target: process.env.VUE_APP_API_ROOT,
        changeOrigin: true,
        ws: false
      }
    }
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/getok/'
    : '/'
};
