<template lang="pug">
nuxt-link.normalize.split(
  to="/churn"
  v-tooltip="'Vault Migration, Churn Progress and Countdown'"
)
  template(v-if="net.mimir?.HALTCHURNING")
    .halt.orange-class
      .el CHURN
      .el PAUSE
  template(v-else)
    .churn.progress-wrapper
      .migration
        IconMigrate.animated.slow.infinite.rubberBand(
          v-if="net.network?.vaults_migrating ?? false"
        )
      .progress {{ net.churn.progress[this.formraw] }}
    .churn {{ net.churn.clock[this.formraw] }}
</template>

<style lang="scss" scoped>
.progress-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .animated {
    display: flex;
  }
}

.halt {
  &:hover {
    color: inherit;
  }
}
</style>
