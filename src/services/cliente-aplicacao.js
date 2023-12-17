import { baseURL } from './url'
import axios from '../configs/axios'

export const retornaPorNome = async (nome) => {
  const result = await axios.get(baseURL(`api/cliente-aplicacao/${nome}/nome`))
  return result.data
}

export const atualizaAjustes = async (form) => {
  const result = await axios.put(baseURL(`api/cliente-aplicacao/${form.id}/ajustes`), form)
  return result.data
}

export const retornaAjustes = async () => {
  const result = await axios.get(baseURL('api/cliente-aplicacao/ajustes'))
  return result.data
}

export default {
  retornaPorNome,
  atualizaAjustes,
  retornaAjustes,
}
