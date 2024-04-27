<template lang="pug">
span.hide
</template>

<script>
export default {
  created() {
    this.startStream()
  },
  destroyed() {
    this.stopStream()
  }
}
</script>
