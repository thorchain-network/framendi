<template lang="pug">
button#btn-toggle-columns-location.buitoni(
  v-tooltip.right="'Locations'"
  @click="toggleColumnsLocation"
  :class="{ active: $store.state.controls.columns.geo }"
)
  IconGlobe
  GlobalEvents(v-if="keyboardControlsActive" @keyup.73="toggleColumnsLocation")
</template>

<script>
export default {
  methods: {
    toggleColumnsLocation() {
      this.$store.dispatch('controls/toggleColumnsLocation')
    }
  }
}
</script>
