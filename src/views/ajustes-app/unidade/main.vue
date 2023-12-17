<template>
  <div class="row">
    <div v-show="!exibirCadatro" class="col-md-12 q-pa-md animated fadeIn fast">
      <app-btn-voltar label="Ajustes" cls="q-mb-md" rota="ajustes" />

      <div class="text-h5">
        <q-icon class="text-primary icone-correcao" name="o_place" />Unidades
      </div>
      <app-buscar :buscando="buscando" :btn-label="'Nova Unidade'" permissao="CriarUnidade" :delay="0"
        @novo="clickNova(null)" @buscar="filtaLista" />

      <app-carregando v-if="carregando" height="100px" tipo="lista" />

      <div v-else>
        <div class="row q-mt-md">
          <div v-for="(item, index) in unidades[pagination.page - 1]" :key="index"
          class="col-xs-12 col-md-3 q-mb-md" :class="{'q-pr-md': !$q.platform.is.mobile}">
          <q-card style="height: 100px">
            <q-card-section>
              <q-item-label lines="1" :class="{ 'text-grey-1': $q.dark.isActive, 'text-black': !$q.dark.isActive }">
                {{ item.nome }}
              </q-item-label>
            </q-card-section>

            <q-card-actions>
              <q-btn v-if="temPermissao('AtualizarUndiade')" label="editar" color="primary" flat
                @click="clickNova(item)" />
            </q-card-actions>
          </q-card>
        </div>
        </div>

        <div class="row justify-center q-mt-md">
          <q-pagination v-model="pagination.page" direction-links color="primary" :max="pagesNumber" max-pages="7" />
        </div>
      </div>
    </div>
    <div v-if="exibirCadatro" class="col-xs-12 q-pa-md animated fadeIn fast">
      <app-btn-voltar label="Unidades" cls="q-mb-md" @voltar="exibirCadatro = false" />

      <app-unidade-cadastro :unidade="unidade" @excluiu="excluiu" @unidade="atualizaUnidade"
        @fechar="exibirCadatro = false"></app-unidade-cadastro>
    </div>

  </div>
</template>

<script>

import { mapActions } from 'vuex'
import {
  QIcon, QCard, QCardSection, QCardActions, QPagination, QItemLabel, QBtn,
} from 'quasar'
import { retornaTodasUnidades } from '../../../services/unidade'
import appUnidadeCadastro from './cadastro/main.vue'
import { temPermissao, orderBy } from '../../../util/util'
import document from '../../../filters/document'
import AppBuscar from '../../../components/buscar/main.vue'
import AppBtnVoltar from '../../../components/btn-voltar/main.vue'
import AppCarregando from '../../../components/carregando/main.vue'

export default {

  components: {
    appUnidadeCadastro,
    AppBuscar,
    AppBtnVoltar,
    AppCarregando,
    QIcon,
    QCard,
    QCardSection,
    QCardActions,
    QPagination,
    QItemLabel,
    QBtn,
  },

  filters: {
    document,
  },

  data() {
    return {
      buscando: false,
      todasUnidades: [],
      unidades: [],
      unidade: [],
      exibirCadatro: false,
      carregando: false,
      pagination: {
        page: 1,
        rowsPerPage: 12,
      },
    }
  },

  computed: {
    pagesNumber() {
      return Math.ceil(this.todasUnidades.length / this.pagination.rowsPerPage)
    },
  },

  mounted() {
    this.carregaLista()
  },

  methods: {
    ...mapActions(['setUnidades']),

    temPermissao(permissao) { return temPermissao(permissao) },

    async carregaLista() {
      this.carregando = true
      const lista = await retornaTodasUnidades()
      this.todasUnidades = orderBy(lista, 'descricao')
      this.unidades = [...this.todasUnidades].chunk(this.pagination.rowsPerPage)
      this.carregando = false
    },
    excluiu(unidade) {
      const index = this.todasUnidades.findIndex((i) => i.id === unidade.id)
      if (index > -1) {
        this.todasUnidades.splice(index, 1)
      }

      this.setUnidades(this.todasUnidades)
      this.unidade = null
      this.exibirCadatro = false
      this.filtaLista('')
    },
    clickNova(obj) {
      if (obj !== null) {
        this.unidade = obj
      } else {
        this.unidade = null
      }
      this.exibirCadatro = false
      this.$nextTick(() => { this.exibirCadatro = true })
    },
    atualizaUnidade(unidade) {
      const index = this.todasUnidades.findIndex((i) => i.id === unidade.id)
      if (index > -1) {
        this.todasUnidades[index] = unidade
      } else {
        this.todasUnidades.push(unidade)
      }
      this.setUnidades(this.todasUnidades)
      this.filtaLista('')
    },
    clickCancela() {
      this.model = null
      this.exibirCadatro = false
    },
    filtaLista(termo) {
      this.pagination.page = 1

      if (termo === '') {
        this.unidades = [...this.todasUnidades].chunk(this.pagination.rowsPerPage)
        return
      }

      const lista = [...this.todasUnidades]
        .filter((p) => p.razaoSocial.toLowerCase().includes(termo.toLowerCase()))
        .chunk(this.pagination.rowsPerPage)
      this.lista = lista
    },
  },
}
</script>
