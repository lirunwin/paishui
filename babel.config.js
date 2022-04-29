module.exports = {
  presets: [
    '@vue/app',
    [
      '@vue/babel-preset-jsx',
      {
        injectH: false
      }
    ]
  ],
  plugins: [
    'transform-remove-strict-mode' // 配置插件，这里很重要
  ],
  ignore: ['./public/Voice/*.js', './src/layout/js/*.js']
}
