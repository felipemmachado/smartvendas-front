import { baseURL } from './url'
import axios from '../configs/axios'
import { validaResponse } from './error'

export const retornaUnidades = async () => {
  const response = await axios.get(baseURL('api/unidades/usuario'))
  return response.data
}

export const retornaTodasUnidades = async () => {
  const response = await axios.get(baseURL('api/unidades'))
  return response.data
}

export const excluir = async (id) => {
  const response = await axios.delete(baseURL(`api/unidades/${id}`))
  return validaResponse(response.data)
}

export const retornaDatasBloqueadas = async (idUnidade) => {
  const response = await axios.get(baseURL(`api/unidades/${idUnidade}/data-bloqueio`))
  return response.data
}

export const podeAgendar = async (idUnidade, data) => {
  const response = await axios.get(baseURL(`api/unidades/${idUnidade}/agenda/${data}`))
  return response.data
}

export const retornaDatasBloqueadasUnidade = async (idUnidade, mes, ano) => {
  const response = await axios.get(baseURL(`api/unidades/${idUnidade}/data-bloqueio/${mes}/${ano}`))
  return response.data
}

export const retornaUnidadeFuncionamento = async (idUnidade) => {
  const response = await axios.get(baseURL(`api/unidades/${idUnidade}/funcionamento`))
  return response.data
}

export const buscaUnidades = async (busca) => {
  const response = await axios.get(baseURL(`api/unidades/busca/${busca}`))
  return response.data
}

export const put = async (unidade) => {
  const response = await axios.put(baseURL(`api/unidades/${unidade.id}`), unidade)
  return validaResponse(response.data)
}

export const post = async (unidade) => {
  const response = await axios.post(baseURL('api/unidades'), unidade)
  return validaResponse(response.data)
}

export const postFuncionamento = async (unidadeFuncionamento) => {
  const response = await axios.post(baseURL(`api/unidades/${unidadeFuncionamento.idUnidade}/funcionamento`), unidadeFuncionamento)
  return validaResponse(response.data)
}

export const putFuncionamento = async (unidadeFuncionamento) => {
  const response = await axios.put(baseURL(`api/unidades/${unidadeFuncionamento.idUnidade}/funcionamento/${unidadeFuncionamento.id}`), unidadeFuncionamento)
  return validaResponse(response.data)
}

export const excluirFuncionamento = async (idUnidade, idFuncionamento) => {
  const response = await axios.delete(baseURL(`api/unidades/${idUnidade}/funcionamento/${idFuncionamento}`))
  return validaResponse(response.data)
}

export const postDataBloqueio = async (dataBloqueio) => {
  const response = await axios.post(baseURL(`api/unidades/${dataBloqueio.idUnidade}/data-bloqueio`), dataBloqueio)
  return validaResponse(response.data)
}

export const excluirDataBloqueio = async (idUnidade, idDataBloqueio) => {
  const response = await axios.delete(baseURL(`api/unidades/${idUnidade}/data-bloqueio/${idDataBloqueio}`))
  return validaResponse(response.data)
}

export const retornaTodasComissoesDeVenda = async (idUnidade) => {
  const response = await axios.get(baseURL(`api/unidades/${idUnidade}/vendas-comissao`))
  return response.data
}

export const retornaTodasComissoesDeVendaAtivas = async (idUnidade) => {
  const response = await axios.get(baseURL(`api/unidades/${idUnidade}/vendas-comissao/ativas`))
  return response.data
}

export const excluirVendaComissao = async (idUnidade, id) => {
  const response = await axios.delete(baseURL(`api/unidades/${idUnidade}/vendas-comissao/${id}`))
  return validaResponse(response.data)
}

export const putVendaComissao = async (idUnidade, comissao) => {
  const response = await axios.put(baseURL(`api/unidades/${idUnidade}/vendas-comissao/${comissao.id}`), comissao)
  return validaResponse(response.data)
}

export const postVendaComissao = async (idUnidade, comissao) => {
  const response = await axios.post(baseURL(`api/unidades/${idUnidade}/vendas-comissao`), comissao)
  return validaResponse(response.data)
}

export default {
  retornaUnidades,
  retornaTodasUnidades,
  excluir,
  retornaDatasBloqueadas,
  podeAgendar,
  retornaDatasBloqueadasUnidade,
  retornaUnidadeFuncionamento,
  buscaUnidades,
  put,
  post,
  postFuncionamento,
  putFuncionamento,
  excluirFuncionamento,
  postDataBloqueio,
  excluirDataBloqueio,
  retornaTodasComissoesDeVenda,
  retornaTodasComissoesDeVendaAtivas,
  excluirVendaComissao,
  putVendaComissao,
  postVendaComissao,
}
