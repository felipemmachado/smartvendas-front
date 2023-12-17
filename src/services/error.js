import { Dialog } from 'quasar'

export const geraMensagemDeErro = (result) => {
  let mensagem = ''

  // gera a msg da array
  if (typeof result.data === 'string') {
    mensagem = `<div class="text-negative">${result.data}</div>`
  }

  // gera a msg da array
  if (Array.isArray(result.data)) {
    let aux = ''
    result.data.forEach((element) => {
      aux += `<div class="text-negative">${element.message}</div>`
    })
    mensagem = aux
  }

  // gera se tiver error como retorno
  if (typeof result.data.error !== 'undefined') {
    mensagem = `<div class="text-negative">${result.data.error}</div>`
  }

  return mensagem
}
export const validaResponse = (result) => {
  if (result.success === false) {
    Dialog.create({
      title: `<div class="text-negative">${result.message}<div>`,
      message: geraMensagemDeErro(result),
      html: true,
    })
  }

  return result
}

export default {
  geraMensagemDeErro,
  validaResponse,
}
