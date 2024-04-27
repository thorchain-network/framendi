<template lang="pug">
VMenu(theme="navigation" :distance="0" v-tooltip="'Toggle Columns'")
  .buitoni
    IconColumn
  template(#popper)
    MenuButtonColumnLocation
    MenuButtonColumnChains
    MenuButtonColumnFee
    MenuButtonColumnProvider
    MenuButtonColumnScore
    MenuButtonColumnHealth
    MenuButtonColumnHealthx
</template>
