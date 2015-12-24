function round (n, dec = 1) {
  return Math.round(n * Math.pow(10, dec)) / Math.pow(10, dec)
}

export function shorten (n) {
  if (n >= 1000000) return round(n / 1000000) + 'm'
  if (n >= 1000) return round(n / 1000) + 'k'
  return n.toString()
}
