<template lang="pug">
.tix.left
  template(v-if="row.location.unicode")
    img.twemoji-flag(
      :src="row.location.twemoji"
      :alt="row.location.emoji"
      v-tooltip="row.location.country"
    )
    span {{ row.location.city }}
  template(v-else) -
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

<style lang="scss">
img.twemoji-flag {
  width: 2.15em;
  overflow: hidden;
  margin-right: 8px;
}
</style>
