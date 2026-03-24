export function toBase64url(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export function fromBase64url(str: string): string {
  const padded = str + '=='.slice(0, (4 - (str.length % 4)) % 4)
  return decodeURIComponent(
    escape(atob(padded.replace(/-/g, '+').replace(/_/g, '/')))
  )
}
