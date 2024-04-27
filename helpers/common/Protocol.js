export class Protocol {
  constructor(version) {
    this.totalNodes = 0
    this.list = []
    this.hasMultipleVersions = false
    this.updateProgress = 0
    this.distribution = {}
  }

  static setup(ctx) {
    ctx.protocol.totalNodes = ctx.nodes.active.length
    ctx.protocol.distribution = distribution(ctx)
    ctx.protocol.list = Object.keys(ctx.protocol.distribution)
    ctx.protocol.hasMultipleVersions = ctx.protocol.list.length > 1
    if (ctx.protocol.hasMultipleVersions) {
      const versions = Object.values(ctx.protocol.distribution)
      ctx.protocol.updateProgress =
        versions[0] / versions.reduce((acc, val) => acc + val, 0)
    }
  }
}

const distribution = (ctx) =>
  ctx.nodes.active.reduce(
    (acc, node) => ({ ...acc, [node.version]: (acc[node.version] || 0) + 1 }),
    {}
  )
