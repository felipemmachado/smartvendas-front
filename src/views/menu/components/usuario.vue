<template>
    <div class="user-settigs">
    <q-btn no-caps flat>
      <q-item-section>
        <div style="display:flex">
          <q-avatar color="primary" size="30px" class="q-mr-sm q-mt-xs">
            {{inicias}}
          </q-avatar>
          <div style="text-align: left;">
            <q-item-label
              :class="{'text-grey-1': $q.dark.isActive, 'text-black': !$q.dark.isActive }">
              {{ $q.platform.is.mobile ? nome.split(' ')[0] : nome }}
            </q-item-label>
            <q-item-label
              :class="{'text-grey-1': $q.dark.isActive, 'text-black': !$q.dark.isActive }"
              style="opacity: .5;">
              {{login}}
          </q-item-label>
          </div>
        </div>
      </q-item-section>
      <q-item-section side style="padding-left: 0px;">
        <q-icon name="keyboard_arrow_down"  />
      </q-item-section>

      <q-menu anchor="bottom right" self="top right">
        <div class="row">
          <q-list style="width:100%; min-width: 160px;">
            <q-item v-ripple clickable to="/voce">
              <q-item-section avatar>
                <q-icon name="o_settings" />
              </q-item-section>
              <q-item-section>Meus Dados</q-item-section>
            </q-item>
            <q-item v-ripple clickable >
              <q-item-section avatar>
                <q-icon name="o_logout" />
              </q-item-section>
              <q-item-section @click="sair">Sair</q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-menu>
    </q-btn>
  </div>
</template>

<script>

import {
  QBtn,
  QItemSection,
  QItemLabel,
  QMenu,
  QIcon,
  QList,
  QItem,
  QAvatar,
} from 'quasar'

export default {

  components: {
    QBtn,
    QItemSection,
    QItemLabel,
    QMenu,
    QIcon,
    QList,
    QItem,
    QAvatar,
  },

  props: {
    nome: String,
    inicias: String,
    login: String,
  },

  methods: {
    sair() {
      this.$q.dialog({
        title: 'Sair',
        message: 'Deseja sair do sistema?',
        cancel: true,
        persistent: true,
        ok: {
          label: 'Sair',
          color: 'negative',
        },
      }).onOk(() => {
        this.$emit('sair')
      }).onCancel(() => {
      }).onDismiss(() => {
      })
    },
  },

}

</script>

<style lang="scss">
.user-settigs {
  padding: 0px;
  // margin-top: 10px;
  // margin-right: 5px;
}
</style>
