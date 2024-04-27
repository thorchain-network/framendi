import Vue from 'vue'
import ECharts from 'vue-echarts'
import { use } from 'echarts/core'

import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'

import * as echarts from 'echarts'
import light from '~/assets/echarts/light'
import sepia from '~/assets/echarts/sepia'
import dark from '~/assets/echarts/dark'

echarts.registerTheme('light', light)
echarts.registerTheme('sepia', sepia)
echarts.registerTheme('dark', dark)

use([
  CanvasRenderer,
  PieChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

Vue.component('VChart', ECharts)
