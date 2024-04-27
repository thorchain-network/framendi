<template lang="pug">
.nodes
  TableFilter
  .sets(v-if="nodesPresent.all")
    .set(v-if="nodesPresent.active")
      NodeTable(
        key="NodeTableActive"
        :tableName="'active'"
        :rows="net.nodes.active"
        :search-options="searchOptions"
        :columns="activeColumns"
      )

    .set(v-if="nodesPresent.frontline")
      NodeTable(
        key="NodeTableFrontline"
        :tableName="'frontline'"
        :rows="net.nodes.frontline"
        :search-options="searchOptions"
        :columns="frontlineColumns"
      )

    .set(v-if="nodesPresent.rest")
      NodeTable(
        key="NodeTableRest"
        :tableName="'rest'"
        :rows="net.nodes.rest"
        :search-options="searchOptions"
        :columns="restColumns"
      )

  WidgetSpinnerStream(v-else)

  GlobalEvents(
    v-if="keyboardControlsActive"
    @keyup.88="$store.dispatch('controls/setSort')"
  )
</template>

<script>
const semver = require('semver')

export default {
  data() {
    return {
      colBase: [
        {
          label: 'NODE',
          field: 'node_address',
          tooltip: 'Node address',
          tdClass: 'nopad',
          width: '49px'
        },
        {
          label: '⚡️',
          field: 'vgtSelected',
          tooltip: 'Selection',
          thClass: 'zeropad',
          tdClass: 'zeropad',
          width: '24px',
          firstSortType: 'desc'
        },
        { label: 'INDEX', field: 'index', hidden: true },
        { label: 'CHURNOUT', field: 'leave_height', hidden: true },
        { label: 'BAD', field: 'bad', hidden: true },
        { label: 'STATUS', field: 'status', hidden: true },
        {
          label: 'AGE',
          field: 'age',
          tooltip: 'Age in days',
          type: 'number',
          formatFn: this.formatDenom,
          sortFn: this.sortRaw
        },
        {
          label: 'CHURN',
          field: 'churn',
          tooltip: 'Churn',
          globalSearchDisabled: true,
          tdClass: 'nopad',
          firstSortType: 'desc'
        }
      ],
      colSlashes: [
        {
          label: 'SLASHES',
          field: 'slash_points',
          type: 'number',
          formatFn: (val) => this.formatNumber(val)[this.formraw],
          firstSortType: 'asc'
        }
      ],
      colStatus: [
        {
          label: 'STS',
          field: 'status',
          tooltip: 'Status',
          tdClass: 'center upcase',
          thClass: 'center',
          formatFn: this.formatStatus,
          sortFn: this.sortStatus
        }
      ],
      colBond: [
        {
          label: 'OPERATOR',
          field: 'node_operator_address',
          width: '80px',
          tdClass: 'nopad'
        },
        {
          label: 'BOND',
          field: 'bond',
          type: 'number',
          formatFn: this.formatDenom,
          sortFn: this.sortRaw,
          firstSortType: 'desc'
        }
      ],
      colRewards: [
        {
          label: 'REWARDS',
          field: 'rewards',
          type: 'number',
          globalSearchDisabled: true,
          formatFn: this.formatDenom,
          sortFn: this.sortRaw,
          firstSortType: 'desc'
        },
        {
          label: 'APY',
          field: 'apy',
          type: 'number',
          globalSearchDisabled: true,
          formatFn: (val) => val.fmt,
          sortFn: this.sortRaw,
          firstSortType: 'desc'
        }
      ],
      colJail: [
        {
          label: 'JAIL',
          field: 'jail',
          tooltip: 'Jail',
          globalSearchDisabled: true,
          tdClass: 'nopad',
          sortFn: (x, y) => y.reason.localeCompare(x.reason)
        }
      ],
      colVault: [
        {
          label: 'VAULT',
          field: 'vault',
          tooltip: 'Vault',
          tdClass: 'zeropad',
          sortFn: (x, y) => y.raw.localeCompare(x.raw)
        }
      ],
      colExit: [
        {
          label: 'Exit',
          field: 'exit',
          tooltip: 'Exit',
          globalSearchDisabled: true,
          tdClass: 'nopad',
          firstSortType: 'desc'
        }
      ],
      colVersion: [
        {
          label: 'VERSION',
          field: 'version',
          tdClass: this.versionClass,
          thClass: 'center',
          firstSortType: 'desc'
        }
      ]
    }
  },
  computed: {
    nodesPresent() {
      const isActive = this.net.nodes.active.length > 0
      const isFrontline = this.net.nodes.frontline.length > 0
      const isRest = this.net.nodes.rest.length > 0

      return {
        all: isActive && isFrontline && isRest,
        active: isActive,
        frontline: isFrontline,
        rest: isRest
      }
    },
    searchOptions() {
      return { enabled: true, externalQuery: this.$store.state.filter }
    },
    activeColumns() {
      return this.createColumns(true, true, false, true, [
        this.colChainProbes,
        this.colChainObservations
      ])
    },
    frontlineColumns() {
      const modifiedProbes = this.colChainProbes.map((probe) => ({
        ...probe,
        hidden: !this.$store.state.controls.columns.chains
      }))

      return this.createColumns(false, false, true, false, [modifiedProbes])
    },
    restColumns() {
      return this.createColumns(false, false, true, false)
    },
    colLocation() {
      return [
        {
          label: 'ADDRESS',
          field: 'ip_address',
          hidden: true
        },
        {
          label: 'ISP',
          field: 'location.isp',
          thClass: 'center',
          tdClass: 'nopad',
          hidden: !this.$store.state.controls.columns.geo
        },
        {
          label: 'LOCATION',
          field: 'location.place',
          tdClass: 'nopad',
          hidden: !this.$store.state.controls.columns.geo
        },
        {
          label: 'COUNTRY',
          field: 'location.country',
          hidden: true
        }
      ]
    },
    colProvider() {
      return [
        {
          label: 'PROVIDER',
          field: 'bond_providers.providers.length',
          type: 'number',
          firstSortType: 'desc',
          hidden: !this.$store.state.controls.columns.provider
        }
      ]
    },
    colFee() {
      return [
        {
          label: 'FEE',
          field: 'bond_providers.node_operator_fee',
          type: 'number',
          globalSearchDisabled: true,
          width: '36px',
          formatFn: this.formatFee,
          hidden: !this.$store.state.controls.columns.fee
        }
      ]
    },
    colScore() {
      return [
        {
          label: 'SCORE',
          field: 'score',
          type: 'number',
          globalSearchDisabled: true,
          tdClass: (row) =>
            row.score.raw && row.score.raw < this.net.churn.threshold
              ? 'low-score'
              : '',
          formatFn: (val) => val.fmt,
          sortFn: this.sortRaw,
          firstSortType: 'desc',
          hidden: !this.$store.state.controls.columns.score
        }
      ]
    },
    colChainObservations() {
      return this.chainList.map((chain) => ({
        label: chain,
        field: `chains.${chain}`,
        tooltip: `${chain} ${this.nFmt(this.chainTips[chain])}`,
        globalSearchDisabled: true,
        thClass: 'zeropad center',
        tdClass: (row) => this.chainComparison(row, chain),
        formatFn: this.formatDenom,
        sortFn: this.sortRaw,
        firstSortType: 'desc',
        hidden:
          !this.$store.state.controls.columns.chains ||
          this.$store.state.controls.probesActive
      }))
    },
    colChainProbes() {
      return this.chainList.map((chain) => ({
        label: chain,
        field: `probes.${chain}`,
        tooltip: `${chain} ${this.nFmt(this.chainTips[chain])}`,
        globalSearchDisabled: true,
        thClass: 'zeropad center',
        tdClass: (row) => this.probeComparison(row, chain),
        formatFn: (val) => val.fmt,
        sortFn: this.sortRaw,
        firstSortType: 'desc',
        hidden:
          !this.$store.state.controls.columns.chains ||
          !this.$store.state.controls.probesActive
      }))
    },
    colHealth() {
      if (!this.$store.state.controls.columns.health) return []
      const columnsConfig = [
        { label: 'RPC', field: 'rpc', tooltip: 'RPC healthcheck' },
        { label: 'BFR', field: 'bfr', tooltip: 'Bifrost healthcheck' }
      ]

      if (this.$store.state.controls.columns.healthx) {
        columnsConfig.push(
          { label: 'P2P', field: 'p2p', tooltip: 'P2P Ping' },
          { label: 'B2B', field: 'b2b', tooltip: 'Bifrost P2P Ping' }
        )
      }

      return columnsConfig.map(({ label, field, tooltip }) => ({
        label,
        field: `health.${field}`,
        tooltip,
        globalSearchDisabled: true,
        tdClass: 'nopad center',
        thClass: 'center'
      }))
    }
  },
  methods: {
    createColumns(
      includeRewards,
      includeScore,
      includeStatus,
      includeVault,
      chains = {}
    ) {
      const chainColumns = Object.values(chains).flat()
      const columns = [
        ...this.colBase,
        ...this.colLocation,
        ...this.colProvider,
        ...this.colFee,
        ...this.colBond,
        ...(includeRewards ? this.colRewards : []),
        ...this.colSlashes,
        ...(includeScore ? this.colScore : []),
        ...(includeStatus ? this.colStatus : []),
        ...this.colJail,
        ...this.colExit,
        ...(includeVault ? this.colVault : []),
        ...chainColumns,
        ...this.colVersion,
        ...this.colHealth
      ]

      return columns
    },
    sortRaw(x, y) {
      const a = x && !isNaN(x.raw) ? x.raw : -Infinity
      const b = y && !isNaN(y.raw) ? y.raw : -Infinity
      return a - b
    },
    sortStatus(x, y) {
      const arr = ['Active', 'Ready', 'Standby', 'Whitelisted', 'Disabled']
      return arr.indexOf(x) - arr.indexOf(y)
    },
    formatStatus(val) {
      const obj = {
        Active: 'ACT',
        Ready: 'RDY',
        Standby: 'STB',
        Whitelisted: 'WHL',
        Disabled: 'DIS'
      }
      return obj[val]
    },
    probeComparison(row, chain) {
      const probe = row?.probes?.[chain].raw
      if (probe < -5) return 'center low-score'
      if (probe > 99) return 'center low-score'
      return 'center'
    },
    chainComparison(row, chain) {
      if (row?.chains?.[chain].raw < this.chainTips[chain] - 5)
        return 'center low-score'
      return 'center'
    },
    versionClass(row) {
      const netV = this.net.version
      if (semver.lt(row.version, netV)) return 'center lower-version'
      if (semver.gt(row.version, netV)) return 'center higher-version'
      return 'center'
    }
  }
}
</script>

<style lang="scss" scoped>
.sets .set:not(:first-child) {
  margin-top: 26px;
}
</style>
