import { nFmt } from '~/helpers/functions'

const runeInit = {
  bare: null,
  price: null,
  priceClass: null,
  volume: null,
  volume_extended: null,
  rank: null,
  supply: null,
  supply_max: null,
  market_cap: null,
  change: null
}

export const state = () => ({
  rune: JSON.parse(localStorage.getItem('rune')) || runeInit,
  previousPrice: null
})

export const actions = {
  setRune({ commit }, data) {
    commit('setRune', data)
  }
}

export const mutations = {
  setRune(state, data) {
    state.rune = {
      bare: data.priceUsd,
      price: nFmt(data.priceUsd, 2, 'standard', 'currency'),
      priceClass: setPriceClass(state.previousPrice, data.priceUsd),
      volume: nFmt(data.volumeUsd24Hr, 1, 'compact', 'currency'),
      volume_extended: nFmt(data.volumeUsd24Hr, 0, 'standard', 'currency'),
      rank: data.rank,
      supply: 'ᚱ' + nFmt(data.supply),
      supply_max: 'ᚱ' + nFmt(500000000),
      market_cap: nFmt(data.marketCapUsd, 0, 'standard', 'currency'),
      change: nFmt(data.changePercent24Hr / 100, 2, 'standard', 'percent')
    }
    localStorage.setItem('rune', JSON.stringify(state.rune))
    state.previousPrice = data.priceUsd
  }
}

function setPriceClass(previous, current) {
  if (previous < current) return 'green'
  if (previous > current) return 'red'
  return null
}
