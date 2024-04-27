import { Network } from '~/helpers/stream/Network'
import {
  NETWORK_CONFIG,
  cleanLocalStorage,
  ingestChurns
} from '~/helpers/functions'

import { Protocol } from '~/helpers/common/Protocol'
import { Churn } from '~/helpers/stream/Churn'
import { NodeList } from '~/helpers/stream/NodeList'

const dataRecord = {
  constants: {},
  mimir: {},
  churns: ingestChurns([])
}

const humD = require('humanize-duration')

const getNetworks = () => {
  const storedNet = JSON.parse(localStorage.getItem('networks'))

  if (!!storedNet?.version && storedNet.version === process.env.client)
    return storedNet

  return NETWORK_CONFIG.availableNetworks.reduce(
    (acc, networkName) => {
      acc[networkName] = new Network({
        name: networkName
      })
      return acc
    },
    { version: process.env.client }
  )
}

const fieldsToUpdate = [
  'balance_rune',
  'balance_asset',
  'pending_inbound_asset',
  'pending_inbound_rune',
  'pool_units',
  'LP_units',
  'synth_units',
  'synth_supply',
  'synth_supply_remaining',
  'savers_depth',
  'savers_units',
  'loan_collateral',
  'loan_cr',
  'derived_depth_bps'
]

function poolFluctuation(current, previous) {
  let className = ''
  const currentVal = parseInt(current, 10)
  const previousVal = parseInt(previous, 10)
  if (currentVal > previousVal) className = 'pup'
  if (currentVal < previousVal) className = 'pdown'
  return className
}

const deltaUpdateObject = (ctx, data, item) => {
  const staticObj = JSON.stringify(dataRecord[item])
  const contextObj = JSON.stringify(ctx[item])

  if (contextObj !== staticObj) ctx[item] = JSON.parse(staticObj)

  if (!data[item]) return

  Object.keys(data[item]).forEach((key) => {
    ctx[item][key] = data[item][key]
  })
}

export const state = () => ({
  network: NETWORK_CONFIG.defaultNetwork,
  networks: getNetworks(),
  filter: '',
  selectedNodes: JSON.parse(localStorage.getItem('selectedNodes')) || [],
  info: ''
})

export const getters = {
  netStream(state) {
    return state.networks[state.network]
  },
  network(state, getters) {
    return {
      stream: getters.netStream,
      current: getters.netStream
    }
  },
  effectiveSecurityBond(_, getters) {
    const nodes = getters.network.current.nodes.active
    return nodes
      .slice(Math.ceil(nodes.length / 3))
      .reduce((sum, item) => sum + Number(item.bond.raw), 0)
  }
}

export const actions = {
  saveState({ commit }, msg = null) {
    commit('saveState', msg)
  },
  updateFilter({ commit }, value) {
    commit('updateFilter', value)
  },
  deltaUpdate({ commit }, data) {
    commit('deltaUpdateConstants', data)
    commit('deltaUpdateMimir', data)
    commit('deltaUpdateChurns', data)
  },
  processPools({ commit }, data) {
    commit('writePools', data)
  },
  processNodes({ state, dispatch, commit }, data) {
    commit('writeNodes', data)
    if (state.stream.hook) dispatch('stream/hook', false)
  },
  nodeSelection({ commit }, node) {
    commit('nodeSelection', node)
  }
}

export const mutations = {
  saveState(state, msg = null) {
    localStorage.setItem('networks', JSON.stringify(state.networks))
    if (msg !== null) this._vm.$toast.success(msg, { timeout: 888 })
    cleanLocalStorage(['contexts', 'context', 'churnView', 'columns'])
  },
  updateFilter(state, value) {
    state.filter = value
  },
  deltaUpdateConstants(state, data) {
    deltaUpdateObject(state.networks[state.network], data, 'constants')
  },
  deltaUpdateMimir(state, data) {
    deltaUpdateObject(state.networks[state.network], data, 'mimir')
  },
  deltaUpdateChurns(state, data) {
    const ctx = state.networks[state.network]

    if (JSON.stringify(ctx.churn.list) !== JSON.stringify(dataRecord.churns))
      ctx.churn.list = dataRecord.churns

    if (!data.churns) return
    if (JSON.stringify(data.churns[0]) === JSON.stringify(ctx.churn.list[0]))
      return
    const uniqueSet = new Set(
      ingestChurns(data.churns, ctx.churn.list[0]).map(JSON.stringify)
    )
    ctx.churn.list.forEach((obj) => uniqueSet.add(JSON.stringify(obj)))
    ctx.churn.list = Array.from(uniqueSet).map(JSON.parse)
  },
  writePools(state, data) {
    if (!data.pools) return

    const prevPools = JSON.parse(
      JSON.stringify(state.networks[state.network].pools)
    )
    data.pools.forEach((pool) => {
      const [chain, symbol] = pool.asset.split('.')
      const [ticker, id] = symbol.split('-')
      pool.asset = {
        chain,
        ticker,
        id,
        raw: pool.asset,
        price: (pool.balance_rune * data.rune.priceUsd) / pool.balance_asset
      }

      const prevPool = prevPools.find((i) => i.asset.raw === pool.asset.raw)

      fieldsToUpdate.forEach((field) => {
        if (!prevPool) {
          pool[field] = { raw: pool[field], class: '' }
          return
        }
        pool[field] = {
          raw: pool[field],
          class: poolFluctuation(pool[field], prevPool[field].raw)
        }
      })

      if (!(prevPool && prevPool.asset)) {
        pool.asset.price = { raw: pool.asset.price, class: '' }
        return
      }
      pool.asset.price = {
        raw: pool.asset.price,
        class: poolFluctuation(pool.asset.price, prevPool.asset.price.raw)
      }
    })

    const ctx = state.networks[state.network]
    ctx.server = data.version
    ctx.price = data.rune.priceUsd
    ctx.tip = data.tip
    ctx.lastblock = data.lastblock
    ctx.chains = data.chains
    ctx.pools = data.pools
  },
  writeNodes(state, data) {
    const ctx = state.networks[state.network]
    ctx.server = data.version
    ctx.price = data.rune.priceUsd
    ctx.tip = data.tip
    ctx.lastblock = data.lastblock
    ctx.blocktime = data.blocktime
    ctx.age = humD(data.age * 1000, { round: false, largest: 2 })
    ctx.stats = data.stats
    ctx.network = data.network
    ctx.mnetwork = data.mnetwork
    ctx.chains = data.chains
    ctx.balances = data.balances
    ctx.balances.reserve = ctx.network.total_reserve
    ctx.bonds.min = ctx.mimir.MINIMUMBONDINRUNE
    ctx.churn.next = ctx.mnetwork.nextChurnHeight
    ctx.churn.elapsed = (Date.now() - ctx.churn.list[0].date) / 1000

    NodeList.setup(ctx, data.nodes)
    ctx.vaults = [...new Set(ctx.nodes.active.map((v) => v.vault))]
    Network.setVersion(ctx)
    Churn.setup(ctx, ctx.mimir.BADVALIDATORREDLINE)
    Churn.setClock(ctx)

    NodeList.updateNodes(ctx, state.selectedNodes)

    Churn.setMetrics(ctx)
    Protocol.setup(ctx)
  },
  nodeSelection(state, node) {
    node.vgtSelected
      ? (state.selectedNodes = state.selectedNodes.filter(
          (i) => i !== node.node_address
        ))
      : state.selectedNodes.push(node.node_address)
    this._vm.$set(node, 'vgtSelected', !node.vgtSelected)
    localStorage.setItem('selectedNodes', JSON.stringify(state.selectedNodes))
  }
}
