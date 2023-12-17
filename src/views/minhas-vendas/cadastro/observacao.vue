<template>
<div>
  <div class="row">

    <div v-if="observacoes.length > 0" class="col-xs-12">
      <div class="q-mb-xs">Observação</div>
      <div v-for="(item, index) in observacoes" :key="index" class="q-mb-md">
        <div class="q-mb-xs">{{item.descricao}}
        <q-btn
          v-if="!fechado ? editar: false"
          type="button"
          class="q-mb-xs q-ml-xs"
          size="sm"
          label="Remover"
          flat
          :loading="excluindo"
          color="negative"
          icon="delete"
          @click="excluir(item.id, index)" />
          <q-icon name="info" class="float-right">
            <q-tooltip anchor="center left" self="center right">
              Criado por <strong>{{item.nome}}</strong>
              em <strong>{{ item.dataCriacao | formatDateTime }}</strong>
            </q-tooltip>
          </q-icon>
        </div>
        <q-separator />
      </div>
    </div>

    <div v-if="exibirBotaoNovo" class="col-xs-12">
      <div v-if="!editar || (observacoes.length == 0 || exibeNovaObservacao)">
        <q-input v-model="observacao" outlined
                label="Observação"
                counter
                rows="5"
                maxlength="500"
                type="textarea"
                class="q-pb-md q-mb-md"
                @blur="$emit('observacao', observacao)" />
      </div>

      <div v-if="observacoes.length > 0" class="q-mb-md">
        <q-btn size="sm"
                :icon="!exibeNovaObservacao ? 'add' : 'close'"
                :color="'primary'"
                @click="exibeNovaObservacao = !exibeNovaObservacao">
          {{!exibeNovaObservacao ? 'Nova' : 'Cancelar'}} Observação
        </q-btn>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {
  QBtn, QInput, QTooltip, QIcon, QSeparator,
} from 'quasar'
import { excluirObservacao, retornaObservacoes } from '../../../services/venda-agenda'
import formatDateTime from '../../../filters/format-date-time'

export default {

  components: {
    QBtn,
    QInput,
    QTooltip,
    QIcon,
    QSeparator,
  },

  filters: {
    formatDateTime,
  },

  props: {
    idVenda: {
      type: String,
      required: true,
      default: '00000000-0000-0000-0000-000000000000',
    },

    editar: {
      type: Boolean,
      require: true,
      default: false,
    },

    fechado: {
      type: Boolean,
      require: true,
      default: false,
    },

    exibirBotaoNovo: {
      type: Boolean,
      require: false,
      default: true,
    },
  },

  data() {
    return {
      exibeNovaObservacao: false,
      observacoes: [],
      observacao: '',
      excluindo: false,
    }
  },

  watch: {
    idVenda: {
      handler(val, odlVal) {
        if (val !== odlVal) {
          if (val !== '00000000-0000-0000-0000-000000000000') {
            this.carregaObservacoes(val)
          }
        }
      },
    },
  },

  mounted() {
    this.carregaObservacao()
  },

  methods: {
    carregaObservacao() {
      this.exibeNovaObservacao = false
      this.observacao = ''
      if (this.idVenda !== '00000000-0000-0000-0000-000000000000') {
        this.carregaObservacoes(this.idVenda)
      }
    },

    async carregaObservacoes(idVenda) {
      const lista = await retornaObservacoes(idVenda)
      this.observacoes = lista
    },

    excluir(idObservacao, index) {
      this.$q.dialog({
        title: 'Remover',
        message: 'Deseja remover esse observação?',
        cancel: true,
        persistent: true,
        ok: {
          label: 'Remover',
          color: 'negative',
        },
      }).onOk(async () => {
        this.excluindo = true
        const reposta = await excluirObservacao(this.idVenda, idObservacao)
        this.excluindo = false
        if (reposta.success) {
          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: 'Observação Removida.',
          })

          this.observacoes.splice(index, 1)
        } else {
          this.$q.notify({
            type: 'negative',
            position: 'top',
            message: reposta.message,
          })
        }
      })
    },
  },
}
</script>
