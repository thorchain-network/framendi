import { Chain } from '~/helpers/stream/Chain'
import {
  formatNumber,
  getFlagEmoji,
  explorerUrl,
  nFmt,
  formatRune,
  twemojiUrl
} from '~/helpers/functions'

const humD = require('humanize-duration')
const semver = require('semver')
const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })

const addresses = {}

const ipaddr = require('ipaddr.js')

const isps = [
  'ALJEEL',
  'AMAZON',
  'ATT',
  'AUSSIE BROADBAND',
  'AVANTI',
  'COGENT',
  'COMCAST',
  'DATACAMP',
  'DIGITALOCEAN',
  'GOOGLE',
  'GOOGLEWIFI',
  'HETZNER',
  'HOSTINGER',
  'LEASEWEB',
  'MICROSOFT',
  'OVH',
  'SOLLUTIUM',
  'STARLINK',
  'TWC',
  'VULTR',
  'ZENLAYER'
]

function formatAge(ctx, val) {
  const age = ctx.lastblock - val
  return {
    raw: val,
    fmt: nFmt((age * ctx.blocktime + ctx.churn.elapsed) / 86400, 2)
  }
}

export class Node {
  static statuses = ['Active', 'Ready', 'Standby', 'Whitelisted', 'Disabled']

  static setup(ctx, selectedNodes, node) {
    flagIpIssues(node)
    node.short = node.node_address.substr(-4)
    node.combo = { raw: node.node_address, fmt: node.short }
    node.age = formatAge(ctx, node.status_since)
    node.bond = formatRune(ctx.price, node.total_bond)
    node.rewards = formatRune(ctx.price, node.current_award, 2)
    node.vgtSelected = selectedNodes.includes(node.node_address)
    node.location = setLocation(node)
    node.exit = setExit(node)
    node.jail = setJail(node, ctx)
    node.vault = setVault(node, ctx)
    node.score = setScore(node, ctx)
    node.apy = setApy(node, ctx)
    node.churn = setChurn(node, ctx)
    node.chains = Chain.setChains(node, ctx)
    node.bad = setGoners(node, ctx)
    node.probes = setProbes(node.probes)
    node.index = setIndex(node, ctx)
    node.refer = {
      api: `${process.env.networks[ctx.name].nodeApi}/${node.node_address}`,
      explorer: explorerUrl(node.node_address, ctx.name)
    }
  }

  static isActive = (node) => node.status.toLowerCase() === 'active'

  static isReady = (node) => node.status.toLowerCase() === 'ready'

  static isStandby = (node) => node.status.toLowerCase() === 'standby'

  static isWhitelisted = (node) => node.status.toLowerCase() === 'whitelisted'

  static isDisabled = (node) => node.status.toLowerCase() === 'disabled'

  static isStready = (node) => this.isStandby(node) || this.isReady(node)

  static isNotJailed = (node) => node.jail.reason === '-'

  static bondQualifies = (node, ctx) => node.total_bond >= ctx.bonds.min

  static versionQualifies = (node, ctx) => semver.gte(node.version, ctx.version)

  static hasIP = (node) => node.ip_address !== ''

  static hasLowScore = (node, ctx) => node.score.raw <= ctx.churn.threshold

  static isOldest = (node, ctx) => ctx.churn.oldest_active === node.node_address

  static hasLowestBond = (node, ctx) =>
    ctx.bonds.active.slice(-1).includes(node.total_bond)

  static isMarkedForChurnOut = (node) => node.leave_height > 0

  static isFrontline = (ctx, node) =>
    (this.isStandby(node) || this.isReady(node)) &&
    this.versionQualifies(node, ctx) &&
    !node.requested_to_leave &&
    !node.forced_to_leave
}

function setLocation(node) {
  if (!addresses?.[node.ip_address]?.cc && !node.geoip)
    return { isp: '', place: null }
  const loc = node.geoip ? node.geoip : addresses[node.ip_address]
  const emoji = 'cc' in loc ? getFlagEmoji(loc.cc) : null
  const unicode = formatUnicode(emoji)
  return {
    ispIcon: isps.includes(loc.isp)
      ? `IconIsp${loc.isp.replace(/\s/g, '')}`
      : 'IconIspGeneric',
    isp: loc.isp,
    place: !loc.city ? loc.cc : `${loc.cc} ${loc.city}`,
    country: regionNames.of(loc.cc),
    city: loc.city,
    emoji,
    unicode,
    twemoji: twemojiUrl(unicode)
  }
}

const flagIpIssues = (node) => {
  const setIssue = (type, info, extraClass = '') => {
    node.ip_issue = {
      type,
      info,
      tooltip: `${node.ip_address ? `${node.ip_address} - ` : ''}${info}`,
      class: `down ${extraClass}`.trim()
    }
  }

  if (!node.ip_address)
    return setIssue('NIP', 'No Address', 'forbidden-pointer')
  if (!ipaddr.isValid(node.ip_address))
    return setIssue('CRR', 'Corrupt Address')
  if (ipaddr.parse(node.ip_address).range() === 'private')
    setIssue('PRV', 'Private Range')
}

