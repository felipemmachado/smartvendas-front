process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {

  pwa: {
    workboxOptions: { skipWaiting: true },
    name: 'Smart Vendas',
    themeColor: '#212121',
    msTileColor: '#FFFFFF',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
  },
  devServer: { port: 9999 },
  pluginOptions: {
    quasar: {
      importStrategy: 'manual',
      rtlSupport: false,
    },
  },
  transpileDependencies: [
    'quasar',
  ],
}
