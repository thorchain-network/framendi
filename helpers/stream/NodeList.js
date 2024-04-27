import { Node } from '~/helpers/stream/Node'
const semver = require('semver')

const wlBase = [
  'age',
  'bad',
  'bond_providers',
  'bond',
  'churn',
  'combo',
  'exit',
  'health',
  'index',
  'ip_address',
  'ip_issue',
  'jail',
  'leave_height',
  'location',
  'node_address',
  'node_operator_address',
  'probes',
  'refer',
  'slash_points',
  'status',
  'version',
  'vgtSelected'
]

const wl = {
  standby: wlBase,
  active: [...wlBase, 'apy', 'chains', 'rewards', 'score', 'vault']
}

export class NodeList {
  constructor() {
    this.active = []
    this.oldestActive = []
    this.standby = []
    this.stready = []
    this.frontline = []
    this.rest = []
  }

  static setup(ctx, nodeData) {
    const nodes = nodeData.slice()
    ctx.nodes.active = this.activeNodes(nodes)
    ctx.nodes.oldestActive = oldestActiveNodes(ctx.nodes.active)
    ctx.nodes.standby = standbyNodes(nodes)
    ctx.nodes.ready = readyNodes(nodes)
    ctx.nodes.stready = streadyNodes(nodes, ctx)
    ctx.nodes.frontline = frontlineNodes(ctx.nodes.stready)
    ctx.nodes.rest = restNodes(nodes, ctx)
  }

  static updateNodes(ctx, selectedNodes) {
    this.allNodes(ctx).forEach((node) => Node.setup(ctx, selectedNodes, node))
    ctx.nodes.candidates = getCandidates(ctx.nodes.stready)
    tagWorstNode(ctx.nodes.active)
    postProcessing(ctx.nodes)
  }

  static allNodes = (ctx) => [
    ...ctx.nodes.active,
    ...ctx.nodes.frontline,
    ...ctx.nodes.rest
  ]

  static activeNodes = (nodes) =>
    nodes.slice().filter((node) => Node.isActive(node))
}

const oldestActiveNodes = (activeNodes) =>
  activeNodes
    .slice()
    .sort(
      (a, b) =>
        a.status_since - b.status_since ||
        a.node_address.localeCompare(b.node_address)
    )
    .map((node) => node.node_address)

const postProcessing = (nodes) => {
  nodes.active = nodes.active.map((n) => stripNodes(n, wl.active))
  nodes.standby = nodes.standby.map((n) => stripNodes(n, wl.standby))
  nodes.stready = nodes.stready.map((n) => stripNodes(n, wl.standby))
  nodes.frontline = nodes.frontline.map((n) => stripNodes(n, wl.standby))
  nodes.rest = nodes.rest.map((n) => stripNodes(n, wl.standby))
}

const standbyNodes = (nodes) =>
  nodes.slice().filter((node) => Node.isStandby(node))

const readyNodes = (nodes) => nodes.slice().filter((node) => Node.isReady(node))

const streadyNodes = (nodes, ctx) =>
  nodes
    .slice()
    .filter(
      (n) =>
        (n.status === 'Standby' || n.status === 'Ready') &&
        semver.gte(n.version, ctx.version) &&
        !n.requested_to_leave
    )

const getCandidates = (nodes) =>
  nodes
    .slice()
    .filter((n) => Node.isNotJailed(n))
    .map((n) => n.total_bond)
    .sort((a, b) => b - a)

const frontlineNodes = (nodes) =>
  nodes.slice().filter((node) => !node.forced_to_leave)

const restNodes = (nodes, ctx) =>
  nodes
    .slice()
    .filter((node) => !(Node.isActive(node) || Node.isFrontline(ctx, node)))

const stripNodes = (n, wl) => {
  const result = {}
  wl.forEach((key) => {
    if (key in n) result[key] = n[key]
  })
  return result
}

const tagWorstNode = (nodes) => {
  const node = nodes.reduce((highest, current) => {
    return highest.slash_points > current.slash_points ? highest : current
  }, nodes[0])

  if (!node || node.length < 1) return

  node.bad = true
  node.churn = node.churn === null ? 'SUB' : node.churn + 'SUB'
}
