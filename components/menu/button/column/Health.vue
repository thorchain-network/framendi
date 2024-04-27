<template lang="pug">
button#btn-toggle-columns-health.buitoni(
  v-tooltip.right="'Health'"
  @click="$store.dispatch('controls/toggleColumnsHealth')"
  :class="{ active: $store.state.controls.columns.health }"
)
  IconMonitor
</template>
