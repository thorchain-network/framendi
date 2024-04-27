<template lang="pug">
.main(:style="{ fontFamily: this.$store.state.controls.font }")
  Nuxt

  GlobalEvents(@keyup.27="$toast.clear()")
  GlobalEvents(@keyup.27="hideAllPoppers()")
</template>
