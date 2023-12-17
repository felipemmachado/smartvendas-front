<template>
<div class="cabecalho-print print" :class="{'exibir-cabecalho' : exibir}">
  <table style="width:100%">
    <tr>
      <td style="width: 15%;">
        <img class="img-sistema-print" src="../../assets/imagens/logo_sistema.png" />
      </td>
      <td class="td-titulo" v-html="titulo"></td>
      <td style="width: 15%;">
        <img class="img-cliente-print" :src="ajustes.logo" />
      </td>
    </tr>
  </table>
</div>
</template>

<script>

import { mapState } from 'vuex'

export default {

  props: {
    exibir: {
      type: Boolean,
      required: false,
      default: false,
    },
    titulo: {
      type: String,
      default: '',
      required: true,
    },
  },

  computed: {
    ...mapState({
      ajustes: (state) => state.aplicacao.ajustes,
    }),
  },
}
</script>

<style>
@media print {
  body {
    font-size: 0.7em;
  }
  .cabecalho-print {
    display: block !important;
    margin-bottom: 10px;
    border-top: 1px solid #FFF;
    border-bottom: 1px solid #DDD;
    height: 50px;
    margin-top: -49px !important;
  }

  .q-card__section {
    padding: 0px !important;
    padding-top: 0px !important;
    margin: 0px !important;
  }
  .q-ma-md {
    padding: 0px !important;
    margin: 0px !important;
  }
};

.img-cliente-print {
  width: 100px;
  float: right;
}

.img-sistema-print {
  width: 100px;
  float:left;
}

.td-titulo {
  text-align:center;
  vertical-align: middle;
  padding: 0;
  font-weight: bold;
}

.cabecalho-print {
  display: none;
}

.exibir-cabecalho {
  display: initial;
}
</style>
