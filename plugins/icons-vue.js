import Vue from 'vue'

import { SemipolarSpinner } from 'epic-spinners'

const iconComponents = [
  // 24
  ['IconColumn', 'column--delete/24'],
  ['IconDiagram', 'diagram/24'],
  ['IconFee', 'percentage/24'],
  ['IconGlobe', 'earth--filled/24'],
  ['IconLink', 'link/24'],
  ['IconMoney', 'money/24'],
  ['IconPower', 'power/24'],
  ['IconProvider', 'license--third-party/24'],
  ['IconScore', 'list--numbered/24'],
  ['IconRaw', 'RAW/24'],
  ['IconSave', 'save/24'],
  ['IconTheme', 'color-palette/24'],
  ['IconAlert', 'warning--alt/24'],
  ['IconReset', 'filter--reset/24'],
  ['IconCatalog', 'catalog/24'],
  ['IconMonitor', 'cloud--monitoring/24'],
  ['IconDNA', 'watson-health/dna/24'],
  // 16
  ['IconAdd', 'add/16'],
  ['IconApi', 'JSON--reference/16'],
  ['IconBoot', 'boot/16'],
  ['IconChurnin', 'data--check/16'],
  ['IconChurnout', 'misuse--outline/16'],
  ['IconClock', 'time/16'],
  ['IconDown', 'arrow-shift-down/16'],
  ['IconExit', 'exit/16'],
  ['IconJail', 'police/16'],
  ['IconVault', 'locked/16'],
  ['IconKeygenProcess', 'chip/16'],
  ['IconKeygenVote', 'hashtag/16'],
  ['IconKeysign', 'code-signing-service/16'],
  ['IconLightning', 'lightning/16'],
  ['IconLogout', 'logout/16'],
  ['IconMigrate', 'migrate/16'],
  ['IconPiggy', 'piggy-bank/16'],
  ['IconProgress', 'progress-bar/16'],
  ['IconServer', 'server--dns/16'],
  ['IconTerminal', 'terminal/16'],
  ['IconExplorer', 'explore/16'],
  ['IconCircle', 'circle--solid/16'],
  ['IconCircleFilled', 'circle--filled/16'],
  ['IconReport', 'report/16'],
  ['IconDataBase', 'data--base/16'],
  ['IconPause', 'pause--filled/16'],
  ['IconInput', 'port--input/16'],
  ['IconSynth', 'chemistry/16'],
  ['IconFinance', 'finance/16'],
  ['IconPool', 'accumulation--rain/16'],
  ['IconDrop', 'rain-drop/16'],
  ['IconWallet', 'wallet/16']
]

iconComponents.forEach(([name, path]) => {
  const component = require(`@carbon/icons-vue/es/${path}`).default
  Vue.component(name, component)
})

Vue.component('SemipolarSpinner', SemipolarSpinner)
