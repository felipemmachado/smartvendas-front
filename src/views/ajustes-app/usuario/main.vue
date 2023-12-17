<template>
  <div class="row">
    <div class="col-md-12 q-pa-md animated fadeIn fast">
      <app-btn-voltar label="Ajustes" cls="q-mb-md" rota="ajustes" />

      <div class="row">
        <div class="col-xs-12">
          <div class="text-h5">
            <q-icon class="text-primary icone-correcao" name="o_perm_contact_calendar" />
            Usuários
          </div>
          <app-buscar :buscando="buscando" permissao="CriarUsuario" :delay="500" btnLabel="Novo Usuário"
            @novo="clickNova(null)" @buscar="buscarPorTermo" />
        </div>
      </div>

      <app-carregando v-if="carregando" tipo="lista" />

      <div v-else>
        <div class="row q-mt-md">
          <div v-for="(usu, index) in usuarios[pagination.page - 1]" :key="index"
            class="col-xs-12 col-md-3 q-mb-md" :class="{ 'q-pr-md': !$q.platform.is.mobile }">
            <q-card style="height: 140px">
              <q-card-section>
                <q-item-label lines="1" :class="{ 'text-grey-1': $q.dark.isActive, 'text-black': !$q.dark.isActive }">
                  {{ usu.nome }}
                </q-item-label>
                <q-item-label
                  :class="{ 'text-deep-purple-4': $q.dark.isActive, 'text-deep-purple-10': !$q.dark.isActive }"
                  style="opacity: .8;">
                  {{ usu.perfil.nome }}
                </q-item-label>
                <q-item-label :class="{ 'text-grey-1': $q.dark.isActive, 'text-black': !$q.dark.isActive }"
                  style="opacity: .5;">
                  {{ usu.login }}
                </q-item-label>
              </q-card-section>

              <q-card-actions>
                <q-btn v-if="temPermissao('AtualizarUsuario')" color="primary" flat @click="clickNova(usu)">Editar
                </q-btn>
                <div style="flex: 1"></div>
                <q-btn v-if="temPermissao('AtualizarUsuario')" color="primary" flat @click="clickPermissoes(usu)">
                  Comissões</q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </div>

        <div class="row justify-center q-mt-md">
          <q-pagination v-model="pagination.page" direction-links color="primary" :max="pagesNumber" max-pages="7" />
        </div>
      </div>

    </div>

    <q-dialog v-model="exibirCadatro" :maximized="$q.platform.is.mobile">
      <q-card :style="{ 'min-width': $q.platform.is.mobile ? 'auto' : '500px' }">
        <q-card-section>
          <app-usuario-cadastro :unidades="unidades" :perfis="perfis" :usuario="usuario" @excluiu="excluiu"
            @atualizar="atualizar" @fechar="exibirCadatro = false"></app-usuario-cadastro>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="exibeComissoes" :maximized="$q.platform.is.mobile" persistent>
      <q-card :style="{ 'min-width': $q.platform.is.mobile ? 'auto' : '600px' }">
        <q-card-section>
          <app-comissoes :usuario="usuario" @fechar="exibeComissoes = false" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  QIcon, QCard, QCardSection, QCardActions, QPagination, QItemLabel, QBtn, QDialog,
} from 'quasar'
import appUsuarioCadastro from './cadastro.vue'
import { retornaTodos } from '../../../services/usuario'
import appComissoes from './comissao/main.vue'
import { retornaTodosPerfis } from '../../../services/perfil'
import { temPermissao, orderBy } from '../../../util/util'
import AppBuscar from '../../../components/buscar/main.vue'
import AppBtnVoltar from '../../../components/btn-voltar/main.vue'
import AppCarregando from '../../../components/carregando/main.vue'

export default {

  components: {
    appUsuarioCadastro,
    appComissoes,
    AppBuscar,
    AppBtnVoltar,
    AppCarregando,
    QIcon,
    QCard,
    QCardSection,
    QCardActions,
    QPagination,
    QItemLabel,
    QBtn,
    QDialog,
  },

  data() {
    return {
      usuario: {
        id: null,
      },
      exibirCadatro: false,
      exibeComissoes: false,
      buscando: false,
      termo: '',
      usuarios: [],
      todosUsuarios: [],
      carregando: true,
      perfis: [],

      pagination: {
        page: 1,
        rowsPerPage: 12,
      },
    }
  },
  computed: {
    ...mapState({
      unidades: (state) => state.aplicacao.unidades,
    }),

    pagesNumber() {
      return Math.ceil((this.usuarios.length * this.pagination.rowsPerPage) / this.pagination.rowsPerPage)
    },
  },
  async mounted() {
    this.carregando = true

    const lista = await retornaTodosPerfis()
    this.perfis = lista

    await this.carregaUsuarios()
  },
  methods: {
    temPermissao(permissao) { return temPermissao(permissao) },

    excluiu() {
      this.exibirCadatro = false
      this.usuario = null
      this.carregaUsuarios()
    },

    buscarPorTermo(termo) {
      this.pagination.page = 1

      if (termo === '') {
        this.usuarios = [...this.todosUsuarios].chunk(this.pagination.rowsPerPage)
        return
      }

      const usuarios = [...this.todosUsuarios]
        .filter((p) => p.nome.toLowerCase().includes(termo.toLowerCase()))
        .chunk(this.pagination.rowsPerPage)
      this.usuarios = usuarios
    },

    atualizar() {
      this.carregaUsuarios()
      this.exibirCadatro = false
    },
    clickPermissoes(obj) {
      this.usuario = obj
      this.exibeComissoes = true
    },
    clickNova(obj) {
      if (obj != null) {
        this.usuario = obj
      } else {
        this.usuario = null
      }

      this.exibirCadatro = false
      this.$nextTick(() => { this.exibirCadatro = true })
    },

    async carregaUsuarios() {
      this.carregando = true
      this.pagination.page = 1
      const usuarios = await retornaTodos()
      this.todosUsuarios = orderBy(usuarios.filter((p) => !p.excluido).map((u) => {
        const novoUsuario = u
        novoUsuario.perfil = this.perfis.find((p) => p.id === u.idPerfil)
        return novoUsuario
      }), 'nome')
      this.usuarios = [...this.todosUsuarios].chunk(this.pagination.rowsPerPage)
      this.carregando = false
    },
  },
}
</script>
