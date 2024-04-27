<template lang="pug">
button#btn-toggle-columns-fee.buitoni(
  v-tooltip.right="'Fee'"
  @click="$store.dispatch('controls/toggleColumnsFee')"
  :class="{ active: $store.state.controls.columns.fee }"
)
  IconFee
</template>
