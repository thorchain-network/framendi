<template lang="pug">
.graph-content
  .info
    .el {{ net.nodes.active.length }} Active Validators
    .el {{ countries }} {{ countries > 1 ? 'Countries' : 'Country' }}
    .el {{ isps }} {{ isps > 1 ? 'ISPs' : 'ISP' }}
    .el {{ versions }} Protocol {{ versions > 1 ? 'Versions' : 'Version' }}
  v-chart.chart(:option="option" :theme="$colorMode.value" :autoresize="false")
  .trigger-update.hide {{ net.name }}
</template>

<script>
import { uniqueItems } from '~/helpers/functions'

export default {
  data() {
    return {
      labels: [],
      values0: [],
      values1: [],
      values2: [],
      option: {
        textStyle: {
          fontFamily: this.$store.state.controls.font
        },
        legend: {
          data: [],
          itemStyle: {
            borderWidth: 1
          }
        },
        series: [
          {
            name: 'VERSION',
            type: 'pie',
            itemStyle: {
              borderWidth: 1,
              borderRadius: 2
            },
            textStyle: {
              fontWeight: 'bold'
            },
            selectedMode: 'single',
            radius: ['0%', '12%'],
            label: {
              position: 'inner',
              fontSize: 11,
              fontWeight: 'bold'
            },
            labelLine: {
              show: false
            },
            data: []
          },
          {
            name: 'ISP',
            type: 'pie',
            itemStyle: {
              borderWidth: 1,
              borderRadius: 3
            },
            textStyle: {
              fontWeight: 'bold'
            },
            selectedMode: 'single',
            radius: ['17%', '40%'],
            label: {
              position: 'inner',
              fontSize: 11,
              fontWeight: 'bold'
            },
            data: []
          },
          {
            name: 'COUNTRY',
            type: 'pie',
            itemStyle: {
              borderWidth: 1,
              borderRadius: 4
            },
            radius: ['45%', '66%'],
            labelLine: {
              length: 40,
              lineStyle: {
                width: 1.2
              }
            },
            label: {
              formatter: '{c|{c}} {b|{b}} {per|({d}%)}  ',
              lineHeight: 28,
              rich: {
                b: {
                  fontWeight: 'bold'
                }
              }
            },
            data: []
          }
        ]
      }
    }
  },
  computed: {
    countries() {
      return uniqueItems(
        this.net.nodes.active.map((n) => n.location),
        'country'
      )
    },
    isps() {
      return uniqueItems(
        this.net.nodes.active.map((n) => n.location),
        'isp'
      )
    },
    versions() {
      return this.net.protocol.list.length
    }
  },
  updated() {
    this.resetChart()
    this.generateChart()
  },
  mounted() {
    this.generateChart()
  },
  methods: {
    resetChart() {
      this.values0 = []
      this.values1 = []
      this.values2 = []
      this.option.series[0].data = []
      this.option.series[1].data = []
      this.option.series[2].data = []
    },
    generateChart() {
      this.generateSeriesAlt('values0', 'version')
      this.generateSeries('values1', 'isp')
      this.generateSeries('values2', 'country')
      this.option.legend.data = this.values1
      this.option.series[0].data = this.values0
      this.option.series[1].data = this.values1
      this.option.series[2].data = this.values2
    },
    generateSeries(vary, item) {
      for (const [name, value] of Object.entries(this.countItem(item))) {
        this[vary].push({ name, value })
      }
    },
    generateSeriesAlt(vary, item) {
      for (const [name, value] of Object.entries(this.countItemAlt(item))) {
        this[vary].push({ name, value })
      }
    },
    countItem(item) {
      return this.net.nodes.active.reduce((acc, node) => {
        return {
          ...acc,
          [node.location[item]]: (acc[node.location[item]] || 0) + 1
        }
      }, {})
    },
    countItemAlt(item) {
      return this.net.nodes.active.reduce((acc, node) => {
        return {
          ...acc,
          [node[item]]: (acc[node[item]] || 0) + 1
        }
      }, {})
    },
    uniqueItems(list, keyFn) {
      return uniqueItems(list, keyFn)
    }
  }
}
</script>

<style lang="scss" scoped>
.chart {
  margin: auto;
}

.info {
  position: absolute;
  z-index: 300;
  font-weight: bold;
  line-height: 3;
}
</style>
