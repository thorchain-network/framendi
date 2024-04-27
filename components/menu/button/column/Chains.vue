<template lang="pug">
button#btn-toggle-columns-chains.buitoni(
  v-tooltip.right="'Chains'"
  @click="toggleColumnsChains"
  :class="{ active: $store.state.controls.columns.chains }"
)
  IconLink
  GlobalEvents(v-if="keyboardControlsActive" @keyup.75="toggleColumnsChains")
</template>

<script>
export default {
  methods: {
    toggleColumnsChains() {
      this.$store.dispatch('controls/toggleColumnsChains')
    }
  }
}
</script>
