<template>
<div>
  <q-dialog ref="modal" persistent :maximized="$q.platform.is.mobile">
    <q-card :style="{'min-width' : $q.platform.is.mobile ? 'auto' : '350px'}">
      <q-card-section>
        <p class="text-h6">Escolha uma imagem:</p>
        <input
          ref="img"
          type="file"
          name="image"
          style="display: none"
          accept="image/*"
          @change="setImage"
        />
        <q-btn label="Selecionar imagem" class="full-width"
        color="primary" @click="$refs.img.click()" />
      </q-card-section>
      <q-card-section v-if="img">
          <cropper
            ref="cropper"
            class="cropper"
            :src="img"
            :maxHeight="400"
            :stencil-props="{
              aspectRatio: 3/1,
            }"
          ></cropper>

        <img v-if="imgRender" :src="imgRender" style="width: 400px" />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn flat @click="$emit('fechar')">Fechar</q-btn>
        <div style="flex:1"></div>
        <q-btn color="primary" @click="crop">Adicionar</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</div>
</template>

<script>

import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

import {
  QCard, QCardSection, QCardActions, QBtn, QDialog,
} from 'quasar'

export default {

  components: {
    Cropper,

    QCard,
    QCardSection,
    QCardActions,

    QBtn,
    QDialog,
  },

  props: {
    exibe: {
      type: Boolean,
      default: false,
      requred: true,
    },
  },

  data() {
    return {
      img: '',
      imgRender: '',
    }
  },

  watch: {
    exibe: {
      handler(val) {
        if (val) {
          this.$refs.modal.show()
          this.$nextTick(() => {
            this.$refs.img.click()
          })

          // this.$refs.input.click();
        } else {
          this.$refs.modal.hide()
        }
      },
    },
  },

  methods: {

    crop() {
      const { coordinates, canvas } = this.$refs.cropper.getResult()
      this.coordinates = coordinates
      this.$emit('base64', canvas.toDataURL())
      this.$emit('fechar')
    },

    setImage(e) {
      const file = e.target.files[0]
      if (file.type.indexOf('image/') === -1) {
        this.$emit('fechar')
        return
      }
      if (typeof FileReader === 'function') {
        const reader = new FileReader()
        reader.onload = (event) => {
          this.img = event.target.result
        }
        reader.readAsDataURL(file)
      } else {
        this.$emit('fechar')
      }
    },
  },
}
</script>
