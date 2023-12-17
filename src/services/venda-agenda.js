import { baseURL } from './url'
import axios from '../configs/axios'
import { validaResponse } from './error'

export const put = async (venda) => {
  const response = await axios.put(baseURL(`api/vendas-agenda/${venda.id}`), venda)
  return validaResponse(response.data)
}

export const reagendar = async (idvenda, reagendamento) => {
  const response = await axios.post(baseURL(`api/vendas-agenda/${idvenda}/reagendar`), reagendamento)
  return validaResponse(response.data)
}

export const excluir = async (id) => {
  const response = await axios.delete(baseURL(`api/vendas-agenda/${id}`))
  return validaResponse(response.data)
}

export const excluirObservacao = async (id, idObservacao) => {
  const response = await axios.delete(baseURL(`api/vendas-agenda/${id}/observacao/${idObservacao}`))
  return validaResponse(response.data)
}

export const exportar = async (nome, inicio, fim, idsUsuarios, idsUnidades) => {
  const params = new URLSearchParams()
  if (nome != null) params.append('nome', nome)
  if (inicio != null) params.append('inicio', inicio)
  if (fim != null) params.append('fim', fim)
  if (idsUsuarios != null) params.append('idsUsuarios', idsUsuarios)
  if (idsUnidades != null) params.append('idsUnidades', idsUnidades)

  const response = await axios.get(baseURL(`api/vendas-agenda/exportar?${params.toString()}`))
  return response.data
}

export const cancelar = async (id) => {
  const response = await axios.delete(baseURL(`api/vendas-agenda/comissao/${id}`))
  return validaResponse(response.data)
}

export const retornaObservacoes = async (idVendaAgenda) => {
  const response = await axios.get(baseURL(`api/vendas-agenda/${idVendaAgenda}/observacao`))
  return response.data
}

export const existeAgenda = async (nome, telefone) => {
  const response = await axios.get(baseURL(`api/vendas-agenda/existe/${nome}/${telefone}`))
  return response.data
}

export const podeConfirmar = async (id) => {
  const response = await axios.get(baseURL(`api/vendas-agenda/${id}/pode-confirmar`))
  return response.data
}

export const retornaPorUsuarioMesAno = async (idUnidade, mes, ano) => {
  const response = await axios.get(baseURL(`api/vendas-agenda/usuario/${idUnidade}/${mes}/${ano}`))
  return response.data
}

export const retornaPagamentoPorUnidadeMesAno = async (idUnidade, mes, ano) => {
  const response = await axios.get(baseURL(`api/vendas-agenda/comissao/pagamento/${idUnidade}/${mes}/${ano}`))
  return response.data
}

export const retornaPorUnidadeMesAno = async (idUnidade, mes, ano) => {
  const response = await axios.get(baseURL(`api/vendas-agenda/unidade/${idUnidade}/${mes}/${ano}`))
  return response.data
}

export const retornaPorUnidadeMesAnoTimeVendas = async (idUnidade, mes, ano) => {
  const response = await axios.get(baseURL(`api/vendas-agenda/unidade/${idUnidade}/${mes}/${ano}/time-vendas`))
  return response.data
}

export const concluir = async (vendaConcluida) => {
  const response = await axios.post(baseURL('api/vendas-agenda/conclusao'), vendaConcluida)
  return validaResponse(response.data)
}

export const dashboardUsuario = async (inicio, fim) => {
  const params = new URLSearchParams()
  if (inicio != null) params.append('inicio', inicio)
  if (fim != null) params.append('fim', fim)

  const response = await axios.get(baseURL(`api/dashboard/usuario?${params.toString()}`))
  return response.data
}

export const dashboardUsuarioDiretoria = async (idUsuario, inicio, fim) => {
  const params = new URLSearchParams()
  if (inicio != null) params.append('inicio', inicio)
  if (fim != null) params.append('fim', fim)

  const response = await axios.get(baseURL(`api/dashboard/usuario/${idUsuario}?${params.toString()}`))
  return response.data
}

export const dashboardUnidade = async (idUnidade, inicio, fim) => {
  const params = new URLSearchParams()
  if (inicio != null) params.append('inicio', inicio)
  if (idUnidade != null) params.append('idUnidade', idUnidade)
  if (fim != null) params.append('fim', fim)

  const response = await axios.get(baseURL(`api/dashboard/unidade?${params.toString()}`))
  return response.data
}

export const dashboardCoordenador = async (inicio, fim) => {
  const params = new URLSearchParams()
  if (inicio != null) params.append('inicio', inicio)
  if (fim != null) params.append('fim', fim)

  const response = await axios.get(baseURL(`api/dashboard/coordenador?${params.toString()}`))
  return response.data
}

export const dashboardDiretor = async (inicio, fim) => {
  const params = new URLSearchParams()
  if (inicio != null) params.append('inicio', inicio)
  if (fim != null) params.append('fim', fim)

  const response = await axios.get(baseURL(`api/dashboard/diretoria?${params.toString()}`))
  return response.data
}

export const retornaPorId = async (id) => {
  const response = await axios.get(baseURL(`api/vendas-agenda/${id}`))
  return response.data
}

export const post = async (venda) => {
  const response = await axios.post(baseURL('api/vendas-agenda'), venda)
  return validaResponse(response.data)
}

export default {
  put,
  reagendar,
  excluir,
  excluirObservacao,
  exportar,
  cancelar,
  retornaObservacoes,
  existeAgenda,
  podeConfirmar,
  retornaPorUsuarioMesAno,
  retornaPagamentoPorUnidadeMesAno,
  retornaPorUnidadeMesAno,
  retornaPorUnidadeMesAnoTimeVendas,
  concluir,
  dashboardUsuario,
  dashboardUsuarioDiretoria,
  dashboardUnidade,
  dashboardCoordenador,
  dashboardDiretor,
  retornaPorId,
  post,
}
