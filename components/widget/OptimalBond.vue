<template lang="pug">
.wrapper
  .icon-filler: IconAdd
  .filler {{ formatDenom(net.bonds.optimal) }}
</template>

<style lang="scss" scoped>
.wrapper {
  display: flex;
}

.icon-filler {
  display: flex;
  align-items: center;
  margin-left: auto;
}
</style>
