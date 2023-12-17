import { baseURL } from './url'
import axios from '../configs/axios'
import { validaResponse } from './error'

export const retornaPorLoginSenha = async (login, senha) => {
  const data = {
    login,
    senha,
  }

  const response = await axios.post(baseURL('api/usuarios/acesso'), data)
  return response.data
}

export const obterPorId = async (id) => {
  const response = await axios.get(baseURL(`api/usuarios/${id}`))
  return response.data
}

export const obterFaturas = async (idUnidade, mes, ano) => {
  const params = new URLSearchParams()
  if (idUnidade != null) params.append('idUnidade', idUnidade)
  if (mes != null) params.append('mes', mes)
  if (ano != null) params.append('ano', ano)

  const response = await axios.get(baseURL(`api/usuarios/faturas/?${params.toString()}`))
  return response.data
}

export const obterFaturamento = async (idUnidade, mes, ano) => {
  const params = new URLSearchParams()
  if (idUnidade != null) params.append('idUnidade', idUnidade)
  if (mes != null) params.append('mes', mes)
  if (ano != null) params.append('ano', ano)

  const response = await axios.get(baseURL(`api/usuarios/valor-fatura?${params.toString()}`))
  return response.data
}

export const alterarSenha = async (senhaAtual, senha, reSenha) => {
  const data = {
    senhaAtual,
    senha,
    reSenha,
  }

  const response = await axios.post(baseURL('api/usuarios/alterar-senha'), data)
  return validaResponse(response.data)
}

export const excluir = async (id) => {
  const response = await axios.delete(baseURL(`api/usuarios/${id}`))
  return validaResponse(response.data)
}

export const retornaPorCoordenadorDeVendas = async () => {
  const response = await axios.get(baseURL('api/usuarios/coordenador-vendas'))
  return response.data
}

export const retornaPorCoordenadorDeVendasPorId = async (id) => {
  const response = await axios.get(baseURL(`api/usuarios/coordenador-vendas/${id}`))
  return response.data
}

export const retornaTodos = async () => {
  const response = await axios.get(baseURL('api/usuarios'))
  return response.data
}

export const atualizaMeusDados = async (dados) => {
  const response = await axios.post(baseURL('api/usuarios/meus-dados'), dados)
  return validaResponse(response.data)
}

export const retornaPorId = async (id) => {
  const response = await axios.get(baseURL(`api/usuarios/${id}`))
  return response.data
}

export const retornaMeusDados = async () => {
  const response = await axios.get(baseURL('api/usuarios/meus-dados'))
  return response.data
}

export const retornaDadosBancario = async () => {
  const response = await axios.get(baseURL('api/usuarios/conta-bancaria'))
  return response.data
}

export const buscaUsuarios = async (busca) => {
  const response = await axios.get(baseURL(`api/usuarios/busca/${busca}`))
  return response.data
}

export const existeLogin = async (login) => {
  const response = await axios.get(baseURL(`api/usuarios/existe/${login}`))
  return response.data
}

export const put = async (usuario) => {
  const response = await axios.put(baseURL(`api/usuarios/${usuario.id}`), usuario)
  return validaResponse(response.data)
}

export const putContaBancaria = async (conta) => {
  const response = await axios.put(baseURL(`api/usuarios/conta-bancaria/${conta.id}`), conta)
  return validaResponse(response.data)
}

export const putCoordenador = async (usuario) => {
  const response = await axios.put(baseURL(`api/usuarios/coordenador-vendas/${usuario.id}`), usuario)
  return validaResponse(response.data)
}

export const post = async (usuario) => {
  const response = await axios.post(baseURL('api/usuarios'), usuario)
  return validaResponse(response.data)
}

export const postContaBancaria = async (conta) => {
  const response = await axios.post(baseURL('api/usuarios/conta-bancaria'), conta)
  return validaResponse(response.data)
}

export const postCoordenador = async (usuario) => {
  const response = await axios.post(baseURL('api/usuarios/coordenador-vendas'), usuario)
  return validaResponse(response.data)
}

export const obterPagamentos = async (mes, ano) => {
  const params = new URLSearchParams()
  if (mes != null) params.append('mes', mes)
  if (ano != null) params.append('ano', ano)

  const response = await axios.get(baseURL(`api/usuarios/pagamento?${params.toString()}`))
  return response.data
}

export const putPagamento = async (statusPagamento) => {
  const response = await axios.put(baseURL(`api/usuarios/pagamento/${statusPagamento.id}`), statusPagamento)
  return validaResponse(response.data)
}

export const postPagamento = async (statusPagamento) => {
  const response = await axios.post(baseURL('api/usuarios/pagamento'), statusPagamento)
  return validaResponse(response.data)
}

export const obterVendasComissao = async (idUsuario) => {
  const response = await axios.get(baseURL(`api/usuarios/${idUsuario}/venda-comissao`))
  return response.data
}

export const postVendaComissao = async (vendaComissao) => {
  const response = await axios.post(baseURL(`api/usuarios/${vendaComissao.idUsuario}/venda-comissao`), vendaComissao)
  return validaResponse(response.data)
}

export const putVendaComissao = async (idUsuario, vendaComissao) => {
  const response = await axios.put(baseURL(`api/usuarios/${idUsuario}/venda-comissao/${vendaComissao.id}`), vendaComissao)
  return validaResponse(response.data)
}

export const excluirComissao = async (idUsuario, idComissao) => {
  const response = await axios.delete(baseURL(`api/usuarios/${idUsuario}/venda-comissao/${idComissao}`))
  return validaResponse(response.data)
}

export default {
  retornaPorLoginSenha,
  obterPorId,
  obterFaturas,
  obterFaturamento,
  alterarSenha,
  excluir,
  retornaPorCoordenadorDeVendas,
  retornaPorCoordenadorDeVendasPorId,
  retornaTodos,
  atualizaMeusDados,
  retornaPorId,
  retornaMeusDados,
  retornaDadosBancario,
  buscaUsuarios,
  existeLogin,
  put,
  putContaBancaria,
  putCoordenador,
  post,
  postContaBancaria,
  postCoordenador,
  obterPagamentos,
  putPagamento,
  postPagamento,
  obterVendasComissao,
  postVendaComissao,
  putVendaComissao,
  excluirComissao,
}
