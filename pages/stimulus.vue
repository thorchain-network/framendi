<template lang="pug">
.main
  Stream
  .header
    .topbar
      .menu-left
        MenuButtonNavigation
        MenuButtonContact
        MenuButtonTheme
        MenuButtonFormat
        MenuButtonUSD
        a#btn-documentation.buitoni(
          v-tooltip="'Documentation'"
          href="https://docs.thorchain.org/how-it-works/incentive-pendulum"
          target="_blank"
          rel="noopener noreferrer"
        ): IconCatalog
        button#btn-reset.buitoni(
          v-tooltip="'Reset to Network Values'"
          @click="reset"
        )
          IconReset
          GlobalEvents(v-if="keyboardControlsActive" @keyup.88="reset")
        MenuButtonPower(v-if="hook && !isProd")

      .middle

      .menu-right
        MenuGroupAlert
        MenuGroupInfo
        MenuGroupChurn
        MenuGroupBond
        MenuGroupPrice

  .page.normflex
    .legend
      h2 METRICS
      .row
        .cell Remaining Rune Supply
        .cell {{ denominate(remainingSupply) }}
      .row
        .cell Total Bond
        .cell {{ denominate(bonded) }}
      .row
        .cell Effective Security Bond
        .cell {{ denominate(security) }}
      .row
        .cell Security Surplus Bond
        .cell {{ denominate(surplus) }}

    .pendulum
      .meter
        v-chart.chart(
          :option="getChartOptions(shareFactor)"
          :theme="$colorMode.value"
          :autoresize="true"
        )

      .normflex.sliders
        .sld-element
          .info
            .title Bond
            .value {{ denominate(bonded) }}
          .scale: input(
            type="range"
            :min="pooled + surplus"
            :max="maxBonded"
            v-model.number="bonded"
          )
          .info.subtle
            .title Remaining
            .value {{ denominate(maxBonded - bonded) }}

        .sld-element
          .info
            .title Pool
            .value {{ denominate(pooled) }}
          .scale: input(
            type="range"
            min="1"
            :max="maxPooled"
            v-model.number="pooled"
          )
          .info.subtle
            .title Remaining
            .value {{ denominate(remainingPool) }}

        .sld-element
          .info
            .title Curve
            .value {{ ic }}
          .scale: input(type="range" min="1" max="100" v-model.number="ic")
</template>

<script>
const gaugeColors = {
  green: { dark: '#91ca8c', sepia: '#919e8b', light: '#9FE6B8' },
  yellow: { dark: '#eedd78', sepia: '#d7ab82', light: '#FFDB5C' },
  orange: { dark: '#f49f42', sepia: '#cc7e63', light: '#ff9f7f' },
  red: { dark: '#dd6b66', sepia: '#d87c7c', light: '#fb7293' }
}

export default {
  data() {
    return {
      bonded: 0,
      ratio: 0.66,
      pooled: 0,
      ic: 0
    }
  },
  computed: {
    systemState() {
      const sf = this.shareFactor
      if (sf >= 0.9) return 'Inefficient'
      if (sf >= 0.75) return 'Over-Bonded'
      if (sf >= 0.65) return 'Suboptimal'
      if (sf <= 0.1) return 'Unsafe'
      if (sf <= 0.25) return 'Under-Bonded'
      if (sf <= 0.35) return 'Suboptimal'
      return 'Optimal'
    },
    shareFactor() {
      return (
        (this.security - this.pooled) / (this.security + this.pooled / this.ic)
      )
    },
    remainingSupply() {
      const result = this.circulatingSupply - this.bonded - this.pooled
      return result <= 0 ? 0 : result
    },
    security() {
      return this.bonded * this.ratio
    },
    surplus() {
      return this.bonded * (1 - this.ratio)
    },
    maxBonded() {
      return this.circulatingSupply - this.pooled
    },
    maxPooled() {
      return Math.min(this.circulatingSupply - this.bonded, this.security)
    },
    remainingPool() {
      const result = this.maxPooled - this.pooled
      return result >= 0 ? result : 0
    },
    hook() {
      return this.$store.state.stream.hook
    }
  },
  watch: {
    hook() {
      this.reset()
      this.stopStream()
      this.$store.dispatch('saveState')
    }
  },
  beforeCreate() {
    this.$store.dispatch('stream/hook', true)
    this.$store.dispatch('stream/setChannel', 'nodes')
  },
  created() {
    if (this.net.nodes.active.length > 0) this.reset()
  },
  destroyed() {
    this.$store.dispatch('stream/hook', false)
  },
  methods: {
    reset() {
      this.bonded = parseInt(this.net?.bonds?.total?.raw) ?? 0
      this.pooled = parseInt(this.net.balances.pooled_rune) ?? 0
      this.ic = 100
      this.ratio = this.$store.getters.effectiveSecurityBond / this.bonded
    },
    getFontColor() {
      return getComputedStyle(document.body).getPropertyValue('--font-color')
    },
    getChartOptions(shareFactor) {
      const colorMode = this.$colorMode.value
      const axisLines = [
        [0.1, gaugeColors.red[colorMode]],
        [0.25, gaugeColors.orange[colorMode]],
        [0.35, gaugeColors.yellow[colorMode]],
        [0.65, gaugeColors.green[colorMode]],
        [0.75, gaugeColors.yellow[colorMode]],
        [0.9, gaugeColors.orange[colorMode]],
        [1, gaugeColors.red[colorMode]]
      ]

      return {
        tooltip: {
          formatter: '{a} <br/>{b} : {c}'
        },
        textStyle: {
          fontFamily: this.$store.state.controls.font
        },
        series: [
          {
            name: 'Stimulus',
            type: 'gauge',
            radius: '90%',
            min: 0.0,
            max: 1.0,
            splitNumber: 10,
            splitLine: {
              lineStyle: {
                width: 3,
                cap: 'round',
                color: this.getFontColor()
              }
            },
            itemStyle: {
              color: this.getFontColor()
            },
            axisLabel: {
              color: this.getFontColor()
            },
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                width: 9,
                color: axisLines
              }
            },
            pointer: {
              width: 2,
              icon: 'roundRect',
              length: '109%',
              itemStyle: {
                color: this.getFontColor(),
                borderWidth: 0,
                opacity: 0.66
              }
            },
            title: {
              color: this.getFontColor()
            },
            detail: {
              fontWeight: 'normal',
              formatter: (value) => value.toFixed(2),
              color: this.getFontColor()
            },
            data: [
              {
                value: shareFactor,
                name: this.systemState
              }
            ]
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  height: 85vh;
  position: relative;
}

.pendulum {
  padding: 0;
  line-height: 2;

  @media (max-width: 1300px) {
    margin-top: 500px;
  }
}

.legend {
  position: absolute;
  left: 0;
  top: 39px;
  z-index: 999;
  display: table;
  line-height: 1.8;

  .row {
    display: table-row;

    .cell:nth-child(2) {
      padding-left: 26px;
      text-align: right;
      min-width: 14em;
    }
  }

  .cell {
    display: table-cell;
  }
}

.meter {
  height: 55vh;
}

.sliders {
  flex-wrap: wrap;
  align-items: flex-start;

  .sld-element {
    padding: 26px;

    .info {
      display: flex;
      justify-content: space-between;
    }

    .scale {
      input {
        width: 233px;
      }
    }
  }
}

.subtle {
  color: var(--font-color-subtle) !important;
}
</style>
