<template>
  <n-card title="Wallets" style="margin-bottom: 16px">
    <n-card :bordered="false" :content-style="{ paddingLeft: 0, paddingRight: 0 }">
      <n-input v-model:value="seedphrase" type="text" placeholder="Input Seed phrase"
        :status="!isValidSeedPhrase ? 'error' : 'success'">
        <template #prefix>
          <b>Seed Phrase:</b>
        </template>
        <template #suffix>
          <n-button size="small" quaternary circle @click="copyToClipboard(seedphrase, 'seedphrase')"
            :class="{ 'copy-button-inverted': clickedButtons.seedphrase }">
            <template #icon>
              <n-icon>
                <CopyOutline />
              </n-icon>
            </template>
          </n-button>
        </template>
      </n-input>
    </n-card>

    <n-card>
      <n-collapse>
        <n-collapse-item v-for="wallet in wallets" :key="wallet.index">
          <template #header>
            <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
              <span>{{ wallet.address }}</span>
              <n-button size="small" quaternary circle
                @click.stop="copyToClipboard(wallet.address, `address-${wallet.index}`)" style="margin-left: auto;"
                :class="{ 'copy-button-inverted': clickedButtons[`address-${wallet.index}`] }">
                <template #icon>
                  <n-icon>
                    <CopyOutline />
                  </n-icon>
                </template>
              </n-button>
            </div>
          </template>
          <div>Address Index: {{ wallet.index }}</div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span>Private Key:</span>
            <n-text code>
              {{ wallet.pk.replace('0x', '') }}
            </n-text>
            <n-button size="small" quaternary circle
              @click="copyToClipboard(wallet.pk.replace('0x', ''), `pk-${wallet.index}`)"
              :class="{ 'copy-button-inverted': clickedButtons[`pk-${wallet.index}`] }">
              <template #icon>
                <n-icon>
                  <CopyOutline />
                </n-icon>
              </template>
            </n-button>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span>Private Key With 0x:</span>
            <n-text code>
              {{ wallet.pk }}
            </n-text>
            <n-button size="small" quaternary circle @click="copyToClipboard(wallet.pk, `pk-0x-${wallet.index}`)"
              :class="{ 'copy-button-inverted': clickedButtons[`pk-0x-${wallet.index}`] }">
              <template #icon>
                <n-icon>
                  <CopyOutline />
                </n-icon>
              </template>
            </n-button>
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

.copy-button-inverted {
  filter: invert(1);
  transition: filter 0.1s ease-in-out;
}
</style>
<script setup lang="ts">
import { NCard, NInput, NText, NCollapse, NCollapseItem, NButton, NIcon } from 'naive-ui'
import { CopyOutline } from '@vicons/ionicons5'
import { ref } from 'vue'

import { generatePrivateKey, privateKeyToAccount, mnemonicToAccount, generateMnemonic, english } from 'viem/accounts'
import { bytesToHex, createWalletClient, hexToString, http, toBytes } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: http(),
})

const mnemonic = () => generateMnemonic(english)

const seedphrase = useState('seedphrase', mnemonic)
const clickedButtons = ref<Record<string, boolean>>({})

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
  for (let i = 0; i < 15; i++) {
    const w = mnemonicToAccount(seedphrase.value, { addressIndex: i })
    accounts.push({ address: w.address, pk: bytesToHex(w.getHdKey().privateKey), index: i })
  }
  return accounts
})

const copyToClipboard = async (text: string, buttonId: string) => {
  try {
    await navigator.clipboard.writeText(text)

    // Trigger the inversion effect
    clickedButtons.value[buttonId] = true

    // Reset the effect after 2 seconds
    setTimeout(() => {
      clickedButtons.value[buttonId] = false
    }, 400)

  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}
</script>
