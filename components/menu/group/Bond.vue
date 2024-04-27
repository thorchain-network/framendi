<template lang="pug">
nuxt-link.normalize.split(
  to="/stats"
  v-tooltip="'Optimal Bond Threshold and TVL of Active Validator Set'"
)
  WidgetOptimalBond
  .tvl {{ formatDenom(net.bonds.total) }}
</template>
