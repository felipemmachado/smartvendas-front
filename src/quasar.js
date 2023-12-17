import Vue from 'vue'

import './styles/quasar.scss'
import './assets/css/animate.css'
import lang from 'quasar/lang/pt-br'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import {
  Quasar,
  Ripple,
  ClosePopup,
  Notify,
  Loading,
  Dialog,
} from 'quasar'

Vue.use(Quasar, {
  config: {},
  components: {},
  directives: {
    Ripple,
    ClosePopup,
  },
  plugins: {
    Notify,
    Loading,
    Dialog,
  },
  lang,
})
