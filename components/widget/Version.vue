<template lang="pug">
.normflex
  span.progress.gradient(v-if="isMixed") {{ formatNumber(net.protocol.updateProgress, 0, 'standard', 'percent')[formraw] }}
  span.version(v-if="net.version !== '0.0.0'" :class="{ gradient: isMixed }") {{ net.version }}
</template>

<script>
export default {
  computed: {
    isMixed() {
      return this.net?.protocol?.hasMultipleVersions
    }
  }
}
</script>

<style lang="scss" scoped>
.version {
  width: 100%;
  text-align: right;
}

.gradient {
  background: linear-gradient(
    45deg,
    var(--success-color-darker),
    var(--error-color-darker)
  );
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
