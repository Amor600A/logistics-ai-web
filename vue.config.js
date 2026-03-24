const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 👇 新增：开启 Source Map，让调试器能找到源码
  configureWebpack: {
    devtool: 'source-map'
  }
})
