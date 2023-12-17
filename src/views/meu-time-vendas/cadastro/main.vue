<template>
  <div class="row">
    <div class="col-xs-12 col-md-4 q-pt-md q-pl-md q-pr-md">
      <app-btn-voltar label="Meu Time de Vendas" cls="q-mb-md" rota="meu-time-vendas" />

      <div class="text-h5">
        <q-icon class="text-primary icone-correcao" name="o_perm_contact_calendar" />
        Usuários
      </div>
    </div>
    <div class="col-xs-12 q-pl-md q-pr-md">

      <app-carregando v-if="carregando" tipo="lista" />

      <app-lista-usuario v-else :todosUsuarios="usuarios" :perfis="perfis"
        @usuarios="carregaUsuarios" @editar="clickNovoUsuario" />
    </div>

    <q-dialog v-model="exibirCadatro" :maximized="$q.platform.is.mobile">
      <q-card :style="{ 'min-width': $q.platform.is.mobile ? 'auto' : '500px' }">
        <q-card-section>
          <app-usuario-cadastro :unidades="unidades" :perfis="perfis" :usuario="usuario" @excluiu="excluiu"
            @fechar="exibirCadatro = false" @salvou="() => carregaLista()"></app-usuario-cadastro>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="exibirListaUsuarios" :maximized="$q.platform.is.mobile">
      <q-card :style="{ 'min-width': $q.platform.is.mobile ? 'auto' : '1000px' }">
        <q-card-section>
        <app-cabecalho-form
            :textoNovo="`Usuários de ${usuario?.nome}`"
            :exibeFechar="true"
            @fechar="exibirListaUsuarios = false"
          />
        </q-card-section>
        <q-card-section>

          <app-carregando v-if="carregandoUsuarios" />

          <div v-if="!carregandoUsuarios && usuariosRepresentante.length === 0">Nenhum usuário encontrado.</div>

          <div style="margin-top: -50px">
            <app-lista-usuario v-if="usuariosRepresentante.length > 0" :exibirUsuarios="false" :todosUsuarios="usuariosRepresentante"
            :perfis="perfis" @editar="clickNovoUsuario" />
          </div>

        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import {
  QIcon, QDialog, QCard, QCardSection,
} from 'quasar'
import { retornaPorCoordenadorDeVendas, retornaPorCoordenadorDeVendasPorId } from '../../../services/usuario'
import AppUsuarioCadastro from './cadastro.vue'
import AppListaUsuario from './lista.vue'
import { retornaTodosPerfis } from '../../../services/perfil'
import AppBtnVoltar from '../../../components/btn-voltar/main.vue'
import AppCarregando from '../../../components/carregando/main.vue'
import AppCabecalhoForm from '../../../components/cabecalho-form/main.vue'

export default {

  components: {
    AppUsuarioCadastro,
    AppListaUsuario,
    AppCarregando,
    AppBtnVoltar,
    AppCabecalhoForm,
    QIcon,
    QDialog,
    QCard,
    QCardSection,
  },

  data() {
    return {
      usuario: null,
      usuarioDoUsuario: null,
      exibirCadatro: false,
      unidades: [],
      usuarios: [],
      usuariosRepresentante: [],
      buscando: false,
      carregando: false,
      perfis: [],
      exibirListaUsuarios: false,
      carregandoUsuarios: false,
    }
  },
  computed: {

    tituloTabela() {
      if (this.usuario) return `Time do ${this.usuario.nome}`
      return ''
    },
  },
  async mounted() {
    this.carregando = true
    const lista = await retornaTodosPerfis()
    this.perfis = lista
    this.carregaLista()
  },
  methods: {

    async carregaLista() {
      this.carregando = true
      const usuarios = await retornaPorCoordenadorDeVendas()
      this.carregando = false
      this.usuarios = usuarios
      this.exibirCadatro = false
    },

    excluiuCoordenador(usuario) {
      const index = this.usuariosRepresentante.findIndex((i) => i.id === usuario.id)
      if (index > -1) {
        this.usuariosRepresentante.splice(index, 1)
        this.usuarioDoUsuario = null
      }
    },

    excluiu() {
      // this.buscaUsuarios(this.termo);
      this.carregaLista()
      this.exibirCadatro = false
      this.usuario = null
    },

    async carregaUsuarios(usuario) {
      this.usuario = usuario
      this.exibirListaUsuarios = true
      this.carregandoUsuarios = true
      const lista = await retornaPorCoordenadorDeVendasPorId(usuario.id)
      this.carregandoUsuarios = false
      this.usuariosRepresentante = lista
    },

    clickNovoUsuario(obj) {
      this.exibirListaUsuarios = false
      this.usuariosRepresentante = []
      if (obj != null) {
        this.usuario = obj
      } else {
        this.usuario = null
      }

      this.exibirCadatro = false
      this.$nextTick(() => { this.exibirCadatro = true })
    },

    clickNovoUsuarioDoUsuario(obj) {
      if (obj != null) {
        this.usuarioDoUsuario = obj.row
        this.$nextTick(() => {
          window.scrollTo(0, document.body.scrollHeight)
        })
      } else {
        this.usuarioDoUsuario = null
      }
    },
  },
}
</script>
