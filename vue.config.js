'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const setMemeoy = require('./memoryConfig')

const webpack = require('webpack')
function resolve(dir) {
  console.log(__dirname)
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || '登录系统' // page title
// const BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://192.168.100.204:1111'
// const BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://xrty.vipgz4.idcfengye.com'
// const BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://192.168.2.231:1111'
const BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://192.168.2.238:1111'
// const BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://127.0.0.1:1111'
const port = 8031
// const port = process.env.port || process.env.npm_config_port || 9528 // dev port

module.exports = {
  /**
   * 如果计划在子路径下部署站点，则需要设置publicPath
   */
  publicPath: './', // 发布路径
  // publicPath: '/',//本地路径
  outputDir: 'dist',
  assetsDir: 'static',
  // lintOnSave: process.env.NODE_ENV === 'development',
  lintOnSave: false,
  productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
  devServer: {
    port: port, // 端口
    open: false, // 自动开启浏览器
    compress: false, // 开启压缩
    overlay: {
      warnings: false,
      errors: false
    },
    proxy: {
      '/backstage': {
        target: 'http://192.168.2.238:1111', // 修改后台接口地址
        // target: 'http://127.0.0.1:1111', // 修改后台接口地址
        // target: 'http://192.168.2.231:1111', // 修改后台接口地址
        // target: 'http://xrty.vipgz4.idcfengye.com',
        // target: 'http://192.168.100.204:1111',
        changeOrigin: true,
        pathRewrite: {
          '^/backstage': ''
        }
      },
      '/api': {
        target: 'http://192.168.2.235:1118', // 后台接口地址
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
      // '/omsweb': { // 自定义 接口前缀
      //   target: 'http://58.17.241.6:1212', // 这里可以跟随项目实际部署服务器来
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/omsweb': ''
      //   }
      // }
    }
    // before: require('./mock/mock-server.js')
  },
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    // sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      // pass options to sass-loader
      sass: {
        // 引入全局变量样式,@使我们设置的别名,执行src目录
        data: `@import "@/styles/variables.scss";`
      }
    },
    // 启用 CSS modules for all css / pre-processor files.
    modules: false
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'),
        staticPub: resolve('public')
      }
    },
    // devtool: '#eval-source-map',
    plugins: [
      // 压缩代码
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.js$|\.html$|\.json$|\.css/,
        threshold: 0, // 只有大小大于该值的资源会被处理
        minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
        deleteOriginalAssets: false // 删除原文件
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'windows.jQuery': 'jquery',
        'vue-moment': 'vue-moment',
        'vue-echarts': 'vue-echarts'
      })
    ]
  },

  chainWebpack(config) {
    // 删除预加载
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    // 设置 svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
    // 设置保留空白
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap((options) => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config.when(process.env.NODE_ENV === 'development', (config) => config.devtool('cheap-source-map'))

    config.when(process.env.NODE_ENV !== 'development', (config) => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime`必须与runtimeChunk名称相同。默认值为“runtime”`
            inline: /runtime\..*\.js$/
          }
        ])
        .end()
      // 分割代码
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // 仅打包最初依赖的第三方
          },
          elementUI: {
            name: 'chunk-elementUI', // 将elementUI拆分为一个包
            priority: 20, // 重量必须大于libs和app，否则将打包成libs或app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // 为了适应cnpm
          },
          monent: {
            name: 'chunk-moment',
            priority: 20,
            test: /[\\/]node_modules[\\/]_?vue-moment(.*)/
          },
          echarts: {
            name: 'chunk-echarts',
            priority: 20,
            test: /[\\/]node_modules[\\/]_?vue-echarts(.*)/
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // 可以自定义规则
            minChunks: 3, //  最小公共数
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      config.optimization.runtimeChunk('single')
    })
    config.externals({ './cptable': 'var cptable' })
    setMemeoy(config)
  }
}
