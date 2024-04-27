<template lang="pug">
.tix
  span(v-if="row.churn === null") -
  span(v-else-if="row.churn === 'IN'" v-tooltip="'Churning IN'"): IconChurnin.sfg
  span(v-else-if="row.churn === 'OUT'" v-tooltip="'Churning OUT'"): IconChurnout.sfg
  template(v-else)
    span(
      v-if="row.churn.includes('LOW')"
      v-tooltip="`Lowest Bond${row.churn.includes('OUT') ? ' - Churning OUT' : ''}`"
    ): IconPiggy.sfg
    span(
      v-if="row.churn.includes('OLD')"
      v-tooltip="`Oldest Node${row.churn.includes('OUT') ? ' - Churning OUT' : ''}`"
    ): IconClock.sfg
    span(
      v-if="row.churn.includes('SUB')"
      v-tooltip="`Worst Performer${row.churn.includes('OUT') ? ' - Churning OUT' : ''}`"
    ): IconDown.sfg
</template>

<script>
export default {
  props: {
    row: {
      type: Object,
      required: true
    }
  }
}
</script>
