
// /需要到处一个对象/
module.exports = {
  // 覆盖蓝色主题
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          blue: '#3296fa'
        }
      }
    }
  },
  configureWebpack: (config) => {
    // config 参数 就是当前 vue-cli 项目所以的webpack 设置
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  },
  publicPath: './'
}
