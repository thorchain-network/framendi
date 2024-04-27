import { toggleSet } from '~/helpers/functions'
import {
  nodeStreamConnection,
  poolStreamConnection
} from '~/helpers/ws/connections'

const STREAM_INIT_ACTIVE = process.env.NODE_ENV === 'production'

export const state = () => ({
  active: STREAM_INIT_ACTIVE,
  pause: !STREAM_INIT_ACTIVE,
  count: 0,
  connection: null,
  channel: null,
  hook: false
})

export const actions = {
  increase({ commit }) {
    commit('increase')
  },
  setChannel({ commit }, channel) {
    commit('setChannel', channel)
  },
  stop({ commit }) {
    commit('stop')
  },
  start({ commit }) {
    commit('start')
  },
  togglePause({ commit }, payload) {
    commit('togglePause', payload)
  },
  hook({ commit }, payload) {
    commit('hook', payload)
  }
}

export const mutations = {
  increase(state) {
    state.count++
  },
  setChannel(state, channel) {
    state.channel = channel
  },
  stop({ connection }) {
    const { CONNECTING, OPEN } = WebSocket
    if ([CONNECTING, OPEN].includes(connection?.readyState)) connection.close()
    this.commit('stream/toggle', false)
  },
  start(state) {
    if (state.channel === 'nodes') state.connection = nodeStreamConnection(this)
    if (state.channel === 'pools') state.connection = poolStreamConnection(this)
    this.commit('stream/toggle', true)
  },
  toggle(state, payload) {
    state.active = toggleSet(state.active, payload)
  },
  togglePause(state, payload) {
    state.pause = toggleSet(state.pause, payload)
  },
  hook(state, payload) {
    state.hook = payload
  }
}
