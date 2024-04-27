<template lang="pug">
.tix.left.spacing
  a(
    v-tooltip="row.node_operator_address"
    @click="copyToClipboard('Operator address', row.node_operator_address)"
  ) {{ trunc(row.node_operator_address) }}
  a(
    v-tooltip="'Explore operator'"
    :href="explorerUrl(row.node_operator_address)"
    target="_blank"
    rel="noopener noreferrer"
  ): IconTerminal.sfs

  VMenu(
    v-if="nProviders > 1"
    theme="bond"
    :triggers="['click']"
    :autoHide="true"
  )
    img.twemoji-keycap(
      v-if="nProviders > 1 && nProviders < 10"
      :src="getKeypadEmoji()"
      :alt="uniToEmoji(keyPadString)"
    )
    img.twemoji-keycap(
      v-if="nProviders === 10"
      :src="getKeypadEmoji('1f51f')"
      :alt="uniToEmoji('1f51f')"
    )
    template(v-if="nProviders > 1" #popper)
      .title-intro
        h2.title-split
          .title {{ nProviders }} BOND PROVIDERS – {{ formatFee(row.bond_providers.node_operator_fee) }} FEE
          .title {{ formatDenom(row.bond) }}

      .provider-table
        .tr(v-for="(p, index) in row.bond_providers.providers")
          .wallet-tools
            a.normalize(
              v-tooltip="p.bond_address"
              @click="copyToClipboard('Provider address', p.bond_address)"
            ) {{ trunc(p.bond_address) }}
            a.normalize(
              v-tooltip="`Explore ${index === 0 ? 'operator' : 'provider'}`"
              :href="explorerUrl(p.bond_address)"
              target="_blank"
              rel="noopener noreferrer"
            )
              IconTerminal.sfs.sfs-fix(v-if="index === 0")
              IconWallet.sfs.sfs-fix(v-else)
          .align-right ({{ bondPercentage(p.bond) }})
          .align-right {{ denominate(p.bond) }}

      .graph-content
        v-chart.chart(
          :option="option"
          :theme="$colorMode.value"
          :autoresize="false"
        )

      .tnw-report
        a.normalize(
          v-tooltip="'Generate Report'"
          :href="tnwUrl(row.node_address)"
          target="_blank"
          rel="noopener noreferrer"
        ): IconReport

  .keep-this-here(v-else)
</template>

<script>
import { twemojiUrl, uniToEmoji } from '~/helpers/functions'

export default {
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      option: {
        textStyle: {
          fontFamily: this.$store.state.controls.font
        },
        series: [
          {
            name: 'Bond Shares',
            type: 'pie',
            radius: ['40%', '70%'],
            emphasis: {
              label: {
                fontWeight: 'bold'
              }
            },
            data: []
          }
        ]
      }
    }
  },
  computed: {
    nProviders() {
      return this.row.bond_providers?.providers?.length ?? 0
    },
    keyPadString() {
      return `3${this.nProviders}-20e3`
    }
  },
  updated() {
    this.resetChart()
    this.generateChart()
  },
  mounted() {
    this.generateChart()
  },
  methods: {
    trunc(address) {
      return this.$store.state.controls.raw ? address : address.substr(-4)
    },
    getKeypadEmoji(i = this.keyPadString) {
      return twemojiUrl(i)
    },
    uniToEmoji(unicode) {
      return uniToEmoji(unicode)
    },
    bondPercentage(p) {
      return this.nFmt(p / this.row.bond.raw, 2, 'standard', 'percent')
    },
    tnwUrl(addr) {
      return `https://thornode.network/report/${addr}`
    },
    resetChart() {
      this.option.series[0].data = []
    },
    generateChart() {
      const suppliers = this.row.bond_providers?.providers ?? false

      if (!suppliers) return

      const out = []

      suppliers.forEach((p) => {
        out.push({ name: p.bond_address.substr(-4), value: p.bond })
      })
      this.option.series[0].data = out
    }
  }
}
</script>

<style lang="scss" scoped>
.title-intro {
  margin-bottom: 26px;

  h2 {
    margin: 0;
    padding: 0;
  }

  .title-split {
    display: flex;
    justify-content: space-between;
    min-width: 300px;
  }
}

img.twemoji-keycap {
  vertical-align: middle;
  width: 1.4em;
}

.sfs-fix {
  vertical-align: -0.25em;
}

.provider-table {
  display: table;
  width: 100%;
  line-height: 2em;

  .tr {
    display: table-row;

    > div {
      display: table-cell;
    }
  }
}

.wallet-tools {
  a {
    &:first-child {
      padding-right: 3px;
    }
  }
}

.graph-content {
  width: 500px;
  height: 300px;
}
</style>
