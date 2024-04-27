<template lang="pug">
button#btn-toggle-columns-healthx.buitoni(
  :disabled="!this.$store.state.controls.columns.health"
  v-tooltip.right="'Extended Health'"
  @click="$store.dispatch('controls/toggleColumnsHealthx')"
  :class="{ active: $store.state.controls.columns.healthx }"
)
  IconDNA
</template>
