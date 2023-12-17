const document = (documentId, documentType) => {
  if (!documentId) return ''
  let documento = typeof documentId !== 'string' ? documentId.toString() : documentId
  if (documentType === 'cnpj') {
    documento = documentId.padStart(14, '0')
    documento = documentId.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  } else {
    documento = documentId.padStart(11, '0')
    documento = documentId.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
  return documento
}

export default document
