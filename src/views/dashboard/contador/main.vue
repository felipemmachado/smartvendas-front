  <template>
  <div>
    <div class="row q-col-gutter-md" style="padding-left: .8em; padding-right: .8em">

      <!-- confirmados com contratos fechados  -->
      <div class="col-md-6 col-sm-6 col-lg-6 col-xs-12">
        <div class="row q-col-gutter-md">
          <div class="col-xs-12 col-md-6">
            <app-card
              :texto="'AGENDADOS'"
              :valor="item.agendados"
              icone="schedule"
              cor="light-blue"
              class="q-mb-sm card-info"
            />

            <app-card
              :texto="'CONTRATOS FECHADOS'"
              :valor="item.contratosFechados"
              icone="check"
              cor="green"
              class="q-mb-sm card-info"
            />

            <app-card
              :texto="'NÃO FECHADOS'"
              :valor="item.contratosNaoFechados"
              icone="close"
              cor="red"
              class="q-mb-sm card-info"
            />
          </div>
          <div class="col-xs-12 col-md-6">
            <q-card
              :flat="!$q.dark.isActive"
              :bordered="!$q.dark.isActive"
              class="animated fadeIn card-grafico-size">
              <q-card-section v-if="exibeContratosFechadoEnao">
                <app-pie-chart class="card-grafico"
                :data="chartDataConfirmadosContratoFechado" :options="chartOptions"></app-pie-chart>
              </q-card-section>
              <q-card-section v-if="!exibeContratosFechadoEnao" class="text-center top-text" >
                <p>Nenhum resultado encontrado.</p>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- confirmados e não confirmados -->
      <div class="col-md-6 col-sm-6 col-lg-6 col-xs-12">
        <div class="row q-col-gutter-md">
          <div class="col-xs-12 col-md-6">
            <app-card
              :texto="'AGENDADOS'"
              :valor="item.agendados"
              icone="schedule"
              cor="light-blue"
              class="q-mb-sm card-info"
            />

            <app-card
              :texto="'CONFIRMADOS'"
              :valor="item.confirmados"
              icone="o_calendar_month"
              cor="green"
              class="q-mb-sm card-info"
            />

            <app-card
              :texto="'NÃO CONFIRMADOS'"
              :valor="item.naoConfirmados"
              icone="event_busy"
              cor="deep-purple"
              class="q-mb-sm card-info"
            />
          </div>
          <div class="col-xs-12 col-md-6 ">
            <q-card
              :flat="!$q.dark.isActive"
              :bordered="!$q.dark.isActive"
              class="animated fadeIn card-grafico-size">
              <q-card-section v-if="exibeConfirmados">
                <app-pie-chart class="card-grafico"
                :data="chartDataConfirmados" :options="chartOptions"></app-pie-chart>
              </q-card-section>
              <q-card-section v-if="!exibeConfirmados" class="text-center top-text" >
                <p>Nenhum resultado encontrado.</p>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- compareceram e não compareceram -->
      <div class="col-md-6 col-sm-6 col-lg-6 col-xs-12">
        <div class="row q-col-gutter-md">
          <div class="col-xs-12 col-md-6">
            <app-card
              :texto="'TOTAL'"
              :valor="item.compareceram + item.naoCompareceram"
              icone="face"
              cor="light-blue"
              class="q-mb-sm card-info"
            />

            <app-card
              :texto="'COMPARECERAM'"
              :valor="item.compareceram"
              icone="person_pin"
              cor="green"
              class="q-mb-sm card-info"
            />

            <app-card
              :texto="'NÃO COMPARECERAM'"
              :valor="item.naoCompareceram"
              icone="directions_run"
              cor="orange"
              class="q-mb-sm card-info"
            />
          </div>
          <div class="col-xs-12 col-md-6">
            <q-card
              :flat="!$q.dark.isActive"
              :bordered="!$q.dark.isActive"
              class="animated fadeIn card-grafico-size">
              <q-card-section v-if="exibeCompareceram">
                <app-pie-chart class="card-grafico"
                :data="chartDataAgendados" :options="chartOptions"></app-pie-chart>
              </q-card-section>
              <q-card-section v-if="!exibeCompareceram" class="text-center top-text" >
                <p>Nenhum resultado encontrado.</p>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- compareceram e não compareceram -->
      <div class="col-md-6 col-sm-6 col-lg-6 col-xs-12">
        <div class="row q-col-gutter-md">
          <div class="col-xs-12 col-md-6">
            <app-card
              :texto="'COMPARECERAM'"
              :valor="item.compareceram"
              icone="person_pin"
              cor="light-blue"
              class="q-mb-sm card-info"
            />

            <app-card
              :texto="'CONTRATOS FECHADOS'"
              :valor="item.contratosFechados"
              icone="check"
              cor="green"
              class="q-mb-sm card-info"
            />

            <app-card
              :texto="'NÃO FECHADOS'"
              :valor="item.contratosNaoFechados"
              icone="close"
              cor="red"
              class="q-mb-sm card-info"
            />
          </div>
          <div class="col-xs-12 col-md-6">
            <q-card
              :flat="!$q.dark.isActive"
              :bordered="!$q.dark.isActive"
              class="animated fadeIn card-grafico-size">
              <q-card-section v-if="exibeContratosFechados">
                <app-pie-chart class="card-grafico"
                :data="chartDataContratosFechados" :options="chartOptions"></app-pie-chart>
              </q-card-section>
              <q-card-section v-if="!exibeContratosFechados" class="text-center top-text" >
                <p>Nenhum resultado encontrado.</p>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- faturados  -->
      <div class="col-md-6 col-sm-6 col-lg-6 col-xs-12">
        <div class="row q-col-gutter-md">
          <div class="col-xs-12 col-md-6">
            <app-card
              :texto="'CONTRATOS FECHADOS'"
              :valor="item.contratosFechados"
              icone="check"
              cor="light-blue"
              class="q-mb-sm card-info"
            />

            <app-card
              :texto="'FATURADOS'"
              :valor="item.faturados"
              icone="attach_money"
              cor="green"
              class="q-mb-sm card-info"
            />

            <app-card
              :texto="'NÃO FATURADOS'"
              :valor="item.contratosFechados - item.faturados"
              icone="close"
              cor="red"
              class="q-mb-sm card-info"
            />
          </div>
          <div class="col-xs-12 col-md-6">
            <q-card
              :flat="!$q.dark.isActive"
              :bordered="!$q.dark.isActive"
              class="animated fadeIn card-grafico-size">
              <q-card-section v-if="exibeContratosFechados">
                <app-pie-chart class="card-grafico"
                :data="chartDataFaturados" :options="chartOptions"></app-pie-chart>
              </q-card-section>
              <q-card-section v-if="!exibeContratosFechados" class="text-center top-text" >
                <p>Nenhum resultado encontrado.</p>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

