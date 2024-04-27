<template lang="pug">
.tix
  .tix(v-if="row.exit === 1" v-tooltip="'Requested to Leave'"): IconLogout.sfg
  .tix(v-else-if="row.exit === 2" v-tooltip="'Banned'"): IconBoot.sfg
  .tix(v-else) -
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
