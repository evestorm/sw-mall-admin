module.exports = {
  publicPath: '/', // 根域上下文目录
  outputDir: 'dist', // 构建输出目录
  assetsDir: 'assets', // 静态资源目录 (js, css, img, fonts)
  devServer: {
    proxy: { // 配置跨域
      '/admin': {
        target: 'http://127.0.0.1:7001/admin/',
        ws: true,
        changOrigin: true,
        pathRewrite: {
          '^/admin': ''
        }
      }
    },
    before: app => {}
  }
}