// eslint-disable-next-line no-unused-vars
import ChartJSPluginDatalabels from 'chartjs-plugin-datalabels'
import { QCard, QCardSection } from 'quasar'
import AppCard from './card.vue'
import AppPieChart from './pie-chart'

export default {
  name: 'App',
  components: {
    AppCard,
    AppPieChart,
    QCard,
    QCardSection,
  },
  props: {
    item: {
      type: Object,
      required: true,
      default: () => {},
    },
    borderColor: {
      type: String,
      default: '#fff',
    },
  },

  data() {
    return {
      chartOptions: {
        borderWidth: 0,
        responsive: true,
        maintainAspectRatio: false,
        cutoutPercentage: 0,
        legend: {
          position: 'bottom',
          align: 'center',
          labels: {
            usePointStyle: true,
            boxWidth: 10,
          },
        },
        tooltips: {
          enabled: false,
        },
        plugins: {
          datalabels: {
            formatter: (value, ctx) => {
              let sum = 0
              const dataArr = ctx.chart.data.datasets[0].data
              dataArr.map((data) => {
                sum += data
                return data
              })
              const percentage = `${((value * 100) / sum).toFixed(1)}%`
              return percentage
            },
            color: '#FFF',
          },
        },
      },
      chartDataConfirmados: {
        labels: ['Confirmados', 'Não Confirmados'],
        datasets: [
          {
            borderColor: this.borderColor,
            backgroundColor: ['rgba(76,175,80, 1)', 'rgba(103,58,183, 1)'],
            data: [this.item.confirmados, this.item.naoConfirmados],
          },
        ],
      },
      chartDataConfirmadosContratoFechado: {
        labels: ['Agendados', 'Contrato Fechado', 'Não fechados'],
        datasets: [
          {
            borderColor: this.borderColor,
            backgroundColor: ['#4fc3f7', 'rgba(76,175,80, 1)', '#f44336'],
            data: [this.item.agendados
              - (this.item.contratosFechados + this.item.contratosNaoFechados),
            this.item.contratosFechados,
            this.item.contratosNaoFechados],
          },
        ],
      },
      chartDataAgendados: {
        labels: ['Compareceram', 'Não Compareceram'],
        datasets: [
          {
            borderColor: this.borderColor,
            backgroundColor: ['rgba(76,175,80, 1)', '#ff9800'],
            data: [this.item.compareceram, this.item.naoCompareceram],
          },
        ],
      },
      chartDataContratosFechados: {
        labels: ['Contratos Fechados', 'Não Fechados'],
        datasets: [
          {
            borderColor: this.borderColor,
            backgroundColor: ['rgba(76,175,80, 1)', '#f44336'],
            data: [this.item.contratosFechados, this.item.contratosNaoFechados],
          },
        ],
      },
      chartDataFaturados: {
        labels: ['Faturados', 'Não Faturados'],
        datasets: [
          {
            borderColor: this.borderColor,
            backgroundColor: ['rgba(76,175,80, 1)', '#f44336'],
            data: [this.item.faturados,
              this.item.contratosFechados - this.item.faturados],
          },
        ],
      },
    }
  },

  computed: {
    exibeContratosFechadoEnao() {
      return this.item.contratosFechados > 0
    },
    exibeContratosFechados() {
      return this.item.contratosFechados > 0 && this.item.contratosNaoFechados > 0
    },

    exibeCompareceram() {
      return this.item.compareceram > 0 && this.item.naoCompareceram > 0
    },

    exibeConfirmados() {
      return this.item.naoConfirmados > 0 && this.item.confirmados > 0
    },

    exibeFaturados() {
      return this.item.faturados > 0 && this.item.contratosFechados > 0
    },
  },
}
</script>

<style lang="scss">
.card-info {
  height: 75px;
}
.card-grafico-size {
  height: 241px;
}

.top-text {
  padding-top: 8em;
}

.card-grafico {
  height: 210px;
}
</style>
