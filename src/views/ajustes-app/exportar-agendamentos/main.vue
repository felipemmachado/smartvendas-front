<template>
  <div class="row">
    <div class="col-md-2 col-lg-2 col-xs-12"></div>
    <div class="col-md-8 col-lg-8 col-xs-12 q-pa-md animated fadeIn fast">
      <app-btn-voltar label="Ajustes" cls="q-mb-md" rota="ajustes" />
      <div class="text-h5 q-mb-md">
        <q-icon class="text-primary icone-correcao" name="o_get_app" />
        Exportar
      </div>
      <q-card>
        <q-card-section>
          <q-form @submit="submitSalvar">
            <p>Apenas as datas início e fim são obrigatórias,
              caso vc queria melhorar a exportação, você pode
              filtrar por usuários e unidades.
            </p>
            <div class="row">
              <div class="col-xs-12">
                <q-input ref="data" v-model="form.inicio" label="Data início" outlined class="q-mb-md"
                  placeholder="DD/MM/AAAA" mask="##/##/####" :rules="[val => !!val || 'A data é obrigatório',
                  val => validaData(val) || 'Data inválida']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date v-model="form.inicio" mask="DD/MM/YYYY" @input="() => $refs.qDateProxy.hide()" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>

            <div class="row">
              <div class="col-xs-12">
                <q-input ref="data" v-model="form.fim" label="Data fim" outlined class="q-mb-md"
                  placeholder="DD/MM/AAAA" mask="##/##/####" :rules="[val => !!val || 'A data é obrigatório',
                  val => validaData(val) || 'Data inválida']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date v-model="form.fim" mask="DD/MM/YYYY" :options="date => minData(date)"
                          @input="() => $refs.qDateProxy.hide()" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>

            <div class="row">
              <div class="col-xs-12">
                <app-select-usuario class="q-mb-md" :multiplos="true" :outlined="true" label="Usuários"
                  @usuario="setaUsuario">
                </app-select-usuario>
              </div>
            </div>

            <div class="row">
              <div class="col-xs-12">
                <q-select v-model="form.unidades" :options="unidades" use-chips multiple outlined option-label="nome"
                  option-id="id" class="q-mb-md" label="Unidades">
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                      <q-item-section>
                        <q-item-label>{{ scope.opt.nome }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </div>

            <q-separator class="q-mt-md"></q-separator>
            <div class="row q-mt-md">
              <div class="col-xs-12">
                <q-btn type="submit" :disable="exportando" :loading="exportando" label="exportar" color="primary"
                  class="float-right" icon="get_app" />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex'
import xlsx from 'xlsx'
import dayjs from 'dayjs'
import fileSaver from 'file-saver'
import {
  QItemLabel, QItem, QSelect, QIcon, QCard, QPopupProxy, QDate, QCardSection, QItemSection, QBtn, QInput, QSeparator, QForm,
} from 'quasar'
import {
  formatSqlDate, formatDateSql, formatDateTimeSql, validaData,
} from '../../../util/util'
import { exportar } from '../../../services/venda-agenda'
import AppSelectUsuario from '../../../components/select-usuario/main.vue'
import AppBtnVoltar from '../../../components/btn-voltar/main.vue'

export default {

  components: {
    AppSelectUsuario,
    AppBtnVoltar,
    QItemLabel,
    QItem,
    QSelect,
    QItemSection,
    QBtn,
    QInput,
    QSeparator,
    QForm,
    QIcon,
    QCard,
    QCardSection,
    QPopupProxy,
    QDate,
  },

  data() {
    return {
      exportando: false,
      form: {
        inicio: null,
        fim: null,
        unidades: [],
        usuarios: [],
      },
    }
  },

  computed: {
    ...mapState({
      unidades: (state) => state.aplicacao.unidades,
    }),
  },
  methods: {
    validaData(data) { return validaData(data) },

    minData(date) {
      return date >= formatSqlDate(this.form.inicio).replace('-', '/').replace('-', '/').replace('-', '/')
    },
    async submitSalvar() {
      const post = {
        inicio: `${formatSqlDate(this.form.inicio)}T00:00:00`,
        fim: `${formatSqlDate(this.form.fim)}T23:59:59`,
        unidades: this.form.unidades.map((item) => item.id).join(','),
        usuarios: this.form.usuarios.map((item) => item.id).join(','),
      }

      this.exportando = true
      const retorno = await exportar(null, post.inicio, post.fim, post.usuarios, post.unidades)
      this.exportaExcel(this.formataJson(retorno))
    },

    formataJson(dados) {
      return dados.map((item) => {
        const itemEditado = item
        itemEditado.dataAgendamento = formatDateSql(item.dataAgendamento)
        const dt = new Date(item.criadoEm)
        itemEditado.criadoEm = `${dt.toLocaleDateString('pt-br')} ${dt.toLocaleTimeString('pt-br')}`
        itemEditado.confirmado = itemEditado.confirmado ? 'SIM' : 'NÃO'
        itemEditado.compareceu = itemEditado.compareceu ? 'SIM' : 'NÃO'
        itemEditado.contratoFechado = itemEditado.contratoFechado ? 'SIM' : 'NÃO'
        itemEditado.faturado = itemEditado.faturado ? 'SIM' : 'NÃO'

        if (itemEditado.dataEncerramento === '0001-01-01T00:00:00') {
          itemEditado.dataEncerramento = ''
        } else {
          itemEditado.dataEncerramento = formatDateTimeSql(item.dataEncerramento)
        }

        return itemEditado
      })
    },

    exportaExcel(dados) {
      const type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
      const arquivo = xlsx.utils.json_to_sheet(dados)
      arquivo.A1.v = 'Nome cliente'
      arquivo.B1.v = 'Telefone'
      arquivo.C1.v = 'Agendamento'
      arquivo.D1.v = 'Tipo agendamento'
      arquivo.E1.v = 'Consultor'
      arquivo.F1.v = 'Unidade'
      arquivo.G1.v = 'Criado em'
      arquivo.H1.v = 'Encerrado por'
      arquivo.I1.v = 'Data encerramento'
      arquivo.J1.v = 'Confirmado'
      arquivo.K1.v = 'Motivo não onfirmado'
      arquivo.L1.v = 'Compareceu'
      arquivo.M1.v = 'Contrato Fechado'
      arquivo.N1.v = 'Motivo da desistência'
      arquivo.O1.v = 'Faturado'

      const workbook = xlsx.utils.book_new()
      workbook.Sheets = { data: arquivo }
      workbook.SheetNames = ['data']
      const excellBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' })
      const data = new Blob([excellBuffer], { type })

      fileSaver.saveAs(data, `AGENDAMENTOS-${dayjs().format('DD-MM-YYYY_HH-mm-ss')}.xlsx`)
      this.exportando = false
    },

    setaUsuario(usuarios) {
      this.form.usuarios = usuarios
    },
  },
}
</script>
