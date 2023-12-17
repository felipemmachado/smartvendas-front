<template>
  <div>
    <app-cabecalho-form iconeNovo="calendar_today" :textoNovo="`Extrato ${nomeMes} de ${ano}`" :exibeFechar="true"
      @fechar="$emit('fechar')" />

    <div v-if="carregando">Carregando...</div>
    <q-scroll-area :style="{ 'height': `${height}px` }">
      <q-list bordered separator>
        <div v-for="(item, index) in unidades" :key="index">
          <q-expansion-item switch-toggle-side expand-separator :label="item.nome" icon="perm_identity">
            <template v-slot:header>
              <q-item-section>
                {{ item.nome }}
              </q-item-section>

              <q-item-section side>
                <div v-if="!item.load" :class="$q.platform.is.mobile ? 'text-h7' : 'text-h6'">
                  {{ item.valor | formatMoney }}
                </div>
                <q-spinner v-if="item.load" />
              </q-item-section>
            </template>

            <q-list bordered separator class="q-mt-sm q-ml-sm q-mr-sm q-mb-md">
              <q-item v-if="item.extrato.length == 0 && !item.load">
                <q-item-section>
                  Nenhum resultado encontrado.
                </q-item-section>
              </q-item>
              <q-item v-for="(it, index) in item.extrato" v-show="item.extrato.length > 0" :key="index">
                <q-item-section>
                  <q-item-label v-if="it.nomeUsuarioRepresentante == null">
                    {{ it.nomeUsuario }}
                  </q-item-label>
                  <q-item-label v-if="it.nomeUsuarioRepresentante != null">
                    {{ it.nomeUsuarioRepresentante }}
                  </q-item-label>
                  <q-item-label caption>{{ it.descricao }} </q-item-label>
                  <q-item-label caption>{{ it.criadoEm }} </q-item-label>
                </q-item-section>
                <q-item-section class="text-h6 text-right" side>
                  <div>
                    {{ it.valor | formatMoney }}
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>
        </div>
      </q-list>
    </q-scroll-area>

    <div class="text-h5 q-mt-md">
      <span>TOTAL</span>
      <span class="float-right">{{ total | formatMoney }}</span>
    </div>
  </div>
</template>

<script>

import dayjs from 'dayjs'
import { mapState } from 'vuex'
import {
  QScrollArea, QList, QExpansionItem, QItemSection, QItemLabel, QItem, QSpinner,
} from 'quasar'
import { obterFaturas } from '../../services/usuario'
import formatMoney from '../../filters/format-money'
import AppCabecalhoForm from '../../components/cabecalho-form/main.vue'
import { orderBy } from '../../util/util'

export default {

  components: {
    AppCabecalhoForm,
    QScrollArea,
    QList,
    QItem,
    QExpansionItem,
    QItemSection,
    QItemLabel,
    QSpinner,
  },

  filters: { formatMoney },

  props: {
    mes: {
      type: Number,
      required: true,
      default: 0,
    },
    ano: {
      type: Number,
      required: true,
      default: 0,
    },
    idUnidade: {
      type: String,
      required: true,
      default: '',
    },
    idUsuario: {
      type: String,
      required: true,
      default: '',
    },
    nomeMes: {
      type: String,
      required: true,
      default: '',
    },
  },

  data() {
    return {
      lista: [],
      height: 0,
      carregando: false,
      total: 0,
      unidades: [],
    }
  },

  computed: {
    ...mapState({
      sessao: (state) => state.sessao.user,
    }),
  },

  watch: {
    mes: {
      handler(val, odlVal) {
        if (val !== odlVal) {
          this.carregaUnidades()
        }
      },
    },
  },

  mounted() {
    this.height = window.innerHeight - (this.$q.platform.is.mobile ? 130 : 180)
    this.carregaUnidades()
  },

  methods: {

    carregaUnidades() {
      this.total = 0
      this.unidades = []
      this.sessao.unidades.forEach((unidade) => {
        const unit = unidade
        unit.load = true
        unit.valor = 0
        unit.extrato = []
        this.unidades.push(unit)
        this.carregaExtrato(unit, unit.id, this.mes, this.ano)
      })
    },

    async carregaExtrato(unidade, idUnidade, mes, ano) {
      const n = unidade
      const lista = await obterFaturas(idUnidade, mes, ano)

      n.extrato = orderBy(lista.map((item) => {
        const itemEditado = item
        const data = dayjs(String(item.criadoEm))
        const dt = new Date(item.criadoEm)
        itemEditado.criadoEm = `${dt.toLocaleDateString('pt-br')} ${dt.toLocaleTimeString('pt-br')}`
        itemEditado.dataId = data.valueOf()
        this.total += Number(item.valor)
        n.valor += Number(item.valor)
        return itemEditado
      }), 'dataId')

      n.load = false
      this.$forceUpdate()
    },
  },
}
</script>
