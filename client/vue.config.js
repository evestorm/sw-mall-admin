module.exports = {
  // publicPath: '/', // 根域上下文目录
  publicPath: '/admin/', // 我自己服务器该项目的结构是 `mall.evelance.cn` 访问前端商城，通过 `mall.evelance.cn/admin` 来访问后台管理系统，所以此处加上了 `/admin` ，如果你没有此需求，请使用上面注释了的代码
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
