<template>
<div>
<q-form @submit="salvar">
  <div class="row items-center q-col-gutter-md q-mt-sm">
    <div v-for="dia in semana" :key="dia.dia" class="col-12 col-md text-h6">

      <q-checkbox v-model="dia.habilitado"
                  :label="retornaNomeDia(dia.diaDaSemana)"
                  @input="valida(dia)" />

        <q-input ref="hora"
                v-model="dia.inicio"
                label="Início"
                class="q-mb-sm"
                placeholder="HH:MM"
                :readonly="!dia.habilitado"
                mask="##:##"
                outlined
                :rules="[val => validaHora(val) || 'Hora inválida']">
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-time v-model="dia.hora" mask="HH:mm" format24h />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input ref="hora"
                v-model="dia.fim"
                label="Fim"
                outlined
                class="q-pb-md"
                :readonly="!dia.habilitado"
                placeholder="HH:MM"
                mask="##:##"
                :rules="[val => validaHora(val) || 'Hora inválida']">
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-time v-model="dia.fim" mask="HH:mm" format24h />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
    </div>
  </div>

  <q-separator class="q-mt-md"></q-separator>

  <div class="row q-mt-md">
    <div class="col-xs-12">
      <q-btn
        type="submit"
        :disable="salvando"
        :loading="salvando"
        label="salvar"
        class="float-right"
        color="primary"
        icon="check" />
    </div>
  </div>
</q-form>
</div>
</template>

<script>
import {
  QCheckbox, QBtn, QInput, QSeparator, QForm, QIcon, QPopupProxy, QTime,
} from 'quasar'
import {
  postFuncionamento, retornaUnidadeFuncionamento, putFuncionamento, excluirFuncionamento,
} from '../../../../services/unidade'
import { validaHora } from '../../../../util/util'

export default {

  components: {
    QCheckbox,
    QBtn,
    QInput,
    QSeparator,
    QForm,
    QIcon,
    QPopupProxy,
    QTime,
  },

  props: {
    unidade: {
      type: Object,
      required: false,
      default: () => {},
    },
  },

  data() {
    return {
      salvando: false,
      qtdAtualizar: 0,
      qtdInserir: 0,
      qtdExcluir: 0,
      left: false,
      semana: [{
        id: 0,
        idUnidade: 0,
        diaDaSemana: 0,
        inicio: '',
        fim: '',
        habilitado: false,
      },
      {
        id: 0,
        idUnidade: 0,
        diaDaSemana: 1,
        inicio: '',
        fim: '',
        habilitado: false,
      },
      {
        id: 0,
        idUnidade: 0,
        diaDaSemana: 2,
        inicio: '',
        fim: '',
        habilitado: false,
      },
      {
        id: 0,
        idUnidade: 0,
        diaDaSemana: 3,
        inicio: '',
        fim: '',
        habilitado: false,
      },
      {
        id: 0,
        idUnidade: 0,
        diaDaSemana: 4,
        inicio: '',
        fim: '',
        habilitado: false,
      },
      {
        id: 0,
        idUnidade: 0,
        diaDaSemana: 5,
        inicio: '',
        fim: '',
        habilitado: false,
      },
      {
        id: 0,
        idUnidade: 0,
        diaDaSemana: 6,
        inicio: '',
        fim: '',
        habilitado: false,
      }],
    }
  },

  async mounted() {
    const lista = await retornaUnidadeFuncionamento(this.unidade.id)
    lista.forEach((item) => {
      const semana = this.semana.find((x) => x.diaDaSemana === item.diaDaSemana)
      semana.id = item.id
      semana.inicio = item.inicio
      semana.fim = item.fim
      semana.habilitado = true
    })
  },

  methods: {
    validaHora(hora) { return validaHora(hora) },

    valida(dia) {
      if (!dia.habilitado) {
        this.semana[dia.diaDaSemana].inicio = ''
        this.semana[dia.diaDaSemana].fim = ''
      }
    },

    retornaNomeDia(index) {
      if (index === 0) return 'Domingo'
      if (index === 1) return 'Segunda'
      if (index === 2) return 'Terça'
      if (index === 3) return 'Quarta'
      if (index === 4) return 'Quinta'
      if (index === 5) return 'Sexta'
      if (index === 6) return 'Sábado'
      return ''
    },

    concluido() {
      if (this.qtdInserir === 0 && this.qtdAtualizar === 0 && this.qtdExcluir === 0) {
        this.salvando = false
        this.$q.notify({
          type: 'positive',
          position: 'top',
          message: 'Funcionamento salvo.',
        })
      }
    },

    salvar() {
      const inserir = []
      const atualizar = []
      const excluir = []

      this.semana.forEach((item) => {
        const it = item
        it.idUnidade = this.unidade.id

        if (item.id === 0 && item.inicio !== '' && item.fim !== '') {
          inserir.push(it)
        }

        if (item.id !== 0 && item.inicio === '' && item.fim === '') {
          excluir.push(item)
        }

        if (item.id !== 0 && item.inicio !== '' && item.fim !== '') {
          atualizar.push(item)
        }
      })

      this.qtdAtualizar = atualizar.length
      this.qtdExcluir = excluir.length
      this.qtdInserir = inserir.length

      this.salvando = true

      inserir.forEach(async (item) => {
        const resposta = await postFuncionamento(item)
        this.qtdInserir -= 1
        this.concluido(resposta)
      })

      atualizar.forEach(async (item) => {
        const resposta = await putFuncionamento(item)
        this.qtdAtualizar -= 1
        this.concluido(resposta)
      })

      excluir.forEach(async (item) => {
        const resposta = await excluirFuncionamento(item.idUnidade, item.id)
        this.qtdExcluir -= 1
        this.concluido(resposta)
      })
    },
  },
}
</script>
