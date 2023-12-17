import Vue from 'vue'
import money from 'v-money'
import App from './views/main.vue'
import './registerServiceWorker'
import router from './router'
import './quasar'
import store from './store'
import theme from './configs/theme'

Vue.use(money)

Vue.config.productionTip = false

// eslint-disable-next-line no-extend-native
Object.defineProperty(Array.prototype, 'chunk', {
  value(chunkSize) {
    const R = []
    for (let i = 0; i < this.length; i += chunkSize) R.push(this.slice(i, i + chunkSize))
    return R
  },
})

new Vue({
  router,
  store,
  created() {
    const tema = theme.getThemaUsuario()

    // se não tiver nenhum tema aplicado e o ambiente for escuro
    if (tema == null && (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      theme.dark()
      return
    }

    if (tema === 'dark') theme.dark()
    else theme.light()
  },
  render: (h) => h(App),
}).$mount('#app')
