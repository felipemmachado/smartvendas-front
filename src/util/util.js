import dayjs from 'dayjs'
import chaveDeFuncionalidades from '@/configs/chaves-funcionalidades'
import jwt from 'jwt-decode'
import storage from '../configs/local-storage'

require('dayjs/locale/pt-br')

dayjs.locale('pt-br')

const customParseFormat = require('dayjs/plugin/customParseFormat')

dayjs.extend(customParseFormat)

export const capitalizeTitle = (string) => {
  if (string === '' || string === null) return string
  return string.trim().replace(/\s{2,}/g, ' ').split(' ')
    .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
    .join(' ')
}

// eslint-disable-next-line no-nested-ternary
export const sortBy = (key) => (a, b) => ((a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0))

export const orderBy = (list, key) => list.concat().sort(sortBy(key))

export const formatSqlDate = (date) => {
  if (date) return dayjs(String(date), 'DD/MM/YYYY').format('YYYY-MM-DD')
  return ''
}

export const groupBy = (list, key) => list.reduce((r, a) => {
  // eslint-disable-next-line no-param-reassign
  r[a[key]] = r[a[key]] || []
  r[a[key]].push(a)
  return r
}, Object.create(null))

export const toNumber = (string) => Number(string.replace('.', '').replace('.', '').replace('.', '').replace('R$ ', '')
  .replace(',', '.'))

export const formatDateSql = (date, format = 'DD/MM/YYYY') => {
  if (date) return dayjs(String(date), 'YYYY-MM-DD').format(format)
  return ''
}

export const formatDateTimeSql = (date, fuso = -3) => {
  if (date) return dayjs(String(date), 'YYYY-MM-DDTHH:mm:ss').add(fuso, 'hour').format('DD/MM/YYYY HH:mm')
  return ''
}

export const mesNome = (mes) => {
  const meses = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  return meses[mes]
}

export const dashboardPadrao = {
  agendados: 0,
  compareceram: 0,
  confirmados: 0,
  contratosFechados: 0,
  contratosNaoFechados: 0,
  faturados: 0,
  idUnidade: null,
  idUsuario: null,
  naoCompareceram: 0,
  naoConfirmados: 0,
}

export const validaHora = (input) => {
  if (input === '') return true
  const val = input.split(':')
  if (val[0].length !== 2) return false
  if (val[1].length !== 2) return false

  const hora = Number(val[0])
  const min = Number(val[1])

  if (Number.isNaN(hora)) return false
  if (Number.isNaN(min)) return false

  if (hora > 24) return false
  if (min >= 60) return false
  return true
}

export const nomeSobrenome = (nome) => {
  const nameSplit = nome.split(' ')
  let iniciais = ''

  // so tem 1 nome
  if (nameSplit.length === 1) {
    iniciais = nameSplit[0].toString()
  } else {
    iniciais = `${nameSplit[0]} ${nameSplit[nameSplit.length - 1]}`
  }
  return iniciais
}

export const iniciasNome = (nome = '') => {
  const nameSplit = nome.split(' ')
  let iniciais = ''

  // so tem 1 nome
  if (nameSplit.length === 1) {
    iniciais = nameSplit[0].substring(0, 2)
  } else {
    iniciais = nameSplit[0].substring(0, 1) + nameSplit[nameSplit.length - 1].substring(0, 1)
  }
  return iniciais.toUpperCase()
}

export const validaTamanhoDatas = (valor) => {
  if (valor.length === 23) return true
  return false
}

export const validaData = (data) => {
  let val = data.replace('/', '')
  val = val.replace('/', '')

  const dia = Number(val.substr(0, 2))
  const mes = Number(val.substr(2, 2))
  const ano = Number(val.substr(4, 4))

  const messes = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  if (dia !== 0 && mes !== 0 && ano !== 0) {
    if (!(mes <= 12 && mes > 0)) {
      return false
    }

    if (!(dia <= messes[mes] && dia > 0)) {
      return false
    }

    const leapYear = (ano % 400 === 0) || (ano % 4 === 0 && ano % 100 !== 0)
    if (!(mes !== 2 || leapYear || dia <= 28)) {
      return false
    }
  }
  return true
}

export const validaDatas = (datas) => {
  const val = datas.split(' - ')

  if (val.length === 2) {
    const data1 = validaData(val[0])
    const data2 = validaData(val[1])

    return data1 && data2
  }
  return false
}

export const exibeFuncao = (funcionalidade) => {
  if (funcionalidade === '') return true
  const data = JSON.parse(sessionStorage.getItem(storage.localSessao))
  const dados = jwt(data.token)

  if (typeof dados.role === 'string') {
    return dados.role === funcionalidade
  }

  if (Array.isArray(dados.role)) {
    const index = dados.role.findIndex((x) => x === funcionalidade)
    return index > -1
  }

  return false
}

export const temPermissao = (chave) => {
  if (chave === '') return true
  if (typeof chave === 'undefined') return true
  if (chave === null) return true
  return exibeFuncao(chaveDeFuncionalidades[chave]())
}

export const vMoneyConfig = {
  decimal: ',',
  thousands: '.',
  prefix: 'R$ ',
  suffix: '',
  precision: 2,
  masked: false,
}

export const guidEmpty = '00000000-0000-0000-0000-000000000000'

export default {
  capitalizeTitle,
  formatSqlDate,
  toNumber,
  formatDateSql,
  formatDateTimeSql,
  mesNome,
  validaHora,
  nomeSobrenome,
  iniciasNome,
  validaTamanhoDatas,
  validaDatas,
  validaData,
  temPermissao,
  exibeFuncao,
  vMoneyConfig,
  guidEmpty,
  dashboardPadrao,
}
