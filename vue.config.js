const webpack = require('webpack')
const path = require('path')

const resolve = dir => path.join(__dirname, dir)

module.exports = {
  publicPath: './',
  assetsDir: './src/assets',
  // outputDir: '/Users/Fun/activityCode/activities-dev/partysday',
  outputDir: '/Users/yicao/mango/activities-master/partysday',
  // outputDir: 'E:\\gitworkspace\\app.hitv.com-master\\2021-new-year',
  // transpileDependencies: ['swiper', 'dom7'],
  configureWebpack: {
    devServer: {
      disableHostCheck: true,
    },
    plugins: [
      // new webpack.ProvidePlugin({
      //   CanvasKeyFrames: 'canvaskeyframes',
      // }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
      }),
    ],
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-pxtorem')({
            rootValue: 75, // 换算的基数
            selectorBlackList: ['weui', 'mu'], // 忽略转换正则匹配项
            propList: ['*'],
          }),
          require('autoprefixer')(),
        ],
      },
    },
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [resolve('src/less/function.less')],
    },
  },
  // chainWebpack: config => {
  //   const urlLoader = config.module.rule('images')
  //   // 清除已有的所有 loader。
  //   // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
  //   urlLoader.uses.clear()
  //   // 添加要替换的 loader
  //   urlLoader
  //     .test(/\.(png|jpe?g|gif|svg|webp)(\?.*)?$/)
  //     .use('url-loader')
  //     .loader('url-loader')
  //     .options({
  //       limit: 1024 * 20,
  //       name: '[path][name].[ext]', // 利用[path]路径获取文件夹名称并设置文件名
  //       fallback: 'file-loader', // 当超过8192byte时，会回退使用file-loader
  //       context: path.resolve(__dirname, './src'), //过滤掉[path]的相对路径
  //       publicPath: './', //采用根路径
  //     })
  // },
}
