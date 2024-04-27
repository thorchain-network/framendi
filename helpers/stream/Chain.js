import { Node } from '~/helpers/stream/Node'
import { defaultCell, nFmt } from '~/helpers/functions'

export class Chain {
  constructor(name, max = null) {
    this.name = name
    this.max = max
  }

  static list = ['BTC', 'ETH', 'LTC', 'BCH', 'DOGE', 'AVAX', 'GAIA', 'BSC']

  static setChains(node, ctx) {
    const attachToNode = createChainOutputContainer()

    if (Node.isActive(node) && node.observe_chains !== null) {
      node.observe_chains.forEach((observedChain) => {
        attachToNode[observedChain.chain] = {
          raw: observedChain.height,
          fmt: isBehind(observedChain, ctx.chains)
        }
      })
    }

    return attachToNode
  }
}

function createChainOutputContainer() {
  const container = {}
  Chain.list.forEach((chain) => (container[chain] = defaultCell))
  return container
}

function isBehind(observedChain, preparedChains) {
  const recordedTip = preparedChains.filter(
    (c) => c.name === observedChain.chain
  )[0].max

  const comparison = observedChain.height - recordedTip

  if (comparison === 0) return 'OK'
  return nFmt(comparison, 0, 'compact')
}
