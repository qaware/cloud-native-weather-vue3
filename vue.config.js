const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // port of the UI
    port: 3000,
    proxy: {
      // backend api calls of this workshop start with /api
      '/api': {
        // the address of the local backend
        target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true
      }
    }
  }
})