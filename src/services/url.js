const { VUE_APP_API } = process.env

export const baseURL = (uri) => {
  if (typeof uri === 'undefined') {
    return VUE_APP_API
  }
  if (uri.substring(0, 1) === '/') {
    return (VUE_APP_API + uri)
  }
  return (`${VUE_APP_API}/${uri}`)
}

export default {
  baseURL,
}
