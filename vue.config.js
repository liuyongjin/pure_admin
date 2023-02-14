const define = require('./src/utils/define.js')

module.exports = {
    chainWebpack: config => {
        // 一个规则里的 基础Loader
        // svg是个基础loader
        const svgRule = config.module.rule('svg')

        // 清除已有的所有 loader。
        // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
        svgRule.uses.clear()

        // 添加要替换的 loader
        svgRule
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })

    },
    devServer: {
        open: false,
        overlay: {
          warnings: false,
          errors: true
        },
        // before: require('./mock/mock-server.js'),
        // 接口转发
        proxy: {
          '/dev': {
            target: define.APIURl,
            changeOrigin: true,
            pathRewrite: {
              '^/dev': ''
            }
          }
        }
      },

}