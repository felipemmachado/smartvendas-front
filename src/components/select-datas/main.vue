<template>
  <q-form @submit="submitSalvar">
    <div class="q-mt-md">
      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-md-7">
          <q-input ref="data" v-model="valor" label="Início - Fim" dense class="q-mb-sm" mask="##/##/#### - ##/##/####"
            placeholder="DD/MM/AAAA - DD/MM/AAAA" :rules="[val => !!val || 'A data é obrigatório',
            val => validaTamanhoDatas(val) || 'Você tem que informar duas datas',
            val => validaDatas(val) || 'Data inválidas']">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="calendario" mask="DD/MM/YYYY" range @input="() => $refs.qDateProxy.hide()" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <div class="col-xs-12 col-md-5">
          <q-btn color="primary" label="Carregar" type="submit" style="margin-top:.4em;width:100%" icon="refresh" />
        </div>
      </div>
    </div>
  </q-form>
</template>

<script>

import {
  QForm, QInput, QIcon, QPopupProxy, QDate, QBtn,
} from 'quasar'

import { validaTamanhoDatas, validaDatas } from '../../util/util'

export default {

  components: {
    QForm, QInput, QIcon, QPopupProxy, QDate, QBtn,
  },

  data() {
    return {
      valor: '',
      calendario: '',
    }
  },

  computed: {
  },

  watch: {
    calendario: {
      handler(val, odlVal) {
        if (val !== odlVal) {
          if (val != null) {
            if (typeof val === 'string') {
              this.valor = `${val} - ${val}`
            } else {
              this.valor = `${val.from} - ${val.to}`
            }
          }
        }
      },
    },
  },

  mounted() {

  },

  methods: {
    validaTamanhoDatas(val) { return validaTamanhoDatas(val) },
    validaDatas(val) { return validaDatas(val) },
    submitSalvar() {
      const data = this.valor.split(' - ')
      this.$emit('selecionou', { inicio: data[0], fim: data[1] })
    },
  },
}
</script>

<style lang="scss">
.mes-ano-nome {
  width: 4.6em;
  margin-left: 0.5em;
  margin-right: 0.5em;
}
</style>
