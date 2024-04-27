<template lang="pug">
button#btn-toggle-columns-provider.buitoni(
  v-tooltip.right="'Provider'"
  @click="$store.dispatch('controls/toggleColumnsProvider')"
  :class="{ active: $store.state.controls.columns.provider }"
)
  IconProvider
</template>
