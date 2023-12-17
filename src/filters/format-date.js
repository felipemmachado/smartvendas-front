import dayjs from 'dayjs'

const formatDate = (value) => {
  if (value) {
    return dayjs(String(value)).format('DD/MM/YYYY')
  }
  return ''
}

export default formatDate
