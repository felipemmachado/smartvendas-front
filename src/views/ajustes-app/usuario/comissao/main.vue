<template>
  <div>

    <app-cabecalho-form :textoNovo="`Comissões <small>(${usuario.nome})</small>`" :editar="false"
      iconeNovo="attach_money" :exibeFechar="true" @fechar="$emit('fechar')" />

    <app-buscar :buscando="false" :btnLabel="'Nova Comissão'" permissao="CriarUsuario" :delay="0" class="q-mb-md"
      @novo="clickItem(null)" @buscar="(val) => termo = val" />

    <div v-if="lista.length == 0 && !carregando">
      Nenhum resultando encontrado.
    </div>

    <app-carregando v-if="carregando" />

    <div class="q-mb-lg">
      <q-list v-for="item in listaFiltrada" :key="item.id" bordered separator>

        <q-item v-ripple clickable @click="clickItem(item)">
          <q-item-section>
            <q-item-label>{{ item.nomeComissao.toUpperCase() }}</q-item-label>
            <q-item-label caption>{{ item.nomeUnidade.toUpperCase() }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label>{{ item.valor | formatMoney }}</q-item-label>
            <q-item-label caption><s>{{ item.valorComissaoUnidade | formatMoney }}</s></q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <q-dialog v-model="exibirCadatro">
      <q-card :style="{ 'min-width': $q.platform.is.mobile ? '100%' : '500px' }">
        <q-card-section>
          <app-cadastro :usuario="usuario" :cadastro="cadastro" @fechar="exibirCadatro = false" @excluiu="excluiu"
            @atualizar="atualizar" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>

import {
  QItem, QCard, QItemSection, QList, QCardSection, QItemLabel, QDialog,
} from 'quasar'
import { obterVendasComissao } from '../../../../services/usuario'
import appCadastro from './cadastro.vue'
import formatMoney from '../../../../filters/format-money'
import AppBuscar from '../../../../components/buscar/main.vue'
import AppCabecalhoForm from '../../../../components/cabecalho-form/main.vue'
import AppCarregando from '../../../../components/carregando/main.vue'

export default {

  components: {
    appCadastro,
    AppBuscar,
    AppCabecalhoForm,
    AppCarregando,
    QItem,
    QCard,
    QItemSection,
    QList,
    QItemLabel,
    QDialog,
    QCardSection,
  },

  filters: { formatMoney },

  props: {
    usuario: {
      type: Object,
      require: true,
      default: () => { },
    },
  },
  data() {
    return {
      exibirCadatro: false,
      carregando: true,
      lista: [],
      termo: '',
      cadastro: null,
    }
  },

  computed: {
    listaFiltrada() {
      if (this.termo !== '') {
        return this.lista.filter((i) => {
          const termo = this.termo.toLowerCase()
          return i.nomeComissao.toLowerCase().indexOf(termo) > -1
            || i.nomeUnidade.toLowerCase().indexOf(termo) > -1
        })
      }
      return this.lista
    },
  },

  async mounted() {
    this.carregando = true
    const lista = await obterVendasComissao(this.usuario.id)
    this.carregando = false
    this.lista = lista
  },

  methods: {

    atualizar(item) {
      const index = this.lista.findIndex((p) => p.id === item.id)
      if (index < 0) {
        this.lista.push(item)
      } else {
        this.lista[index] = item
      }
      this.exibirCadatro = false
      this.cadastro = null
    },

    excluiu(id) {
      const index = this.lista.findIndex((p) => p.id === id)
      if (index > -1) {
        this.lista.splice(index, 1)
      }

      this.exibirCadatro = false
      this.cadastro = null
    },

    clickItem(obj) {
      if (obj != null) {
        this.cadastro = obj
      } else {
        this.cadastro = null
      }

      this.exibirCadatro = false
      this.$nextTick(() => { this.exibirCadatro = true })
    },
  },
}
</script>
