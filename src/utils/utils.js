
export const idFromUrl = (url) => {
  if (url) {
    return url.endsWith('/') ? url.split('/').reverse()[1] : url.split('/').reverse()[0]
  }
  return false
}
