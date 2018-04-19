
export const idFromUrl = (url) => {
  if (url) {
    return url.endsWith('/') ? parseInt(url.slice(-2, -1)) : parseInt(url.slice(-1))
  }
  return false
}
