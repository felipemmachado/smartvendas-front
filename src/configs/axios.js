import axios from 'axios'
import { Dialog, Loading } from 'quasar'
import local from './local-storage'
import router from '../router/index'

// Add a request interceptor
axios.interceptors.request.use((configDefault) => {
  const config = configDefault
  let sessao = null
  if (sessionStorage.getItem(local.localSessao) != null) {
    sessao = JSON.parse(sessionStorage.getItem(local.localSessao))
    config.headers.Authorization = `Bearer ${sessao.token}`
    config.headers['Content-Type'] = 'application/json'
  }
  return config
}, (error) => Promise.reject(error))

// Add a response interceptor
axios.interceptors.response.use((response) => {
  Loading.hide()
  return response
}, (error) => {
  // console.error(error.response.data);
  Loading.hide()
  let mesage = ''
  if (!error.response) {
    mesage = 'Você está sem internet.'
  } else if (error.request.status === 401) {
    const query = {}
    query.url = window.location.href
    sessionStorage.setItem(local.localSessaoExpriada, JSON.stringify(query))
    router.push({ name: 'login' }).catch(() => {})
  } else if (error.request.status === 403) {
    Dialog.create({
      title: 'Permissão Negada',
      message: 'Você não tem permissão para acessar essa funcionalidade.',
    })
  } else if (error.request.status === 500) {
    Dialog.create({
      title: '<div class="text-negative"> Algo deu errado.<div>',
      message: error.request.response,
      html: true,
    })
  } else if (error.request.status === 0
      || error.request.status === 400
      || error.request.status === 404) {
    mesage = error.Error

    Dialog.create({
      title: '<div class="text-negative"> Algo deu errado.<div>',
      message: mesage,
      html: true,
    })
  }

  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error)
})

export default axios
