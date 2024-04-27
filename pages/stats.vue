<template lang="pug">
.main
  Stream
  .topbar
    .menu-left
      MenuButtonNavigation
      MenuButtonContact
      MenuButtonTheme
      MenuButtonFormat
      MenuButtonUSD
      MenuButtonSave
      MenuButtonPower

    .middle

    .menu-right
      MenuGroupAlert
      MenuGroupInfo
      MenuGroupChurn
      MenuGroupBond
      MenuGroupPrice

  .frame
    .column
      StatsWrapper(:title="`${net.name} ${net.version}`")
        StatsRow(v-for="row in networkRows" :key="row.label")
          template(v-slot:label) {{ row.label }}
          template(v-slot:value)
            template(v-if="row.blockheight")
              IconCoinTHORCHAIN
              | {{ row.value }}
            template(v-else) {{ row.value }}

      StatsWrapper(:title="`CHURN #${net.churn.list.length + 1}`")
        StatsRow(v-for="row in churnRows" :key="row.label")
          template(v-slot:label) {{ row.label }}
          template(v-slot:value) {{ row.value }}

      StatsWrapper(title="LIMITS")
        StatsRow(v-for="row in limitRows" :key="row.label")
          template(v-slot:label) {{ row.label }}
          template(v-slot:value) {{ row.value }}

      StatsWrapper(title="LIQUIDITY")
        StatsRow(v-for="row in liquidityRows" :key="row.label")
          template(v-slot:label) {{ row.label }}
          template(v-slot:value) {{ row.value }}

      StatsWrapper(title="SWAP")
        StatsRow(v-for="row in swapRows" :key="row.label")
          template(v-slot:label) {{ row.label }}
          template(v-slot:value) {{ row.value }}

    .column
      StatsWrapper(:title="`VALIDATORS #${this.net.protocol.totalNodes}`")
        StatsRow(v-for="row in validatorRows" :key="row.label")
          template(v-slot:label) {{ row.label }}
          template(v-slot:value) {{ row.value }}

      StatsWrapper(title="BONDS")
        StatsRow(v-for="row in bondTotalRows" :key="row.label")
          template(v-slot:label) {{ row.label }}
          template(v-slot:value) {{ row.value }}

      StatsWrapper(title="OBSERVED TIPS")
        StatsRow(v-for="chain in net.chains" :key="chain.label")
          template(v-slot:label)
            component(:is="`IconCoin${chain.name}`")
            |
            | {{ chain.name }}
          template(v-slot:value) {{ formatNumber(chain.max)[formraw] }}

    .column
      StatsWrapper(:title="`VAULTS #${net.vaults?.length}`")
        StatsRow(v-for="row in vaultRows" :key="row.label")
          template(v-slot:label) {{ row.label }}
          template(v-slot:value) {{ row.value }}

      StatsWrapper(title="SYNTHS")
        StatsRow(v-for="row in synthRows" :key="row.label")
          template(v-slot:label) {{ row.label }}
          template(v-slot:value) {{ row.value }}

      StatsWrapper(title="GAS")
        StatsRow(v-for="row in gasRows" :key="row.label")
          template(v-slot:label) {{ row.label }}
          template(v-slot:value) {{ row.value }}

      StatsWrapper(title="FEES")
        StatsRow(v-for="row in feeRows" :key="row.label")
          template(v-slot:label) {{ row.label }}
          template(v-slot:value) {{ row.value }}

      StatsWrapper(title="NAME SERVICE")
        StatsRow(v-for="row in nameServiceRows" :key="row.label")
          template(v-slot:label) {{ row.label }}
          template(v-slot:value) {{ row.value }}

      StatsWrapper(title="PRICE")
        StatsRow(v-for="row in priceRows" :key="row.label")
          template(v-slot:label) {{ row.label }}
          template(v-slot:value) {{ row.value }}

    .column
      StatsWrapper(title="SUPPLY")
        StatsRow(v-for="row in supplyRows" :key="row.label")
          template(v-slot:label) {{ row.label }}
          template(v-slot:value) {{ row.value }}

      StatsWrapper(title="RESERVE")
        StatsRow(v-for="row in reserveRows" :key="row.label")
          template(v-slot:label) {{ row.label }}
          template(v-slot:value) {{ row.value }}

      StatsWrapper(title="TREASURY")
        StatsRow(v-for="row in treasuryRows" :key="row.label")
          template(v-slot:label) {{ row.label }}
          template(v-slot:value) {{ row.value }}

      StatsWrapper(title="RUNE")
        StatsRow(v-for="row in runeRows" :key="row.label")
          template(v-slot:label) {{ row.label }}
          template(v-slot:value) {{ row.value }}

      StatsWrapper(title="EXTERNAL (CoinCap)")
        StatsRow(v-for="row in externalRows" :key="row.label")
          template(v-slot:label) {{ row.label }}
          template(v-slot:value)
            template(v-if="row.price")
              WidgetPrice
              |
              | {{ row.value }}
            template(v-else) {{ row.value }}
