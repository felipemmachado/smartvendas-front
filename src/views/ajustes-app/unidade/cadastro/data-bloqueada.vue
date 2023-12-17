<template>
  <div>

    <q-btn label="Adicionar Feriado" outline class="q-mt-md" color="primary" icon="add" @click="exibeForm = true" />

    <app-carregando v-if="carregando" class="q-mt-md" />

    <div v-if="lista.length == 0 && !carregando" class="q-mt-md">
      Nenhum resultado encontrado.
    </div>

    <q-table v-if="lista.length > 0" :data="lista" :columns="columns" class="q-mt-lg" :loading="carregando" flat
      bordered row-key="unidade" :pagination.sync="pagination" hide-bottom>

      <template v-slot:body-cell-id="props">
        <q-td :props="props">
          <q-btn label="Excluir" color="negative" flat style="min-width: 130px" icon="delete" @click="excluir(props)" />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="exibeForm">
      <q-card :style="{ 'min-width': $q.platform.is.mobile ? '100%' : '400px' }">
        <q-form @submit="salvar">
          <q-card-section>
            <app-cabecalho-form textoNovo="Adicionar Feriado" :editar="false" :exibeFechar="true"
              @fechar="exibeForm = false" />

            <q-input ref="data" v-model="form.data" label="Data" placeholder="DD/MM/AAAA" class="q-mb-sm"
              mask="##/##/####" outlined :rules="[val => !!val || 'A data é obrigatório',
              val => validaData(val) || 'Data inválida']">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.data" mask="DD/MM/YYYY" @input="() => $refs.qDateProxy.hide()" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-input ref="nome" v-model="form.descricao" label="Descrição" outlined
              :rules="[val => !!val || 'A descrição é obrigatório']" class="q-pb-md" type="text" />

            <q-separator />

            <q-btn type="submit" class="float-right q-mt-md q-mb-md" :disable="salvando" :loading="salvando"
              label="salvar" color="primary" icon="check" />

          </q-card-section>

        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import {
  QIcon, QCard, QCardSection, QTable, QTd, QBtn, QDialog, QForm, QInput, QPopupProxy, QDate, QSeparator,
} from 'quasar'
import { postDataBloqueio, excluirDataBloqueio, retornaDatasBloqueadas } from '../../../../services/unidade'
import { formatDateSql, formatSqlDate, validaData } from '../../../../util/util'
import AppCabecalhoForm from '../../../../components/cabecalho-form/main.vue'
import AppCarregando from '../../../../components/carregando/main.vue'

export default {

  components: {
    AppCabecalhoForm,
    AppCarregando,
    QIcon,
    QCard,
    QCardSection,
    QBtn,
    QTable,
    QTd,
    QDialog,
    QForm,
    QInput,
    QPopupProxy,
    QDate,
    QSeparator,
  },

  props: {
    unidade: {
      type: Object,
      required: false,
      default: () => { },
    },
  },

  data() {
    return {
      columns: [
        {
          name: 'data',
          required: true,
          label: 'Data',
          align: 'left',
          field: (row) => formatDateSql(row.data),
          sortable: true,
        },
        {
          name: 'descricao',
          label: 'Descrição',
          align: 'left',
          field: (row) => row.descricao,
          sortable: true,
        },
        {
          name: 'id',
          field: (row) => row.id,
        },
      ],
      pagination: {
        sortBy: 'data',
        descending: false,
        page: 1,
        rowsPerPage: 10,
      },
      carregando: false,
      salvando: false,
      exibeForm: false,

      lista: [],
      form: {
        data: '',
        descricao: '',
      },
    }
  },

  mounted() {
    // this.exibeForm = true;
    this.carregaLista()
  },

  methods: {
    validaData(data) { return validaData(data) },

    async salvar() {
      const post = {
        data: '',
        descricao: '',
        idUnidade: '',
      }

      post.data = formatSqlDate(this.form.data)
      post.descricao = this.form.descricao
      post.idUnidade = this.unidade.id

      const response = await postDataBloqueio(post)
      if (response.success) {
        this.$q.notify({
          type: 'positive',
          position: 'top',
          message: 'Feriado salvo.',
        })
        this.carregaLista()
        this.limpaForm()
      }
    },

    excluir(event) {
      this.$q.dialog({
        title: 'Excluir',
        message: 'Deseja excluir esse feriado?',
        cancel: true,
        persistent: true,
        ok: {
          label: 'Excluir',
          color: 'negative',
        },
      }).onOk(async () => {
        this.excluindo = true
        const reposta = await excluirDataBloqueio(this.unidade.id, event.value)
        this.excluindo = false
        if (reposta.success) {
          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: 'Unidade Excluída.',
          })
          this.carregaLista()
        } else {
          this.$q.notify({
            type: 'negative',
            position: 'top',
            message: reposta.message,
          })
        }
      })
    },

    limpaForm() {
      this.exibeForm = false
      this.form.descricao = ''
      this.form.data = ''
    },

    async carregaLista() {
      this.carregando = true
      const lista = await retornaDatasBloqueadas(this.unidade.id)
      this.carregando = false
      this.lista = lista
    },
  },
}
</script>
