<template>
  <div>
    <q-select v-model="model" use-input :multiple="multiplos" :use-chips="multiplos" option-label="nome"
      :outlined="outlined" :label="label" :loading="buscando" hint="Busque pelo nome ou login"
      :options="usuariosFiltrados" :dense="dense" @filter="filterFn" @input=setaValor>
      <template v-slot:append>
        <q-icon v-if="model !== null" class="cursor-pointer" name="clear" danse @click.stop="clickCancela" />
      </template>

      <template v-if="!multiplos" v-slot:selected>
        {{ model ? model.nome : '' }}
      </template>

      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
          <q-item-section>
            <q-item-label>{{ scope.opt.nome }}</q-item-label>
            <q-item-label caption>{{ scope.opt.login }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>

      <template v-slot:no-option>
        <q-item>
          <q-item-section v-if="termo.length == 0" class="text-grey">
            Digite para buscar
          </q-item-section>
          <q-item-section v-else class="text-grey">
            Nenhum usuário encontrado
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>
<script>
import {
  QSelect, QIcon, QItem, QItemSection, QItemLabel,
} from 'quasar'
import { buscaUsuarios, obterPorId } from '../../services/usuario'

export default {

  components: {
    QSelect, QIcon, QItem, QItemSection, QItemLabel,
  },

  props: {
    label: {
      required: false,
      default: null,
      type: String,
    },
    idUsuario: {
      required: false,
      default: () => null,
      type: String,
    },
    multiplos: {
      required: false,
      type: Boolean,
      default: false,
    },
    outlined: {
      require: false,
      type: Boolean,
      default: false,
    },
    dense: {
      require: false,
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      model: null,
      buscouPrimeiro: false,
      debouce: null,
      usuariosFiltrados: [],
      buscando: false,
      termo: '',
    }
  },

  watch: {
    idUsuario: {
      handler(val, odlVal) {
        if (val !== odlVal) {
          if (val != null) {
            this.carregaUsuario(val)
          }
        }
      },
    },
  },

  methods: {

    filterFn(val, update) {
      update(async () => {
        this.termo = val.toLowerCase()
        if (this.termo.trim() !== '') {
          this.buscando = true
          const usuarios = await buscaUsuarios(this.termo)
          this.buscando = false
          this.usuariosFiltrados = usuarios
        } else {
          this.usuariosFiltrados = []
        }
      })
    },

    async carregaUsuario(idUsuario) {
      if (idUsuario === 0) return

      const usuario = await obterPorId(idUsuario)
      this.model = usuario
    },

    setaValor(valor) {
      if (typeof valor === 'object') {
        this.$emit('usuario', valor)
      }
    },

    clickCancela() {
      this.model = null
      this.$emit('usuario', null)
    },

    abortFilterFn() {
    },
  },
}
</script>
