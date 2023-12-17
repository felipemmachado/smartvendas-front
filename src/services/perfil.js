import { baseURL } from './url'
import axios from '../configs/axios'

export const retornaTodosPerfis = async () => {
  const response = await axios.get(baseURL('api/perfis'))

  return response.data
}

export default {
  retornaTodosPerfis,
}
