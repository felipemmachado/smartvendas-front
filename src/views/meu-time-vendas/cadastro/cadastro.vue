<template>
<div>
  <q-form @submit="validaForm">
    <app-cabecalho-form
      textoEditar="Editar Usuário"
      textoNovo="Novo Usuário"
      :editar="editar"
      :exibeFechar="true"
      @fechar="$emit('fechar')"
    />
    <div class="row">
      <div class="col-xs-12">
        <q-input ref="nome"
                v-model="form.nome"
                label="Nome"
                outlined
                :rules="[val => !!val || 'O nome é obrigatório']"
                class="q-mb-md"
                type="text"
                @blur="capitalizaNome" />
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12">
        <q-input ref="login"
                v-model="form.login"
                label="Login"
                outlined
                :disable="editar"
                :loading="verificandoLogin"
                :rules="[
                val => !!val || 'O login é obrigatório',
                val => loginValido || 'Esse login já existe',
                ]"
                class="q-mb-md"
                type="text"
                @blur="verificaLogin" />
      </div>
    </div>
    <div v-if="!editar" class="row">
      <div class="col-xs-12">
          <q-input ref="senha"
                  v-model="form.senha"
                  label="Senha"
                  :disable="!editar"
                  outlined
                  hint="A senha é o login do usuario,
                        quando logar a primeria vez,
                        será solicitado a alteração da senha."
                  :rules="[val =>  !editar ? !!val : true || 'A senha é obrigatório']"
                  class="q-mb-md"
                  type="password" />
      </div>
    </div>
    <div v-if="editar" class="row q-mb-lg">
      <div class="col-xs-12">
        <q-checkbox v-model="form.alterarSenha"
                  style="margin-left: -0.8em"
                  label="Alterar a senha no próximo login (a senha será o login)"
                  color="primary" />
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12">
          <q-select ref="perfil"
                    v-model="form.perfil"
                    class="q-mb-md"
                    outlined
                    :options="perfisFiltrado"
                    option-label="nome"
                    :rules="[val => !!val || 'O Perfil é obrigatório']"
                    label="Perfil" />
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12">
        <q-select
          v-model="form.unidades"
          outlined
          :options="sessao.unidades"
          use-chips
          multiple
          option-label="nome"
          option-id="id"
          class="q-mb-xl"
          label="Unidades que esse usuário pode acessar"
        >
          <template v-slot:option="scope">
            <q-item
              v-bind="scope.itemProps"
              v-on="scope.itemEvents"
            >
              <q-item-section>
                <q-item-label>{{scope.opt.nome}}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12">
        <app-select-usuario
        class="q-mb-md"
        :outlined="true"
        :idUsuario="form.idRepresentante"
        label="Representando por"
        @usuario="setaRepresentante" />
      </div>
    </div>
    <q-separator class="q-mt-md"></q-separator>
    <div class="row q-mt-md">

      <div class="col-xs-12">
        <q-btn
          v-if="form.id !== guidEmpty && temPermissao('ExcluirUsuario')"
          type="button"
          label="Excluir"
          flat
          :loading="excluindo"
          color="negative"
          icon="delete"
          @click="excluir" />

        <q-btn
          type="submit"
          :disable="salvando && verificandoLogin"
          :loading="salvando"
          label="salvar"
          color="primary"
          class="float-right"
          icon="check" />
      </div>
    </div>
  </q-form>
</div>
</template>

<script>
import { mapState } from 'vuex'
import {
  QItemLabel, QItem, QSelect, QCheckbox, QItemSection, QBtn, QInput, QSeparator, QForm,
} from 'quasar'
import { capitalizeTitle, temPermissao, guidEmpty } from '../../../util/util'
import {
  excluir, existeLogin, putCoordenador, postCoordenador,
} from '../../../services/usuario'
import AppSelectUsuario from '../../../components/select-usuario/main.vue'
import AppCabecalhoForm from '../../../components/cabecalho-form/main.vue'

