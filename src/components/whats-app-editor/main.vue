<template>
  <div>
    <div v-if="label" class="q-mb-sm">
      <label>{{ label }}</label>
    </div>
    <q-editor ref="editor" v-model="editor" :toolbar="[['formatacao'], ['lista']]" @input="$emit('input', editor)">

      <template v-slot:formatacao>
        <q-btn-dropdown ref="formatacao" dense no-caps no-wrap unelevated label="Formatação" size="sm">
          <q-list dense>
            <q-item tag="label" clickable @click="addFormatacao('n')">
              <q-item-section> <small>Negrido</small></q-item-section>
            </q-item>
            <q-item tag="label" clickable @click="addFormatacao('i')">
              <q-item-section><small>Itálico</small></q-item-section>
            </q-item>
            <q-item tag="label" clickable @click="addFormatacao('t')">
              <q-item-section><small>Tachado</small></q-item-section>
            </q-item>
            <q-item tag="label" clickable @click="addFormatacao('m')">
              <q-item-section><small>Monoespaçado</small></q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </template>

      <template v-slot:lista>
        <q-btn-dropdown ref="lista" dense no-caps no-wrap unelevated label="Campos" size="sm">
          <q-list dense>
            <q-item tag="label" clickable @click="add('nome')">
              <q-item-section> <small>Nome</small></q-item-section>
            </q-item>
            <q-item tag="label" clickable @click="add('data')">
              <q-item-section><small>Data</small></q-item-section>
            </q-item>
            <q-item tag="label" clickable @click="add('hora')">
              <q-item-section><small>Hora</small></q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </template>
    </q-editor>
    <div class="q-mt-sm">
      Para saber mais sobre formatação de mensagens no whatsapp
      <a href="https://faq.whatsapp.com/general/chats/how-to-format-your-messages/" class="text-primary"
        target="_blank">
        Clique aqui.</a>
    </div>

  </div>
</template>

<script>

import {
  QEditor, QBtnDropdown, QList, QItem, QItemSection,
} from 'quasar'

export default {

  components: {
    QEditor, QBtnDropdown, QList, QItem, QItemSection,
  },

  props: {
    label: {
      type: String,
      required: false,
      default: '',
    },
    value: {
      type: String,
      required: false,
      default: '',
    },
  },

  data() {
    return {
      editor: '',
    }
  },

  watch: {
    value: {
      handler(val, odlVal) {
        if (val !== odlVal) {
          this.editor = val.replace(/%0A/g, '<br/>').replace(/ /g, '&nbsp;')
          this.$emit('input', this.editor)
        }
      },
    },
  },

  mounted() {
  },

  methods: {
    addFormatacao(formatacao) {
      const edit = this.$refs.editor
      this.$refs.lista.hide()
      edit.caret.restore()

      const copy = window.getSelection().toString()
      if (formatacao === 'n') {
        edit.runCmd('insertHTML', `*${copy}*`)
      }

      if (formatacao === 'i') {
        edit.runCmd('insertHTML', `_${copy}_`)
      }

      if (formatacao === 't') {
        edit.runCmd('insertHTML', `~${copy}~`)
      }

      if (formatacao === 'm') {
        edit.runCmd('insertHTML', `\`\`\`${copy}\`\`\``)
      }

      edit.focus()
    },
    add(campo) {
      const edit = this.$refs.editor
      this.$refs.lista.hide()
      edit.caret.restore()
      edit.runCmd('insertHTML', `{${campo}}`)
      edit.focus()
    },
  },
}
</script>
