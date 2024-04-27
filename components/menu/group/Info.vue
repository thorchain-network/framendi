<template lang="pug">
nuxt-link.normalize.split(
  to="/stats"
  v-tooltip="'Network Version and Block Height'"
)
  .wrapper: WidgetVersion
  .wrapper: WidgetBlockHeight
</template>
