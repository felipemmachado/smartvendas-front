import { Dark } from 'quasar'

const root = document.documentElement
const keyTema = 'tema-usuario'

const theme = {
  dark: () => {
    Dark.set(true)
    root.style.setProperty('--q-color-primary', '#916eff')
    root.style.setProperty('--q-color-secondary', '#050505')
    root.style.setProperty('--q-color-accent', '#790faa')
    root.style.setProperty('--q-color-positive', '#21BA45')
    root.style.setProperty('--q-color-negative', '#ff0623')
    root.style.setProperty('--q-color-info', '#31CCEC')
    root.style.setProperty('--q-color-warning', '#F2C037')
    root.style.setProperty('--q-color-dark', '#1B1B1B')
    document.body.style.backgroundColor = '#121212'
    localStorage.setItem(keyTema, 'dark')
  },
  light: () => {
    Dark.set(false)
    root.style.setProperty('--q-color-primary', '#221454')
    root.style.setProperty('--q-color-secondary', '#050505')
    root.style.setProperty('--q-color-accent', '#790faa')
    root.style.setProperty('--q-color-positive', '#21BA45')
    root.style.setProperty('--q-color-negative', '#ff0623')
    root.style.setProperty('--q-color-info', '#31CCEC')
    root.style.setProperty('--q-color-warning', '#F2C037')
    root.style.setProperty('--q-color-dark', '#2B2B2B')
    document.body.style.backgroundColor = '#f5f5f5'
    localStorage.setItem(keyTema, 'light')
  },
  getThemaUsuario: () => {
    const tema = localStorage.getItem(keyTema) || null
    return tema
  },
}

export default theme
