const timeStamp = new Date().getTime()

module.exports = {
  lintOnSave: false,
  // publicPath: process.env.NODE_ENV === 'production' ? '/vue-quasar-manage/' : '/',
  // publicPath: '/',
  devServer: {
    host: 'localhost',
    port: 8868,
    proxy: {
      '/api': {
        target: 'http://cdnsss.rkru.cn',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  },
  transpileDependencies: [
    'quasar',
    'vue-echarts',
    'resize-detector',
    '@kangc'
  ],

  // 项目打包文件夹
  // outputDir: 'vue-quasar-manage',

  // 静态资源文件夹 *注：当生成的资源覆写 filename 或 chunkFilename 时，assetsDir 会被忽略。
  // assetsDir: 'static',

  // 关闭 sourcemap
  productionSourceMap: false,

  // 打包的时候不使用 hash 值
  filenameHashing: false,

  // Webpack 函数式配置
  configureWebpack: config => {
    // 体积分析
    if (process.env.use_analyzer) {
      const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
      config.plugins.push(new BundleAnalyzerPlugin())
    }

    // 生产环境配置
    if (process.env.NODE_ENV === 'production') {
      // 消除 console 输出信息
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true

      // Gzip 压缩
      const CompressionPlugin = require('compression-webpack-plugin')
      config.plugins.push(
        new CompressionPlugin({
          algorithm: 'gzip',
          test: /\.(js|css|woff|woff2|svg)$/, // 匹配文件名
          threshold: 10240, // 对超过10k的数据压缩
          deleteOriginalAssets: false, // 不删除源文件
          minRatio: 0.8 // 压缩比
        })
      )

      // 将 js 文件夹添加时间戳，这样浏览器不会加载上个版本缓存的代码
      config.output.filename = `js/[name].${timeStamp}.js`
      config.output.chunkFilename = `js/[name].${timeStamp}.js`
    } else {
      // 开发环境配置
    }
  },
  chainWebpack: config => {
    // 移除 prefetch 插件
    // config.plugins.delete('prefetch')
  },
  css: {
    // 打包后css文件名称添加时间戳，浏览器不会加载上版本资源
    extract: {
      filename: `css/[name].${timeStamp}.css`,
      chunkFilename: `css/[name].${timeStamp}.css`
    }
  }
}
