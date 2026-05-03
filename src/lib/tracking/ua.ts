export type UAFamily =
  | 'Chrome'
  | 'Safari'
  | 'Firefox'
  | 'Edge'
  | 'Opera'
  | 'Mobile'
  | 'Other'

export type OSFamily = 'Windows' | 'macOS' | 'iOS' | 'Android' | 'Linux' | 'Other'

export function parseUA(ua: string | null | undefined): { browser: UAFamily; os: OSFamily; mobile: boolean } {
  const s = (ua || '').toLowerCase()
  const mobile = /(iphone|ipad|ipod|android|mobile|opera mini)/.test(s)

  let browser: UAFamily = 'Other'
  if (/edg\//.test(s)) browser = 'Edge'
  else if (/opr\/|opera/.test(s)) browser = 'Opera'
  else if (/firefox\//.test(s)) browser = 'Firefox'
  else if (/chrome\//.test(s) && !/edg\//.test(s)) browser = 'Chrome'
  else if (/safari\//.test(s) && /version\//.test(s)) browser = 'Safari'
  else if (mobile) browser = 'Mobile'

  let os: OSFamily = 'Other'
  if (/windows/.test(s)) os = 'Windows'
  else if (/iphone|ipad|ipod/.test(s)) os = 'iOS'
  else if (/android/.test(s)) os = 'Android'
  else if (/mac os x|macintosh/.test(s)) os = 'macOS'
  else if (/linux/.test(s)) os = 'Linux'

  return { browser, os, mobile }
}

export function flagFor(country: string | null | undefined): string {
  if (!country || country.length !== 2) return ''
  const cc = country.toUpperCase()
  const A = 0x1f1e6
  return String.fromCodePoint(A + (cc.charCodeAt(0) - 65), A + (cc.charCodeAt(1) - 65))
}
