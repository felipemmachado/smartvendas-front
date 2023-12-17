<template>
  <div class="row">
    <div class="col-md-12 animated fadeIn fast">

      <div class="q-pl-md">
        <app-btn-voltar label="Ajustes" cls="q-pl-md q-mt-md" rota="ajustes" />
      </div>

      <div class="row no-print">
        <div class="col-xs-12 col-md-4 q-pt-md q-pl-md q-pr-md">
          <app-select-unidade @unidade-atual="carregaLista" />
        </div>
      </div>

      <div class="row">
        <div class="col-xs-12 q-pa-md animated fadeIn fast">

          <div class="text-h5">
            <q-icon class="text-primary icone-correcao" name="o_attach_money" />Comissões
          </div>
          <app-buscar :buscando="buscando" :btn-label="'Nova Comissão'" :delay="0" permissao="CriarComissao" @novo="clickNova(null)"
            @buscar="filtaLista" />

          <app-carregando v-if="carregando" height="120px" tipo="lista" />

          <div v-else>
            <div class="row q-mt-md">
              <div v-for="(item, index) in comissoes[pagination.page - 1]" :key="index"
                class="col-xs-12 col-md-3 q-mb-md" :class="{ 'q-pr-md': !$q.platform.is.mobile }">
                <q-card style="height: 120px">

                  <q-card-section>

                    <q-item-label lines="1"
                      :class="{ 'text-grey-1': $q.dark.isActive, 'text-black': !$q.dark.isActive }">
                      {{ item.descricao }}
                    </q-item-label>

                    <q-item-label >
                      <q-badge outline rounded
                      :color="item.habilitado ? 'positive' : 'negative'"
                      :label="item.habilitado ? 'Habilitado' : 'Desativado'" />
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
    <q-dialog v-model="exibirCadatro">
      <q-card :style="{ 'min-width': $q.platform.is.mobile ? '100%' : '500px' }">
        <q-card-section>
          <app-unidade-cadastro :unidade="unidadeAtual" :comissao="item" @excluiu="excluiu" @comissao="atualizar"
            @fechar="exibirCadatro = false"></app-unidade-cadastro>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>

import {
  QIcon, QCard, QCardSection, QCardActions, QPagination, QItemLabel, QBadge, QBtn, QDialog,
} from 'quasar'
import { retornaTodasComissoesDeVenda } from '../../../services/unidade'
import AppUnidadeCadastro from './cadastro.vue'
import { temPermissao, orderBy } from '../../../util/util'
import AppBuscar from '../../../components/buscar/main.vue'
import AppSelectUnidade from '../../../components/select-unidade/main.vue'
import AppBtnVoltar from '../../../components/btn-voltar/main.vue'
import AppCarregando from '../../../components/carregando/main.vue'

export default {

  components: {
    AppUnidadeCadastro,
    AppBuscar,
    AppSelectUnidade,
    AppBtnVoltar,
    AppCarregando,
    QIcon,
    QCard,
    QCardSection,
    QCardActions,
    QPagination,
    QItemLabel,
    QBadge,
    QBtn,
    QDialog,
  },

  data() {
    return {
      unidadeAtual: null,
      buscando: false,
      todasComissoes: [],
      comissoes: [],
      item: null,
      exibirCadatro: false,
      carregando: false,
      termo: '',

      pagination: {
        page: 1,
        rowsPerPage: 12,
      },
    }
  },

  computed: {
    pagesNumber() {
      return Math.ceil(this.todasComissoes.length / this.pagination.rowsPerPage)
    },
  },

  methods: {
    temPermissao(permissao) { return temPermissao(permissao) },

    async carregaLista(unidade) {
      this.unidadeAtual = unidade
      this.carregando = true
      const lista = await retornaTodasComissoesDeVenda(unidade.id)
      this.todasComissoes = orderBy(lista, 'descricao')
      this.comissoes = [...this.todasComissoes].chunk(this.pagination.rowsPerPage)
      this.carregando = false
    },
    excluiu(item) {
      const index = this.todasComissoes.findIndex((i) => i.id === item.id)
      if (index > -1) {
        this.todasComissoes.splice(index, 1)
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
      const index = this.todasComissoes.findIndex((i) => i.id === comissao.id)
      if (index > -1) {
        this.todasComissoes[index] = comissao
      } else {
        this.todasComissoes.push(comissao)
      }

      this.exibirCadatro = false
      this.filtaLista('')
    },
    filtaLista(termo) {
      this.pagination.page = 1

      if (termo === '') {
        this.comissoes = [...this.todasComissoes].chunk(this.pagination.rowsPerPage)
        return
      }

      const lista = [...this.todasComissoes]
        .filter((p) => p.razaoSocial.toLowerCase().includes(termo.toLowerCase()))
        .chunk(this.pagination.rowsPerPage)
      this.comissoes = lista
    },
  },
}
</script>
