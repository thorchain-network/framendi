import {
  formatRune,
  nFmt,
  floor10,
  median,
  humanizeDuration
} from '~/helpers/functions'

export class Churn {
  constructor(name) {
    this.list = []
    this.clock = {}
    this.progress = {}
    this.last = null
    this.next = null
    this.out_amount = 0
    this.in_amount = 2
    this.oldest_active = ''
    this.ready = false
    this.score = { avg: null, med: null }
    this.slash = { avg: null, med: null }
    this.interval = 43200
    this.passed_blocks = 0
    this.remaining_blocks = 0
    this.apy = { avg: null, med: null }
    this.badvalidatorredline = null
    this.threshold = null
    this.finalized = false
  }

  static setup(ctx, threshold = 3) {
    ctx.churn.finalized = isFinalized(ctx)
    if (ctx.nodes.oldestActive.length === 0) return
    ctx.churn.oldest_active = ctx.nodes.oldestActive[0]
    ctx.churn.last = ctx.churn.list[0].height
    ctx.in_amount = ctx.mimir?.NUMBEROFNEWNODESPERCHURN ?? ctx.in_amount
    ctx.churn.interval = ctx.mimir?.CHURNINTERVAL ?? ctx.churn.interval
    ctx.churn.passed_blocks = ctx.lastblock - ctx.churn.last
    ctx.churn.remaining_blocks = ctx.churn.next - ctx.lastblock
    setReady(ctx)
    setThreshold(ctx, threshold)
    setChurnOut(ctx)
    setBonds(ctx)
    indexChurns(ctx.churn.list)
  }

  static setClock(ctx) {
    const bare =
      (ctx.churn.interval - ctx.churn.remaining_blocks) / ctx.churn.interval

    ctx.churn.progress = {
      raw: `${nFmt(ctx.churn.passed_blocks)}/${nFmt(ctx.churn.interval)}`,
      fmt: nFmt(floor10(bare, -2), 0, 'standard', 'percent'),
      bare
    }

    ctx.churn.clock = {
      raw: nFmt(ctx.churn.remaining_blocks),
      fmt: humanizeDuration(ctx.churn.remaining_blocks * ctx.blocktime * 1000, {
        round: true,
        spacer: '',
        delimiter: ' ',
        largest: 2
      })
    }
  }

  static setMetrics(ctx) {
    const activeNodes = ctx.nodes.active
    ctx.churn.score.avg = setAverage(activeNodes, 'score')
    ctx.churn.slash.avg =
      activeNodes.reduce((prev, cur) => prev + cur.slash_points, 0) /
      activeNodes.length
    ctx.churn.apy.avg = setAverage(activeNodes, 'apy')
    ctx.churn.score.med = median(activeNodes.map((v) => v.score.raw))
    ctx.churn.slash.med = median(activeNodes.map((v) => v.slash_points))
    ctx.churn.apy.med = median(activeNodes.map((v) => v.apy.raw))
  }
}

const isFinalized = (ctx) =>
  ctx.nodes.active.slice().sort((a, b) => b.leave_height - a.leave_height)[0]
    .leave_height > 0

function setReady(ctx) {
  ctx.churn.ready = ctx.nodes.ready.length > 0
}

function setThreshold(ctx, threshold) {
  if (threshold === 0) threshold = 3
  const behaviorNodes = ctx.nodes.active.filter((n) => n.slash_points !== 0)
  ctx.churn.threshold =
    behaviorNodes.reduce(
      (a, b) => +a + +(ctx.churn.passed_blocks / b.slash_points),
      0
    ) /
    behaviorNodes.length /
    threshold
}

function setChurnOut(ctx) {
  ctx.churn.out_amount = ctx.nodes.active.filter(
    (n) => n.leave_height > 0
  ).length
  if (ctx.churn.out_amount < 3) ctx.churn.out_amount = 3
}

function setBonds(ctx) {
  ctx.bonds.active = ctx.nodes.active
    .map((n) => n.total_bond)
    .sort((a, b) => b - a)

  ctx.bonds.total = formatRune(
    ctx.price,
    ctx.mnetwork.activeBondsSum,
    1,
    'compact'
  )
  ctx.bonds.standby = formatRune(
    ctx.price,
    ctx.mnetwork.standbyBondsSum,
    1,
    'compact'
  )

  ctx.bonds.optimal = formatRune(
    ctx.price,
    ctx.bonds.active[Math.floor(ctx.bonds.active.length / 3)]
  )
}

const setAverage = (list, item) =>
  list.reduce((prev, cur) => prev + cur[item].raw, 0) / list.length

function indexChurns(list) {
  list.forEach((item, index) => {
    item.index = list.length - index
  })
}
