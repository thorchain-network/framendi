<template lang="pug">
nuxt-link.normalize.split(
  to="/stats"
  v-tooltip="'External Market Price and Volume'"
)
  WidgetPrice
  .volume {{ rune.volume }}
</template>