</template>

<script>
export default {
  computed: {
    networkRows() {
      return [
        { label: 'Age', value: this.net.age },
        {
          label: 'Height',
          value: this.formatNumber(this.net.lastblock)[this.formraw],
          blockheight: true
        },
        { label: 'Blocktime', value: `${this.nFmt(this.net.blocktime, 2)}s` }
      ]
    },
    churnRows() {
      const baseRows = [
        {
          label: 'Last',
          value: this.formatNumber(this.net.churn.last)[this.formraw]
        }
      ]

      if (this.net.mimir?.HALTCHURNING)
        return [...baseRows, { label: 'Next', value: 'CHURNING IS PAUSED' }]

      return [
        { label: 'Progress', value: this.net.churn.progress[this.formraw] },
        { label: 'Remaining Time', value: this.net.churn.clock.fmt },
        { label: 'Remaining Blocks', value: this.net.churn.clock.raw },
        {
          label: 'Next',
          value: this.formatNumber(this.net.churn.next)[this.formraw]
        },
        ...baseRows
      ]
    },
    vaultRows() {
      return [
        {
          label: 'Migration',
          value: this.net.network?.vaults_migrating ?? false ? 'YES' : 'NO'
        }
      ]
    },
    gasRows() {
      return [
        {
          label: 'Spent',
          value: this.denominate(this.net.network?.gas_spent_rune)
        },
        {
          label: 'Withheld',
          value: this.denominate(this.net.network?.gas_withheld_rune)
        }
      ]
    },
    feeRows() {
      return [
        {
          label: 'Transaction',
          value: this.denominate(this.net.network?.native_tx_fee_rune, 3)
        },
        {
          label: 'Outbound',
          value: this.denominate(this.net.network?.native_outbound_fee_rune, 3)
        },
        {
          label: 'Outbound Multiplier',
          value: this.formatNumber(this.net.network?.outbound_fee_multiplier)[
            this.formraw
          ]
        }
      ]
    },
    priceRows() {
      return [
        {
          label: 'Internal',
          value: this.formatNumber(
            this.net.stats.runePriceUSD,
            2,
            'standard',
            'currency'
          )[this.formraw]
        },
        {
          label: 'Deterministic',
          value: this.formatNumber(
            this.deterministicPrice,
            2,
            'standard',
            'currency'
          )[this.formraw]
        },
        {
          label: 'Valuation Gap',
          value: this.formatNumber(
            this.net.stats.runePriceUSD - this.deterministicPrice,
            2,
            'standard',
            'currency'
          )[this.formraw]
        },
        {
          label: 'Speculative Multiplier',
          value: this.formatNumber(
            this.net.stats.runePriceUSD / this.deterministicPrice,
            2
          )[this.formraw]
        },
        {
          label: 'Arbitrage',
          value: this.formatNumber(
            Math.abs(this.net.stats.runePriceUSD - this.rune.bare),
            2,
            'standard',
            'currency'
          )[this.formraw]
        }
      ]
    },
    supplyRows() {
      return [
        {
          label: 'Circulating',
          value: this.denominate(this.circulatingSupply)
        },
        { label: 'Total', value: this.denominate(this.net.balances.supply) }
      ]
    },
    liquidityRows() {
      return [
        {
          label: 'APY',
          value: this.formatNumber(
            this.net.mnetwork?.liquidityAPY,
            2,
            'standard',
            'percent'
          )[this.formraw]
        },
        {
          label: 'Added (vol/ct)',
          value: `${this.denominate(this.net.stats.addLiquidityVolume)} / ${
            this.formatNumber(this.net.stats.addLiquidityCount)[this.formraw]
          }`
        },
        {
          label: 'Withdrawn (vol/ct)',
          value: `${this.denominate(this.net.stats.withdrawVolume)} / ${
            this.formatNumber(this.net.stats.withdrawCount)[this.formraw]
          }`
        },
        {
          label: 'Pool Share Factor',
          value: this.formatNumber(
            this.net.mnetwork?.poolShareFactor,
            2,
            'standard',
            'percent'
          )[this.formraw]
        }
      ]
    },
    validatorRows() {
      return [
        ...this.protocolVersionRows(),
        {
          label: 'Optimal Threshold',
          value: this.denominate(this.net.mnetwork?.bondMetrics.bondHardCap)
        },
        {
          label: 'Bond (av/md)',
          value: `${this.denominate(
            this.net.mnetwork?.bondMetrics.averageActiveBond
          )} / ${this.denominate(
            this.net.mnetwork?.bondMetrics.medianActiveBond
          )}`
        },
        {
          label: 'APY (av/md)',
          value: `${this.nFmt(
            this.net.churn.apy.avg,
            2,
            'standard',
            'percent'
          )} / ${this.nFmt(this.net.churn.apy.med, 2, 'standard', 'percent')}`
        },
        {
          label: 'Slashes (av/md)',
          value: `${this.nFmt(this.net.churn.slash.avg)} / ${this.nFmt(
            this.net.churn.slash.med
          )}`
        },
        {
          label: 'Rewards',
          value: this.denominate(this.net.network?.bond_reward_rune)
        }
      ]
    },
    bondTotalRows() {
      return [
        {
          label: 'Active',
          value: this.denominate(this.net.bonds.total.raw)
        },
        {
          label: 'Passive',
          value: this.denominate(this.net.bonds.standby.raw)
        },
        {
          label: 'Total',
          value: this.denominate(
            this.net.bonds.total.raw + this.net.bonds.standby.raw
          )
        },
        {
          label: 'Units',
          value: this.formatNumber(this.net.network?.total_bond_units)[
            this.formraw
          ]
        }
      ]
    },
    limitRows() {
      return [
        {
          label: 'Hard Cap',
          value: this.denominate(this.net.network?.effective_security_bond)
        },
        {
          label: 'Total Pooled RUNE',
          value: this.denominate(this.net.balances.pooled_rune)
        },
        {
          label: 'Difference',
          value: this.denominate(
            this.net.network?.effective_security_bond -
              this.net.balances.pooled_rune
          )
        }
      ]
    },
    swapRows() {
      return [
        { label: 'Volume', value: this.denominate(this.net.stats.swapVolume) },
        {
          label: 'Count (24h/30d/all)',
          value: `${
            this.formatNumber(this.net.stats.swapCount24h)[this.formraw]
          } / ${
            this.formatNumber(this.net.stats.swapCount30d)[this.formraw]
          } / ${this.formatNumber(this.net.stats.swapCount)[this.formraw]}`
        }
      ]
    },
    reserveRows() {
      return [
        { label: 'Active', value: this.denominate(this.net.balances.reserve) },
        {
          label: 'Standby',
          value: this.denominate(this.net.balances.standby_reserve)
        }
      ]
    },
    treasuryRows() {
      return [
        {
          label: 'Multisig',
          value: this.denominate(this.net.balances.treasury_multisig)
        },
        { label: '2', value: this.denominate(this.net.balances.treasury_2) },
        {
          label: 'LP2',
          value: this.denominate(this.net.balances.treasury_lp2)
        },
        { label: 'Total', value: this.denominate(this.totalTreasury) }
      ]
    },
    runeRows() {
      return [
        {
          label: 'Switched',
          value: this.denominate(this.net.stats.switchedRune)
        },
        {
          label: 'Burned BEP2',
          value: this.denominate(this.net.network?.burned_bep_2_rune)
        },
        {
          label: 'Burned ERC20',
          value: this.denominate(this.net.network?.burned_erc_20_rune)
        },
        {
          label: 'Count to Asset/RUNE',
          value: `${
            this.formatNumber(this.net.stats.toAssetCount)[this.formraw]
          } / ${this.formatNumber(this.net.stats.toRuneCount)[this.formraw]}`
        }
      ]
    },
    synthRows() {
      return [
        {
          label: 'Minted',
          value: this.formatNumber(this.net.stats.synthMintCount)[this.formraw]
        },
        {
          label: 'Burned',
          value: this.formatNumber(this.net.stats.synthBurnCount)[this.formraw]
        }
      ]
    },
    nameServiceRows() {
      return [
        {
          label: 'Fee',
          value: this.denominate(this.net.network?.tns_register_fee_rune, 2)
        },
        {
          label: 'Per Block',
          value: this.denominate(this.net.network?.tns_fee_per_block_rune, 8)
        }
      ]
    },
    externalRows() {
      return [
        { label: 'Price', value: `(${this.rune.change})`, price: true },
        {
          label: 'Market Cap',
          value: `${this.rune.market_cap} (#${this.rune.rank})`
        },
        { label: 'Volume 24h', value: this.rune.volume_extended },
        {
          label: 'Supply',
          value: `${this.rune.supply} (${this.rune.supply_max})`
        }
      ]
    },
    nonRuneTvl() {
      return this.net.balances.pooled_rune * this.net.stats.runePriceUSD
    },
    deterministicPrice() {
      return (this.nonRuneTvl * 3) / this.circulatingSupply
    }
  },
  beforeCreate() {
    this.$store.dispatch('stream/setChannel', 'nodes')
  },
  methods: {
    protocolVersionRows() {
      return this.net.protocol.list.map((protocol) => ({
        label: `Version (${protocol})`,
        value: `${this.net.protocol.distribution[protocol]} (${this.nFmt(
          this.net.protocol.distribution[protocol] /
            this.net.protocol.totalNodes,
          0,
          'standard',
          'percent'
        )})`
      }))
    }
  }
}
</script>
