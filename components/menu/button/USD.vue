<template lang="pug">
button#btn-usd.buitoni(
  :disabled="this.$store.state.controls.raw"
  v-tooltip="'Denominate in USD'"
  @click="toggleUSDFormat"
  :class="{ active: this.$store.state.controls.usd }"
)
  IconMoney
  GlobalEvents(v-if="keyboardControlsActive" @keyup.84="toggleUSDFormat")
</template>

<script>
export default {
  methods: {
    toggleUSDFormat() {
      this.$store.dispatch('controls/toggleUSDFormat')
    }
  }
}
</script>