const formatUnicode = (emoji) =>
  !emoji
    ? null
    : `${emoji.codePointAt(0).toString(16)}-${emoji
        .codePointAt(2)
        .toString(16)}`

function setExit(node) {
  if (node.requested_to_leave) return 1
  if (node.forced_to_leave) return 2
  return '-'
}

function setJail(node, ctx) {
  if (!node.jail) return { reason: '-' }

  const blocks = node.jail.release_height - ctx.lastblock
  const jailTime = blocks * ctx.blocktime * 1000

  const duration = humD(jailTime, {
    round: true,
    largest: 1
  })

  const stamp = new Intl.DateTimeFormat('en-US', {
    timeStyle: 'short'
  }).format(Date.now() + jailTime)

  const block = `${nFmt(blocks)} ${blocks >= 1 ? 'blocks' : 'block'} (${nFmt(
    node.jail.release_height
  )})`

  const time = `${duration} (${stamp})`

  const reason = node.jail.reason

  const getIcon = (reason) => {
    if (reason.includes('vote keygen')) return 'KeygenVote'
    if (reason.includes('perform keygen')) return 'KeygenProcess'
    if (reason.includes('perform keysign')) return 'Keysign'
    if (reason.includes('yggdrasil transaction')) return 'TX'
    return 'Help'
  }

  const icon = getIcon(reason)

  return { reason, block, time, icon }
}

function setVault(node, ctx) {
  if (!node.vault) return
  const colors = ['red', 'green', 'blue', 'yellow', 'orange', 'purple']
  const colorizeVault = (vault) => {
    if (!ctx.vaults) return
    return colors[ctx.vaults.findIndex((e) => e === vault)]
  }
  return {
    raw: node.vault,
    fmt: node.vault.substr(-4),
    color: colorizeVault(node.vault)
  }
}

function setScore(node, ctx) {
  if (!Node.isActive(node)) return
  if (ctx.churn.passed_blocks === 0) return formatNumber(Infinity)
  const v = ctx.churn.passed_blocks / node.slash_points
  const f = v < 100 ? 2 : 0
  return formatNumber(v, f)
}

const setGoners = (node, ctx) => {
  if (!Node.isActive(node)) return
  return Node.hasLowScore(node, ctx) || ['OLD', 'LOW'].includes(node.churn)
}

function setApy(node, ctx) {
  if (!Node.isActive(node)) return null
  const yearInSeconds = 31536000
  return formatNumber(
    Math.pow(
      (Number(node.total_bond) + Number(node.current_award)) / node.total_bond,
      yearInSeconds / ctx.churn.elapsed
    ) - 1,
    2,
    'standard',
    'percent'
  )
}

function setChurn(node, ctx) {
  const churnOutMarkers = (node, ctx) => {
    let output = node.bad ? 'SUB' : ''
    if (Node.isOldest(node, ctx)) output = 'OLD'
    if (Node.hasLowestBond(node, ctx)) output += 'LOW'
    if (Node.isMarkedForChurnOut(node)) output += 'OUT'
    return output === '' ? null : output
  }
  const qualifiesForChurnIn = (node, ctx) => {
    if (!ctx.nodes.candidates) return false
    if (ctx.churn.ready && !Node.isReady(node)) return false
    const isAmongstHighestQualifyingBonders = ctx.nodes.candidates
      .slice(0, ctx.churn.out_amount + ctx.churn.in_amount)
      .includes(node.total_bond)
    return (
      Node.isStready(node) &&
      Node.isNotJailed(node) &&
      Node.bondQualifies(node, ctx) &&
      Node.versionQualifies(node, ctx) &&
      Node.hasIP(node) &&
      isAmongstHighestQualifyingBonders
    )
  }

  if (ctx.bonds.active === undefined) return
  if (Node.isActive(node)) return churnOutMarkers(node, ctx)
  if (qualifiesForChurnIn(node, ctx)) return 'IN'
  return null
}

function setProbes(probes) {
  probes = probes ?? {}

  return Chain.list.reduce((acc, chain) => {
    acc[chain] =
      chain in probes
        ? {
            raw: probes[chain],
            fmt: probes[chain] === 0 ? 'OK' : nFmt(probes[chain], 0, 'compact')
          }
        : { raw: -Number.MAX_VALUE, fmt: '-' }
    return acc
  }, {})
}

const setIndex = (node) =>
  [indexBondProviders(node), node.vault?.raw, node.jail?.reason]
    .flat()
    .join(' ')

function indexBondProviders(node) {
  const elem = node.bond_providers?.providers
  return elem
    ? elem.slice(1).flatMap((val) => [val.bond_address, val.bond])
    : null
}
