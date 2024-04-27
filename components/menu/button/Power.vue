<template lang="pug">
button#btn-power.buitoni(
  v-tooltip="tooltip"
  @click="pauseStream"
  :class="{ active: $store.state.stream.active }"
)
  transition(
    enter-active-class="animated pulseLong"
    leave-active-class="animated pulseLong"
    mode="out-in"
  )
    span(:key="$store.state.stream.count"): IconPower

  GlobalEvents(v-if="keyboardControlsActive" @keyup.80="pauseStream")
</template>

<script>
export default {
  computed: {
    tooltip() {
      const stream = this.$store.state.stream.active
      return {
        html: true,
        content: `<div class='vtt-title'>Live Stream ${
          stream ? 'ON' : 'OFF'
        }</div><div>Press to Turn ${stream ? 'Off' : 'On'}</div>`
      }
    }
  }
}
</script>
