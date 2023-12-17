<template>
  <div>
    <q-scroll-area :style="{'height': `${height}px`}">
      <q-list bordered separator>
        <q-item v-for="(item, index) in lista"
              :key="index"
              v-ripple
              clickable
              @click="$emit('click', item)">
          <q-item-section>
            <q-item-label>{{item.nome}}</q-item-label>
            <q-item-label caption> {{item.nomeUsuario}}</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>
              <span v-if="item.idUsuarioEncerramento === null">
                <span v-if="item.confirmado == null" class="text-primary">
                  <q-icon name="watch_later" class="icone-correcao" /> Agendado
                </span>
                <span v-if="item.confirmado == false" class="text-red">
                  <q-icon name="close" class="icone-correcao" /> Não Confirmado
                </span>
                <span v-if="item.confirmado == true" class="text-green">
                  <q-icon name="done" class="icone-correcao" /> Confirmado
                </span>
              </span>
              <span v-else>
                <span v-if="!item.compareceu" class="text-warning">
                  <q-icon name="error" class="icone-correcao" /> Não Compareceu
                </span>
                <span v-if="item.contratoFechado" class="text-green">
                  <q-icon v-if="!item.faturado"
                      name="cancel"
                      class="icone-correcao text-negative q-mr-xs">
                    <q-tooltip>
                      O cliente não foi confirmado, portando a venda não foi faturada.
                    </q-tooltip>
                  </q-icon>
                  <q-icon name="check_circle" class="icone-correcao" /> Contrato Fechado
                </span>
                <span v-if="item.compareceu && !item.contratoFechado" class="text-red">
                  <q-icon name="cancel" class="icone-correcao" /> Não Fechou
                </span>
              </span>
            </q-item-label>
            <q-item-label caption>
              {{item.dataFormatada}}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </div>
</template>

<script>

import {
  QScrollArea,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QIcon,
  QTooltip,
} from 'quasar'

export default {

  components: {
    QScrollArea,
    QList,
    QItem,
    QItemSection,
    QItemLabel,
    QIcon,
    QTooltip,
  },

  props: {
    lista: {
      type: Array,
      required: true,
      default: () => [],
    },
    height: {
      type: Number,
      default: 400,
      required: true,
    },
  },
}
</script>
