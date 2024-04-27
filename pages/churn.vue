<template lang="pug">
.main
  Stream
  .topbar
    .menu-left
      MenuButtonNavigation
      MenuButtonContact
      MenuButtonTheme
      MenuButtonFormat
      MenuButtonUSD
      MenuButtonSave
      MenuButtonPower

    .middle

    .menu-right
      MenuGroupAlert
      MenuGroupInfo
      MenuGroupChurn
      MenuGroupBond
      MenuGroupPrice

  .frame(v-if="net.churn.list.length > 0")
    .column
      h2.sme
        .item CHURN
        .item {{ '#' + (net.churn.list.length + 1) }}
      .content(v-if="net.mimir.HALTCHURNING")
        .row.orange-class CHURNING IS PAUSED
      .content(v-else)
        .row
          .cell Blocks
          .cell {{ net.churn.progress.raw }}
        .row
          .cell Progress
          .cell {{ net.churn.progress.fmt }}
        .row
          .cell Retries
          .cell
            span(v-if="noa.length > 0") {{ retries }}

    .column
      h2 START
      .content
        .row
          .cell Height
          .cell {{ nFmt(net.churn.last) }}
        .row
          .cell Event
          .cell {{ startDate }}
        .row
          .cell Duration
          .cell {{ elapsedTime }}
        .row
          .cell Validated Blocks
          .cell {{ nFmt(net.churn.passed_blocks) }}

    .column(v-if="!net.mimir.HALTCHURNING")
      h2 FINISH
      .content
        .row
          .cell Height
          .cell {{ nFmt(net.churn.next) }}
        .row
          .cell Event
          .cell {{ endDate }}
        .row
          .cell Countdown
          .cell {{ remainingTime }}
        .row
          .cell Pending Blocks
          .cell {{ net.churn.clock.raw }}

  .churn-table
    vue-good-table(
      v-if="net.churn.list.length > 0"
      compactMode
      :rows="net.churn.list"
      :columns="columns"
      :line-numbers="true"
      :sort-options="sortOptions"
    )

    WidgetSpinnerStream(v-else)
</template>

<script>
const humD = require('humanize-duration')
const durationFormat = { round: true, largest: 3 }

const dateFormat = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  minute: '2-digit',
  hour: '2-digit',
  weekday: 'short'
})

export default {
  data() {
    return {
      sortOptions: {
        enabled: true,
        multipleColumns: true,
        initialSortBy: {
          field: 'height',
          type: 'desc'
        }
      },
      columns: [
        {
          label: 'CHURN',
          field: 'index',
          firstSortType: 'desc',
          type: 'number'
        },
        {
          label: 'HEIGHT',
          field: 'height',
          firstSortType: 'desc',
          type: 'number',
          formatFn: (val) => this.nFmt(val)
        },
        {
          label: 'BLOCKS',
          field: 'blocks',
          firstSortType: 'desc',
          type: 'number',
          formatFn: (val) => this.nFmt(val)
        },
        {
          label: 'EVENT',
          field: 'date',
          firstSortType: 'desc',
          type: 'date',
          formatFn: (val) => dateFormat.format(val)
        },
        {
          label: 'DURATION',
          field: 'duration',
          firstSortType: 'desc',
          type: 'number',
          tooltip: 'Duration in days',
          formatFn: (val) => (val / 1000 / 60 / 60 / 24).toFixed(2)
        }
      ]
    }
  },
  computed: {
    noa() {
      return this.net.nodes.oldestActive
    },
    clock() {
      return dateFormat
    },
    remainingSeconds() {
      return this.net.churn.remaining_blocks * this.net.blocktime * 1000
    },
    elapsedTime() {
      return humD(Date.now() - this.net.churn.list[0].date, durationFormat)
    },
    remainingTime() {
      return humD(this.remainingSeconds, durationFormat)
    },
    endDate() {
      return this.clock.format(Date.now() + this.remainingSeconds)
    },
    startDate() {
      return this.clock.format(this.net.churn.list[0].date)
    },
    retries() {
      const churnedBlocks =
        this.net.churn.passed_blocks - this.net.churn.interval
      if (churnedBlocks <= 0) return 0
      return Math.floor(churnedBlocks / 720)
    }
  },
  beforeCreate() {
    this.$store.dispatch('stream/setChannel', 'nodes')
  }
}
</script>

<style lang="scss" scoped>
.frame {
  border-bottom: 0;
}

.sme {
  display: flex;
  justify-content: space-between;
}
</style>
