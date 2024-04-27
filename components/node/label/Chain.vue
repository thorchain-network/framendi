<template lang="pug">
.tix.coin(v-if="!hasIssue")
  template(v-if="upcomingMaintenance")
    VTooltip.coin-wrapped(theme="coinlabel")
      .maintenance
        IconAlert.spw
        .info M

      template(#popper)
        .frame
          .column
            h2 UPCOMING MAINTENANCE ON {{ chain }}
            .content
              .row
                .cell Height
                .cell {{ nFmt(maintenanceObj.height) }}
              .row
                .cell Pending Blocks
                .cell {{ maintenanceObj.pending }}
              .row
                .cell Countdown
                .cell {{ maintenanceObj.duration }}

      .coin-icon
        component.sfg(
          :is="`IconCoin${chain}`"
          v-if="chainList.includes(chain)"
        )
  template(v-else)
    component.sfg(:is="`IconCoin${chain}`" v-if="chainList.includes(chain)")

.coin-wrapped(v-else)
  .issue(v-tooltip="tooltip")
    IconAlert.spw
    .info {{ displayIssues() }}
  .coin-icon
    component.sfg(:is="`IconCoin${chain}`" v-if="chainList.includes(chain)")
</template>

<script>
const humD = require('humanize-duration')
const durationFormat = { round: true, largest: 2 }

export default {
  props: {
    column: {
      type: Object,
      required: true
    }
  },
  computed: {
    chain() {
      return this.column.label
    },
    halt() {
      const {
        HALTCHAINGLOBAL,
        NODEPAUSECHAINGLOBAL,
        HALTTRADING,
        HALTSIGNING,
        [`SOLVENCYHALT${this.chain}CHAIN`]: solvency,
        [`HALT${this.chain}CHAIN`]: chain,
        [`HALT${this.chain}TRADING`]: trading,
        [`HALTSIGNING${this.chain}`]: signing
      } = this.net.mimir
      const { lastblock } = this.net

      return {
        globalChain: HALTCHAINGLOBAL !== 0,
        nodePauseChain: NODEPAUSECHAINGLOBAL > lastblock,
        globalTrading: HALTTRADING !== 0,
        globalSigning: HALTSIGNING !== 0,
        solvency: solvency !== 0 && solvency < lastblock,
        chain: chain !== 0 && chain < lastblock,
        trading: trading !== 0 && trading < lastblock,
        signing: signing !== 0 && signing < lastblock
      }
    },
    hasIssue() {
      return Object.values(this.halt).some((condition) => condition)
    },
    maintenance() {
      const { [`HALT${this.chain}CHAIN`]: chain } = this.net.mimir
      const { lastblock } = this.net

      return {
        chain: chain !== 0 && chain >= lastblock
      }
    },
    upcomingMaintenance() {
      return Object.values(this.maintenance).some((condition) => condition)
    },
    maintenanceObj() {
      const height = this.net.mimir[`HALT${this.chain}CHAIN`]
      const pending = height - this.net.lastblock
      const duration = humD(pending * this.net.blocktime * 1000, durationFormat)
      return {
        duration,
        height,
        pending
      }
    },
    tooltip() {
      const result = []
      if (this.halt.globalChain || this.halt.nodePauseChain)
        result.push('Chains Globally Paused')
      if (this.halt.globalTrading) result.push('Trading Globally Paused')
      if (this.halt.globalSigning) result.push('Signing Globally Paused')

      const chainIssues = ['solvency', 'chain', 'trading', 'signing']
        .filter((issue) => this.halt[issue])
        .map(
          (issue) => `${this.chain} ${issue.charAt(0) + issue.slice(1)} Paused`
        )

      return [...result, ...chainIssues].join(' & ')
    }
  },
  methods: {
    displayIssues() {
      const issues = [
        {
          condition: this.halt.globalChain || this.halt.nodePauseChain,
          label: 'G'
        },
        { condition: this.halt.globalTrading, label: 'T' },
        { condition: this.halt.globalSigning, label: 'S' },
        { condition: this.halt.solvency, label: 'C' },
        { condition: this.halt.chain, label: 'C' },
        { condition: this.halt.trading, label: 'T' },
        { condition: this.halt.signing, label: 'S' }
      ]

      return [
        ...new Set(
          issues.filter((issue) => issue.condition).map((issue) => issue.label)
        )
      ].join('')
    }
  }
}
</script>

<style lang="scss" scoped>
.coin {
  height: 100%;
}

.coin-wrapped {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
  width: 100%;
}

.issue,
.maintenance {
  color: var(--error-color-darker);
  width: 100%;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 0;

  .info {
    font-size: 0.72em;
  }

  svg {
    width: 0.7em;
    height: 0.7em;
  }
}

#popper {
  z-index: 101;
}

.maintenance {
  color: var(--success-color-darker);
}

.coin-icon {
  line-height: 0;

  svg {
    width: 1.2em !important;
    height: 1.2em !important;
  }
}

.frame {
  border: 0;
  width: 100% !important;
}
</style>
