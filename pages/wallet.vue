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
      <br/>
      <n-input-number :style="{ width: '33%' }" v-model:value="walletQuantity">
        <template #prefix>
          <b>Wallet Quantity:</b>
        </template>
      </n-input-number>
    </n-card>

    <n-card justify="space-between">
      <n-collapse>
        <n-collapse-item v-for="wallet in wallets" :title="`${wallet.address}`">
          <div>Address:
            <n-text code @click="copyToClipboard(wallet.address)">
              {{wallet.address}}
            </n-text>
          </div>
          <div>Address Index: {{wallet.index}}</div>
          <div>Private Key:
            <n-text code @click="copyToClipboard(wallet.pk.replace('0x', ''))">
              {{wallet.pk.replace('0x', '')}}
            </n-text>
          </div>
          <div>Private Key With 0x:
            <n-text code @click="copyToClipboard(wallet.pk)">
              {{wallet.pk}}
            </n-text>
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
import {NCard, NInput, NButton, NText, NCollapse, NCollapseItem, NInputGroup, NInputNumber} from 'naive-ui'
import { useNotification } from 'naive-ui' // Import useMessage for toast notifications
import {generatePrivateKey, privateKeyToAccount, mnemonicToAccount, generateMnemonic, english} from 'viem/accounts'
import {bytesToHex, createWalletClient, hexToString, http, toBytes} from 'viem'
import {mainnet} from 'viem/chains'

  const client = createWalletClient({
    chain: mainnet,
    transport: http(),
  })

  const mnemonic = () => generateMnemonic(english)
  const seedphrase = useState('seedphrase', mnemonic)
  const walletQuantity = useState('walletQuantity', () => 15)
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
    for (let i = 0; i < walletQuantity.value; i ++ )  {
      const w = mnemonicToAccount(seedphrase.value, {addressIndex: i})
      accounts.push({address: w.address, pk: bytesToHex(w.getHdKey().privateKey), index: i})
    }
    return accounts
  })

  const copyToClipboard = (text: string) => {
    const notification = useNotification()
    nextTick(() => {
      navigator.clipboard.writeText(text).then(() => {
        notification.success({ content: 'Copied' }); // Show success toast
      }).catch(err => {
        console.error('Failed to copy:', err);
        notification.error({ content: 'Error to copy' }); // Show error toast
      });
    });
  }
</script>
