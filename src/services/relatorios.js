import { baseURL } from './url'
import axios from '../configs/axios'

export const clientesFechados = async (idUnidade, inicio, fim) => {
  const params = new URLSearchParams()
  if (idUnidade != null) params.append('idUnidade', idUnidade)
  if (inicio != null) params.append('inicio', inicio)
  if (fim != null) params.append('fim', fim)
  const response = await axios.get(baseURL(`api/relatorios/clientes-fechados?${params.toString()}`))
  return response.data
}

export const comissoesUnidade = async (idUnidade, inicio, fim) => {
  const params = new URLSearchParams()
  if (idUnidade != null) params.append('idUnidade', idUnidade)
  if (inicio != null) params.append('inicio', inicio)
  if (fim != null) params.append('fim', fim)
  const response = await axios.get(baseURL(`api/relatorios/comissao-unidade?${params.toString()}`))
  return response.data
}

export const vendas = async (idUnidade, mes, ano) => {
  const params = new URLSearchParams()
  if (idUnidade != null) params.append('idUnidade', idUnidade)
  if (mes != null) params.append('mes', mes)
  if (ano != null) params.append('ano', ano)
  const response = await axios.get(baseURL(`api/relatorios/vendas?${params.toString()}`))
  return response.data
}

export const vendasPorDatas = async (idUnidade, inicio, fim) => {
  const params = new URLSearchParams()
  if (idUnidade != null) params.append('idUnidade', idUnidade)
  if (inicio != null) params.append('inicio', inicio)
  if (fim != null) params.append('fim', fim)
  const response = await axios.get(baseURL(`api/relatorios/vendas?${params.toString()}`))
  return response.data
}

export const vendasPorTipo = async (inicio, fim) => {
  const params = new URLSearchParams()
  if (inicio != null) params.append('inicio', inicio)
  if (fim != null) params.append('fim', fim)
  const response = await axios.get(baseURL(`api/relatorios/vendas-por-tipo?${params.toString()}`))
  return response.data
}

export const faturas = async (idUnidade, idUsuario, inicio, fim) => {
  const params = new URLSearchParams()
  if (idUnidade != null) params.append('idUnidade', idUnidade)
  if (idUsuario != null) params.append('idUsuario', idUsuario)
  if (inicio != null) params.append('inicio', inicio)
  if (fim != null) params.append('fim', fim)
  const response = await axios.get(baseURL(`api/relatorios/faturas?${params.toString()}`))
  return response.data
}

export default {
  clientesFechados,
  comissoesUnidade,
  vendas,
  vendasPorDatas,
  vendasPorTipo,
  faturas,
}
