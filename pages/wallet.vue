<template>
  <n-card title="Wallets" style="margin-bottom: 16px">
    <n-card :bordered="false">
      <n-input v-model:value="seedphrase" type="text" placeholder="Input Seed phrase"
               :status="!isValidSeedPhrase ? 'error' : 'success'"
      >
        <template #prefix>
          <b>Seed Phrase:</b>
        </template>
      </n-input>
    </n-card>

    <n-card justify="space-between">
      <n-collapse>
        <n-collapse-item v-for="wallet in wallets" :title="`${wallet.address}`">
          <div>Address Index: {{wallet.index}}</div>
          <div>Private Key:
            <n-text code>
              {{wallet.pk.replace('0x', '')}}
            </n-text>
          </div>
          <div>Private Key With 0x:
            <n-text code>
              {{wallet.pk}}
            </n-text><br/>
          </div>
        </n-collapse-item>
      </n-collapse>
    </n-card>
  </n-card>
</template>

<style scoped>
.card-tabs .n-tabs-nav--bar-type {
  padding-left: 4px;
}
</style>
<script setup lang="ts">
import {NCard, NInput, NText, NCollapse, NCollapseItem} from 'naive-ui'
import {ref} from 'vue'

import {generatePrivateKey, privateKeyToAccount, mnemonicToAccount, generateMnemonic, english} from 'viem/accounts'
import {bytesToHex, createWalletClient, hexToString, http, toBytes} from 'viem'
import {mainnet} from 'viem/chains'

  const client = createWalletClient({
    chain: mainnet,
    transport: http(),
  })

  const mnemonic = () => generateMnemonic(english)

  const seedphrase = useState('seedphrase', mnemonic)
  const randomAddress = computed(() => {
    if (seedphrase.value === '0x') {
      return ''
    }
    try {
      return mnemonicToAccount(seedphrase.value).address
    } catch (e) {
      console.log(e)
      return 'error address'
    }
  })

  const isValidSeedPhrase = computed(() => {
    return !randomAddress.value.includes('error')
  })

  const wallets = computed(() => {
    let accounts = []
    for (let i = 0; i < 15; i ++ )  {
      const w = mnemonicToAccount(seedphrase.value, {addressIndex: i})
      accounts.push({address: w.address, pk: bytesToHex(w.getHdKey().privateKey), index: i})
    }
    return accounts
  })
</script>
