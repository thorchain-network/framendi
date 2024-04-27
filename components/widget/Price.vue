<template lang="pug">
transition(
  enter-active-class="animated jello"
  leave-active-class="animated jello"
  mode="out-in"
)
  .price(:key="rune.priceClass" :class="rune.priceClass") {{ rune.price }}
</template>

<style lang="scss" scoped>
.price {
  display: inline-block;
  animation-duration: 2s;

  &.green {
    color: limegreen;
  }

  &.red {
    color: tomato;
  }
}
</style>
