import { nextItem } from '~/helpers/functions'

const columnsInit = {
  geo: true,
  chains: true,
  fee: false,
  provider: false,
  score: false,
  health: true,
  healthx: false
}

const defaultSort = {
  active: { field: 'vgtSelected', type: 'desc' },
  frontline: { field: 'bond', type: 'desc' },
  rest: { field: 'vgtSelected', type: 'desc' }
}

function getSort() {
  const sortObj = JSON.parse(localStorage.getItem('sort')) ?? defaultSort
  sortObj.active.field = sortObj.active.field.replace(
    /probes\.([a-zA-Z0-9]+)/g,
    'chains.$1'
  )
  return sortObj
}

export const state = () => ({
  raw: false,
  usd: false,
  font: localStorage.getItem('font') || 'Runic, Monoid',
  keyboardControlsActive: true,
  sort: getSort(),
  probesActive: false,
  columns: JSON.parse(localStorage.getItem('columns_v2')) || columnsInit
})

export const actions = {
  toggleFormat({ commit }) {
    commit('toggleFormat')
  },
  toggleUSDFormat({ commit }) {
    commit('toggleUSDFormat')
  },
  setFont({ commit }, payload) {
    commit('setFont', payload)
  },
  setKeyboardControls({ commit }, payload) {
    commit('setKeyboardControls', payload)
  },
  setSort({ commit }, payload) {
    commit('setSort', payload)
  },
  toggleProbes({ commit }) {
    commit('toggleProbes')
  },
  toggleColumnsLocation({ commit }) {
    commit('toggleColumnsLocation')
  },
  toggleColumnsChains({ commit }) {
    commit('toggleColumnsChains')
  },
  toggleColumnsFee({ commit }) {
    commit('toggleColumnsFee')
  },
  toggleColumnsProvider({ commit }) {
    commit('toggleColumnsProvider')
  },
  toggleColumnsScore({ commit }) {
    commit('toggleColumnsScore')
  },
  toggleColumnsHealthx({ commit }) {
    commit('toggleColumnsHealthx')
  },
  toggleColumnsHealth({ commit }) {
    commit('toggleColumnsHealth')
  },
  cycleTheme({ commit }) {
    commit('cycleTheme')
  }
}

export const mutations = {
  toggleFormat(state) {
    state.raw = !state.raw
  },
  toggleUSDFormat(state) {
    if (state.raw) return
    state.usd = !state.usd
  },
  setFont(state, payload) {
    state.font = payload
    localStorage.setItem('font', state.font)
  },
  setKeyboardControls(state, payload) {
    state.keyboardControlsActive = payload
  },
  setSort(state, payload) {
    if (!payload) {
      state.sort = defaultSort
      localStorage.removeItem('sort')
      return
    }
    state.sort = { ...state.sort, ...payload }
    localStorage.setItem('sort', JSON.stringify({ ...state.sort, ...payload }))
  },
  toggleProbes(state) {
    state.probesActive = !state.probesActive
    state.sort.active.field = state.probesActive
      ? state.sort.active.field.replace(/chains\.([a-zA-Z0-9]+)/g, 'probes.$1')
      : state.sort.active.field.replace(/probes\.([a-zA-Z0-9]+)/g, 'chains.$1')
  },
  toggleColumnsLocation(state) {
    state.columns.geo = !state.columns.geo
    localStorage.setItem('columns_v2', JSON.stringify(state.columns))
  },
  toggleColumnsChains(state) {
    state.columns.chains = !state.columns.chains
    localStorage.setItem('columns_v2', JSON.stringify(state.columns))
  },
  toggleColumnsFee(state) {
    state.columns.fee = !state.columns.fee
    localStorage.setItem('columns_v2', JSON.stringify(state.columns))
  },
  toggleColumnsProvider(state) {
    state.columns.provider = !state.columns.provider
    localStorage.setItem('columns_v2', JSON.stringify(state.columns))
  },
  toggleColumnsScore(state) {
    state.columns.score = !state.columns.score
    localStorage.setItem('columns_v2', JSON.stringify(state.columns))
  },
  toggleColumnsHealthx(state) {
    state.columns.healthx = !state.columns.healthx
    localStorage.setItem('columns_v2', JSON.stringify(state.columns))
  },
  toggleColumnsHealth(state) {
    state.columns.health = !state.columns.health
    localStorage.setItem('columns_v2', JSON.stringify(state.columns))
  },
  cycleTheme() {
    this.$colorMode.preference = nextItem(
      ['light', 'sepia', 'dark'],
      this.$colorMode.value
    )
  }
}
