import { Protocol } from '~/helpers/common/Protocol'
import { Churn } from '~/helpers/stream/Churn'
import { NodeList } from '~/helpers/stream/NodeList'
const semver = require('semver')

export class Network {
  constructor({ name } = {}) {
    this.name = name
    this.age = ''
    this.version = '0.0.0'
    this.server = '0.0.0'
    this.price = 0
    this.protocol = new Protocol()
    this.tip = null
    this.lastblock = null
    this.blocktime = null
    this.stats = {}
    this.mimir = {}
    this.constants = {}
    this.churn = new Churn(this.name)
    this.nodes = new NodeList()
    this.set = {
      active: [],
      frontline: [],
      rest: []
    }
    this.chains = {}
    this.pools = []
    this.balances = {}
    this.bonds = {
      total: 0,
      standby: 0,
      optimal: { fmt: 0, raw: 0, usd: 0 }
    }
  }

  static setVersion(ctx) {
    ctx.version =
      ctx.nodes.active.map((n) => n.version).sort(semver.compare)[0] ??
      NodeList.allNodes.map((n) => n.version).sort(semver.compare)[0]
  }

  static list(networks) {
    const list = []
    for (const value of Object.values(networks)) {
      if (value?.name) list.push(value?.name)
    }
    return list
  }
}
