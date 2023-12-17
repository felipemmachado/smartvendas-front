<template>
  <div class="row">
    <div class="col-md-12 animated fadeIn fast">
      <div class="row">
        <div class="col-xs-12 q-pa-md animated fadeIn fast">
          <app-btn-voltar label="Ajustes" cls="q-mb-md" rota="ajustes" />

          <div class="text-h5">
            <q-icon class="text-primary icone-correcao" name="o_all_inbox" />
            Tipos de Venda
          </div>
          <app-buscar :buscando="buscando" :delay="0" permissao="CriarComissao" :btn-label="'Novo Tipo'"
            @novo="clickNova(null)" @buscar="filtaLista" />

          <app-carregando v-if="carregando" height="100px" tipo="lista" />

          <div v-else class="q-mt-md">
            <div class="row">
              <div v-for="(item, index) in lista[pagination.page - 1]" :key="index"
                class="col-xs-12 col-md-3 q-mb-md" :class="{'q-pr-md': !$q.platform.is.mobile}">
                <q-card style="height: 100px">
                  <q-card-section>
                    <q-item-label lines="1"
                      :class="{ 'text-grey-1': $q.dark.isActive, 'text-black': !$q.dark.isActive }">
                      {{ item.descricao }}
                    </q-item-label>
                  </q-card-section>

                  <q-card-actions>
                    <q-btn v-if="temPermissao('AtualizarComissao')" label="editar" color="primary" flat
                      @click="clickNova(item)" />
                  </q-card-actions>
                </q-card>
              </div>
            </div>

            <div class="row justify-center q-mt-md">
              <q-pagination v-model="pagination.page" direction-links color="primary" :max="pagesNumber"
                max-pages="7" />
            </div>
          </div>
        </div>

      </div>
    </div>
    <q-dialog v-model="exibirCadatro" :maximized="$q.platform.is.mobile">
      <q-card :style="{ 'min-width': $q.platform.is.mobile ? 'auto' : '500px' }">
        <q-card-section>
          <app-cadastro :unidade="unidadeAtual" :cadastro="item" @excluiu="excluiu" @cadastro="atualizar"
            @fechar="exibirCadatro = false"></app-cadastro>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>

import {
  QIcon, QCard, QCardSection, QCardActions, QPagination, QItemLabel, QBtn, QDialog,
} from 'quasar'
import { retornaTodos } from '../../../services/venda-agenda-tipo'
import appCadastro from './cadastro.vue'
import AppBuscar from '../../../components/buscar/main.vue'
import { temPermissao, orderBy } from '../../../util/util'
import AppBtnVoltar from '../../../components/btn-voltar/main.vue'
import AppCarregando from '../../../components/carregando/main.vue'

export default {

  components: {
    appCadastro,
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
    QDialog,
  },

  data() {
    return {
      unidadeAtual: null,
      buscando: false,
      listaCompleta: [],
      lista: [],
      item: null,
      exibirCadatro: false,
      carregando: true,

      pagination: {
        page: 1,
        rowsPerPage: 12,
      },
    }
  },

  computed: {
    pagesNumber() {
      return Math.ceil(this.listaCompleta.length / this.pagination.rowsPerPage)
    },
  },

  mounted() {
    this.carregaLista()
  },

  methods: {
    temPermissao(permissao) { return temPermissao(permissao) },

    async carregaLista(unidade) {
      this.unidadeAtual = unidade
      this.carregando = true
      const lista = await retornaTodos()
      this.listaCompleta = orderBy(lista, 'descricao')
      this.lista = [...this.listaCompleta].chunk(this.pagination.rowsPerPage)

      this.carregando = false
    },
    excluiu(item) {
      const index = this.listaCompleta.findIndex((i) => i.id === item.id)
      if (index > -1) {
        this.listaCompleta.splice(index, 1)
      }
      this.item = null
      this.exibirCadatro = false
      this.filtaLista('')
    },
    clickNova(obj) {
      if (obj !== null) {
        this.item = obj
      } else {
        this.item = null
      }
      this.exibirCadatro = false
      this.$nextTick(() => { this.exibirCadatro = true })
    },
    atualizar(comissao) {
      const index = this.listaCompleta.findIndex((i) => i.id === comissao.id)
      if (index > -1) {
        this.listaCompleta[index] = comissao
      } else {
        this.listaCompleta.push(comissao)
      }
      this.exibirCadatro = false
      this.filtaLista('')
    },
    clickCancela() {
      this.model = null
      this.exibirCadatro = false
    },
    filtaLista(termo) {
      this.pagination.page = 1

      if (termo === '') {
        this.lista = [...this.listaCompleta].chunk(this.pagination.rowsPerPage)
        return
      }

      const lista = [...this.listaCompleta]
        .filter((p) => p.descricao.toLowerCase().includes(termo.toLowerCase()))
        .chunk(this.pagination.rowsPerPage)
      this.lista = lista
    },
  },
}
</script>
