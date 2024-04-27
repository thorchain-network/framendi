<template lang="pug">
button#btn-toggle-columns-score.buitoni(
  v-tooltip.right="'Score'"
  @click="$store.dispatch('controls/toggleColumnsScore')"
  :class="{ active: $store.state.controls.columns.score }"
)
  IconScore
</template>
