<template>
<div>
  <div class="q-mb-md">
    <app-cabecalho-form
      textoEditar="Editar Unidade"
      textoNovo="Nova Unidade"
      :editar="uni != null"
      :exibeFechar="false"
      @fechar="$emit('fechar')"
    />
    <div v-if="uni" class="row">
      <div class="col-xs-12 col-md-4 q-mb-md">
        <small class="text-primary">NOME</small>
        <div class="">{{uni.nome?.toUpperCase()}}</div>
      </div>
      <div class="col-xs-12 col-md-4 q-mb-md">
        <div><small class="text-primary">RAZÃO SOCIAL</small></div>
        <div class="">{{uni.razaoSocial === null ? 'N/A' : uni.razaoSocial?.toUpperCase()}}</div>
      </div>
      <div class="col-xs-12 col-md-4 q-mb-md">
        <div><small class="text-primary">NOME FANTASIA</small></div>
        <div class="">{{uni.nomeFantasia === null ? 'N/A' : uni.nomeFantasia?.toUpperCase()}}</div>
      </div>
    </div>
  </div>

  <q-card>
    <q-tabs
      v-model="tab"
      inline-label
      outside-arrows
      align="left"
      mobile-arrows
      :class="{'bg-indigo-1 text-primary' : !$q.dark.isActive, 'text-primary' : $q.dark.isActive }"
      class="shadow-2"
    >
      <q-tab name="cadastro" icon="edit" label="Cadastro" />
      <q-tab  :disable="uni == null"
              name="funcionamento"
              icon="schedule"
              label="Horário de Funcionamento" />
      <q-tab  :disable="uni == null"
              name="dataBloqueio"
              icon="watch_later"
              label="Feriados" />
    </q-tabs>

    <div class="q-pa-md">
      <app-cadastro v-if="tab == 'cadastro'"
                    :unidade="uni"
                    @excluiu="(unidade) => $emit('excluiu', unidade)"
                    @unidade="atualizaUnidade" />

      <app-funcionamento v-if="tab == 'funcionamento'"
                        :unidade="uni" />

      <app-datas-bloqueadas v-if="tab == 'dataBloqueio'"
                        :unidade="uni" />
    </div>
  </q-card>
</div>
</template>

<script>

import {
  QCard, QTabs, QTab,
} from 'quasar'
import AppCadastro from './cadastro.vue'
import AppFuncionamento from './funcionamento.vue'
import AppDatasBloqueadas from './data-bloqueada.vue'
import AppCabecalhoForm from '../../../../components/cabecalho-form/main.vue'

export default {

  components: {
    AppCadastro,
    AppFuncionamento,
    AppDatasBloqueadas,
    AppCabecalhoForm,
    QCard,
    QTabs,
    QTab,
  },

  props: {
    unidade: {
      type: Object,
      required: false,
      default: () => null,
    },
  },

  data() {
    return {
      tab: 'cadastro',
      uni: this.unidade,
    }
  },

  mounted() {
    this.uni = this.unidade
  },

  methods: {
    atualizaUnidade(unidade) {
      this.uni = unidade
      this.$emit('unidade', unidade)
    },
  },
}
</script>
