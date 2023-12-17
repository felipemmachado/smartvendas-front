<template>
<div>
  <q-form @submit="submitSalvar">
    <div class="row q-col-gutter-md">
      <div class="col-xs-12 col-sm-8">
        <q-input ref="data"
                v-model="form.data"
                label="Data"
                class="q-pb-md"
                placeholder="DD/MM/AAAA"
                mask="##/##/####"
                :loading="verificandoDataUnidade"
                :rules="[val => !!val || 'A data é obrigatório',
                        val => validaData(val) || 'Data inválida',
                        val => dataUnidadeValida || 'Data fora do horário de funcionamento']"
                @blur="podeAgendarUnidade()">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="form.data"
                        mask="DD/MM/YYYY"
                        @input="() => $refs.qDateProxy.hide()" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-xs-12 col-sm-4">
        <q-input ref="hora"
                v-model="form.hora"
                label="Hora"
                class="q-pb-md"
                placeholder="HH:MM"
                mask="##:##"
                :rules="[val => !!val || 'A data é obrigatório',
                        val => validaHora(val) || 'Hora inválida',
                        val => dataUnidadeValida || 'Hora fora do horário de funcionamento']"
                @blur="podeAgendarUnidade('DATA')">
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-time v-model="form.hora" mask="HH:mm" format24h />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>

    <q-separator class="q-mt-md q-mb-md"></q-separator>

    <div class="row">
      <div class="col-xs-12">
        <q-btn
            type="submit"
            :disable="salvando || verificandoDataUnidade"
            :loading="salvando"
            label="salvar"
            color="primary"
            class="float-right"
            icon="check" />
      </div>
    </div>
  </q-form>
</div>
</template>

<script>
import { mapState } from 'vuex'
import {
  QForm, QInput, QBtn, QTime, QPopupProxy, QSeparator, QIcon, QDate,
} from 'quasar'
import { formatSqlDate, validaHora, validaData } from '../../../util/util'
import { podeAgendar } from '../../../services/unidade'
import { reagendar } from '../../../services/venda-agenda'

export default {

  components: {
    QForm,
    QInput,
    QBtn,
    QTime,
    QPopupProxy,
    QSeparator,
    QIcon,
    QDate,
  },

  props: {
    venda: {
      type: Object,
      require: true,
      default: () => {},
    },
  },

  data() {
    return {
      salvando: false,
      dataUnidadeValida: true,
      verificandoDataUnidade: false,
      form: {
        data: '',
        hora: '',
      },
    }
  },

  computed: {
    ...mapState({
      sessao: (state) => state.sessao.user,
    }),
  },

  methods: {
    validaHora(hora) { return validaHora(hora) },
    validaData(data) { return validaData(data) },

    async submitSalvar() {
      const data = {
        idVenda: this.venda.id,
        data: `${formatSqlDate(this.form.data)} ${this.form.hora}`,
      }

      this.salvando = true
      const retorno = await reagendar(this.venda.id, data)
      this.salvando = false
      if (retorno.success) {
        this.$q.notify({
          type: 'positive',
          position: 'top',
          message: 'Venda reagendada com sucesso.',
        })

        this.$emit('reagendado', retorno.id)
      }
    },

    async podeAgendarUnidade() {
      if ((this.form.data !== '' && this.form.data.length === 10) && (this.form.hora !== '' && this.form.hora.length === 5)) {
        const data = `${formatSqlDate(this.form.data)}T${this.form.hora}`
        this.verificandoDataUnidade = true
        this.dataUnidadeValida = true

        const pode = await podeAgendar(this.sessao.unidadeAtual.id, data)
        this.verificandoDataUnidade = false
        this.dataUnidadeValida = pode
        this.$refs.data.validate()
        this.$refs.hora.validate()
      }
    },
  },
}
</script>
