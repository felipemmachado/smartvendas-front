import { baseURL } from './url'
import axios from '../configs/axios'
import { validaResponse } from './error'

export const retornaTodos = async () => {
  const response = await axios.get(baseURL('api/tipos-de-venda'))
  return response.data
}

export const retornaPorId = async (id) => {
  const response = await axios.get(baseURL(`api/tipos-de-venda/${id}`))
  return response.data
}

export const excluir = async (id) => {
  const response = await axios.delete(baseURL(`api/tipos-de-venda/${id}`))
  return validaResponse(response.data)
}

export const put = async (comissao) => {
  const response = await axios.put(baseURL(`api/tipos-de-venda/${comissao.id}`), comissao)
  return validaResponse(response.data)
}

export const post = async (comissao) => {
  const response = await axios.post(baseURL('api/tipos-de-venda'), comissao)
  return validaResponse(response.data)
}

export default {
  retornaPorId,
  retornaTodos,
  excluir,
  put,
  post,
}
