import dayjs from 'dayjs'

const formatDateTime = (value) => {
  if (value) {
    return dayjs(String(value)).format('DD/MM/YYYY HH:mm')
  }
  return ''
}

export default formatDateTime
