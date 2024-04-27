<template lang="pug">
.tix
  a.tix.node-selection
    span.selected(v-if="row.vgtSelected" v-tooltip="'Deselect Node'") ◉
    span.unselected(v-else v-tooltip="'Select Node'") ◉
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

<style scoped lang="scss">
.node-selection {
  width: 100%;
  height: 100%;
  font-weight: bold;

  &:hover > span {
    color: var(--font-color) !important;
  }

  span.selected {
    color: var(--error-color-darker);
  }

  span.unselected {
    color: var(--background-color-secondary);
  }
}
</style>
