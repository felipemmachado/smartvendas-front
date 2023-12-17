<template>
  <div>
    <app-buscar :btn-label="'Novo Usuário'" :buscando="false" :delay="0" @novo="$emit('editar', null)" @buscar="(val) => filtra(val)" />
    <div class="row q-mt-md">
      <div v-for="(usu, index) in usuarios[pagination.page - 1]" :key="index" class="col-xs-12 col-md-3 q-mb-md"
        :class="{ 'q-pr-md': !$q.platform.is.mobile }">
        <q-card style="height: 140px">
          <q-card-section>
            <q-item-label lines="1" :class="{ 'text-grey-1': $q.dark.isActive, 'text-black': !$q.dark.isActive }">
              {{ usu.nome }}
            </q-item-label>
            <q-item-label :class="{ 'text-deep-purple-4': $q.dark.isActive, 'text-deep-purple-10': !$q.dark.isActive }"
              style="opacity: .8;">
              {{ usu.perfil.nome }}
            </q-item-label>
            <q-item-label :class="{ 'text-grey-1': $q.dark.isActive, 'text-black': !$q.dark.isActive }"
              style="opacity: .5;">
              {{ usu.login }}
            </q-item-label>
          </q-card-section>

          <q-card-actions>
            <q-btn color="primary" label="editar" flat @click="$emit('editar', usu)" />
            <div style="flex: 1"></div>
            <q-btn v-if="exibirUsuarios" color="primary" label="Usuários" flat @click="$emit('usuarios', usu)" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <div v-if="usuarios[pagination.page - 1]?.length > 0" class="row justify-center q-mt-md">
      <q-pagination v-model="pagination.page" direction-links color="primary" :max="pagesNumber" max-pages="7" />
    </div>
  </div>
</template>

<script>

import {
  QItemLabel, QPagination, QCardActions, QCard, QCardSection, QBtn,
} from 'quasar'
import AppBuscar from '../../../components/buscar/main.vue'
import { orderBy } from '../../../util/util'

export default {

  components: {
    AppBuscar,
    QItemLabel,
    QPagination,
    QCardActions,
    QCard,
    QBtn,
    QCardSection,
  },

  props: {
    todosUsuarios: {
      type: Array,
      default: () => [],
      required: false,
    },
    perfis: {
      type: Array,
      required: true,
      default: () => [],
    },
    exibirUsuarios: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      usuarios: [],
      pagination: {
        page: 1,
        rowsPerPage: 12,
      },
    }
  },

  computed: {
    pagesNumber() {
      return Math.ceil(this.todosUsuarios.length / this.pagination.rowsPerPage)
    },
  },

  watch: {
    termo: {
      handler(val) {
        this.filtra(val)
      },
    },
  },

  mounted() {
    this.carregaUsuarios()
  },

  methods: {

    filtra(termo) {
      this.pagination.page = 1

      if (termo === '') {
        this.usuarios = [...this.todosUsuarios].chunk(this.pagination.rowsPerPage)
        return
      }

      const usuarios = [...this.todosUsuarios]
        .filter((p) => p.nome.toLowerCase().includes(termo.toLowerCase()))
        .chunk(this.pagination.rowsPerPage)
      this.usuarios = usuarios
    },

    carregaUsuarios() {
      const todosUsuarios = orderBy(this.todosUsuarios.filter((p) => !p.excluido).map((u) => {
        const novoUsuario = u
        novoUsuario.perfil = this.perfis.find((p) => p.id === u.idPerfil)
        return novoUsuario
      }), 'nome')
      this.usuarios = [...todosUsuarios].chunk(this.pagination.rowsPerPage)
    },
  },
}
</script>
