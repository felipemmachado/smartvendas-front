<template>
  <router-view></router-view>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import local from '../configs/local-storage'

export default {
  computed: {
    ...mapState({
      sessao: (state) => state.sessao.user,
      config: (state) => state.sessao.config,
      theme: (state) => state.sessao.theme,
    }),
  },
  beforeMount() {
    if (this.sessao == null && sessionStorage.getItem(local.localSessao) != null) {
      this.setSession(JSON.parse(sessionStorage.getItem(local.localSessao)))

      if (this.sessao.alterar_senha === 'True') {
        this.$router.push({ name: 'alterar-senha' }).catch(() => {})
      }

      return
    }

    this.setSession(null)
    this.$router.push({ name: 'login' }).catch(() => {})
  },
  methods: {
    ...mapActions(['setSession', 'setConfig']),
  },
}
</script>
