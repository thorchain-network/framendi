export const NETWORK_CONFIG = {
  availableNetworks: Object.keys(process.env.networks),
  get defaultNetwork() {
    return this.availableNetworks[0]
  },
  get secondaryNetworks() {
    return this.availableNetworks.slice(1)
  }
}

export const appNavigation = {
  nodes: { key: 'N', code: 78, desc: 'Nodes' },
  graphs: { key: 'A', code: 65, desc: 'Analytics/Nodes' },
  liquidity: { key: 'L', code: 76, desc: 'Liquidity/Nodes' },
  stats: { key: 'S', code: 83, desc: 'Stats/Nodes' },
  churn: { key: 'D', code: 68, desc: 'Churn/Nodes' },
  stimulus: { key: 'G', code: 71, desc: 'Stimulus/Nodes' },
  help: { key: 'Y', code: 89, desc: 'Help/Nodes' }
}

export const defaultCell = { raw: '-', fmt: '-' }

export const formatNumber = (
  n,
  fr = 0,
  notation = 'standard',
  style = 'decimal'
) => ({
  raw: n,
  fmt: nFmt(n, fr, notation, style)
})

export const formatAndKeepNumber = (
  orig,
  n,
  fr = 0,
  notation = 'standard',
  style = 'decimal'
) => ({
  raw: orig,
  fmt: nFmt(n, fr, notation, style)
})

export const nFmt = (n, fr = 0, notation = 'standard', style = 'decimal') =>
  new Intl.NumberFormat('en-US', {
    style,
    currency: 'USD',
    notation,
    maximumFractionDigits: fr,
    minimumFractionDigits: fr
  }).format(n)

export const median = (arr) => {
  const mid = Math.floor(arr.length / 2)
  const nums = [...arr].sort((a, b) => a - b)
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2
}

function decimalAdjust(type, value, exp) {
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value)
  }
  value = +value
  exp = +exp
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN
  }
  value = value.toString().split('e')
  value = Math[type](+(value[0] + 'e' + (value[1] ? +value[1] - exp : -exp)))
  value = value.toString().split('e')
  return +(value[0] + 'e' + (value[1] ? +value[1] + exp : exp))
}

export const round10 = (value, exp) => decimalAdjust('round', value, exp)
export const floor10 = (value, exp) => decimalAdjust('floor', value, exp)
export const ceil10 = (value, exp) => decimalAdjust('ceil', value, exp)

export const formatRune = (price = 0, n, fr = 0, notation = 'standard') => {
  const v = n / 1e8
  return {
    raw: n,
    fmt: 'ᚱ' + nFmt(v, fr, notation),
    usd: nFmt(price * v, fr, notation, 'currency')
  }
}

export const nanoToMilliSeconds = (unix) => Number(BigInt(unix) / BigInt(1e6))

export const ingestChurns = (churns, previousChurn = null) =>
  churns.map((c, index) => {
    const dateInMillis = nanoToMilliSeconds(c.date)
    const nextDateInMillis =
      index < churns.length - 1
        ? nanoToMilliSeconds(churns[index + 1].date)
        : null
    const genesisDate = 1618058210955

    return {
      ...c,
      height: Number(c.height),
      date: dateInMillis,
      duration:
        index === churns.length - 1
          ? previousChurn
            ? dateInMillis - previousChurn.date
            : dateInMillis - genesisDate
          : dateInMillis - (nextDateInMillis ?? genesisDate),
      blocks:
        index === churns.length - 1
          ? previousChurn
            ? c.height - previousChurn.height
            : c.height
          : c.height - churns[index + 1].height
    }
  })

export const nextItem = (arr, item) => {
  const index = arr.indexOf(item)
  return arr[index >= arr.length - 1 ? 0 : index + 1]
}

export const toggleSet = (state, payload) =>
  typeof payload === 'boolean' ? payload : !state

export const getFlagEmoji = (countryCode) =>
  String.fromCodePoint(
    ...countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt())
  )

export const uniToEmoji = (unicode) =>
  String.fromCodePoint(parseInt(unicode, 16))

export const uniqueItems = (list, keyFn) =>
  list.reduce(
    (resultSet, item) =>
      resultSet.add(typeof keyFn === 'string' ? item[keyFn] : keyFn(item)),
    new Set()
  ).size

export function cleanLocalStorage(arr) {
  arr.forEach((e) => {
    if (localStorage.getItem(e) !== null) localStorage.removeItem(e)
  })
}

export const twemojiUrl = (unicode) =>
  `${process.env.twemojiUrl}/${unicode}.svg`

export const explorerUrl = (addr, net) =>
  `${process.env.explorerUrl}/${addr}${
    net !== NETWORK_CONFIG.defaultNetwork ? `?network=${net}` : ''
  }`

const humD = require('humanize-duration')
export const humanizeDuration = humD.humanizer({
  language: 'shortEn',
  languages: {
    shortEn: {
      y: () => 'y',
      mo: () => 'mo',
      w: () => 'w',
      d: () => 'd',
      h: () => 'h',
      m: () => 'm',
      s: () => 's',
      ms: () => 'ms'
    }
  }
})
