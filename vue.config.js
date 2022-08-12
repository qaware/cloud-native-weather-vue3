const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // desired port for your UI
    port: 3000,
    proxy: {
      // according to our backend api calls start with /api
      '/api': {
        // the local backend is running on localhost:8080
        target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true
      }
    }
  }
})