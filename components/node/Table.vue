<template lang="pug">
vue-good-table(
  compactMode
  :rows="rows"
  :columns="columns"
  :line-numbers="true"
  :sort-options="sortOptions(tableName)"
  :search-options="searchOptions"
  :row-style-class="rowStyleClass"
  :select-options="selectOptions"
  @on-cell-click="onCellClick"
  @on-sort-change="(params) => onSortChange(params, tableName)"
)
  template(v-slot:table-column="{ column }")
    .tix.normal(v-if="column.field === 'vgtSelected'"): IconLightning.sfg
    .tix.normal(v-else-if="column.field === 'churn'"): IconProgress.sfg
    .tix.normal(v-else-if="column.field === 'jail'"): IconJail.sfg
    .tix.normal(v-else-if="column.field === 'vault'"): IconVault.sfg
    .tix.normal(v-else-if="column.field === 'exit'"): IconLogout.sfg
    NodeLabelChain(
      v-else-if="chainList.includes(column.label)"
      :column="column"
    )

  template(v-slot:table-row="{ row, column, formattedRow }")
    NodeColumnAddress(v-if="column.field === 'node_address'" :row="row")
    NodeColumnSelection(v-else-if="column.field === 'vgtSelected'" :row="row")
    NodeColumnChurn(v-else-if="column.field === 'churn'" :row="row")
    NodeColumnExit(v-else-if="column.field === 'exit'" :row="row")
    NodeColumnJail(v-else-if="column.field === 'jail'" :row="row")
    NodeColumnVault(v-else-if="column.field === 'vault'" :row="row")
    NodeColumnIsp(
      v-else-if="column.field === 'location.isp'"
      :location="row.location"
    )
    NodeColumnLocation(
      v-else-if="column.field === 'location.place'"
      :row="row"
    )
    NodeColumnOperator(
      v-else-if="column.field === 'node_operator_address'"
      :row="row"
    )
    NodeColumnHealth(
      v-else-if="healthFields.includes(column.field)"
      :row="row"
      :column="column"
    )
</template>

<script>
export default {
  props: {
    tableName: {
      type: String,
      required: true
    },
    searchOptions: {
      type: Object,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    rows: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      healthFields: ['health.rpc', 'health.bfr', 'health.p2p', 'health.b2b'],
      selectOptions: {
        enabled: true,
        selectOnCheckboxOnly: true,
        disableSelectInfo: true,
        selectAllByGroup: true
      }
    }
  },
  methods: {
    sortOptions(tableName) {
      return {
        enabled: true,
        multipleColumns: true,
        initialSortBy: {
          field: this.$store.state.controls.sort[tableName].field,
          type: this.$store.state.controls.sort[tableName].type
        }
      }
    },
    onSortChange(params, tableName) {
      this.$store.dispatch('controls/setSort', {
        [tableName]: { field: params[0].field, type: params[0].type }
      })
    },
    rowStyleClass(row) {
      const sel = row.vgtSelected ? 'highlight-row-churn' : ''
      if (row.churn === 'IN') return 'churn-in ' + sel
      if (row.status === 'Active' && row.leave_height > 0)
        return 'churn-out ' + sel
      if (row.bad && !this.net.churn.finalized) return 'churn-marked ' + sel
      return sel
    },
    onCellClick(params) {
      if (params.column.field === 'vgtSelected') {
        params.row.vgtSelected = !params.row.vgtSelected
        this.setSelection(params.row.node_address)
      }
    },
    setSelection(nodeAddress) {
      const node = this.allNodes.filter(
        (i) => i.node_address === nodeAddress
      )[0]
      this.$store.dispatch('nodeSelection', node)
      this.$store.dispatch('saveState')
    }
  }
}
</script>
