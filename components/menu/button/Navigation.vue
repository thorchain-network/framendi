<template lang="pug">
VMenu(theme="navigation" :distance="0")
  nuxt-link.navlink(:to="$nuxt.$route.path" custom v-slot="{ navigate }")
    a#navigation.normalize.buitoni(@click.prevent="") {{ path }}
  template(#popper)
    template(v-for="(value, key) in appNavigation")
      nuxt-link.navlink.buitoni(
        v-if="path !== key"
        :key="key"
        :id="`nav-${key}`"
        :to="`/${key}`"
      ) {{ key }}

  GlobalEvents(v-if="keyboardControlsActive" @keyup="keyboard")
</template>

<script>
export default {
  computed: {
    path() {
      return this.$nuxt.$route.name
    }
  },
  methods: {
    keyboard(event) {
      const route = Object.keys(this.appNavigation).find(
        (key) => this.appNavigation[key].code === event.keyCode
      )

      if (route) this.$router.push(this.path !== route ? `/${route}` : '/nodes')
    }
  }
}
</script>

<style lang="scss" scoped>
.navlink {
  text-transform: uppercase;
}
</style>
