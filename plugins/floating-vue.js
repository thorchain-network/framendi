import Vue from 'vue'
import FloatingVue from 'floating-vue'

import 'floating-vue/dist/style.css'

Vue.use(FloatingVue, {
  themes: {
    bond: {
      $extend: 'menu',
      $resetCss: true
    },
    coinlabel: {
      $extend: 'menu',
      $resetCss: true,
      triggers: ['hover']
    },
    datatable: {
      $extend: 'tooltip',
      $resetCss: true,
      placement: 'left'
    },
    navigation: {
      $extend: 'dropdown',
      $resetCss: true
    }
  }
})
