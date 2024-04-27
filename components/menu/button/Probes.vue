<template lang="pug">
button#btn-probes.buitoni(
  v-tooltip="'Toggle Chain Probes'"
  @click="toggleProbes"
  :class="{ active: this.$store.state.controls.probesActive }"
)
  IconLink
  GlobalEvents(v-if="keyboardControlsActive" @keyup.67="toggleProbes")
</template>

<script>
export default {
  methods: {
    toggleProbes() {
      this.$store.dispatch('controls/toggleProbes')
    }
  }
}
</script>