export default {

  components: {
    AppSelectUsuario,
    AppCabecalhoForm,
    QItemLabel,
    QInput,
    QItem,
    QSelect,
    QCheckbox,
    QItemSection,
    QSeparator,
    QForm,
    QBtn,
  },

  props: {
    usuario: {
      type: Object,
      required: false,
      default: () => {},
    },
    unidades: {
      type: Array,
      required: false,
      default: () => [],
    },
    perfis: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  data() {
    return {
      guidEmpty,
      perfisFiltrado: this.perfis.filter((x) => x.id === '27ba5524-5455-4a26-a8be-1387c6ef32c4' || x.id === 'a8eb8200-7ad9-42d8-8b09-0924392f06fd'),
      editar: false,
      salvando: false,
      excluindo: false,
      loginAntigo: '',
      verificandoLogin: false,
      loginValido: true,
      usuarios: [],
      form: {
        id: '00000000-0000-0000-0000-000000000000',
        login: '',
        alterarSenha: true,
        valorComissaoVenda: false,
        nome: '',
        senha: '',
        perfil: null,
        idRepresentante: null,
        unidades: [],
      },
    }
  },

  computed: {
    ...mapState({
      sessao: (state) => state.sessao.user,
    }),
  },

  mounted() {
    this.form.idRepresentante = this.sessao.id
    if (this.usuario) {
      this.form.perfil = this.perfis.find((item) => item.id === this.usuario.idPerfil)
      this.form.id = this.usuario.id
      this.form.nome = this.usuario.nome
      this.form.login = this.usuario.login
      this.form.senha = ''
      this.form.alterarSenha = this.usuario.alterarSenha
      this.form.idRepresentante = this.usuario.idUsuarioRepresentante
      this.editar = true
      this.form.unidades = this.usuario.unidades

      this.loginAntigo = this.form.login
    }
  },

  methods: {
    temPermissao(permissao) { return temPermissao(permissao) },

    validaForm() {
      const nome = this.$refs.nome.validate()
      const login = this.$refs.login.validate()
      const senha = this.editar ? true : this.$refs.senha.validate()
      const perfil = this.$refs.perfil.validate()
      if (!nome || !login || !senha || !perfil) {
        this.$q.notify({
          type: 'negative',
          position: 'top-right',
          message: 'Corrija os campos em vermelho.',
        })
      } else {
        this.submitSalvar()
      }
    },

    excluir() {
      this.$q.dialog({
        title: 'Excluir',
        message: 'Deseja excluir esse usuário?',
        cancel: true,
        persistent: true,
        ok: {
          label: 'Excluir',
          color: 'negative',
        },
      }).onOk(async () => {
        this.excluindo = true
        const reposta = await excluir(this.form.id)
        this.excluindo = false
        if (reposta.success) {
          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: 'Usuário Excluído.',
          })
          this.$emit('excluiu', this.form)
        } else {
          this.$q.notify({
            type: 'negative',
            position: 'top',
            message: reposta.message,
          })
        }
      })
    },

    setaRepresentante(usuario) {
      if (usuario == null) {
        this.form.idRepresentante = usuario
      } else if (this.form.id !== usuario.id) {
        // TODO: exibir mensegm que nao pode add o mesmo usuario
        this.form.idRepresentante = usuario.id
      }
    },

    capitalizaNome() {
      this.form.nome = capitalizeTitle(this.form.nome)
    },

    async verificaLogin() {
      this.form.login = this.form.login.toLowerCase().replace(/\s/g, '')
      this.loginValido = true
      this.form.senha = this.form.login
      this.$refs.login.validate()
      if (this.loginAntigo !== this.form.login && this.form.login !== '') {
        this.verificandoLogin = true
        const existe = await existeLogin(this.form.login)
        this.loginValido = !existe
        this.verificandoLogin = false
        this.$refs.login.validate()
      }
    },

    async submitSalvar() {
      const usuario = {
        id: this.form.id,
        login: this.form.login,
        nome: capitalizeTitle(this.form.nome),
        senha: this.form.senha,
        alterarSenha: this.form.alterarSenha,
        idsUnidade: this.form.unidades.map((item) => item.id),
        idRepresentante: this.form.idRepresentante,
        idPerfil: this.form.perfil.id,
      }

      this.salvando = true

      if (this.editar) {
        const result = await putCoordenador(usuario)
        this.salvando = false
        if (result.success) {
          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: 'Usuário salvo com sucesso.',
          })
          this.$emit('salvou')
        }
      } else {
        const result = await postCoordenador(usuario)
        this.salvando = false
        if (result.success) {
          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: 'Usuário salvo com sucesso.',
          })
          this.form.id = result.data.id
          this.editar = true
          this.$emit('salvou')
        }
      }
    },
  },
}
</script>
