const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    config.plugin('html')
      .tap(args => {
        args[0].title = '物流AI管理系统' // 改成你想要的标题
        return args
      })
  },
  // 👇 新增：开启 Source Map，让调试器能找到源码
  configureWebpack: {
    devtool: 'source-map'
  }
})
