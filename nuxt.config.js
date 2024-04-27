export default {
  head: {
    title: 'thorchain.network',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#333' },
      {
        hid: 'description',
        name: 'description',
        content: 'THORChain Network Monitor'
      }
    ],
    link: [
      { rel: 'icon', href: 'icon.svg?v=4' },
      { rel: 'apple-touch-icon', href: 'icon.png?v=4' }
    ]
  },

  ssr: false,

  env: {
    client: require('./package.json').version,
    networks: {
      mainnet: {
        nodeApi: process.env.MAINNET_API_THORNODE
      }
    },
    twitterContact: process.env.TWITTER_CONTACT,
    explorerUrl: process.env.EXPLORER_URL,
    twemojiUrl: process.env.TWEMOJI_URL,
    isProd: process.env.NODE_ENV === 'production',
    stream: {
      url:
        process.env.NODE_ENV === 'production'
          ? process.env.STREAM_PRODUCTION
          : process.env.STREAM_DEVELOPMENT
    }
  },

  css: ['@/assets/scss/main.scss'],

  plugins: [
    '~/plugins/default',
    { src: '~/plugins/vue-good-table', ssr: false },
    { src: '~/plugins/vue-global-events', ssr: false },
    { src: '~/plugins/vue-toastification', ssr: false },
    { src: '~/plugins/vue-echarts', ssr: false },
    { src: '~/plugins/floating-vue', ssr: false },
    { src: '~/plugins/icons-vue', ssr: false }
  ],

  components: ['~/components'],

  colorMode: {
    preference: 'system',
    fallback: 'light',
    storageKey: 'theme'
  },

  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/stylelint-module',
    '@nuxtjs/color-mode'
  ],

  router: {
    base: '/',
    middleware: ['redirections']
  },

  eslint: {
    fix: true
  },

  alias: {
    vue: 'vue/dist/vue.runtime.esm.js'
  },

  build: {}
}
