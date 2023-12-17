import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/acesso/main.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'inicio',
    props: true,
    component: Login,
    children: [
      {
        path: '/login',
        name: 'login',
        component: () => import('../views/acesso/login/main.vue'),
      },
    ],
  },
  {
    path: '/alterar-senha',
    name: 'alterar-senha',
    component: () => import('../views/alterar-senha/main.vue'),
  },
  {
    path: '/',
    name: 'menu',
    component: () => import('../views/menu/main.vue'),
    children: [
      {
        path: '/minhas-vendas',
        name: 'minhas-vendas',
        component: () => import('../views/minhas-vendas/main.vue'),
      },
      {
        path: '/voce',
        name: 'voce',
        component: () => import('../views/voce/main.vue'),
      },
      {
        path: '/mudar-senha',
        name: 'mudar-senha',
        component: () => import('../views/voce/components/mudar-senha.vue'),
      },
      {
        path: '/dados-bancario',
        name: 'dados-bancario',
        component: () => import('../views/voce/components/dados-bancario.vue'),
      },
      {
        path: '/meus-dados',
        name: 'meus-dados',
        component: () => import('../views/voce/components/cadastro.vue'),
      },
      {
        path: '/tema',
        name: 'tema',
        component: () => import('../views/voce/components/tema.vue'),
      },
      {
        path: '/meu-time-vendas',
        name: 'meu-time-vendas',
        component: () => import('../views/meu-time-vendas/main.vue'),
      },
      {
        path: '/meu-time-vendas/vendas-cadastro',
        name: 'meu-time-vendas-cadastro',
        component: () => import('../views/meu-time-vendas/cadastro/main.vue'),
      },
      {
        path: '/meu-time-vendas/vendas-agenda',
        name: 'meu-time-vendas-agenda',
        component: () => import('../views/meu-time-vendas/agenda/main.vue'),
      },
      {
        path: '/unidade-vendas',
        name: 'unidade-vendas',
        component: () => import('../views/unidade-vendas/main.vue'),
      },
      {
        path: '/ajustes/usuario',
        name: 'usuario',
        component: () => import('../views/ajustes-app/usuario/main.vue'),
      },
      {
        path: '/ajustes/unidade',
        name: 'unidade',
        component: () => import('../views/ajustes-app/unidade/main.vue'),
      },
      {
        path: '/ajustes/exportar-agendamentos',
        name: 'exportar-agendamentos',
        component: () => import('../views/ajustes-app/exportar-agendamentos/main.vue'),
      },
      {
        path: '/ajustes',
        name: 'ajustes',
        component: () => import('../views/ajustes-app/main.vue'),
      },
      {
        path: '/ajustes/venda-agenda-tipo',
        name: 'venda-agenda-tipo',
        component: () => import('../views/ajustes-app/venda-agenda-tipo/main.vue'),
      },
      {
        path: '/ajustes/configuracoes-gerais',
        name: 'configuracoes-gerais',
        component: () => import('../views/ajustes-app/config-gerais/main.vue'),
      },
      {
        path: '/ajustes/venda-comissao',
        name: 'venda-comissao',
        component: () => import('../views/ajustes-app/venda-comissao/main.vue'),
      },
      {
        path: '/relatorios',
        name: 'relatorios',
        component: () => import('../views/relatorios/main.vue'),
      },
      {
        path: '/relatorios/venda-mes',
        name: 'venda-mes',
        component: () => import('../views/relatorios/venda-mes/main.vue'),
      },
      {
        path: '/relatorios/venda-mes-unidade',
        name: 'venda-mes-unidade',
        component: () => import('../views/relatorios/venda-mes-unidade/main.vue'),
      },
      {
        path: '/relatorios/pagamento-mes',
        name: 'pagamento-mes',
        component: () => import('../views/relatorios/pagamento-mes/main.vue'),
      },
      {
        path: '/relatorios/venda-consultor',
        name: 'venda-consultor',
        component: () => import('../views/relatorios/venda-consultor/main.vue'),
      },
      {
        path: '/relatorios/clientes-fechados',
        name: 'clientes-fechados',
        component: () => import('../views/relatorios/clientes-fechados/main.vue'),
      },
      {
        path: '/relatorios/venda-mes-tipo',
        name: 'venda-mes-tipo',
        component: () => import('../views/relatorios/venda-mes-tipo/main.vue'),
      },
      {
        path: '/relatorios/pagameto-comissao-unidade-mes',
        name: 'pagameto-comissao-unidade-mes',
        component: () => import('../views/relatorios/comissao-unidade-mes/main.vue'),
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('../views/dashboard/main.vue'),
        children: [
          {
            path: '/dashboard/diretor',
            name: 'dashboard-diretor',
            component: () => import('../views/dashboard/diretor.vue'),
          },
          {
            path: '/dashboard/usuario',
            name: 'dashboard-usuario',
            component: () => import('../views/dashboard/usuario.vue'),
          },
          {
            path: '/dashboard/meu-time-vendas',
            name: 'dashboard-meu-time-vendas',
            component: () => import('../views/dashboard/meu-time-vendas.vue'),
          },
          {
            path: '/dashboard/minhas-vendas',
            name: 'dashboard-minhas-vendas',
            component: () => import('../views/dashboard/minhas-vendas.vue'),
          },
          {
            path: '/dashboard/unidade',
            name: 'dashboard-unidade',
            component: () => import('../views/dashboard/unidade.vue'),
          },
        ],
      },

    ],
  },
]

const router = new VueRouter({
  mode: 'history',
  routes,
})

export default router
