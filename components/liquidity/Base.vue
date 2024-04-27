<template lang="pug">
.pools
  TableFilter
  vue-good-table(
    v-if="net.pools.length > 0"
    compactMode
    :rows="net.pools"
    :columns="columns"
    :line-numbers="true"
    :sort-options="sortOptions"
    :search-options="{ enabled: true, externalQuery: $store.state.filter }"
    :row-style-class="rowStyleClass"
    :select-options="selectOptions"
  )
    template(v-slot:table-column="{ column }")
      .tix.normal(v-if="column.field === 'asset.chain'"): IconDataBase.sfg
      .tix.right(v-else-if="column.field === 'pending_inbound_asset.raw'"): IconInput.sfg
      .tix.right(v-else-if="column.field === 'pending_inbound_rune.raw'"): IconInput.sfg
      .tix.normal(v-else-if="column.field === 'synth_mint_paused'"): IconPause.sfg
      .tix.right(v-else-if="column.field === 'pool_units.raw'"): IconPool.sfg
      .tix.right(v-else-if="column.field === 'LP_units.raw'"): IconDrop.sfg
      .tix.right(v-else-if="column.field === 'synth_units.raw'")
        IconSynth.sfg
        | U
      .tix.right(v-else-if="column.field === 'synth_supply.raw'")
        IconSynth.sfg
        | S
      .tix.right(v-else-if="column.field === 'synth_supply_remaining.raw'")
        IconSynth.sfg
        | R
      .tix.right(v-else-if="column.field === 'savers_depth.raw'")
        IconPiggy.sfg
        | ↓
      .tix.right(v-else-if="column.field === 'savers_units.raw'")
        IconPiggy.sfg
        | U
      .tix.right(v-else-if="column.field === 'loan_collateral.raw'")
        IconFinance.sfg
        | C
      .tix.right(v-else-if="column.field === 'loan_cr.raw'")
        IconFinance.sfg
        | CR

    template(v-slot:table-row="{ row, column, formattedRow }")
      .tix.coin(
        v-if="column.field === 'asset.chain' && chainList.includes(row.asset.chain)"
        v-tooltip="row.asset.chain"
      )
        component.sfs(:is="`IconCoin${row.asset.chain}`")
      template(v-else-if="column.field === 'asset.ticker'")
        span(v-tooltip="row.asset.raw") {{ row.asset.ticker }}

  WidgetSpinnerStream(v-else)
</template>

