<template lang="pug">
WidgetSpinnerBase
  template(v-slot="{ color }")
    span(v-if="$store.state.stream.active")
      SemipolarSpinner(:animation-duration="1666" :size="50" :color="color")
    span(v-else) PRESS THE POWER BUTTON TO RECEIVE STREAMS
</template>