<script>
export default {
  data() {
    return {
      sortOptions: {
        enabled: true,
        multipleColumns: true,
        initialSortBy: [
          { field: 'status' },
          { field: 'balance_rune.raw', type: 'desc' }
        ]
      },
      selectOptions: {
        enabled: true,
        selectOnCheckboxOnly: true,
        disableSelectInfo: true,
        selectAllByGroup: true
      },
      columns: [
        {
          label: 'DEPTH',
          field: 'balance_rune.raw',
          tooltip: 'Total Pool Depth',
          type: 'number',
          tdClass: (row) => row.balance_rune.class,
          formatFn: (val) =>
            this.nFmt(
              (val / 1e8) * 2 * this.net.price,
              2,
              'compact',
              'currency'
            ),
          firstSortType: 'desc'
        },
        {
          label: 'BALANCE',
          field: 'balance_rune.raw',
          tooltip: 'Rune Balance',
          type: 'number',
          tdClass: (row) => row.balance_rune.class,
          formatFn: (val) => this.denominate(val, val <= 1e12 ? 2 : 0),
          firstSortType: 'desc'
        },
        {
          label: 'BALANCE',
          field: 'balance_asset.raw',
          tooltip: 'Asset Balance',
          type: 'number',
          tdClass: (row) => row.balance_asset.class,
          formatFn: (val, row) => this.formatAssetRatio(val, 8),
          firstSortType: 'desc'
        },
        {
          label: 'CHAIN',
          field: 'asset.chain',
          tdClass: 'center',
          thClass: 'center',
          tooltip: 'Asset Chain'
        },
        {
          label: 'ASSET',
          field: 'asset.ticker',
          tooltip: 'Asset Ticker'
        },
        {
          label: 'PRICE',
          field: 'asset.price.raw',
          tooltip: 'Asset Price',
          type: 'number',
          tdClass: (row) => row.asset.price.class,
          formatFn: this.formatPrice,
          firstSortType: 'desc'
        },
        {
          label: 'ID',
          field: 'asset.id',
          tooltip: 'Asset ID',
          hidden: true
        },
        {
          field: 'short_code',
          hidden: true
        },
        {
          field: 'status',
          hidden: true
        },
        {
          label: '->',
          field: 'pending_inbound_asset.raw',
          tooltip: 'Pending Inbound Asset',
          type: 'number',
          tdClass: (row) => row.pending_inbound_asset.class,
          formatFn: (val, row) => this.formatAsset(val, 8, 2),
          firstSortType: 'desc'
        },
        {
          label: '->RUNE',
          field: 'pending_inbound_rune.raw',
          tooltip: 'Pending Inbound Rune',
          type: 'number',
          tdClass: (row) => row.pending_inbound_rune.class,
          formatFn: (val) => (val === '0' ? '-' : this.denominate(val, 2)),
          firstSortType: 'desc'
        },
        {
          label: 'UNITS',
          field: 'pool_units.raw',
          tooltip: 'Pool Units',
          type: 'number',
          tdClass: (row) => row.pool_units.class,
          formatFn: this.formatDigits,
          firstSortType: 'desc'
        },
        {
          label: 'LP UNITS',
          field: 'LP_units.raw',
          tooltip: 'LP Units',
          type: 'number',
          tdClass: (row) => row.LP_units.class,
          formatFn: this.formatDigits,
          firstSortType: 'desc'
        },
        {
          label: 'SYNTH UNITS',
          field: 'synth_units.raw',
          tooltip: 'Synth Units',
          type: 'number',
          tdClass: (row) => row.synth_units.class,
          formatFn: this.formatDigits,
          firstSortType: 'desc'
        },
        {
          label: 'SYNTH SUPPLY',
          field: 'synth_supply.raw',
          tooltip: 'Synth Supply',
          type: 'number',
          tdClass: (row) => row.synth_supply.class,
          formatFn: this.formatDigits,
          firstSortType: 'desc'
        },
        {
          label: 'REMAINING',
          field: 'synth_supply_remaining.raw',
          tooltip: 'Remaining Synth Supply',
          type: 'number',
          tdClass: (row) => row.synth_supply_remaining.class,
          formatFn: this.formatDigits,
          firstSortType: 'desc'
        },
        {
          label: 'MINT PAUSE',
          field: 'synth_mint_paused',
          tooltip: 'Synth Mint',
          tdClass: (row) =>
            row.synth_mint_paused ? 'center low-score' : 'center',
          formatFn: (val) =>
            ({
              raw: val,
              fmt: val ? 'P' : 'OK'
            }[this.formraw]),
          firstSortType: 'desc'
        },
        {
          label: 'SAVERS DEPTH',
          field: 'savers_depth.raw',
          tooltip: 'Savers Depth',
          type: 'number',
          tdClass: (row) => row.synth_supply_remaining.class,
          formatFn: (val, row) => this.formatAsset(val),
          firstSortType: 'desc'
        },
        {
          label: 'SAVERS UNITS',
          field: 'savers_units.raw',
          tooltip: 'Savers Units',
          type: 'number',
          tdClass: (row) => row.synth_supply_remaining.class,
          formatFn: (val) => (val === '0' ? '-' : this.formatDigits(val)),
          firstSortType: 'desc'
        },
        {
          label: 'COLL',
          field: 'loan_collateral.raw',
          tooltip: 'Collateral',
          type: 'number',
          tdClass: (row) => row.synth_supply_remaining.class,
          formatFn: (val, row) => this.formatAsset(val),
          firstSortType: 'desc'
        },
        {
          label: 'CR',
          field: 'loan_cr.raw',
          tooltip: 'Collateralization Ratio',
          type: 'number',
          tdClass: (row) => row.synth_supply_remaining.class,
          formatFn: (val, row) =>
            row.loan_collateral.raw === '0'
              ? '-'
              : this.formatNumber(val)[this.formraw],
          firstSortType: 'desc'
        },
        {
          label: 'DPD',
          field: 'derived_depth_bps.raw',
          tooltip: 'Derived Pool Depth',
          type: 'number',
          tdClass: (row) => row.synth_supply_remaining.class,
          formatFn: (val) => (val === '0' ? '-' : this.formatFee(val)),
          firstSortType: 'desc'
        }
      ]
    }
  },
  methods: {
    formatAssetRatio(val, decimals) {
      const calVal = val / Math.pow(10, decimals ?? 8)
      let fraction = 0
      if (calVal < 5000) fraction = 1
      if (calVal < 1000) fraction = 2
      if (calVal < 200) fraction = 3
      if (calVal < 100) fraction = 4
      return this.formatAsset(val, decimals, fraction)
    },
    formatDigits(val) {
      return {
        raw: val,
        fmt: this.nFmt(val / 1e8, 1, 'compact')
      }[this.formraw]
    },
    formatPrice(val) {
      let fraction = 0
      if (val < 100) fraction = 1
      if (val < 50) fraction = 2
      if (val < 2) fraction = 3
      if (val < 1) fraction = 4
      return this.nFmt(val, fraction, 'standard', 'currency')
    },
    rowStyleClass(row) {
      if (row.status === 'Staged') return 'churn-marked'
    }
  }
}
</script>

<style lang="scss" scoped>
.sets .set:not(:first-child) {
  margin-top: 26px;
}

svg.sfs {
  height: 1.22em;
  width: 1.22em;
}
</style>
